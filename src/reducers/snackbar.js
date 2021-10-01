import { MESSAGE_SHOW, SNACKBAR_HIDE } from '../constants/snackbar';
import {
    BALANCE_FETCH_ERROR,
    DELEGATIONS_FETCH_ERROR,
    REWARDS_FETCH_ERROR,
    UN_BONDING_DELEGATIONS_FETCH_ERROR,
} from '../constants/accounts';

const snackbar = (state = {
    open: false,
    message: '',
}, action) => {
    switch (action.type) {
    case MESSAGE_SHOW:
    case DELEGATIONS_FETCH_ERROR:
    case BALANCE_FETCH_ERROR:
    case UN_BONDING_DELEGATIONS_FETCH_ERROR:
    case REWARDS_FETCH_ERROR:
        return {
            open: true,
            message: action.message,
        };
    case SNACKBAR_HIDE:
        return {
            open: false,
            message: '',
        };
    default:
        return state;
    }
};

export default snackbar;
