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
import { balanceCalculation, feeCalculation, feeCalculationDisplay, feeCalculationMax } from 'utils/feeCalculation';
import FeeOptions from 'containers/Tokens/FeeOptions';

const ShieldDialog = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [approval, setApproval] = useState(false);
    const [params, setParams] = useState(false);
    const handleSubmit = () => {
        setInProgress(true);

        const source = props.address;
        let token = config.TOKEN_ADDRESS;
        let amount = new BigNumber(props.amount);
        if (props.selectedAsset?.balance?.minDenomAmount && props.selectedAsset?.balance?.tokenAddress &&
            props.selectedAsset?.balance?.tokenAddress !== config.TOKEN_ADDRESS) {
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
            const tokenGasPrice = props.gasPrice.find((val) => val.token === props.selectedAsset?.balance?.tokenAddress);
            txs.feeAmount = new BigNumber(tokenGasPrice?.minDenomAmount);
            if (props.feeOption?.fees?.token) {
                txs.token = props.feeOption?.fees?.token;
                const tokenGasPrice = props.gasPrice.find((val) => val.token === props.feeOption?.fees?.token);
                txs.feeAmount = new BigNumber(tokenGasPrice?.minDenomAmount);
                if (props.feeOption?.fees?.token === config.TOKEN_ADDRESS) {
                    txs.feeAmount = new BigNumber(0.000001);
                }
            }
            txs.gasLimit = new BigNumber(feeCalculation(props.gasEstimation))
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
            const tokenName = props.selectedAsset?.symbol || props.selectedAsset?.name;
            const successObject = {
                text: `${tokenName} Shielded Successfully`,
                content: 'Your shielded transaction was completed',
            }
            if (token === config.TOKEN_ADDRESS) {
                props.getBalance(props.address, (result) => {
                    if (result && result.length) {
                        let localBalance = null;
                        result && result.length && result.map((val) => {
                            if (val && val.length) {
                                val.map((value) => {
                                    if (value === config.TOKEN_ADDRESS) {
                                        localBalance = val[1];
                                    }
                                });
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

                return;
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

    const handleMax = (ibcBalance) => {
        if (ibcBalance > 0) {
            props.setAmount(feeCalculationMax(props.gasEstimation, props.gasPrice, props.selectedAsset?.balance?.tokenAddress, ibcBalance), true);
        }
    };

    let token = config.TOKEN_ADDRESS;
    if (props.selectedAsset?.balance?.minDenomAmount) {
        token = props.selectedAsset?.balance?.tokenAddress;
    }
    const balanceValidation = balanceCalculation(props.balanceList, token, props.amount, props.feeOption);
    balance = balance && balance / 10 ** config.COIN_DECIMALS;
    const disable = inProgress || !props.amount || props.amountValid === false || !balanceValidation;

    const fromNamadaSelectedConfig = props.selectedAsset?.config;
    let namadaBalance = props.selectedAsset?.balance?.minDenomAmount && Number(props.selectedAsset?.balance?.minDenomAmount) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    if (props.selectedAsset?.balance?.tokenAddress === config.TOKEN_ADDRESS) {
        namadaBalance = props.selectedAsset?.balance?.minDenomAmount && Number(props.selectedAsset?.balance?.minDenomAmount)
    }
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
                    <Button onClick={() => handleMax(namadaBalance)}>{variables[props.lang].max}</Button>
                </div>
                {fromNamadaSelectedConfig
                    ? <div className="transparent_tokens_secion">
                        <span>
                            <p>{variables[props.lang].available}</p>
                            <p>{namadaBalance || 0} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                        </span>
                        {/* <Button onClick={() => handleMax(namadaBalance)}>{variables[props.lang].max}</Button> */}
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
                <div className="fee">
                    {props.feeOption?.fees?.fee
                        ? <p>{variables[props.lang].fee}:&nbsp;
                        <p>{formatCount(props.feeOption?.fees?.fee) || feeCalculationDisplay(props.gasEstimation, props.gasPrice, props.selectedAsset?.balance?.tokenAddress)} {props.feeOption?.symbol}</p></p> : null}
                    <FeeOptions/>
                </div>
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
                {!balanceValidation
                    ? 'Not Enough Balance'
                    : params
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
    balanceList: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    failedDialog: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    gasPrice: PropTypes.array.isRequired,
    gasEstimation: PropTypes.object.isRequired,
    feeOption: PropTypes.object.isRequired,
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
        balanceList: state.accounts.balanceList.result,
        lang: state.language,
        address: state.accounts.address.value,
        amount: state.shieldedAssets.amount.value,
        amountValid: state.shieldedAssets.amount.valid,
        details: state.accounts.address.details,
        shieldedAddress: state.accounts.address.shieldedDetails,
        revealPublicKey: state.accounts.revealPublicKey.result,
        selectedAsset: state.shieldedAssets.selectedAsset.result,
        shieldedData: state.accounts.address.shieldedData,
        gasEstimation: state.gasPrice.gasEstimation.value,
        gasPrice: state.gasPrice.gasPrice.value,
        feeOption: state.assets.feeOptionPopoverValue.value,
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
