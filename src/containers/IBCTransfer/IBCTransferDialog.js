import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button, Tooltip } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import { setIBCSwapType, setIBCTransferAmount, setIBCTransferType, fetchTimeoutHeight, executeIBCTransfer, fetchIBCBalance, aminoSignIBCTx, protoBufSigning, txSignAndBroadCast, connectIBCAccount, connectIBCAccountSuccess, fetchIBCChannel } from '../../actions/IBCTransfer';
import { config } from '../../config';
// import TransferIcon from '../../assets/transfer.svg';
import AssetSelectField from './AssetSelectField';
import NamadaLogo from '../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';
// import AddressTextField from './AddressTextField';
import SourceChainSelectField from './SourceChainSelectField';
import SourceSelectField from './SourceSelectField';
import { showMessage } from 'actions/snackbar';
import { showConnectDialog } from 'actions/navBar';
import { getWrapAddress } from '../../utils/strings';
import keplrIcon from '../../assets/keplr.png';
import { fetchBalanceList, fetchTokensList, getBalance, getShieldedBalance } from '../../actions/accounts';
import { showDelegateSuccessDialog } from '../../actions/stake';
import CircularProgress from '../../components/CircularProgress';
import { ibcList } from 'dummy/ibcList';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { getShieldedArgs, ibcTransaction } from 'helper';
import BigNumber from 'bignumber.js';
import DownArrowIcon from '../../assets/down_arrow_nofill.png';
import { hideShieldedTokensDepositDialog, hideTransparentTokensDepositDialog } from 'actions/assets';

const IBCTransferDialog = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [approval, setApproval] = useState(false);
    const [params, setParams] = useState(false);
    const [transactionCompleted, setTransactionCompleted] = useState(false);
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
    
            props.fetchIBCChannel(selectedChain.channel_link);
            // setInProgress(true);
            // props.connectIBCAccount(config, (address) => {
            //     setInProgress(false);
            //     localStorage.setItem('namada_keplr_address', address[0].address);
            //     props.fetchIBCBalance(config.REST_URL, address[0].address);
            //     props.fetchIBCChannel(selectedChain.channel_link);
            // });
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
        const token = fromNamadaSelectedConfig?.COIN_MINIMAL_DENOM;
        const amount = new BigNumber(props.amount * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
        // const amount = String(Number(props.amount) * (10 ** fromNamadaSelectedConfig?.COIN_DECIMALS));
        const namadaChannelId = getChannelIdForChain(props.ibcChannel, 'namada');

        const tx = {
            source: source,
            token: token,
            amountInBaseDenom: amount,
            receiver: props.ibcTransferAddress,
            portId: 'transfer',
            channelId: namadaChannelId,
        };

        const txs = {
            token: props.fromNamadaSelectedAsset?.balance?.tokenAddress,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(100000),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

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

        if (props.ibcSwapType === 'from_namada') {
            handleNamadaTransfer();
            return;
        }

        setInProgress(true);
        setTransactionCompleted(false);
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
            EXPLORER_URL: selectedChain && selectedChain.config && selectedChain.config.EXPLORER_URL,
        };
        const targetChain = selectedChain && selectedChain.chain_name || selectedChain.value;
        const channelId = getChannelIdForChain(props.ibcChannel, targetChain);
        const namadaChannelId = getChannelIdForChain(props.ibcChannel, 'namada');

        props.fetchTimeoutHeight(config.REST_URL, channelId, async (result) => {
            // let revisionNumber = null;
            // let revisionHeight = null;
            // if (result) {
            //     revisionNumber = result && result.proof_height && result.proof_height.revision_number &&
            //         Long.fromNumber(result.proof_height.revision_number);
            //     revisionHeight = result && result.proof_height && result.proof_height.revision_height;
            // }

            let memo = '';
            let receiver = '';
            if (props.ibcTransferType === 'shielded') {
                setParams(true);
                const { memo: shieldedMemo , receiver: shieldedReceiver } = await getShieldedArgs(props.shieldedAddress, config.COIN_MINIMAL_DENOM, new BigNumber(props.amount * (10 ** config.COIN_DECIMALS)), namadaChannelId);
                memo = shieldedMemo;
                receiver = shieldedReceiver;
                setParams(false);
            }
            const timeoutTimestampNanoseconds =
            BigInt(Math.floor(Date.now() / 1000) + 60) * BigInt(1_000_000_000);
            const Tx = {
                msg: {
                    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
                    value: {
                        memo: memo,
                        source_port: 'transfer',
                        source_channel: channelId,
                        token: {
                            denom: config.COIN_MINIMAL_DENOM,
                            amount: String(props.amount * (10 ** config.COIN_DECIMALS)),
                        },
                        sender: props.ibcTransferAddress,
                        receiver: props.ibcTransferType === 'shielded' ? receiver : props.address,
                        timeout_height: undefined,
                        timeout_timestamp: timeoutTimestampNanoseconds,
                    },
                },
                fee: {
                    amount: [{
                        amount: String(225000),
                        denom: config.COIN_MINIMAL_DENOM,
                    }],
                    gasLimit: String(450000),
                },
                memo: '',
            };
            setApproval(true);
            props.protoBufSigning(config, Tx, props.ibcTransferAddress, (result, txBytes) => {
                if (result) {
                    const txData = {
                        tx_bytes: txBytes,
                        mode: 'BROADCAST_MODE_SYNC',
                    };
                    setApproval(false);
                    props.txSignAndBroadCast(config, txData, (res1) => {
                        if (res1 && res1.code !== undefined && res1.code !== 0) {
                            props.showMessage(res1.raw_log || res1.logs, 'error', res1 && res1.hash);
                            setInProgress(false);
                            setApproval(false);

                            return;
                        }

                        setTransactionCompleted(true);
                        if (props.from === 'transparent_deposit') {
                            props.fetchBalanceList(props.address);
                            const tokenAddress = props.transparentTokensDepositDialogValue && props.transparentTokensDepositDialogValue.balance &&
                                props.transparentTokensDepositDialogValue.balance.tokenAddress;
                            const balance = props.transparentTokensDepositDialogValue && props.transparentTokensDepositDialogValue.balance &&
                                props.transparentTokensDepositDialogValue.balance.minDenomAmount && Number(props.transparentTokensDepositDialogValue.balance.minDenomAmount);
                            if (tokenAddress) {
                                const time = setInterval(() => {
                                    (async () => {
                                        props.fetchBalanceList(props.address, (resBalance) => {
                                            let resultBalance = resBalance && resBalance.length && tokenAddress &&
                                                    resBalance.find((val) => val.tokenAddress === tokenAddress);
                                            resultBalance = resultBalance && resultBalance.minDenomAmount && Number(resultBalance.minDenomAmount);
                                            if (resultBalance !== balance) {
                                                props.fetchIBCBalance(config.REST_URL, props.ibcTransferAddress);
                                                props.getBalance(props.address);
                                                props.showDelegateSuccessDialog(res1.txhash, config);
                                                setInProgress(false);
                                                setParams(false);
                                                setApproval(false);
                                                clearInterval(time);
                                            }
                                        });
                                    })();
                                }, 5000);

                                return;
                            }
                        }
                        if (props.from === 'shielded_deposit') {
                            // props.getShieldedBalance(props.shieldedData?.viewingKey, props.shieldedData?.timestamp, props.address, props.shieldedData?.address);
                            const tokenAddress = props.shieldedTokensDepositDialogValue && props.shieldedTokensDepositDialogValue.tokenAddress;
                            const balance = props.shieldedTokensDepositDialogValue && props.shieldedTokensDepositDialogValue.balance && Number(props.shieldedTokensDepositDialogValue.balance);
                            handleFetchShieldedBalance(tokenAddress, balance, config, res1);

                            return;
                        }
                        props.fetchIBCBalance(config.REST_URL, props.ibcTransferAddress);
                        props.getBalance(props.address);
                        props.fetchTokensList();
                        props.fetchBalanceList(props.address);
                        // if(props.from === 'shielded_deposit') {
                        //     props.hideShieldedTokensDepositDialog();
                        // } else if (props.from === 'transparent_deposit') {
                        //     props.hideTransparentTokensDepositDialog();
                        // }
                        setTimeout(() => {
                            props.fetchBalanceList(props.address);
                        }, 10000);
                        props.showDelegateSuccessDialog(res1.txhash, config);
                        // props.setIBCTransferAmount('');
                        setTimeout(() => {
                            props.fetchIBCBalance(config.REST_URL, props.ibcTransferAddress);
                            props.getBalance(props.address);
                            // props.fetchTokensList();
                            props.fetchBalanceList(props.address);
                        }, 5000);
                        setInProgress(false);
                        setApproval(false);
                    });
                } else {
                    setInProgress(false);
                    setApproval(false);
                }
            });
        });
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
                        setParams(false);
                        setApproval(false);
                        clearInterval(intervalTime);
                        props.showDelegateSuccessDialog(value && value.hash);
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
            }, 60000);
        }
    };

    const handleFetchShieldedBalance = (tokenAddress, balance, ibcConfig, res1) => {
        props.getShieldedBalance(props.shieldedData?.viewingKey, props.shieldedData?.timestamp, props.address, props.shieldedData?.address, config.CHAIN_ID, (resBalance) => {
            let resultBalance = resBalance && resBalance.length && tokenAddress &&
                    resBalance.find((val) => val && val.length && val[0] && (val[0] === tokenAddress));
            resultBalance = resultBalance && resultBalance.length && resultBalance[1] && Number(resultBalance[1]);
            if (resultBalance !== balance) {
                props.fetchIBCBalance(ibcConfig?.REST_URL, props.ibcTransferAddress);
                props.getBalance(props.address);
                props.showDelegateSuccessDialog(res1.txhash, ibcConfig);
                setInProgress(false);
            } else {
                handleFetchShieldedBalance(tokenAddress, balance, ibcConfig, res1);
            }
        });
    };

    const fromNamadaSelectedConfig = props.fromNamadaSelectedAsset?.config;
    const namadaBalance = props.fromNamadaSelectedAsset?.balance?.minDenomAmount && Number(props.fromNamadaSelectedAsset?.balance?.minDenomAmount) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    const image = props.fromNamadaSelectedAsset && props.fromNamadaSelectedAsset.logo_URIs && (props.fromNamadaSelectedAsset.logo_URIs.svg || props.fromNamadaSelectedAsset.logo_URIs.png);

    const disable = !props.amount || props.amount === '';
    return (
        <div className="transfer_dialog">
            {props.ibcSwapType === 'to_namada'
                ? <>
                    <div className="transfer_source">
                        <div className="header">
                            {!props.ibcTransferAddress && <Button>Connect Wallet</Button>}
                            <SourceChainSelectField from={props.from} data={props.depositData}/>
                            {/* <div className="header_right">
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
                            </div> */}
                        </div>
                        {/* <div className="border"></div> */}
                        <div className="select_section">
                            <AssetSelectField/>
                            <AmountTextField  from="namada_deposit"/>
                        </div>
                        <span className="available_balance">
                            <p>Available</p>
                            <p>{ibcBalance || 0} {props.selectedAsset && (props.selectedAsset.symbol || props.selectedAsset.display)}</p>
                        </span>
                        <div className="deposit_nam_tokens_secion">
                            <Button onClick={() => props.setIBCTransferAmount(ibcBalance)}>Max</Button>
                        </div>
                        <div className="border"></div>
                        {props.ibcTransferAddress && 
                        <div className="tokens_secion">
                            <img alt='keplrIcon' src={keplrIcon}/>
                            <p>{props.ibcTransferAddress}</p>
                            {/* <p>Available: {ibcBalance || 0} {props.selectedAsset && (props.selectedAsset.symbol || props.selectedAsset.display)}</p> */}
                            {/* <Button onClick={() => props.setIBCTransferAmount(ibcBalance)}>Max</Button> */}
                        </div>}
                    </div>
                    <div className="arrow">
                        <img alt="Arrow" src={DownArrowIcon}/>
                    </div>
                    {/* <Tooltip arrow title={'Coming soon'}> */}
                        {/* <div disabled className="arrow"> */}
                        {/* <div disabled className="arrow" onClick={() => props.setIBCSwapType('from_namada')}>
                            <img alt="TransferIcon" src={TransferIcon}/>
                        </div> */}
                    {/* </Tooltip> */}
                    <div className="transfer_destination">
                        {/* <div className="transfer_type">
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
                        </div> */}
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
                                    NAM
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
                            <AmountTextField from="from_namada_deposit"/>
                        </div>
                        {fromNamadaSelectedConfig
                            ? <div className="tokens_secion">
                                <p>Available: {namadaBalance || 0} {fromNamadaSelectedConfig.COIN_DENOM}</p>
                                <Button onClick={() => props.setIBCTransferAmount(namadaBalance)}>Max</Button>
                            </div> : null}
                    </div>
                    <div className="arrow">
                        <img alt="Arrow" src={DownArrowIcon}/>
                    </div>
                    <div className="transfer_destination header">
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
                    </div>
                </>}
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
                              {(inProgress || approval || params) ? 
                              <CircularProgress className="action_progress"/> : null}
            </Button>
            {/* {inProgress && <CircularProgress className="full_screen" text={props.transactionCompleted ? 'Transaction is in progress...' : null}/>} */}
        </div>
    );
};

IBCTransferDialog.propTypes = {
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
    hideShieldedTokensDepositDialog: PropTypes.func.isRequired,
    hideTransparentTokensDepositDialog: PropTypes.func.isRequired,
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    setIBCSwapType: PropTypes.func.isRequired,
    setIBCTransferAmount: PropTypes.func.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    showDelegateSuccessDialog: PropTypes.func.isRequired,
    getShieldedBalance: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    protoBufSigning: PropTypes.func.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    fromNamadaSelectedAsset: PropTypes.object.isRequired,
    transparentTokensDepositDialogValue: PropTypes.object,
    shieldedTokensDepositDialogValue: PropTypes.object,
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
    depositData: PropTypes.object,
    shieldedData: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        ibcBalance: state.ibcTransfer.balance.value,
        lang: state.language,
        address: state.accounts.address.value,
        shieldedData: state.accounts.address.shieldedData,
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

        transparentTokensDepositDialogValue: state.assets.transparentTokensDepositDialog.value,
        shieldedTokensDepositDialogValue: state.assets.shieldedTokensDepositDialog.value,
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

    hideTransparentTokensDepositDialog,
    hideShieldedTokensDepositDialog,
};

export default connect(stateToProps, actionToProps)(IBCTransferDialog);
