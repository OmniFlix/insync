import { Button, Dialog } from "@material-ui/core";
import { hideTransparentTokensTransferDialog } from "actions/assets";
import React, { memo } from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import { Close } from "@material-ui/icons";
import AmountTextField from "./AmountTextField";
import MemoTextField from "./MemoTextField";
import AddressTextField from "./AddressTextField";
import './index.css';
import { feeList } from "dummy/ibcList";
import { formatCount } from "utils/numberFormats";
import { fetchBalanceList, getBalance } from "actions/accounts";
import { showDelegateFailedDialog, showDelegateProcessingDialog, showDelegateSuccessDialog } from "actions/stake";
import { showMessage } from "actions/snackbar";
import { config } from "config";
import { TransparentTransferDataMsgValue } from "@harish551/namada-types";
import BigNumber from "bignumber.js";
import { ibcTransparentTransfer } from "helper";
import variables from "utils/variables";
import ProcessingButton from "components/ProcessingButton";
import { showTokensTransactionSuccessDialog } from "actions/IBCTransfer";
import { balanceCalculation, feeCalculation, feeCalculationDisplay } from "utils/feeCalculation";
import FeeOptions from "../FeeOptions";

class TransparentTransferDialog extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            inProgress: false,
            approval: false,
        };

        this.handleTransfer = this.handleTransfer.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
    }

    handleTransfer () {
        const fromSelectedConfig = this.props.value && this.props.value.config && this.props.value.config.CHAIN_NAME ? this.props.value.config : null;
        this.setState({ inProgress: true });

        const source = this.props.address;
        // const source = this.props.shieldedData?.pseudoExtendedKey;
        let token = config.TOKEN_ADDRESS;
        let amount = new BigNumber(this.props.tokensTransferAmount);
        if (this.props.value?.balance?.minDenomAmount) {
            amount = new BigNumber(this.props.tokensTransferAmount * (10 ** fromSelectedConfig?.COIN_DECIMALS));
            token = this.props.value?.balance?.tokenAddress;
        }

        const msgValue = new TransparentTransferDataMsgValue({
            source: source,
            target: this.props.tokensTransferAddress,
            token: token,
            amount: amount,
        });

        const tx = {
            data: [msgValue],
        };

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(32032),
            chainId: config.CHAIN_ID,
            publicKey: this.props.details && this.props.details.publicKey,
            memo: this.props.tokensTransferMemo || '',
        };

        if (this.props.value?.balance?.minDenomAmount) {
            txs.token = this.props.value?.balance?.tokenAddress;
            const tokenGasPrice = this.props.gasPrice.find((val) => val.token === this.props.value?.balance?.tokenAddress);
            txs.feeAmount = new BigNumber(tokenGasPrice?.minDenomAmount);
            if (this.props.feeOption?.fees?.token) {
                txs.token = this.props.feeOption?.fees?.token;
                const tokenGasPrice = this.props.gasPrice.find((val) => val.token === this.props.feeOption?.fees?.token);
                txs.feeAmount = new BigNumber(tokenGasPrice?.minDenomAmount);
                if (props.feeOption?.fees?.token === config.TOKEN_ADDRESS) {
                    txs.feeAmount = new BigNumber(0.000001);
                }
            }
            txs.gasLimit = new BigNumber(feeCalculation(this.props.gasEstimation))
        }

        this.setState({ approval: true });
        ibcTransparentTransfer(this.props.address, tx, txs, this.props.revealPublicKey, this.props.details && this.props.details.type, this.handleFetch);
    }

    handleFetch (error, value, approval) {
        if (approval) {
            this.setState({ approval: false });
            return;
        }
        const tokenName = this.props.value?.symbol || this.props.value?.name;
        const successObject = {
            text: `${tokenName} Transfer Successfully`,
            content: 'Your transfer was completed',
        }

        const fromSelectedConfig = this.props.value && this.props.value.config && this.props.value.config.CHAIN_NAME ? this.props.value.config : null;
        const selectedBalance = this.props.value && this.props.value.balance;
        const tokenAddress = selectedBalance.tokenAddress;
        const balance = selectedBalance.minDenomAmount;
        if (error) {
            this.setState({ inProgress: false, approval: false });
            if (error.indexOf('not yet found on the chain') > -1) {
                this.props.pendingDialog();
                return;
            }
            this.props.failedDialog();
            this.props.showMessage(error);
            return;
        }

        // this.props.successDialog(value && value.hash, null, fromSelectedConfig);
        this.props.showTokensTransactionSuccessDialog(successObject);
        this.props.handleClose();
        this.setState({ inProgress: false, approval: false });
        this.props.fetchBalanceList(this.props.address);
        this.props.getBalance(this.props.address);
        setTimeout(() => {
            this.props.fetchBalanceList(this.props.address);
            this.props.getBalance(this.props.address);
        }, 5000);
    };

    render () {
        const image = this.props.value && this.props.value.logo_URIs && (this.props.value.logo_URIs.svg || this.props.value.logo_URIs.png);
        let amount = this.props.value && this.props.value.balance && this.props.value.balance.minDenomAmount;
        if (this.props.value && this.props.value.config && this.props.value.config.COIN_DECIMALS) {
            amount = amount ? (amount / 10 ** this.props.value.config.COIN_DECIMALS) : 0;
        }

        const fromSelectedConfig = this.props.value && this.props.value.config && this.props.value.config.CHAIN_NAME ? this.props.value.config : null;
        const fee = feeList && feeList[fromSelectedConfig?.COIN_DENOM];

        let token = config.TOKEN_ADDRESS;
        if (this.props.value?.balance?.minDenomAmount) {
            token = this.props.value?.balance?.tokenAddress;
        }
        const balanceValidation = balanceCalculation(this.props.balanceList, token, this.props.tokensTransferAmount, this.props.feeOption);
        const disable = this.state.inProgress || this.props.inProgress || this.props.tokensTransferAddressValid === false || !this.props.tokensTransferAmount || !this.props.tokensTransferAddress || this.props.tokensTransferAmountValid === false || !balanceValidation;

        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_transfer_dialog">
                <div className="ibc_content ibc_transfer_dialog">
                    <div className="header">
                        <h2>{variables[this.props.lang].transfer_asset}</h2>
                        <Button
                            className="close_button"
                            onClick={this.props.handleClose}
                            variant="outlined">
                                <Close className="icon" />
                            </Button>
                    </div>
                    <div className="section1">
                        <div className="row1">
                            <div className="text">{variables[this.props.lang].asset}</div>
                            <div className="available_balance">
                                <span>{variables[this.props.lang].available}</span>
                                <p>{amount}{' '}{this.props.value?.symbol}</p>
                            </div>
                        </div>
                        <div className="row2">
                            <div className="left_section">
                                {image && <img alt={this.props.value?.name} src={image} style={{ width: '18px', height: '18px', marginRight: '8px' }} />}
                                {this.props.value?.symbol || this.props.value?.display}
                            </div>
                            <div className="right_section">
                                <AmountTextField />
                            </div>
                        </div>
                    </div>
                    <div className="section3">
                        <div className="row1">
                            {variables[this.props.lang].enter_recipient_address}
                        </div>
                        <div className="row2">
                            <AddressTextField />
                        </div>
                    </div>
                    <div className="section4">
                        <div className="row1">
                            {variables[this.props.lang].memo}
                        </div>
                        <div className="row2">
                            <MemoTextField />
                        </div>
                    </div>
                    <div className="section5">
                        {this.props.feeOption?.fees?.fee
                            ? <div className="left_section">
                                <span>{variables[this.props.lang].fee}:</span>
                                <p>{formatCount(this.props.feeOption?.fees?.fee) || feeCalculationDisplay(this.props.gasEstimation, this.props.gasPrice, this.props.value?.balance?.tokenAddress)} {this.props.feeOption?.symbol}</p>
                            </div>
                            : null}
                        <div className="right_section">
                            <FeeOptions/>
                        </div>
                    </div>
                    <div className="actions">
                        {this.state.inProgress ?
                            <ProcessingButton>
                                <Button disabled={disable} onClick={this.handleTransfer}>
                                    {this.state.approval
                                        ? 'Approval pending...'
                                        : this.state.inProgress
                                            ? 'InProgress...' : 'Transfer'}
                                </Button>
                            </ProcessingButton>
                            : <Button disabled={disable} onClick={this.handleTransfer}>
                                {!balanceValidation
                                    ? 'Not Enough Balance'
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

TransparentTransferDialog.propTypes = {
    balance: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    fetchBalanceList: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    failedDialog: PropTypes.func.isRequired,
    gasPrice: PropTypes.array.isRequired,
    gasEstimation: PropTypes.object.isRequired,
    feeOption: PropTypes.object.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
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
    tokensTransferAmountValid: PropTypes.bool,
    tokensTransferAddress: PropTypes.string,
    tokensTransferAddressValid: PropTypes.bool,
    tokensTransferMemo: PropTypes.string,
    shieldedData: PropTypes.object,
    showTokensTransactionSuccessDialog: PropTypes.func,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        balance: state.accounts.balance.result,
        balanceList: state.accounts.balanceList.result,
        lang: state.language,
        open: state.assets.transparentTokensTransferDialog.open,
        value: state.assets.transparentTokensTransferDialog.value,
        ibcTransferType: state.ibcTransfer.ibcTransferType.value,
        tokensTransferAmount: state.assets.tokensTransferAmount.value,
        tokensTransferAmountValid: state.assets.tokensTransferAmount.valid,
        tokensTransferAddress: state.assets.tokensTransferAddress.value, 
        tokensTransferAddressValid: state.assets.tokensTransferAddress.valid, 
        details: state.accounts.address.details,
        revealPublicKey: state.accounts.revealPublicKey.result,
        tokensTransferMemo: state.assets.tokensTransferMemo.value,
        shieldedData: state.accounts.address.shieldedData,
        gasEstimation: state.gasPrice.gasEstimation.value,
        gasPrice: state.gasPrice.gasPrice.value,
        feeOption: state.assets.feeOptionPopoverValue.value,
    };
};

const actionToProps = {
    handleClose: hideTransparentTokensTransferDialog,
    getBalance,
    fetchBalanceList,
    successDialog: showDelegateSuccessDialog,
    failedDialog: showDelegateFailedDialog,
    pendingDialog: showDelegateProcessingDialog,
    showMessage,
    showTokensTransactionSuccessDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(TransparentTransferDialog));