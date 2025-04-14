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
} from '../constants/IBCTransfer';
import { getSdk } from '@namada/sdk/web';
import init from '@namada/sdk/web-init';
import { config } from '../config';
import BigNumber from 'bignumber.js';
import { urlFetchTimeoutHeight } from 'constants/url';
import Axios from 'axios';

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

export const executeIBCTransfer = (revisionHeight, revisionNumber) => async (dispatch) => {
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
            source: "osmo14jnzh8wnurw5dk4h9rgmsnd5wt5ddusdxj80md",
            receiver: "tnam1qr5q7a5st2tj0ltdzfm42225zn55ftgt7qmsl3dn",
            token: "uosmo",
            amountInBaseDenom: BigNumber(1000000),
            portId: "transfer",
            channelId: "channel-98451",
        };

        console.log('transer paramas :', transferParams);

        const txs = {
                token: config.TOKEN_ADDRESS,
                feeAmount: new BigNumber(0.000001),
                gasLimit: new BigNumber(5000),
            chainId: config.CHAIN_ID,
        };

        const result = await rpc.tx.buildIbcTransfer(transferParams, txs);
        console.log('result :', result);
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
