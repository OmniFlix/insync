import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import { setAmount } from '../../../actions/shieldedAssets';
import { config } from '../../../config';
import DownArrowIcon from '../../../assets/masp/downArrow.svg';
import NamadaLogo from '../../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../../assets/masp/namada_shielded.svg';
import BigNumber from 'bignumber.js';
import { shieldedToTransparentTransaction } from 'helper';
import CircularProgress from 'components/CircularProgress';
import { UnshieldingTransferDataMsgValue } from '@harish551/namada-types';
import variables from 'utils/variables';
import { getBalance, getShieldedBalance } from 'actions/accounts';
import { showDelegateFailedDialog, showDelegateProcessingDialog, showDelegateSuccessDialog } from 'actions/stake';
import { showMessage } from 'actions/snackbar';
import { feeList } from 'dummy/ibcList';
import { formatCount } from 'utils/numberFormats';
import ShieldedSourceSelectField from 'containers/IBCTransfer/ShieldedSourceSelectField';
import { fetchIBCBalance } from 'actions/IBCTransfer';

const ShieldedToTransparent = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const handleSubmit = () => {
        setInProgress(true);

        // const source = props.shieldedAddress;
        const source = props.shieldedData?.pseudoExtendedKey;
        let token = config.TOKEN_ADDRESS;
        let amount = new BigNumber(props.amount);
        if (props.selectedAsset?.balance) {
            amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            // amount = new BigNumber(props.amount);
            token = props.selectedAsset?.tokenAddress;
        }

        const msgValue = new UnshieldingTransferDataMsgValue({
            target: props.address,
            token: token,
            amount: amount,
        });

        const tx = {
            source: source,
            data: [msgValue],
        };

        const fee = feeList && fromNamadaSelectedConfig && feeList[fromNamadaSelectedConfig?.COIN_DENOM];
        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(fee?.shieldedgas || 152624),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
            // publicKey: props.disposableSigner && props.disposableSigner.publicKey,
        };

        if (props.selectedAsset?.balance) {
            txs.token = props.selectedAsset?.tokenAddress;
            txs.feeAmount = new BigNumber(0.00001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            // txs.chainId = fromNamadaSelectedConfig.CHAIN_ID;
            if (fromNamadaSelectedConfig?.COIN_DENOM === 'ATOM') {
                txs.feeAmount = new BigNumber(0.000001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            }
        }

        shieldedToTransparentTransaction(props.address, tx, txs, props.revealPublicKey, props.details && props.details.type, handleFetch);
    };

    const handleFetch = (error, value) => {
        if (error) {
            setInProgress(false);
            if (error.indexOf('not yet found on the chain') > -1) {
                props.pendingDialog();
                return;
            }
            props.failedDialog();
            props.showMessage(error);
            return;
        }
        const tokenAddress = props.selectedAsset && props.selectedAsset.tokenAddress;
        const balance = props.selectedAsset && props.selectedAsset.balance && Number(props.selectedAsset.balance);
        const fromNamadaSelectedConfig = props.selectedAsset?.config;
        handleFetchShieldedBalance(tokenAddress, balance, fromNamadaSelectedConfig, value);
    };

    const handleFetchShieldedBalance = (tokenAddress, balance, ibcConfig, res1) => {
        props.getShieldedBalance(props.shieldedData?.viewingKey, props.shieldedData?.timestamp, props.address, props.shieldedData?.address, config.CHAIN_ID, (resBalance) => {
            let resultBalance = resBalance && resBalance.length && tokenAddress &&
                    resBalance.find((val) => val && val.length && val[0] && (val[0] === tokenAddress));
            resultBalance = resultBalance && resultBalance.length && resultBalance[1] && Number(resultBalance[1]);
            if (resultBalance !== balance) {
                props.getBalance(props.address);
                props.successDialog(res1.hash);
                setInProgress(false);
            } else {
                handleFetchShieldedBalance(tokenAddress, balance, ibcConfig, res1);
            }
        });
    };

    let balance = null;
    props.balance && props.balance.length && props.balance.map((val) => {
        if (val && val.length) {
            val.map((value) => {
                if (value === config.TOKEN_ADDRESS) {
                    balance = val[1];
                }
            });
        }

        return null;
    });

    balance = balance && balance / 10 ** config.COIN_DECIMALS;
    const disable = inProgress || !props.amount;

    const fromNamadaSelectedConfig = props.selectedAsset?.config;
    const namadaBalance = props.selectedAsset?.balance && Number(props.selectedAsset?.balance) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    const fee = feeList && fromNamadaSelectedConfig && feeList[fromNamadaSelectedConfig?.COIN_DENOM];

    return (
        <div className="shield_dialog">
            <div className="transfer_source">
                <div className="header">
                    <p>
                        <img alt="NamadaLogo" src={NamadaShieldedLogo}/>
                        Namada Shielded
                    </p>
                    <div className="address">
                        <span>{props.shieldedAddress}</span>
                        {props.shieldedAddress && props.shieldedAddress.slice(props.shieldedAddress.length - 6, props.shieldedAddress.length)}
                    </div>
                </div>
                <div className="border"></div>
                <div className="select_section">
                    <ShieldedSourceSelectField/>
                    <AmountTextField from={"shield_to_transparent"}/>
                </div>
                {fromNamadaSelectedConfig
                    ? <div className="tokens_secion">
                        <p>Available: {namadaBalance || 0} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                        <Button onClick={() => props.setAmount(namadaBalance)}>Max</Button>
                    </div> : null}
            </div>
            <div className="arrow">
                <img alt="Arrow" src={DownArrowIcon}/>
            </div>
            <div className="transfer_destination">
                <div>
                    <p>
                        <img alt="NamadaLogo" src={NamadaLogo}/>
                        Namada Transparent
                    </p>
                    <div className="address">
                        <span>{props.address}</span>
                        {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                    </div>
                </div>
                {fee && fee.fee
                ? <div className="fee">
                    <p>fee:<b>{formatCount(fee.fee * fee.shieldedgas)} {fromNamadaSelectedConfig.COIN_DENOM}</b></p>
                </div> : null}
                {/* <p>Transaction fee: 0.025385 NAM</p> */}
            </div>
            {inProgress && <CircularProgress className="full_screen"/>}
            <Button
                disabled={disable}
                onClick={handleSubmit}>
                {inProgress
                    ? variables[props.lang]['approval_pending']
                    : 'Submit'}
            </Button>
        </div>
    );
};

ShieldedToTransparent.propTypes = {
    balance: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    failedDialog: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    setAmount: PropTypes.func.isRequired,
    getShieldedBalance: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    address: PropTypes.string,
    revealPublicKey: PropTypes.object,
    selectedAsset: PropTypes.object,
    shieldedData: PropTypes.object,
    disposableSigner: PropTypes.object,
    shieldedAddress: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        address: state.accounts.address.value,
        amount: state.shieldedAssets.amount.value,
        details: state.accounts.address.details,
        shieldedAddress: state.accounts.address.shieldedDetails,
        shieldedData: state.accounts.address.shieldedData,
        disposableSigner: state.accounts.address.disposableSigner,
        revealPublicKey: state.accounts.revealPublicKey.result,
        selectedAsset: state.ibcTransfer.fromNamadaSelectedAsset.shieldedResult,
    };
};

const actionToProps = {
    setAmount,
    getBalance,
    successDialog: showDelegateSuccessDialog,
    failedDialog: showDelegateFailedDialog,
    pendingDialog: showDelegateProcessingDialog,
    showMessage,
    getShieldedBalance,
    fetchIBCBalance,
};

export default connect(stateToProps, actionToProps)(ShieldedToTransparent);
