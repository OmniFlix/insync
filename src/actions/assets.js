import { ASSETS_TABS_SET } from 'constants/assets';

export const setAssetsTabs = (value) => {
    return {
        type: ASSETS_TABS_SET,
        value,
    };
};
