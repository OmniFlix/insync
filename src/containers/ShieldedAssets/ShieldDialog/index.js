import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import { setAmount } from '../../../actions/shieldedAssets';
import { config } from '../../../config';
import DownArrowIcon from '../../../assets/down_arrow_nofill.png';
import SourceSelectField from './SourceSelectField';
import NamadaLogo from '../../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../../assets/masp/namada_shielded.svg';
import BigNumber from 'bignumber.js';
import { maspTransaction } from 'helper';
import CircularProgress from 'components/CircularProgress';
import { ShieldingTransferDataMsgValue } from '@harish551/namada-types';
import { fetchBalanceList, getBalance, getShieldedBalance } from 'actions/accounts';
import { showDelegateFailedDialog, showDelegateProcessingDialog, showDelegateSuccessDialog } from 'actions/stake';
import { showMessage } from 'actions/snackbar';
import { feeList } from 'dummy/ibcList';
import { formatCount } from 'utils/numberFormats';
import { hideTransparentTokensConvertDialog } from 'actions/assets';
import variables from 'utils/variables';
import ProcessingButton from 'components/ProcessingButton';
import { showTokensTransactionSuccessDialog } from 'actions/IBCTransfer';

const ShieldDialog = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [approval, setApproval] = useState(false);
    const [params, setParams] = useState(false);
    const handleSubmit = () => {
        setInProgress(true);

        const source = props.address;
        let token = config.TOKEN_ADDRESS;
        let amount = new BigNumber(props.amount);
        if (props.selectedAsset?.balance?.minDenomAmount) {
            amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            token = props.selectedAsset?.balance?.tokenAddress;
        }

        const msgValue = new ShieldingTransferDataMsgValue({
            source: source,
            token: token,
            amount: amount,
        });

        const tx = {
            target: props.shieldedAddress,
            data: [msgValue],
        };

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(32032),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

        if (props.selectedAsset?.balance?.minDenomAmount) {
            txs.token = props.selectedAsset?.balance?.tokenAddress;
            txs.feeAmount = new BigNumber(0.00001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            // txs.chainId = fromNamadaSelectedConfig.CHAIN_ID;
            if (fromNamadaSelectedConfig?.COIN_DENOM === 'ATOM') {
                txs.feeAmount = new BigNumber(0.000001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            }
        }

        setParams(true);
        setApproval(true);
        maspTransaction(props.address, tx, txs, props.revealPublicKey, props.details && props.details.type, props.details, handleFetch);
    };

    const handleFetch = (error, value, params, approval) => {
        if (approval) {
            setApproval(false);
            return;
        }
        if (params) {
            setParams(false);
            return;
        }

        if (error) {
            setInProgress(false);
            setParams(false);
            setApproval(false);
            if (error.indexOf('not yet found on the chain') > -1) {
                props.pendingDialog();
                return;
            }
            props.failedDialog();
            props.showMessage(error);
            return;
        }

        const available = props.selectedAsset?.balance?.minDenomAmount;
        const token = props.selectedAsset?.balance?.tokenAddress;
        const intervalTime = setInterval(() => {
            const tokenName = props.selectedAsset?.name || props.selectedAsset?.symbol;
            const successObject = {
                text: `${tokenName} Shield Successfully`,
                content: 'Your shield was completed',
            }
            props.fetchBalanceList(props.address, (result) => {
                if (result && result.length) {
                    let localBalance = null;
                    result && result.length && result.map((val) => {
                        if (val && val.tokenAddress === token) {
                            localBalance = val.minDenomAmount;
                        }

                        return null;
                    });

                    if (localBalance !== available) {
                        setInProgress(false);
                        setParams(false);
                        setApproval(false);
                        clearInterval(intervalTime);
                        // props.successDialog(value && value.hash, null, fromNamadaSelectedConfig);
                        props.showTokensTransactionSuccessDialog(successObject)
                        props.getShieldedBalance(props.shieldedData?.viewingKey, props.shieldedData?.timestamp, props.address, props.shieldedData?.address, config.CHAIN_ID);
                        props.hideTransparentTokensConvertDialog();
                    }
                }
            });
        }, 2000);

        if (intervalTime) {
            setTimeout(() => {
                setInProgress(false);
                setParams(false);
                setApproval(false);
                clearInterval(intervalTime);
                props.fetchBalanceList(props.address);
            }, 30000);
        }
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
    const disable = inProgress || !props.amount || props.amountValid === false;

    const fromNamadaSelectedConfig = props.selectedAsset?.config;
    const namadaBalance = props.selectedAsset?.balance?.minDenomAmount && Number(props.selectedAsset?.balance?.minDenomAmount) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    const fee = feeList && fromNamadaSelectedConfig && feeList[fromNamadaSelectedConfig?.COIN_DENOM];

    return (
        <div className="shield_dialog">
            <div className="transfer_source">
                <div className="header">
                    <p>
                        <img alt="NamadaLogo" src={NamadaLogo}/>
                        {variables[props.lang].namada_transparent}
                    </p>
                    <div className="address">
                        <span>{props.address}</span>
                        {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                    </div>
                </div>
                <div className="border"></div>
                <div className="transparent_shield_select_section">
                    <SourceSelectField/>
                    <AmountTextField/>
                </div>
                {fromNamadaSelectedConfig
                    ? <div className="transparent_tokens_secion">
                        <span>
                            <p>{variables[props.lang].available}</p>
                            <p>{namadaBalance || 0} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                        </span>
                        <Button onClick={() => props.setAmount(namadaBalance)}>{variables[props.lang].max}</Button>
                    </div> : null}
            </div>
            <div className="arrow">
                <img alt="Arrow" src={DownArrowIcon}/>
            </div>
            <div className="transfer_destination">
                <div>
                    <p>
                        <img alt="NamadaShieldedLogo" src={NamadaShieldedLogo}/>
                        {variables[props.lang].namada_shielded}
                    </p>
                    <div className="address">
                        <span>{props.shieldedAddress}</span>
                        {props.shieldedAddress && props.shieldedAddress.slice(props.shieldedAddress.length - 6, props.shieldedAddress.length)}
                    </div>
                </div>
                {/* <p>Transaction fee: 0.025385 NAM</p> */}
            </div>
            {fee && fee.fee

                ? <div className="transparent_fee">
                    <p>{variables[props.lang].fee}</p>
                    <p>{formatCount(fee.fee * fee.gas)} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                </div> : null}
                {inProgress
                ? <ProcessingButton>
                    <Button
                     className="submit_button"
                        disabled={disable}
                        onClick={handleSubmit}>
                        {params
                            ? 'Generating MASP Parameters...'
                            : approval
                                ? 'Approval pending...'
                                : inProgress
                                    ? 'InProgress...' : 'Submit'}
                    </Button>
                </ProcessingButton>
                :  <Button
                className="submit_button"
                disabled={disable}
                onClick={handleSubmit}>
                {params
                    ? 'Generating MASP Parameters...'
                    : approval
                        ? 'Approval pending...'
                        : inProgress
                            ? 'InProgress...' : 'Submit'}
            </Button>}
           
        </div>
    );
};

ShieldDialog.propTypes = {
    balance: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    failedDialog: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    fetchBalanceList: PropTypes.func.isRequired,
    getShieldedBalance: PropTypes.func.isRequired,
    hideTransparentTokensConvertDialog: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    setAmount: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    showTokensTransactionSuccessDialog: PropTypes.func.isRequired,
    address: PropTypes.string,
    amount: PropTypes.number,
    amountValid: PropTypes.bool,
    revealPublicKey: PropTypes.object,
    selectedAsset: PropTypes.object,
    shieldedData: PropTypes.object,
    shieldedAddress: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        address: state.accounts.address.value,
        amount: state.shieldedAssets.amount.value,
        amountValid: state.shieldedAssets.amount.valid,
        details: state.accounts.address.details,
        shieldedAddress: state.accounts.address.shieldedDetails,
        revealPublicKey: state.accounts.revealPublicKey.result,
        selectedAsset: state.shieldedAssets.selectedAsset.result,
        shieldedData: state.accounts.address.shieldedData,
    };
};

const actionToProps = {
    setAmount,
    getBalance,
    fetchBalanceList,
    getShieldedBalance,
    successDialog: showDelegateSuccessDialog,
    failedDialog: showDelegateFailedDialog,
    pendingDialog: showDelegateProcessingDialog,
    showMessage,

    hideTransparentTokensConvertDialog,
    showTokensTransactionSuccessDialog,
};

export default connect(stateToProps, actionToProps)(ShieldDialog);
