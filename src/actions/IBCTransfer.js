import {
    FROM_NAMADA_SELECT_ASSET_SET,
    IBC_SWAP_TYPE_SET,
    IBC_TRANSFER_ADDRESS_SET,
    IBC_TRANSFER_AMOUNT_SET,
    IBC_TRANSFER_TYPE_SET,
    SELECT_ASSET_SET,
    SELECT_CHAIN_SET,
    IBC_TRANSFER_IN_PROGRESS,
    IBC_TRANSFER_SUCCESS,
    IBC_TRANSFER_ERROR,
    TIMEOUT_HEIGHT_FETCH_IN_PROGRESS,
    TIMEOUT_HEIGHT_FETCH_SUCCESS,
    TIMEOUT_HEIGHT_FETCH_ERROR,
    CONNECT_IBC_ACCOUNT_IN_PROGRESS,
    CONNECT_IBC_ACCOUNT_SUCCESS,
    CONNECT_IBC_ACCOUNT_ERROR,
    IBC_BALANCE_FETCH_IN_PROGRESS,
    IBC_BALANCE_FETCH_SUCCESS,
    IBC_BALANCE_FETCH_ERROR,
    AMINO_SIGN_IBC_TX_IN_PROGRESS,
    AMINO_SIGN_IBC_TX_SUCCESS,
    AMINO_SIGN_IBC_TX_ERROR,
    IBC_CHANNEL_FETCH_IN_PROGRESS,
    IBC_CHANNEL_FETCH_SUCCESS,
    IBC_CHANNEL_FETCH_ERROR,
    KEPLR_ACCOUNT_KEYS_SET,
} from '../constants/IBCTransfer';
import { getSdk } from '@namada/sdk/web';
import init from '@namada/sdk/web-init';
import { config } from '../config';
import BigNumber from 'bignumber.js';
import { urlFetchIBCBalance, urlFetchTimeoutHeight } from 'constants/url';
import Axios from 'axios';
import { SigningStargateClient } from '@cosmjs/stargate';
import { handleErrorMessage } from '../utils/errorMessages';

export const setIBCTransferAmount = (value) => {
    return {
        type: IBC_TRANSFER_AMOUNT_SET,
        value,
    };
};

export const setIBCTransferType = (value) => {
    return {
        type: IBC_TRANSFER_TYPE_SET,
        value,
    };
};

export const setIBCSwapType = (value) => {
    return {
        type: IBC_SWAP_TYPE_SET,
        value,
    };
};

export const setSelectedChain = (value) => {
    return {
        type: SELECT_CHAIN_SET,
        value,
    };
};

export const setSelectedAsset = (value) => {
    return {
        type: SELECT_ASSET_SET,
        value,
    };
};

export const setIBCTransferAddress = (value) => {
    return {
        type: IBC_TRANSFER_ADDRESS_SET,
        value,
    };
};

export const setFromNamadaSelectedAsset = (value) => {
    return {
        type: FROM_NAMADA_SELECT_ASSET_SET,
        value,
    };
};

const connectIBCAccountInProgress = () => {
    return {
        type: CONNECT_IBC_ACCOUNT_IN_PROGRESS,
    };
};

const connectIBCAccountSuccess = (value) => {
    return {
        type: CONNECT_IBC_ACCOUNT_SUCCESS,
        value,
    };
};

const connectIBCAccountError = (message) => {
    return {
        type: CONNECT_IBC_ACCOUNT_ERROR,
        message,
    };
};

const setKeplrAccountKeys = (value) => {
    return {
        type: KEPLR_ACCOUNT_KEYS_SET,
        value,
    };
};

export const connectIBCAccount = (data, cb) => (dispatch) => {
    dispatch(connectIBCAccountInProgress());
    const prefix = data.PREFIX;
    const chainConfig = {
        chainId: data.CHAIN_ID,
        chainName: data.CHAIN_NAME,
        rpc: data.RPC_URL,
        rest: data.REST_URL,
        stakeCurrency: {
            coinDenom: data.COIN_DENOM,
            coinMinimalDenom: data.COIN_MINIMAL_DENOM,
            coinDecimals: data.COIN_DECIMALS,
        },
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: `${prefix}`,
            bech32PrefixAccPub: `${prefix}pub`,
            bech32PrefixValAddr: `${prefix}valoper`,
            bech32PrefixValPub: `${prefix}valoperpub`,
            bech32PrefixConsAddr: `${prefix}valcons`,
            bech32PrefixConsPub: `${prefix}valconspub`,
        },
        currencies: [{
            coinDenom: data.COIN_DENOM,
            coinMinimalDenom: data.COIN_MINIMAL_DENOM,
            coinDecimals: data.COIN_DECIMALS,
        }],
        feeCurrencies: [{
            coinDenom: data.COIN_DENOM,
            coinMinimalDenom: data.COIN_MINIMAL_DENOM,
            coinDecimals: data.COIN_DECIMALS,
        }],
        coinType: 118,
        gasPriceStep: {
            low: 0.1,
            average: 0.5,
            high: 1,
        },
        features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
    };

    (async () => {
        if (!window.getOfflineSigner || !window.keplr) {
            const error = 'Please install keplr extension';
            dispatch(connectIBCAccountError(error));
        } else {
            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(chainConfig);
                } catch (error) {
                    const chainError = 'Failed to suggest the chain';
                    dispatch(connectIBCAccountError(chainError));
                }
            } else {
                const versionError = 'Please use the recent version of keplr extension';
                dispatch(connectIBCAccountError(versionError));
            }
        }

        if (window.keplr) {
            window.keplr.enable(data.CHAIN_ID)
                .then(async () => {
                    const offlineSigner = window.getOfflineSigner(data.CHAIN_ID);
                    const accounts = await offlineSigner.getAccounts();
                    dispatch(connectIBCAccountSuccess(accounts));
                    cb(accounts);
                }).catch((error) => {
                    dispatch(connectIBCAccountError(error.toString()));
                });
            window.keplr && window.keplr.getKey(data.CHAIN_ID)
                .then((res) => {
                    dispatch(setKeplrAccountKeys(res));
                }).catch(() => {

                });
        } else {
            return null;
        }
    })();
};

const fetchIBCBalanceInProgress = () => {
    return {
        type: IBC_BALANCE_FETCH_IN_PROGRESS,
    };
};

const fetchIBCBalanceSuccess = (value) => {
    return {
        type: IBC_BALANCE_FETCH_SUCCESS,
        value,
    };
};

const fetchIBCBalanceError = (message) => {
    return {
        type: IBC_BALANCE_FETCH_ERROR,
        message,
    };
};

export const fetchIBCBalance = (ibcUrl, address) => (dispatch) => {
    dispatch(fetchIBCBalanceInProgress());

    const url = urlFetchIBCBalance(ibcUrl, address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchIBCBalanceSuccess(res.data && res.data.balances));
        })
        .catch((error) => {
            const message = handleErrorMessage(error);
            dispatch(fetchIBCBalanceError(message));
        });
};

const fetchIBCChannelInProgress = () => {
    return {
        type: IBC_CHANNEL_FETCH_IN_PROGRESS,
    };
};

const fetchIBCChannelSuccess = (value) => {
    return {
        type: IBC_CHANNEL_FETCH_SUCCESS,
        value,
    };
};

const fetchIBCChannelError = (message) => {
    return {
        type: IBC_CHANNEL_FETCH_ERROR,
        message,
    };
};

export const fetchIBCChannel = (url) => (dispatch) => {
    dispatch(fetchIBCChannelInProgress());

    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchIBCChannelSuccess(res && res.data));
        })
        .catch((error) => {
            const message = handleErrorMessage(error);
            dispatch(fetchIBCChannelError(message));
        });
};

const aminoSignIBCTxInProgress = () => {
    return {
        type: AMINO_SIGN_IBC_TX_IN_PROGRESS,
    };
};

const aminoSignIBCTxSuccess = (value) => {
    return {
        type: AMINO_SIGN_IBC_TX_SUCCESS,
        value,
        message: 'Transaction Success. Token Transfer in progress...',
        variant: 'success',
    };
};

const aminoSignIBCTxError = (message) => {
    return {
        type: AMINO_SIGN_IBC_TX_ERROR,
        message,
        variant: 'error',
    };
};

export const aminoSignIBCTx = (config, tx, cb) => (dispatch) => {
    dispatch(aminoSignIBCTxInProgress());

    (async () => {
        await window.keplr && window.keplr.enable(config.CHAIN_ID);
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(config.CHAIN_ID);
        const client = await SigningStargateClient.connectWithSigner(
            config.RPC_URL,
            offlineSigner,
        );

        console.log('55555555', tx);
        client.sendIbcTokens(
            tx.msg && tx.msg.value && tx.msg.value.sender,
            tx.msg && tx.msg.value && tx.msg.value.receiver,
            tx.msg && tx.msg.value && tx.msg.value.token,
            tx.msg && tx.msg.value && tx.msg.value.source_port,
            tx.msg && tx.msg.value && tx.msg.value.source_channel,
            (tx.msg && tx.msg.value && tx.msg.value.timeout_height) || undefined,
            (tx.msg && tx.msg.value && tx.msg.value.timeout_timestamp) || undefined,
            tx.fee,
            tx.memo,
        ).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                dispatch(aminoSignIBCTxError(result.log || result.rawLog));
                cb(null);
            } else {
                dispatch(aminoSignIBCTxSuccess(result));
                cb(result);
            }
        }).catch((error) => {
            dispatch(aminoSignIBCTxError(error && error.message));
            cb(null);
        });
    })();
};

const fetchTimeoutHeightInProgress = () => {
    return {
        type: TIMEOUT_HEIGHT_FETCH_IN_PROGRESS,
    };
};

const fetchTimeoutHeightSuccess = (value) => {
    return {
        type: TIMEOUT_HEIGHT_FETCH_SUCCESS,
        value,
    };
};

const fetchTimeoutHeightError = (message) => {
    return {
        type: TIMEOUT_HEIGHT_FETCH_ERROR,
        message,
        variant: 'error',
    };
};

export const fetchTimeoutHeight = (URL, channel, cb) => (dispatch) => {
    dispatch(fetchTimeoutHeightInProgress());

    const url = urlFetchTimeoutHeight(URL, channel);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchTimeoutHeightSuccess(res.data));
            cb(res.data);
        })
        .catch((error) => {
            dispatch(fetchTimeoutHeightError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const IBCTransferInProgress = () => {
    return {
        type: IBC_TRANSFER_IN_PROGRESS,
    };
};

const IBCTransferSuccess = (value) => {
    return {
        type: IBC_TRANSFER_SUCCESS,
        value,
    };
};

const IBCTransferError = (message) => {
    return {
        type: IBC_TRANSFER_ERROR,
        message,
    };
};

export const executeIBCTransfer = (revisionHeight, revisionNumber, cb) => async (dispatch) => {
    dispatch(IBCTransferInProgress());
    try {
        const { cryptoMemory } = await init();
        const sdk = getSdk(
            cryptoMemory,
            config.RPC_URL,
            config.MAPS_REST_URL,
            '',
            config.TOKEN_ADDRESS,
        );

        const rpc = sdk;
        // IBC TRANSFER PARAMETERS
        const transferParams = {
            source: 'osmo14jnzh8wnurw5dk4h9rgmsnd5wt5ddusdxj80md',
            receiver: 'tnam1qr5q7a5st2tj0ltdzfm42225zn55ftgt7qmsl3dn',
            token: 'uosmo',
            amountInBaseDenom: BigNumber(1000000),
            portId: 'transfer',
            channelId: 'channel-98451',
        };

        console.log('transer paramas :', transferParams);

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(5000),
            chainId: config.CHAIN_ID,
        };

        const result = await rpc.tx.buildIbcTransfer(transferParams, txs);
        if (result) {
            dispatch(IBCTransferSuccess(result));
            if (cb) {
                cb(result);
            }
        }
    } catch (error) {
        console.error('IBC Transfer Error:', error);
        dispatch(IBCTransferError(error));
    }
};

const showSuccessDialog = () => {
    return {
        type: SHOW_SUCCESS_TX_DIALOG,
        message,
    };
};
