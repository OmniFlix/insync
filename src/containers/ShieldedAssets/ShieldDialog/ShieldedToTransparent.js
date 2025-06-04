import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import { setAmount } from '../../../actions/shieldedAssets';
import { config } from '../../../config';
import DownArrowIcon from '../../../assets/down_arrow_nofill.png';
import NamadaLogo from '../../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../../assets/masp/namada_shielded.svg';
import BigNumber from 'bignumber.js';
import { shieldedToTransparentTransaction } from 'helper';
import { UnshieldingTransferDataMsgValue } from '@harish551/namada-types';
import { fetchBalanceList, getBalance, getShieldedBalance } from 'actions/accounts';
import { showDelegateFailedDialog, showDelegateProcessingDialog, showDelegateSuccessDialog } from 'actions/stake';
import { showMessage } from 'actions/snackbar';
import { feeList } from 'dummy/ibcList';
import { formatCount } from 'utils/numberFormats';
import ShieldedSourceSelectField from 'containers/IBCTransfer/ShieldedSourceSelectField';
import { fetchIBCBalance, showTokensTransactionSuccessDialog } from 'actions/IBCTransfer';
import variables from 'utils/variables';
import ProcessingButton from 'components/ProcessingButton';
import { hideShieldedTokensConvertDialog } from 'actions/assets';
import { feeCalculation, feeCalculationDisplay, feeCalculationMax } from 'utils/feeCalculation';

const ShieldedToTransparent = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [approval, setApproval] = useState(false);
    const [params, setParams] = useState(false);
    const handleSubmit = () => {
        setInProgress(true);

        const source = props.shieldedData?.pseudoExtendedKey;
        let token = config.TOKEN_ADDRESS;
        let amount = new BigNumber(props.amount);
        if (props.selectedAsset?.balance) {
            amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
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
            gasLimit: new BigNumber(fee?.shieldedTransfer || 62500),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

        if (props.selectedAsset?.balance) {
            txs.token = props.selectedAsset?.tokenAddress;
            const tokenGasPrice = props.gasPrice.find((val) => val.token === props.selectedAsset?.tokenAddress);
            txs.feeAmount = new BigNumber(tokenGasPrice?.minDenomAmount);
            txs.gasLimit = new BigNumber(feeCalculation(props.gasEstimation))
        }

        setParams(true);
        setApproval(true);
        shieldedToTransparentTransaction(props.address, tx, txs, props.revealPublicKey, props.details && props.details.type, props.details, handleFetch);
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
        const tokenAddress = props.selectedAsset && props.selectedAsset.tokenAddress;
        const balance = props.selectedAsset && props.selectedAsset.balance && Number(props.selectedAsset.balance);
        const fromNamadaSelectedConfig = props.selectedAsset?.config;
        handleFetchShieldedBalance(tokenAddress, balance, fromNamadaSelectedConfig, value);
    };

    const handleFetchShieldedBalance = (tokenAddress, balance, ibcConfig, res1) => {
        const tokenName = props.selectedAsset?.symbol || props.selectedAsset?.name;
        const successObject = {
            text: `${tokenName} Unshield Successfully`,
            content: 'Your unshield was completed',
        }

        props.getShieldedBalance(props.shieldedData?.viewingKey, props.shieldedData?.timestamp, props.address, props.shieldedData?.address, config.CHAIN_ID, (resBalance) => {
            let resultBalance = resBalance && resBalance.length && tokenAddress &&
                    resBalance.find((val) => val && val.length && val[0] && (val[0] === tokenAddress));
            resultBalance = resultBalance && resultBalance.length && resultBalance[1] && Number(resultBalance[1]);
            if (resultBalance !== balance) {
                props.fetchBalanceList(props.address);
                // props.successDialog(res1.hash, null, ibcConfig);
                props.showTokensTransactionSuccessDialog(successObject);
                props.hideShieldedTokensConvertDialog();
                setInProgress(false);
                setParams(false);
                setApproval(false);
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

    const handleMax = (ibcBalance) => {
        if (ibcBalance > 0) {
            props.setAmount(feeCalculationMax(props.gasEstimation, props.gasPrice, props.selectedAsset?.tokenAddress, ibcBalance), true);
        }
    };

    balance = balance && balance / 10 ** config.COIN_DECIMALS;
    const disable = inProgress || !props.amount || props.amountValid === false;

    const fromNamadaSelectedConfig = props.selectedAsset?.config;
    const namadaBalance = props.selectedAsset?.balance && Number(props.selectedAsset?.balance) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    const fee = feeList && fromNamadaSelectedConfig && feeList[fromNamadaSelectedConfig?.COIN_DENOM];

    return (
        <div className="shield_dialog">
            <div className="transfer_source">
                <div className="header">
                    <p>
                        <img alt="NamadaLogo" src={NamadaShieldedLogo}/>
                        {variables[props.lang].namada_shielded}
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
                        <p>{variables[props.lang].available} {namadaBalance || 0} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                        {/* <Button onClick={() => props.setAmount(namadaBalance)}>Max</Button> */}
                    </div> : null}
                <Button className="max_button" onClick={() => handleMax(namadaBalance)}>{variables[props.lang].max}</Button>

            </div>
            <div className="arrow shield_convert_arrow">
                <img alt="Arrow" src={DownArrowIcon}/>
            </div>
            <div className="transfer_destination">
                <div>
                    <p>
                        <img alt="NamadaLogo" src={NamadaLogo}/>
                        {variables[props.lang].namada_transparent}
                    </p>
                    <div className="address">
                        <span>{props.address}</span>
                        {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                    </div>
                </div>
                {/* <p>Transaction fee: 0.025385 NAM</p> */}
            </div>
            {fee && fee.fee
                ? <div className="fee">
                    <p>{variables[props.lang].fee}</p>
                    <p>{feeCalculationDisplay(props.gasEstimation, props.gasPrice, props.selectedAsset?.tokenAddress) || formatCount(fee.fee * fee.shieldedTransfer)} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                </div> : null}
            {/* {inProgress && <CircularProgress className="full_screen"/>} */}
            {inProgress
            ? <ProcessingButton>
                  <Button
                  className='submit_button'
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
            :   <Button
            className='submit_button'
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

ShieldedToTransparent.propTypes = {
    balance: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    failedDialog: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    gasPrice: PropTypes.array.isRequired,
    gasEstimation: PropTypes.object.isRequired,
    fetchBalanceList: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    setAmount: PropTypes.func.isRequired,
    getShieldedBalance: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    showTokensTransactionSuccessDialog: PropTypes.func.isRequired,
    hideShieldedTokensConvertDialog: PropTypes.func.isRequired,
    address: PropTypes.string,
    amount: PropTypes.string,
    amountValid: PropTypes.bool,
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
        amountValid: state.shieldedAssets.amount.valid,
        details: state.accounts.address.details,
        shieldedAddress: state.accounts.address.shieldedDetails,
        shieldedData: state.accounts.address.shieldedData,
        disposableSigner: state.accounts.address.disposableSigner,
        revealPublicKey: state.accounts.revealPublicKey.result,
        selectedAsset: state.ibcTransfer.fromNamadaSelectedAsset.shieldedResult,
        gasEstimation: state.gasPrice.gasEstimation.value,
        gasPrice: state.gasPrice.gasPrice.value,
    };
};

const actionToProps = {
    setAmount,
    getBalance,
    fetchBalanceList,
    successDialog: showDelegateSuccessDialog,
    failedDialog: showDelegateFailedDialog,
    pendingDialog: showDelegateProcessingDialog,
    showMessage,
    getShieldedBalance,
    fetchIBCBalance,
    showTokensTransactionSuccessDialog,
    hideShieldedTokensConvertDialog,
};

export default connect(stateToProps, actionToProps)(ShieldedToTransparent);
