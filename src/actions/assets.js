import { ASSETS_TABS_SET, TOKENS_DEPOSIT_DIALOG_HIDE, TOKENS_DEPOSIT_DIALOG_SHOW } from "constants/assets";

export const setAssetsTabs = (value) => {
    return {
        type: ASSETS_TABS_SET,
        value,
    };
};


export const showTokensDepositDialog = (value) => {
    return {
        type: TOKENS_DEPOSIT_DIALOG_SHOW,
        value,
    };
}

export const hideTokensDepositDialog = () => {
    return {
        type: TOKENS_DEPOSIT_DIALOG_HIDE,
    };
}
