import { AMOUNT_SET, SELECT_SOURCE_SET } from '../constants/shieldedAssets';

export const setAmount = (value) => {
    return {
        type: AMOUNT_SET,
        value,
    };
};

export const setSelectedSource = (value, result) => {
    return {
        type: SELECT_SOURCE_SET,
        value,
        result,
    };
};
