import { ASSETS_TABS_SET, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_HIDE, TRANSPARENT_TOKENS_DEPOSIT_DIALOG_SHOW, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_SHOW } from "constants/assets";
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

export default combineReducers({
    assetsTab,
    transparentTokensDepositDialog,
    transparentTokensWithdrawDialog,
});
