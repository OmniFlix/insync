import { ASSETS_TABS_SET, SHIELDED_TOKENS_CONVERT_DIALOG_HIDE, SHIELDED_TOKENS_CONVERT_DIALOG_SHOW, SHIELDED_TOKENS_DEPOSIT_DIALOG_HIDE, SHIELDED_TOKENS_DEPOSIT_DIALOG_SHOW, SHIELDED_TOKENS_TRANSFER_DIALOG_HIDE, SHIELDED_TOKENS_TRANSFER_DIALOG_SHOW, SHIELDED_TOKENS_WITHDRAW_DIALOG_HIDE, SHIELDED_TOKENS_WITHDRAW_DIALOG_SHOW, TOKENS_TRANSFER_ADDRESS_SET, TOKENS_TRANSFER_AMOUNT_SET, TOKENS_TRANSFER_MEMO_SET, TRANSPARENT_TOKENS_CONVERT_DIALOG_HIDE, TRANSPARENT_TOKENS_CONVERT_DIALOG_SHOW, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_HIDE, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_SHOW, TRANSPARENT_TOKENS_TRANSFER_DIALOG_HIDE, TRANSPARENT_TOKENS_TRANSFER_DIALOG_SHOW, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_SHOW } from "constants/assets";

export const setAssetsTabs = (value) => {
    return {
        type: ASSETS_TABS_SET,
        value,
    };
};

// Transparent Tokens Dialogs
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

export const showTransparentTokensTransferDialog = (value) => {
    return {
        type: TRANSPARENT_TOKENS_TRANSFER_DIALOG_SHOW,
        value,
    };
}

export const hideTransparentTokensTransferDialog = () => {
    return {
        type: TRANSPARENT_TOKENS_TRANSFER_DIALOG_HIDE,
    };
}

export const showTransparentTokensConvertDialog = (value) => {
    return {
        type: TRANSPARENT_TOKENS_CONVERT_DIALOG_SHOW,
        value,
    };
}

export const hideTransparentTokensConvertDialog = () => {
    return {
        type: TRANSPARENT_TOKENS_CONVERT_DIALOG_HIDE,
    };
}

// // Shielded Tokens Dialogs

export const showShieldedTokensDepositDialog = (value) => {
    return {
        type: SHIELDED_TOKENS_DEPOSIT_DIALOG_SHOW,
        value,
    };
}

export const hideShieldedTokensDepositDialog = () => {
    return {
        type: SHIELDED_TOKENS_DEPOSIT_DIALOG_HIDE,
    };
}

export const showShieldedTokensWithdrawDialog = (value) => {
    return {
        type: SHIELDED_TOKENS_WITHDRAW_DIALOG_SHOW,
        value,
    };
}

export const hideShieldedTokensWithdrawDialog = () => {
    return {
        type: SHIELDED_TOKENS_WITHDRAW_DIALOG_HIDE,
    };
}

export const showShieldedTokensTransferDialog = (value) => {
    return {
        type: SHIELDED_TOKENS_TRANSFER_DIALOG_SHOW,
        value,
    };
}

export const hideShieldedTokensTransferDialog = () => {
    return {
        type: SHIELDED_TOKENS_TRANSFER_DIALOG_HIDE,
    };
}

export const showShieldedTokensConvertDialog = (value) => {
    return {
        type: SHIELDED_TOKENS_CONVERT_DIALOG_SHOW,
        value,
    };
}

export const hideShieldedTokensConvertDialog = () => {
    return {
        type: SHIELDED_TOKENS_CONVERT_DIALOG_HIDE,
    };
}

// Tokens Transfer Dialog Fields
export const setTokensTransferAmount = (value) => {
    return {
        type: TOKENS_TRANSFER_AMOUNT_SET,
        value,
    };
}

export const setTokensTransferAddress = (value, valid) => {
    return {
        type: TOKENS_TRANSFER_ADDRESS_SET,
        value,
        valid,
    };
}

export const setTokensTransferMemo = (value) => {
    return {
        type: TOKENS_TRANSFER_MEMO_SET,
        value,
    };
}
