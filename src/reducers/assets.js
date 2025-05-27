import { ASSETS_TABS_SET, SHIELDED_TOKENS_CONVERT_DIALOG_HIDE, SHIELDED_TOKENS_CONVERT_DIALOG_SHOW, SHIELDED_TOKENS_DEPOSIT_DIALOG_HIDE, SHIELDED_TOKENS_DEPOSIT_DIALOG_SHOW, SHIELDED_TOKENS_TRANSFER_DIALOG_HIDE, SHIELDED_TOKENS_TRANSFER_DIALOG_SHOW, SHIELDED_TOKENS_WITHDRAW_DIALOG_HIDE, SHIELDED_TOKENS_WITHDRAW_DIALOG_SHOW, TRANSPARENT_TOKENS_CONVERT_DIALOG_HIDE, TRANSPARENT_TOKENS_CONVERT_DIALOG_SHOW, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_HIDE, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_SHOW, TRANSPARENT_TOKENS_TRANSFER_DIALOG_HIDE, TRANSPARENT_TOKENS_TRANSFER_DIALOG_SHOW, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_SHOW } from "constants/assets";
import { combineReducers } from "redux";

const assetsTab = (state = {
    value: 'transparent',
}, action) => {
    switch (action.type) {
    case ASSETS_TABS_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

// Transparent Tokens Dialogs
const transparentTokensDepositDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case TRANSPARENT_TOKENS_DEPOSIT_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case TRANSPARENT_TOKENS_DEPOSIT_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}

const transparentTokensWithdrawDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case TRANSPARENT_TOKENS_WITHDRAW_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}

const transparentTokensTransferDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case TRANSPARENT_TOKENS_TRANSFER_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case TRANSPARENT_TOKENS_TRANSFER_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}

const transparentTokensConvertDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case TRANSPARENT_TOKENS_CONVERT_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case TRANSPARENT_TOKENS_CONVERT_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}

// Shielded Tokens Dialogs
const shieldedTokensDepositDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case SHIELDED_TOKENS_DEPOSIT_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case SHIELDED_TOKENS_DEPOSIT_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}

const shieldedTokensWithdrawDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case SHIELDED_TOKENS_WITHDRAW_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case SHIELDED_TOKENS_WITHDRAW_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}

const shieldedTokensTransferDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case SHIELDED_TOKENS_TRANSFER_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case SHIELDED_TOKENS_TRANSFER_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}

const shieldedTokensConvertDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case SHIELDED_TOKENS_CONVERT_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case SHIELDED_TOKENS_CONVERT_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
}


export default combineReducers({
    assetsTab,
    transparentTokensDepositDialog,
    transparentTokensWithdrawDialog,
    transparentTokensTransferDialog,
    transparentTokensConvertDialog,

    shieldedTokensDepositDialog,
    shieldedTokensWithdrawDialog,
    shieldedTokensTransferDialog,
    shieldedTokensConvertDialog,
});
