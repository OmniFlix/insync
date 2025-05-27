import { ASSETS_TABS_SET, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_HIDE, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_SHOW, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_SHOW } from "constants/assets";

export const setAssetsTabs = (value) => {
    return {
        type: ASSETS_TABS_SET,
        value,
    };
};


export const showTransparentTokensDepositDialog = (value) => {
    return {
        type: TRANSPARENT_TOKENS_DEPOSIT_DIALOG_SHOW,
        value,
    };
}

export const hideTransparentTokensDepositDialog = () => {
    return {
        type: TRANSPARENT_TOKENS_DEPOSIT_DIALOG_HIDE,
    };
}

export const showTransparentTokensWithdrawDialog = (value) => {
    return {
        type: TRANSPARENT_TOKENS_WITHDRAW_DIALOG_SHOW,
        value,
    };
}

export const hideTransparentTokensWithdrawDialog = () => {
    return {
        type: TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE,
    };
}
