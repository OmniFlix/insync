import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import {
    setIBCSwapType,
    setIBCTransferAmount,
    setIBCTransferType,
    fetchTimeoutHeight,
    executeIBCTransfer,
    fetchIBCBalance,
    aminoSignIBCTx,
    protoBufSigning,
    txSignAndBroadCast,
    connectIBCAccount,
    connectIBCAccountSuccess,
    fetchIBCChannel,
    showTokensTransactionSuccessDialog,
} from '../../actions/IBCTransfer';
import { config } from '../../config';
import NamadaLogo from '../../assets/masp/namada_logo.svg';
import SourceSelectField from './SourceSelectField';
import { showMessage } from 'actions/snackbar';
import { showConnectDialog } from 'actions/navBar';
import keplrIcon from '../../assets/keplr.png';
import { fetchBalanceList, fetchTokensList, getBalance } from '../../actions/accounts';
import { showDelegateSuccessDialog } from '../../actions/stake';
import { feeList, ibcList } from 'dummy/ibcList';
import { ibcTransaction } from 'helper';
import BigNumber from 'bignumber.js';
import DownArrowIcon from '../../assets/down_arrow_nofill.png';
import { formatCount } from 'utils/numberFormats';
import { hideTransparentTokensWithdrawDialog } from 'actions/assets';
import variables from 'utils/variables';
import ProcessingButton from 'components/ProcessingButton';
import FeeOptions from 'containers/Tokens/FeeOptions';
import { balanceCalculation, feeCalculation, feeCalculationDisplay, feeCalculationMax } from 'utils/feeCalculation';

const NamadaToIBCTransparentTransfer = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [approval, setApproval] = useState(false);
    const [params, setParams] = useState(false);
    useEffect(() => {
        const address = localStorage.getItem('namada_keplr_address');
        if (address) {
            const selectedChain = props.selectedChain || ibcList[0];
    
            const config = {
                RPC_URL: selectedChain && selectedChain.config && selectedChain.config.RPC_URL,
                REST_URL: selectedChain && selectedChain.config && selectedChain.config.REST_URL,
                CHAIN_ID: selectedChain && selectedChain.config && selectedChain.config.CHAIN_ID,
                CHAIN_NAME: selectedChain && selectedChain.config && selectedChain.config.CHAIN_NAME,
                COIN_DENOM: selectedChain && selectedChain.config && selectedChain.config.COIN_DENOM,
                COIN_MINIMAL_DENOM: selectedChain && selectedChain.config && selectedChain.config.COIN_MINIMAL_DENOM,
                COIN_DECIMALS: selectedChain && selectedChain.config && selectedChain.config.COIN_DECIMALS,
                PREFIX: selectedChain && selectedChain.config && selectedChain.config.PREFIX,
            };
    
            setInProgress(true);
            props.connectIBCAccount(config, (address) => {
                setInProgress(false);
                localStorage.setItem('namada_keplr_address', address[0].address);
                props.fetchIBCBalance(config.REST_URL, address[0].address);
                props.fetchIBCChannel(selectedChain.channel_link);
            });
        }
    }, []);

    let balance = null;
    let ibcBalance = null;
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
    props.ibcBalance && props.ibcBalance.length && props.ibcBalance.map((val) => {
        if (val) {
            ibcBalance = val && val.amount;
        }

        return null;
    });

    balance = balance && balance / 10 ** config.COIN_DECIMALS;
    ibcBalance = ibcBalance && ibcBalance / 10 ** (props.selectedChain && props.selectedChain.config && props.selectedChain.config.COIN_DECIMALS);
    if (ibcBalance > 0.5) {
        ibcBalance = ibcBalance - 0.05;
    }

    const getChannelIdForChain = (ibcData, targetChain) => {
        if (!ibcData || !ibcData.channels) {
            return undefined;
        }

        const channel = ibcData.channels.find((ch) => {
            if (!ch) { return false; }

            return (ibcData.chain_1 && ibcData.chain_1.chain_name === targetChain && ch.chain_1 && ch.chain_1.channel_id) ||
                (ibcData.chain_2 && ibcData.chain_2.chain_name === targetChain && ch.chain_2 && ch.chain_2.channel_id);
        });

        if (!channel) { return undefined; }

        const chainKey = ibcData.chain_1 && ibcData.chain_1.chain_name === targetChain ? 'chain_1' : 'chain_2';
        return channel[chainKey] && channel[chainKey].channel_id;
    };

    const handleNamadaTransfer = () => {
        setInProgress(true);

        const source = props.address;
        let token = fromNamadaSelectedConfig?.COIN_MINIMAL_DENOM;
        let amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
        const namadaChannelId = getChannelIdForChain(props.ibcChannel, 'namada');
        if (props.fromNamadaSelectedAsset?.balance?.minDenomAmount) {
            amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            token = props.fromNamadaSelectedAsset?.balance?.tokenAddress;
        }

        const tx = {
            source: source,
            token: token,
            amountInBaseDenom: amount,
            receiver: props.ibcTransferAddress,
            portId: 'transfer',
            channelId: namadaChannelId,
        };

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(32032),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

        if (props.fromNamadaSelectedAsset?.balance?.minDenomAmount) {
            txs.token = props.fromNamadaSelectedAsset?.balance?.tokenAddress;
            const tokenGasPrice = props.gasPrice.find((val) => val.token === props.fromNamadaSelectedAsset?.balance?.tokenAddress);
            txs.feeAmount = new BigNumber(tokenGasPrice?.minDenomAmount);
            if (props.feeOption?.fees?.token) {
                txs.token = props.feeOption?.fees?.token;
                const tokenGasPrice = props.gasPrice.find((val) => val.token === props.feeOption?.fees?.token);
                txs.feeAmount = new BigNumber(tokenGasPrice?.minDenomAmount);
            }
            txs.gasLimit = new BigNumber(feeCalculation(props.gasEstimation))
        }

        // setParams(true);
        setApproval(true);
        ibcTransaction(props.address, tx, txs, props.revealPublicKey, props.details && props.details.type, props.details, handleFetch);
    };

    const handleSubmit = () => {
        if (!props.address) {
            props.showMessage('Please connect your wallet first');
            props.showConnectDialog();
            return;
        }
        if (!props.ibcTransferAddress) {
            props.showMessage('Please connect your wallet first');
            props.showConnectDialog(false, false, true);
            return;
        }

        handleNamadaTransfer();
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
            // if (error.indexOf('not yet found on the chain') > -1) {
            //     props.pendingDialog();
            //     return;
            // }
            // props.failedDialog();
            props.showMessage(error);
            return;
        }
        const available = props.fromNamadaSelectedAsset?.balance?.minDenomAmount;
        const token = props.fromNamadaSelectedAsset?.balance?.tokenAddress;

        const tokenName = props.fromNamadaSelectedAsset?.symbol || props.fromNamadaSelectedAsset?.name;
        const successObject = {
            text: `${tokenName} Withdraw Successfully`,
            content: 'Your withdraw was completed and funds are available',
        }

        const intervalTime = setInterval(() => {
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
                        props.hideTransparentTokensWithdrawDialog();
                        props.showTokensTransactionSuccessDialog(successObject)
                        // props.showDelegateSuccessDialog(value && value.hash, null, fromNamadaSelectedConfig);
                        // props.fetchBalanceList(props.address);
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
                // props.showDelegateSuccessDialog(value && value.hash, null, fromNamadaSelectedConfig);
                props.fetchBalanceList(props.address);
            }, 30000);
        }
    };

    const handleMax = (ibcBalance) => {
        if (ibcBalance > 0) {
            props.setIBCTransferAmount (feeCalculationMax(props.gasEstimation, props.gasPrice, props.fromNamadaSelectedAsset?.balance?.tokenAddress, ibcBalance), true);
        }
    };

    const fromNamadaSelectedConfig = props.fromNamadaSelectedAsset?.config;
    const namadaBalance = props.fromNamadaSelectedAsset?.balance?.minDenomAmount && Number(props.fromNamadaSelectedAsset?.balance?.minDenomAmount) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    const image = props.fromNamadaSelectedAsset && props.fromNamadaSelectedAsset.logo_URIs && (props.fromNamadaSelectedAsset.logo_URIs.svg || props.fromNamadaSelectedAsset.logo_URIs.png);
    const fee = feeList && fromNamadaSelectedConfig && feeList[fromNamadaSelectedConfig?.COIN_DENOM];

    let token = config.TOKEN_ADDRESS;
    if (props.fromNamadaSelectedAsset?.balance?.minDenomAmount) {
        token = props.fromNamadaSelectedAsset?.balance?.tokenAddress;
    }
    const balanceValidation = balanceCalculation(props.balanceList, token, props.amount, props.feeOption);
    const disable = !props.amount || props.amount === '' || !balanceValidation;

    return (
        <div className="transfer_dialog">
            <div className="transfer_source">
                {!props.ibcTransferAddress && <Button className="connect_keplr" disabled={props.ibcTransferAddress} onClick={() => props.showConnectDialog(false, false, true)}>Connect wallet</Button>}
                <div className="nam_header">
                    <img alt="NamadaLogo" src={NamadaLogo}/>
                    <div className="address">
                        {variables[props.lang].nam}
                        <div>
                            <span>{props.address}</span>
                            {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                        </div>    
                    </div>
                </div>
                <div className="border"></div>
                <div className="select_section">
                    <SourceSelectField ibcOnly={true} from={props.from} data={props.transparentWithdrawData}/>
                    <AmountTextField data={props.transparentWithdrawData}/>
                </div>
                <span className="available_balance">
                    <p>{variables[props.lang].available}</p>
                    <p>{namadaBalance || 0} {fromNamadaSelectedConfig?.COIN_DENOM}</p>
                </span>
                {fromNamadaSelectedConfig
                    ? <div className="nam_tokens_secion">
                        <Button onClick={() => handleMax(namadaBalance, true)}>Max</Button>
                    </div> : null}
            </div>
            {/* <div className="arrow from_namada_transfer" onClick={() => props.setIBCSwapType('to_namada')}>
                <img alt="TransferIcon" src={TransferIcon}/>
            </div> */}
            <div className="nam_arrow">
                <img alt="Arrow" src={DownArrowIcon}/>
            </div>
            <div className="nam_transfer_destination" style={{ minHeight: 'unset' }}>
                {fromNamadaSelectedConfig
                ? <div>
                    <img alt={keplrIcon} src={keplrIcon} style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                        <p>
                            
                            {props.ibcTransferAddress}
                        </p>
                        <div className="header_right">
                            {/* <Button className="connect_keplr" disabled={props.ibcTransferAddress} onClick={() => props.showConnectDialog(false, false, true)}>
                                {props.ibcTransferAddress
                                    ? <>
                                        <img alt="keplr" src={keplrIcon}/>
                                        {getWrapAddress(props.ibcTransferAddress, 6, 6)}
                                    </>
                                    : 'Connect'}
                            </Button> */}
                            {/* {props.ibcTransferAddress
                                ? <ExitToAppIcon className="logout_icon" onClick={() => {
                                    localStorage.removeItem('namada_keplr_address');
                                    props.connectIBCAccountSuccess('');
                                }}/> : null} */}
                        </div>
                    </div> : null}
            </div>
            <div className="fee">
                {props.feeOption?.fees?.fee
                    ? <p>{variables[props.lang].fee}:<p>{formatCount(props.feeOption?.fees?.fee) || feeCalculationDisplay(props.gasEstimation, props.gasPrice, props.fromNamadaSelectedAsset?.balance?.tokenAddress)} {props.feeOption?.symbol}</p></p> : null}
                <FeeOptions/>
            </div>
                    {inProgress
                    ? <ProcessingButton>
                          <Button
                className="submit_button"
                disabled={disable || inProgress || props.amountValid === false}
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
                disabled={disable || inProgress || props.amountValid === false}
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
            {/* {inProgress && <CircularProgress className="full_screen"/>} */}
        </div>
    );
};

NamadaToIBCTransparentTransfer.propTypes = {
    aminoSignIBCTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    connectIBCAccountSuccess: PropTypes.func.isRequired,
    executeIBCTransfer: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchTimeoutHeight: PropTypes.func.isRequired,
    fetchIBCChannel: PropTypes.func.isRequired,
    fetchTokensList: PropTypes.func.isRequired,
    fetchBalanceList: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    gasPrice: PropTypes.array.isRequired,
    gasEstimation: PropTypes.object.isRequired,
    feeOption: PropTypes.object.isRequired,
    hideTransparentTokensWithdrawDialog: PropTypes.func.isRequired,
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    setIBCSwapType: PropTypes.func.isRequired,
    setIBCTransferAmount: PropTypes.func.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    showDelegateSuccessDialog: PropTypes.func.isRequired,
    showTokensTransactionSuccessDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    protoBufSigning: PropTypes.func.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    fromNamadaSelectedAsset: PropTypes.object.isRequired,
    address: PropTypes.string,
    amount: PropTypes.string,
    amountValid: PropTypes.bool,
    from: PropTypes.string,
    ibcBalance: PropTypes.number,
    ibcChannel: PropTypes.object,
    ibcTransferAddress: PropTypes.string,
    ibcTransferType: PropTypes.string,
    keys: PropTypes.object,
    revealPublicKey: PropTypes.object,
    selectedAsset: PropTypes.string,
    selectedChain: PropTypes.string,
    shieldedAddress: PropTypes.string,
    transparentWithdrawData: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        balanceList: state.accounts.balanceList.result,
        ibcBalance: state.ibcTransfer.balance.value,
        lang: state.language,
        address: state.accounts.address.value,
        amount: state.ibcTransfer.ibcTransferAmount.value,
        amountValid: state.ibcTransfer.ibcTransferAmount.valid,
        details: state.accounts.address.details,
        shieldedAddress: state.accounts.address.shieldedDetails,
        ibcTransferType: state.ibcTransfer.ibcTransferType.value,
        ibcSwapType: state.ibcTransfer.ibcSwapType.value,
        selectedChain: state.ibcTransfer.selectedChain.value,
        selectedAsset: state.ibcTransfer.selectedAsset.value,
        ibcTransferAddress: state.ibcTransfer.connection.address,
        ibcChannel: state.ibcTransfer.ibcChannel.value,
        keys: state.ibcTransfer.connection.keys,
        revealPublicKey: state.accounts.revealPublicKey.result,
        fromNamadaSelectedAsset: state.ibcTransfer.fromNamadaSelectedAsset.result,
        gasEstimation: state.gasPrice.gasEstimation.value,
        gasPrice: state.gasPrice.gasPrice.value,
        feeOption: state.assets.feeOptionPopoverValue.value,
    };
};

const actionToProps = {
    aminoSignIBCTx,
    setIBCTransferAmount,
    setIBCTransferType,
    setIBCSwapType,
    protoBufSigning,
    txSignAndBroadCast,
    executeIBCTransfer,
    fetchTimeoutHeight,
    fetchIBCBalance,
    showMessage,
    showConnectDialog,
    getBalance,
    showDelegateSuccessDialog,
    connectIBCAccount,
    connectIBCAccountSuccess,
    fetchIBCChannel,
    fetchTokensList,
    fetchBalanceList,

    hideTransparentTokensWithdrawDialog,
    showTokensTransactionSuccessDialog,
};

export default connect(stateToProps, actionToProps)(NamadaToIBCTransparentTransfer);
