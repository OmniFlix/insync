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
} from '../../actions/IBCTransfer';
import { config } from '../../config';
import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';
import { showMessage } from 'actions/snackbar';
import { showConnectDialog } from 'actions/navBar';
import { getWrapAddress } from '../../utils/strings';
import keplrIcon from '../../assets/keplr.png';
import { fetchBalanceList, fetchTokensList, getBalance, getShieldedBalance } from '../../actions/accounts';
import { showDelegateSuccessDialog } from '../../actions/stake';
import CircularProgress from '../../components/CircularProgress';
import { feeList, ibcList } from 'dummy/ibcList';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { ibcTransaction } from 'helper';
import BigNumber from 'bignumber.js';
import DownArrowIcon from '../../assets/down_arrow_nofill.png';
import { formatCount } from 'utils/numberFormats';
import ShieldedSourceSelectField from './ShieldedSourceSelectField';

const IBCUnShielding = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [approval, setApproval] = useState(false);
    const [params, setParams] = useState(false);
    // useEffect(() => {
    //     const address = localStorage.getItem('namada_keplr_address');
    //     if (address) {
    //         const selectedChain = props.selectedChain || ibcList[0];
    
    //         const config = {
    //             RPC_URL: selectedChain && selectedChain.config && selectedChain.config.RPC_URL,
    //             REST_URL: selectedChain && selectedChain.config && selectedChain.config.REST_URL,
    //             CHAIN_ID: selectedChain && selectedChain.config && selectedChain.config.CHAIN_ID,
    //             CHAIN_NAME: selectedChain && selectedChain.config && selectedChain.config.CHAIN_NAME,
    //             COIN_DENOM: selectedChain && selectedChain.config && selectedChain.config.COIN_DENOM,
    //             COIN_MINIMAL_DENOM: selectedChain && selectedChain.config && selectedChain.config.COIN_MINIMAL_DENOM,
    //             COIN_DECIMALS: selectedChain && selectedChain.config && selectedChain.config.COIN_DECIMALS,
    //             PREFIX: selectedChain && selectedChain.config && selectedChain.config.PREFIX,
    //         };
    
    //         setInProgress(true);
    //         props.connectIBCAccount(config, (address) => {
    //             setInProgress(false);
    //             localStorage.setItem('namada_keplr_address', address[0].address);
    //             props.fetchIBCBalance(config.REST_URL, address[0].address);
    //             props.fetchIBCChannel(selectedChain.channel_link);
    //         });
    //     }
    // }, []);

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

        // const source = props.address;
        const source = props.shieldedData?.pseudoExtendedKey;
        const gasSpendingKey = props.shieldedData?.pseudoExtendedKey;
        let token = fromNamadaSelectedConfig?.COIN_MINIMAL_DENOM;
        let amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
        // const amount = String(Number(props.amount) * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
        const namadaChannelId = getChannelIdForChain(props.ibcChannel, 'namada');
        if (props.fromNamadaSelectedAsset?.balance) {
            amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            token = props.fromNamadaSelectedAsset?.tokenAddress;
        }

        const tx = {
            source: source,
            gasSpendingKey: gasSpendingKey,
            token: token,
            amountInBaseDenom: amount,
            receiver: props.ibcTransferAddress,
            portId: 'transfer',
            channelId: namadaChannelId,
            // disposableSigner: props.disposableSigner?.address,
        };

        const fee = feeList && fromNamadaSelectedConfig && feeList[fromNamadaSelectedConfig?.COIN_DENOM];
        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(fee?.shieldedgas || 152624),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
            // publicKey: props.disposableSigner?.publicKey,
        };
        
        if (props.fromNamadaSelectedAsset?.balance) {
            txs.token = props.fromNamadaSelectedAsset?.tokenAddress;
            txs.feeAmount = new BigNumber(0.00001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            // txs.chainId = fromNamadaSelectedConfig.CHAIN_ID;
            if (fromNamadaSelectedConfig?.COIN_DENOM === 'ATOM') {
                txs.feeAmount = new BigNumber(0.000001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            }
        }

        setParams(true);
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
        const tokenAddress = props.fromNamadaSelectedAsset && props.fromNamadaSelectedAsset.tokenAddress;
        const balance = props.fromNamadaSelectedAsset && props.fromNamadaSelectedAsset.balance && Number(props.fromNamadaSelectedAsset.balance);
        const fromNamadaSelectedConfig = props.fromNamadaSelectedAsset?.config;
        handleFetchShieldedBalance(tokenAddress, balance, fromNamadaSelectedConfig, value);
    };

    const handleFetchShieldedBalance = (tokenAddress, balance, ibcConfig, res1) => {
        props.getShieldedBalance(props.shieldedData?.viewingKey, props.shieldedData?.timestamp, props.address, props.shieldedData?.address, config.CHAIN_ID, (resBalance) => {
            let resultBalance = resBalance && resBalance.length && tokenAddress &&
                    resBalance.find((val) => val && val.length && val[0] && (val[0] === tokenAddress));
            resultBalance = resultBalance && resultBalance.length && resultBalance[1] && Number(resultBalance[1]);
            if (resultBalance !== balance) {
                props.fetchIBCBalance(ibcConfig?.REST_URL, props.ibcTransferAddress);
                props.getBalance(props.address);
                props.showDelegateSuccessDialog(res1.hash, null, ibcConfig);
                setInProgress(false);
                setParams(false);
                setApproval(false);
            } else {
                handleFetchShieldedBalance(tokenAddress, balance, ibcConfig, res1);
            }
        });
    };

    const fromNamadaSelectedConfig = props.fromNamadaSelectedAsset?.config;
    const namadaBalance = props.fromNamadaSelectedAsset?.balance && Number(props.fromNamadaSelectedAsset?.balance) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    const image = props.fromNamadaSelectedAsset && props.fromNamadaSelectedAsset.logo_URIs && (props.fromNamadaSelectedAsset.logo_URIs.svg || props.fromNamadaSelectedAsset.logo_URIs.png);
    const fee = feeList && fromNamadaSelectedConfig && feeList[fromNamadaSelectedConfig?.COIN_DENOM];

    const disable = !props.amount || props.amount === '';

    return (
        <div className="transfer_dialog">
             <div className="transfer_source">
                <div className="header">
                    <p>
                        <img alt="NamadaLogo" src={NamadaShieldedLogo}/>
                        <span>
                            <p>NAM Shielded</p>
                            <div className="address">
                                <span>{props.shieldedAddress}</span>
                                {props.shieldedAddress && props.shieldedAddress.slice(props.shieldedAddress.length - 6, props.shieldedAddress.length)}
                            </div>
                        </span>
                    </p>
                    <span className="balance_span">
                        <p>Available </p>
                        <p>{namadaBalance}{' '}{config.COIN_DENOM}</p>
                    </span>
                    
                </div>
                <div className="border"></div>
                <div className="select_section">
                    <ShieldedSourceSelectField ibcOnly={true}/>
                    <AmountTextField amount={namadaBalance} from="withdraw_shielded"/>
                </div>
                {fromNamadaSelectedConfig
                    ? <div className="shielded_tokens_secion">
                        <span className="available_balance">
                            <p>Available</p>
                            <p>{namadaBalance || 0} {fromNamadaSelectedConfig.COIN_DENOM}</p>                        
                        </span>
                        {/* <Button onClick={() => props.setIBCTransferAmount(namadaBalance)}>Max</Button> */}
                    </div> : null}
                <Button className="max_button" onClick={() => props.setIBCTransferAmount(namadaBalance)}>Max</Button>
            </div>
            {/* <div className="arrow from_namada_transfer" onClick={() => props.setIBCSwapType('to_namada')}>
                <img alt="TransferIcon" src={TransferIcon}/>
            </div> */}
            <div className="arrow" style={{ top: '48%', height: 'max-content' }}>
                <img alt="Arrow" src={DownArrowIcon}/>
            </div>
            <div className="shielded_transfer_destination" style={{ minHeight: 'unset' }}>
                {fromNamadaSelectedConfig
                ? <div>
                        {/* <p>
                            {image && <img alt={props.fromNamadaSelectedAsset?.name} src={image} style={{ width: '24px', height: '24px', marginRight: '8px' }} />}
                            {fromNamadaSelectedConfig.COIN_DENOM}
                        </p> */}
                        <div className="shielded_withdraw_header_right">
                            {/* <Button className="connect_keplr" disabled={props.ibcTransferAddress} onClick={() => props.showConnectDialog(false, false, true)}>
                                {props.ibcTransferAddress
                                    ? <>
                                        <img alt="keplr" src={keplrIcon}/>
                                        {getWrapAddress(props.ibcTransferAddress, 6, 6)}
                                    </>
                                    : 'Connect'}
                            </Button> */}
                            {props.ibcTransferAddress ? (
                                <div className="tokens_secion">
                                    <img alt='keplrIcon' src={keplrIcon}/>
                                    <p>{props.ibcTransferAddress}</p>
                                </div>
                                // <p><img alt="keplr" src={keplrIcon}/>{' '}{getWrapAddress(props.ibcTransferAddress, 6, 6)}</p>
                            ) 
                            : ( 
                            <Button onClick={() => props.showConnectDialog(false, false, true)}>
                                Connect
                            </Button>)
                            }
                            {/* {props.ibcTransferAddress
                                ? <ExitToAppIcon className="logout_icon" onClick={() => {
                                    localStorage.removeItem('namada_keplr_address');
                                    props.connectIBCAccountSuccess('');
                                }}/> : null} */}
                        </div>
                    </div> : null}
            </div>
            {fee && fee.fee
                    ? <div className="fee">
                        <p>fee:<p>{formatCount(fee.fee * fee.shieldedgas)} {fromNamadaSelectedConfig.COIN_DENOM}</p></p>
                    </div> : null}
            <Button
                className="submit_button"
                disabled={disable || inProgress}
                onClick={handleSubmit}>
                {params
                    ? 'Generating MASP Parameters...'
                    : approval
                        ? 'Approval pending...'
                        : inProgress
                            ? 'InProgress...' : 'Submit'}
            </Button>
            {inProgress && <CircularProgress className="full_screen"/>}
        </div>
    );
};

IBCUnShielding.propTypes = {
    aminoSignIBCTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
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
    getShieldedBalance: PropTypes.func.isRequired,
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    setIBCSwapType: PropTypes.func.isRequired,
    setIBCTransferAmount: PropTypes.func.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    showDelegateSuccessDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    protoBufSigning: PropTypes.func.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    fromNamadaSelectedAsset: PropTypes.object.isRequired,
    address: PropTypes.string,
    amount: PropTypes.string,
    ibcBalance: PropTypes.number,
    ibcChannel: PropTypes.object,
    ibcTransferAddress: PropTypes.string,
    ibcTransferType: PropTypes.string,
    keys: PropTypes.object,
    revealPublicKey: PropTypes.object,
    disposableSigner: PropTypes.object,
    shieldedData: PropTypes.object,
    selectedAsset: PropTypes.string,
    selectedChain: PropTypes.string,
    shieldedAddress: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        ibcBalance: state.ibcTransfer.balance.value,
        lang: state.language,
        address: state.accounts.address.value,
        amount: state.ibcTransfer.ibcTransferAmount.value,
        details: state.accounts.address.details,
        disposableSigner: state.accounts.address.disposableSigner,
        shieldedAddress: state.accounts.address.shieldedDetails,
        ibcTransferType: state.ibcTransfer.ibcTransferType.value,
        ibcSwapType: state.ibcTransfer.ibcSwapType.value,
        selectedChain: state.ibcTransfer.selectedChain.value,
        selectedAsset: state.ibcTransfer.selectedAsset.value,
        ibcTransferAddress: state.ibcTransfer.connection.address,
        ibcChannel: state.ibcTransfer.ibcChannel.value,
        keys: state.ibcTransfer.connection.keys,
        revealPublicKey: state.accounts.revealPublicKey.result,
        fromNamadaSelectedAsset: state.ibcTransfer.fromNamadaSelectedAsset.shieldedResult,
        shieldedData: state.accounts.address.shieldedData,
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
    getShieldedBalance,
};

export default connect(stateToProps, actionToProps)(IBCUnShielding);
