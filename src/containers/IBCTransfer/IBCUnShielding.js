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
import { fetchBalanceList, fetchTokensList, getBalance } from '../../actions/accounts';
import { showDelegateSuccessDialog } from '../../actions/stake';
import CircularProgress from '../../components/CircularProgress';
import { feeList, ibcList } from 'dummy/ibcList';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { ibcTransaction } from 'helper';
import BigNumber from 'bignumber.js';
import DownArrowIcon from '../../assets/masp/downArrow.svg';
import { formatCount } from 'utils/numberFormats';
import ShieldedSourceSelectField from './ShieldedSourceSelectField';

const IBCUnShielding = (props) => {
    const [inProgress, setInProgress] = useState(false);
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
        // const amount = String(Number(props.amount) * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
        const namadaChannelId = getChannelIdForChain(props.ibcChannel, 'namada');
        if (props.fromNamadaSelectedAsset?.balance) {
            amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            token = props.fromNamadaSelectedAsset?.balanceTokenAddress;
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
        
        if (props.fromNamadaSelectedAsset?.balance) {
            txs.token = props.fromNamadaSelectedAsset?.balanceTokenAddress;
            txs.feeAmount = new BigNumber(0.00001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            // txs.chainId = fromNamadaSelectedConfig.CHAIN_ID;
            if (fromNamadaSelectedConfig?.COIN_DENOM === 'ATOM') {
                txs.feeAmount = new BigNumber(0.000001 * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
            }
        }

        console.log('txs', txs, tx, fromNamadaSelectedConfig, props);
        ibcTransaction(props.address, tx, txs, props.revealPublicKey, props.details && props.details.type, handleFetch);
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

    const handleFetch = (error, value) => {
        if (error) {
            setInProgress(false);
            // if (error.indexOf('not yet found on the chain') > -1) {
            //     props.pendingDialog();
            //     return;
            // }
            // props.failedDialog();
            props.showMessage(error);
            return;
        }
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

        const available = balance;
        const intervalTime = setInterval(() => {
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
                        clearInterval(intervalTime);
                        props.showDelegateSuccessDialog(value && value.hash, fromNamadaSelectedConfig);
                        props.fetchTokensList();
                        props.fetchBalanceList(props.address);
                    }
                }
            });
        }, 2000);

        if (intervalTime) {
            setTimeout(() => {
                setInProgress(false);
                clearInterval(intervalTime);
            }, 60000);
        }
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
                        Namada Shielded
                    </p>
                    <div className="address">
                        <span>{props.shieldedAddress}</span>
                        {props.shieldedAddress && props.shieldedAddress.slice(props.shieldedAddress.length - 6, props.shieldedAddress.length)}
                    </div>
                </div>
                <div className="border"></div>
                <div className="select_section">
                    <ShieldedSourceSelectField ibcOnly={true}/>
                    <AmountTextField/>
                </div>
                {fromNamadaSelectedConfig
                    ? <div className="tokens_secion">
                        <p>Available: {namadaBalance || 0} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                        <Button onClick={() => props.setIBCTransferAmount(namadaBalance)}>Max</Button>
                    </div> : null}
            </div>
            {/* <div className="arrow from_namada_transfer" onClick={() => props.setIBCSwapType('to_namada')}>
                <img alt="TransferIcon" src={TransferIcon}/>
            </div> */}
            <div className="arrow" style={{ top: '45%' }}>
                <img alt="Arrow" src={DownArrowIcon}/>
            </div>
            <div className="transfer_destination" style={{ minHeight: 'unset' }}>
                {fromNamadaSelectedConfig
                ? <div>
                        <p>
                            {image && <img alt={props.fromNamadaSelectedAsset?.name} src={image} style={{ width: '24px', height: '24px', marginRight: '8px' }} />}
                            {fromNamadaSelectedConfig.COIN_DENOM}
                        </p>
                        <div className="header_right">
                            <Button className="connect_keplr" disabled={props.ibcTransferAddress} onClick={() => props.showConnectDialog(false, false, true)}>
                                {props.ibcTransferAddress
                                    ? <>
                                        <img alt="keplr" src={keplrIcon}/>
                                        {getWrapAddress(props.ibcTransferAddress, 6, 6)}
                                    </>
                                    : 'Connect'}
                            </Button>
                            {props.ibcTransferAddress
                                ? <ExitToAppIcon className="logout_icon" onClick={() => {
                                    localStorage.removeItem('namada_keplr_address');
                                    props.connectIBCAccountSuccess('');
                                }}/> : null}
                        </div>
                    </div> : null}
                    {fee && fee.fee
                    ? <div className="fee">
                        <p>fee:<b>{formatCount(fee.fee * fee.gas)} {fromNamadaSelectedConfig.COIN_DENOM}</b></p>
                    </div> : null}
            </div>
            <Button
                className="submit_button"
                disabled={disable || inProgress}
                onClick={handleSubmit}>
                {inProgress
                    ? 'InProgress...'
                    : 'Submit'}
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
};

export default connect(stateToProps, actionToProps)(IBCUnShielding);
