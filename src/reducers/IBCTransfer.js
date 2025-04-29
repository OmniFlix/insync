import { combineReducers } from 'redux';
import {
    AMINO_SIGN_IBC_TX_ERROR,
    AMINO_SIGN_IBC_TX_IN_PROGRESS,
    AMINO_SIGN_IBC_TX_SUCCESS,
    CONNECT_IBC_ACCOUNT_ERROR,
    CONNECT_IBC_ACCOUNT_IN_PROGRESS,
    CONNECT_IBC_ACCOUNT_SUCCESS,
    FROM_NAMADA_SELECT_ASSET_SET,
    IBC_BALANCE_FETCH_ERROR,
    IBC_BALANCE_FETCH_IN_PROGRESS,
    IBC_BALANCE_FETCH_SUCCESS,
    IBC_CHANNEL_FETCH_ERROR,
    IBC_CHANNEL_FETCH_IN_PROGRESS,
    IBC_CHANNEL_FETCH_SUCCESS,
    IBC_SWAP_TYPE_SET,
    IBC_TRANSFER_ADDRESS_SET,
    IBC_TRANSFER_AMOUNT_SET,
    IBC_TRANSFER_TYPE_SET,
    KEPLR_ACCOUNT_KEYS_SET,
    SELECT_ASSET_SET,
    SELECT_CHAIN_SET,
    TIMEOUT_HEIGHT_FETCH_ERROR,
    TIMEOUT_HEIGHT_FETCH_IN_PROGRESS,
    TIMEOUT_HEIGHT_FETCH_SUCCESS,
    TX_SIGN_AND_BROAD_CAST_ERROR,
    TX_SIGN_AND_BROAD_CAST_IN_PROGRESS,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
} from '../constants/IBCTransfer';

const connection = (state = {
    inProgress: false,
    address: '',
    keys: {},
    signInProgress: false,
}, action) => {
    switch (action.type) {
    case CONNECT_IBC_ACCOUNT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case CONNECT_IBC_ACCOUNT_SUCCESS:
        return {
            ...state,
            inProgress: false,
            address: action.value && action.value.length &&
                action.value[0] && action.value[0].address,
        };
    case CONNECT_IBC_ACCOUNT_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case AMINO_SIGN_IBC_TX_IN_PROGRESS:
        return {
            ...state,
            signInProgress: true,
        };
    case AMINO_SIGN_IBC_TX_SUCCESS:
    case AMINO_SIGN_IBC_TX_ERROR:
        return {
            ...state,
            signInProgress: false,
        };
    case KEPLR_ACCOUNT_KEYS_SET:
        return {
            ...state,
            keys: action.value,
        };
    // case DEPOSITE_DIALOG_HIDE:
    //     return {
    //         ...state,
    //         address: '',
    //     };
    default:
        return state;
    }
};

const balance = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case IBC_BALANCE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_BALANCE_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case IBC_BALANCE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    // case DEPOSITE_DIALOG_HIDE:
    //     return {
    //         ...state,
    //         value: [],
    //     };
    default:
        return state;
    }
};

const timeoutHeight = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TIMEOUT_HEIGHT_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TIMEOUT_HEIGHT_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TIMEOUT_HEIGHT_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const ibcChannel = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case IBC_CHANNEL_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_CHANNEL_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case IBC_CHANNEL_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const ibcTransferAmount = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case IBC_TRANSFER_AMOUNT_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

const ibcTransferType = (state = {
    value: 'shielded',
}, action) => {
    switch (action.type) {
    case IBC_TRANSFER_TYPE_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

const ibcSwapType = (state = {
    value: 'to_namada',
}, action) => {
    switch (action.type) {
    case IBC_SWAP_TYPE_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

const selectedChain = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case SELECT_CHAIN_SET:
        return {
            ...state,
            value: action.value,
        };
    default:
        return state;
    }
};

const selectedAsset = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case SELECT_ASSET_SET:
        return {
            ...state,
            value: action.value,
        };
    default:
        return state;
    }
};

const ibcTransferAddress = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case IBC_TRANSFER_ADDRESS_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

const fromNamadaSelectedAsset = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case FROM_NAMADA_SELECT_ASSET_SET:
        return {
            ...state,
            value: action.value,
        };
    default:
        return state;
    }
};

const broadCast = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TX_SIGN_AND_BROAD_CAST_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TX_SIGN_AND_BROAD_CAST_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TX_SIGN_AND_BROAD_CAST_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    connection,
    balance,
    timeoutHeight,
    ibcChannel,
    ibcTransferAmount,
    ibcTransferType,
    ibcSwapType,
    selectedChain,
    selectedAsset,
    ibcTransferAddress,
    fromNamadaSelectedAsset,
    broadCast,
});
