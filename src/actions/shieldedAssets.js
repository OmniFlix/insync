import { AMOUNT_SET, EXTERNAL_SHIELDING_SUB_TABS_SET, SELECT_SOURCE_SET, SHIELDING_SUB_TABS_SET } from '../constants/shieldedAssets';

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

export const setShieldingSubTabs = (value) => {
    return {
        type: SHIELDING_SUB_TABS_SET,
        value,
    };
};

export const setExternalShieldingSubTabs = (value) => {
    return {
        type: EXTERNAL_SHIELDING_SUB_TABS_SET,
        value,
    };
};
