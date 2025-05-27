import { ASSETS_TABS_SET, TOKENS_DEPOSIT_DIALOG_HIDE, TOKENS_DEPOSIT_DIALOG_SHOW } from "constants/assets";
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

const tokensDepositDialog = (state = {
    open: false,
    value: {}
}, action) => {
    switch (action.type) {
    case TOKENS_DEPOSIT_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case TOKENS_DEPOSIT_DIALOG_HIDE:
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
    tokensDepositDialog,
});
