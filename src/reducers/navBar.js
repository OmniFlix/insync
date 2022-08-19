import { combineReducers } from 'redux';
import { CONNECT_DIALOG_HIDE, CONNECT_DIALOG_SHOW, HIDE_SIDE_BAR_SET, SHOW_SIDE_BAR_SET } from '../constants/navBar';

const show = (state = false, action) => {
    switch (action.type) {
    case SHOW_SIDE_BAR_SET:
        return true;
    case HIDE_SIDE_BAR_SET:
        return false;
    default:
        return state;
    }
};

const connectDialog = (state = {
    open: false,
    proposalTab: false,
    stake: false,
    value: {},
}, action) => {
    switch (action.type) {
    case CONNECT_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
            proposalTab: action.proposalTab,
            stake: action.stake,
        };
    case CONNECT_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    show,
    connectDialog,
});
