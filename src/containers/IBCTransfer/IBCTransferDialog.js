import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import { setIBCSwapType, setIBCTransferAmount, setIBCTransferType, fetchTimeoutHeight, executeIBCTransfer, fetchIBCBalance, aminoSignIBCTx } from '../../actions/IBCTransfer';
import { config } from '../../config';
import TransferIcon from '../../assets/transfer.svg';
import AssetSelectField from './AssetSelectField';
import NamadaLogo from '../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';
import AddressTextField from './AddressTextField';
import SourceChainSelectField from './SourceChainSelectField';
import SourceSelectField from './SourceSelectField';
import { showMessage } from 'actions/snackbar';
import { showConnectDialog } from 'actions/navBar';
import { getWrapAddress } from '../../utils/strings';
import keplrIcon from '../../assets/keplr.png';
import Long from 'long';
import { getBalance } from '../../actions/accounts';
import { showDelegateSuccessDialog } from '../../actions/stake';
import CircularProgress from '../../components/CircularProgress';

const IBCTransferDialog = (props) => {
    const [inProgress, setInProgress] = useState(false);
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

        setInProgress(true);
        const selectedChain = props.selectedChain;
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
        const targetChain = selectedChain && selectedChain.value;
        const channelId = getChannelIdForChain(props.ibcChannel, targetChain);

        props.fetchTimeoutHeight(config.REST_URL, channelId, (result) => {
            let revisionNumber = null;
            let revisionHeight = null;
            if (result) {
                revisionNumber = result && result.proof_height && result.proof_height.revision_number &&
                    Long.fromNumber(result.proof_height.revision_number);
                revisionHeight = result && result.proof_height && result.proof_height.revision_height;
            }

            const Tx = {
                msg: {
                    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
                    value: {
                        source_port: 'transfer',
                        source_channel: channelId,
                        token: {
                            denom: config.COIN_MINIMAL_DENOM,
                            amount: String(props.amount * (10 ** config.COIN_DECIMALS)),
                        },
                        sender: props.ibcTransferAddress,
                        receiver: props.ibcTransferType === 'shielded' ? props.shieldedAddress : props.address,
                        timeout_height: {
                            revisionNumber: revisionNumber || undefined,
                            revisionHeight: Long.fromNumber(parseInt(revisionHeight) + 150) || undefined,
                        } || undefined,
                        timeout_timestamp: undefined,
                    },
                },
                fee: {
                    amount: [{
                        amount: String(225000),
                        denom: config.COIN_MINIMAL_DENOM,
                    }],
                    gas: String(450000),
                },
                memo: '',
            };

            // Now call executeIBCTransfer only after timeoutHeight is fetched
            // if (props.keys && props.keys.isNanoLedger) {
            //     if (data && data.fee && data.fee.granter && window.keplr) {
            //         window.keplr.defaultOptions = {
            //             sign: {
            //                 disableBalanceCheck: true,
            //             },
            //         };
            //     } else if (window.keplr) {
            //         window.keplr.defaultOptions = {};
            //     }

            //     const date = new Date();
            //     let time = new Date(date.getTime() + 10 * 60000);
            //     time = time * 1000000;
            //     const Tx = {
            //         msg: {
            //             typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
            //             value: {
            //                 source_port: 'transfer',
            //                 source_channel: channelId,
            //                 token: {
            //                     denom: denom,
            //                     amount: String(amount * (10 ** config.COIN_DECIMALS)),
            //                 },
            //                 sender: props.ibcTransferAddress,
            //                 receiver: props.ibcTransferType === 'shielded' ? props.shieldedAddress : props.address,
            //                 // timeout_height: {
            //                 //     revision_height: String(revisionNumber) || undefined,
            //                 //     revision_number: String(Long.fromNumber(parseInt(revisionHeight) + 150)) || undefined,
            //                 // },
            //                 timeout_timestamp: String(time) || undefined,
            //             },
            //         },
            //         fee: {
            //             amount: [{
            //                 amount: String(225000),
            //                 denom: denom,
            //             }],
            //             gas: String(450000),
            //         },
            //         memo: '',
            //     };

            //     props.aminoSignTx(Tx, props.ibcTransferAddress, (result) => {
            //         if (result && result.transactionHash) {
            //             if (result && result.code !== undefined && result.code !== 0) {
            //                 props.showMessage(result.logs || result.raw_log, 'error', result && result.hash);

            //                 return;
            //             }

            //             props.fetchIBCBalance(config.REST_URL, props.ibcTransferAddress);
            //         }
            //     });

            //     return;
            // }

            props.aminoSignIBCTx(config, Tx, (result) => {
                if (result && result.transactionHash) {
                    if (result && result.code !== undefined && result.code !== 0) {
                        props.showMessage(result.logs || result.raw_log, 'error', result && result.hash);

                        return;
                    }

                    props.fetchIBCBalance(config.REST_URL, props.ibcTransferAddress);
                    props.getBalance(props.address);
                    props.showDelegateSuccessDialog(result.transactionHash);
                    setInProgress(false);
                }
            });
        });
    };

    return (
        <div className="transfer_dialog">
            {props.ibcSwapType === 'to_namada'
                ? <>
                    <div className="transfer_source">
                        <div className="header">
                            <SourceChainSelectField/>
                            <Button className="connect_keplr" disabled={props.ibcTransferAddress} onClick={() => props.showConnectDialog(false, false, true)}>
                                {props.ibcTransferAddress
                                    ? <>
                                        <img alt="keplr" src={keplrIcon}/>
                                        {getWrapAddress(props.ibcTransferAddress, 6, 6)}
                                    </>
                                    : 'Connect'}
                            </Button>
                        </div>
                        <div className="border"></div>
                        <div className="select_section">
                            <AssetSelectField/>
                            <AmountTextField/>
                        </div>
                        <div className="tokens_secion">
                            <p>Available: {ibcBalance || 0} {props.selectedAsset && (props.selectedAsset.symbol || props.selectedAsset.display)}</p>
                            <Button onClick={() => props.setIBCTransferAmount(balance)}>Max</Button>
                        </div>
                    </div>
                    <div disabled className="arrow" onClick={() => props.setIBCSwapType('from_namada')}>
                        <img alt="TransferIcon" src={TransferIcon}/>
                    </div>
                    <div className="transfer_destination">
                        <div className="transfer_type">
                            <Button
                                className={props.ibcTransferType === 'shielded' ? 'active_tab' : ''}
                                onClick={() => props.setIBCTransferType('shielded')}>
                                Shielded
                            </Button>
                            <Button
                                className={props.ibcTransferType === 'transparent' ? 'active_tab' : ''}
                                onClick={() => props.setIBCTransferType('transparent')}>
                                Transparent
                            </Button>
                        </div>
                        {props.ibcTransferType === 'shielded'
                            ? <div>
                                <p>
                                    <img alt="NamadaShieldedLogo" src={NamadaShieldedLogo}/>
                                    Namada Shielded
                                </p>
                                <div className="address">
                                    <span>{props.shieldedAddress}</span>
                                    {props.shieldedAddress && props.shieldedAddress.slice(props.shieldedAddress.length - 6, props.shieldedAddress.length)}
                                </div>
                            </div>
                            : <div>
                                <p>
                                    <img alt="NamadaLogo" src={NamadaLogo}/>
                                    Namada Transparent
                                </p>
                                <div className="address">
                                    <span>{props.address}</span>
                                    {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                                </div>
                            </div>}
                    </div>
                </>
                : <>
                    <div className="transfer_source">
                        <div className="header">
                            <p>
                                <img alt="NamadaLogo" src={NamadaLogo}/>
                                Namada Transparent
                            </p>
                            <div className="address">
                                <span>{props.address}</span>
                                {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                            </div>
                        </div>
                        <div className="border"></div>
                        <div className="select_section">
                            <SourceSelectField/>
                            <AmountTextField/>
                        </div>
                        <div className="tokens_secion">
                            <p>Available: {balance || 0} NAM</p>
                            <Button onClick={() => props.setIBCTransferAmount(balance)}>Max</Button>
                        </div>
                    </div>
                    <div className="arrow from_namada_transfer" onClick={() => props.setIBCSwapType('to_namada')}>
                        <img alt="TransferIcon" src={TransferIcon}/>
                    </div>
                    <div className="transfer_destination from_namada">
                        <SourceChainSelectField/>
                        <AddressTextField/>
                    </div>
                </>}
            <Button
                className="submit_button"
                onClick={handleSubmit}>
                {inProgress
                    ? 'InProgress...'
                    : 'Submit'}
            </Button>
            {inProgress && <CircularProgress className="full_screen"/>}
        </div>
    );
};

IBCTransferDialog.propTypes = {
    aminoSignIBCTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    executeIBCTransfer: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchTimeoutHeight: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    setIBCSwapType: PropTypes.func.isRequired,
    setIBCTransferAmount: PropTypes.func.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    showDelegateSuccessDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
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
    };
};

const actionToProps = {
    aminoSignIBCTx,
    setIBCTransferAmount,
    setIBCTransferType,
    setIBCSwapType,
    executeIBCTransfer,
    fetchTimeoutHeight,
    fetchIBCBalance,
    showMessage,
    showConnectDialog,
    getBalance,
    showDelegateSuccessDialog,
};

export default connect(stateToProps, actionToProps)(IBCTransferDialog);
