import {
    FROM_NAMADA_SELECT_ASSET_SET,
    IBC_SWAP_TYPE_SET,
    IBC_TRANSFER_ADDRESS_SET,
    IBC_TRANSFER_AMOUNT_SET,
    IBC_TRANSFER_TYPE_SET,
    SELECT_ASSET_SET,
    SELECT_CHAIN_SET,
} from '../constants/IBCTransfer';

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
