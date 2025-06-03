import { Button, Dialog } from "@material-ui/core";
import { hideShieldedTokensTransferDialog, hideTransparentTokensTransferDialog } from "actions/assets";
import React, { memo } from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import { Close } from "@material-ui/icons";
import AmountTextField from "../TransparentTransferDialog/AmountTextField";
import MemoTextField from "../TransparentTransferDialog/MemoTextField";
import AddressTextField from "../TransparentTransferDialog/AddressTextField";
import '../TransparentTransferDialog/index.css';
import { feeList } from "dummy/ibcList";
import { formatCount } from "utils/numberFormats";
import { fetchBalanceList, getBalance, getShieldedBalance } from "actions/accounts";
import { showDelegateFailedDialog, showDelegateProcessingDialog, showDelegateSuccessDialog } from "actions/stake";
import { showMessage } from "actions/snackbar";
import { config } from "../../../config";
import { ShieldedTransferDataMsgValue } from "@harish551/namada-types";
import BigNumber from "bignumber.js";
import { ibcShieldedTransfer } from "helper";
import { fetchIBCBalance } from "actions/IBCTransfer";
import CircularProgress from "components/CircularProgress";
import ProcessingButton from "components/ProcessingButton";

class ShieldedTransferDialog extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            inProgress: false,
            params: false,
            approval: false,
        };

        this.handleTransfer = this.handleTransfer.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
        this.handleFetchShieldedBalance = this.handleFetchShieldedBalance.bind(this);
    }

    handleTransfer () {
        const fromSelectedConfig = this.props.value && this.props.value.config && this.props.value.config.CHAIN_NAME ? this.props.value.config : null;
        this.setState({ inProgress: true });

        // const source = this.props.address;
        const source = this.props.shieldedData?.pseudoExtendedKey;
        let token = config.TOKEN_ADDRESS;
        let amount = new BigNumber(this.props.tokensTransferAmount);
        if (this.props.value?.balance) {
            amount = new BigNumber(this.props.tokensTransferAmount * (10 ** fromSelectedConfig?.COIN_DECIMALS));
            token = this.props.value?.tokenAddress;
        }

        const msgValue = new ShieldedTransferDataMsgValue({
            source: source,
            target: this.props.tokensTransferAddress,
            token: token,
            amount: amount,
        });

        const tx = {
            data: [msgValue],
            gasSpendingKey: source,
        };

        const fee = feeList && feeList[fromSelectedConfig?.COIN_DENOM]
        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(fee?.shieldedgas || 152624),
            chainId: config.CHAIN_ID,
            publicKey: this.props.details && this.props.details.publicKey,
            memo: this.props.tokensTransferMemo || '',
        };

        if (this.props.value?.balance) {
            txs.token = this.props.value?.tokenAddress;
            txs.feeAmount = new BigNumber(0.00001 * (10 ** fromSelectedConfig?.COIN_DECIMALS));
            // txs.chainId = fromSelectedConfig.CHAIN_ID;
            if (fromSelectedConfig?.COIN_DENOM === 'ATOM') {
                txs.feeAmount = new BigNumber(0.000001 * (10 ** fromSelectedConfig?.COIN_DECIMALS));
            }
        }

        this.setState({ params: true, approval: true });
        ibcShieldedTransfer(this.props.address, tx, txs, this.props.revealPublicKey, this.props.details && this.props.details.type, this.props.details, this.handleFetch);
    }

    handleFetch (error, value, params, approval) {
        if (approval) {
            this.setState({ approval: false });
            return;
        }
        if (params) {
            this.setState({ params: false });
            return;
        }

        if (error) {
            this.setState({ inProgress: false, params: false, approval: false });
            if (error.indexOf('not yet found on the chain') > -1) {
                this.props.pendingDialog();
                return;
            }
            this.props.failedDialog();
            this.props.showMessage(error);
            return;
        }

        const tokenAddress = this.props.value && this.props.value.tokenAddress;
        const balance = this.props.value && this.props.value.balance && Number(this.props.value.balance);
        const fromNamadaSelectedConfig = this.props.value?.config;
        this.handleFetchShieldedBalance(tokenAddress, balance, fromNamadaSelectedConfig, value);
    };

    handleFetchShieldedBalance (tokenAddress, balance, ibcConfig, res1) {
        this.props.getShieldedBalance(this.props.shieldedData?.viewingKey, this.props.shieldedData?.timestamp, this.props.address, this.props.shieldedData?.address, config.CHAIN_ID, (resBalance) => {
            let resultBalance = resBalance && resBalance.length && tokenAddress &&
                    resBalance.find((val) => val && val.length && val[0] && (val[0] === tokenAddress));
            resultBalance = resultBalance && resultBalance.length && resultBalance[1] && Number(resultBalance[1]);
            if (resultBalance !== balance) {
                this.props.fetchIBCBalance(ibcConfig?.REST_URL, this.props.ibcTransferAddress);
                this.props.getBalance(this.props.address);
                this.props.successDialog(res1.hash, null, ibcConfig);
                this.setState({ inProgress: false, params: false, approval: false });
            } else {
                handleFetchShieldedBalance(tokenAddress, balance, ibcConfig, res1);
            }
        });
    };

    render () {
        const image = this.props.value && this.props.value.logo_URIs && (this.props.value.logo_URIs.svg || this.props.value.logo_URIs.png);
        let amount = this.props.value && this.props.value.balance;
        if (this.props.value && this.props.value.config && this.props.value.config.COIN_DECIMALS) {
            amount = amount ? (amount / 10 ** this.props.value.config.COIN_DECIMALS) : 0;
        }

        const fromSelectedConfig = this.props.value && this.props.value.config && this.props.value.config.CHAIN_NAME ? this.props.value.config : null;
        const fee = feeList && feeList[fromSelectedConfig?.COIN_DENOM]
        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_transfer_dialog">
                <div className="ibc_content ibc_transfer_dialog">
                    <div className="header">
                        <h2>Transfer Asset</h2>
                        <Button
                            className="close_button"
                            onClick={this.props.handleClose}
                            variant="outlined">
                                <Close className="icon" />
                            </Button>
                    </div>
                    <div className="section1">
                        <div className="row1">
                            <div className="text">Asset</div>
                            <div className="available_balance">
                                <span>Available</span>
                                <p>{amount}{' '}{this.props.value?.symbol}</p>
                            </div>
                        </div>
                        <div className="row2">
                            <div className="left_section">
                                {image && <img alt={this.props.value?.name} src={image} style={{ width: '18px', height: '18px', marginRight: '8px' }} />}
                                {this.props.value?.symbol || this.props.value?.display}
                            </div>
                            <div className="right_section">
                                <AmountTextField from="shielded" amount={amount}/>
                            </div>
                        </div>
                    </div>
                    <div className="section3">
                        <div className="row1">
                            Enter recipient address
                        </div>
                        <div className="row2">
                            <AddressTextField />
                        </div>
                    </div>
                    <div className="section4">
                        <div className="row1">
                            Memo
                        </div>
                        <div className="row2">
                            <MemoTextField />
                        </div>
                    </div>
                    {fee && fee.fee 
                    ? <div className="section5">
                            <div className="left_section">
                                <span>Fee</span>
                                <p>{formatCount(fee.fee * fee.shieldedgas)}{' '} {fromSelectedConfig.COIN_DENOM}</p>
                            </div>
                            {/* <div className="right_section">
                                <span>Fee options</span>
                            </div> */}
                    </div> : null}
                    {/* {this.state.inProgress && <CircularProgress className="full_screen"/>} */}
                    <div className="actions">
                        {this.state.inProgress
                        ? <ProcessingButton>
                            <Button disabled={this.state.inProgress} onClick={this.handleTransfer}>
                            {this.state.params
                                ? 'Generating MASP Parameters...'
                                : this.state.approval
                                    ? 'Approval pending...'
                                    : this.state.inProgress
                                        ? 'InProgress...' : 'Transfer'}
                        </Button>
                        </ProcessingButton>
                        : <Button disabled={this.state.inProgress} onClick={this.handleTransfer}>
                            {this.state.params
                                ? 'Generating MASP Parameters...'
                                : this.state.approval
                                    ? 'Approval pending...'
                                    : this.state.inProgress
                                        ? 'InProgress...' : 'Transfer'}
                        </Button>}
                    </div>
                </div>
            </Dialog>
        )
    }
}

ShieldedTransferDialog.propTypes = {
    balance: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    fetchBalanceList: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    failedDialog: PropTypes.func.isRequired,
    pendingDialog: PropTypes.func.isRequire,
    showMessage: PropTypes.func.isRequired,
    getShieldedBalance: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    ibcTransferType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    router: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }).isRequired,
        navigate: PropTypes.func.isRequired,
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }).isRequired,
    }),
    address: PropTypes.string,
    value: PropTypes.object,
    revealPublicKey: PropTypes.object,
    tokensTransferAmount: PropTypes.string,
    tokensTransferAddress: PropTypes.string,
    tokensTransferMemo: PropTypes.string,
    shieldedData: PropTypes.object,
    disposableSigner: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        balance: state.accounts.balance.result,
        lang: state.language,
        open: state.assets.shieldedTokensTransferDialog.open,
        value: state.assets.shieldedTokensTransferDialog.value,
        ibcTransferType: state.ibcTransfer.ibcTransferType.value,
        tokensTransferAmount: state.assets.tokensTransferAmount.value,
        tokensTransferAddress: state.assets.tokensTransferAddress.value, 
        details: state.accounts.address.details,
        revealPublicKey: state.accounts.revealPublicKey.result,
        tokensTransferMemo: state.assets.tokensTransferMemo.value,
        shieldedData: state.accounts.address.shieldedData,
        disposableSigner: state.accounts.address.disposableSigner,
    };
};

const actionToProps = {
    handleClose: hideShieldedTokensTransferDialog,
    getBalance,
    fetchBalanceList,
    successDialog: showDelegateSuccessDialog,
    failedDialog: showDelegateFailedDialog,
    pendingDialog: showDelegateProcessingDialog,
    showMessage,
    getShieldedBalance,
    fetchIBCBalance,
};

export default withRouter(connect(stateToProps, actionToProps)(ShieldedTransferDialog));