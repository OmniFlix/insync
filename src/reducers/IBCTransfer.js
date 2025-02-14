import { combineReducers } from 'redux';
import {
    FROM_NAMADA_SELECT_ASSET_SET,
    IBC_SWAP_TYPE_SET,
    IBC_TRANSFER_ADDRESS_SET,
    IBC_TRANSFER_AMOUNT_SET,
    IBC_TRANSFER_TYPE_SET,
    SELECT_ASSET_SET,
    SELECT_CHAIN_SET,
} from '../constants/IBCTransfer';

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

export default combineReducers({
    ibcTransferAmount,
    ibcTransferType,
    ibcSwapType,
    selectedChain,
    selectedAsset,
    ibcTransferAddress,
    fromNamadaSelectedAsset,
});
