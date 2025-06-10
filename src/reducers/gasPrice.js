import { SHIELDED_TOKENS_CONVERT_DIALOG_HIDE, SHIELDED_TOKENS_TRANSFER_DIALOG_HIDE, SHIELDED_TOKENS_WITHDRAW_DIALOG_HIDE, TRANSPARENT_TOKENS_CONVERT_DIALOG_HIDE, TRANSPARENT_TOKENS_TRANSFER_DIALOG_HIDE, TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE } from 'constants/assets';
import {
    GAS_ESTIMATION_FETCH_ERROR,
    GAS_ESTIMATION_FETCH_IN_PROGRESS,
    GAS_ESTIMATION_FETCH_SUCCESS,
    GAS_PRICE_FETCH_ERROR,
    GAS_PRICE_FETCH_IN_PROGRESS,
    GAS_PRICE_FETCH_SUCCESS,
} from 'constants/gasPrice';
import { combineReducers } from 'redux';

const gasPrice = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case GAS_PRICE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case GAS_PRICE_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            value: action.value,
        };
    case GAS_PRICE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const gasEstimation = (state = {
    inProgress: false,
    value: {},
    tokenDetails: {},
}, action) => {
    switch (action.type) {
    case GAS_ESTIMATION_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
            tokenDetails: action.value,
        };
    case GAS_ESTIMATION_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            value: action.value,
        };
    case GAS_ESTIMATION_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case TRANSPARENT_TOKENS_TRANSFER_DIALOG_HIDE:
    case TRANSPARENT_TOKENS_WITHDRAW_DIALOG_HIDE:
    case TRANSPARENT_TOKENS_CONVERT_DIALOG_HIDE:
    case SHIELDED_TOKENS_TRANSFER_DIALOG_HIDE:
    case SHIELDED_TOKENS_CONVERT_DIALOG_HIDE:
    case SHIELDED_TOKENS_WITHDRAW_DIALOG_HIDE:
        return {
            ...state,
            tokenDetails: {},
        };
    default:
        return state;
    }
};

export default combineReducers({
    gasPrice,
    gasEstimation,
});
