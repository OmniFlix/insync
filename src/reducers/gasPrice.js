import {
    GAS_ESTIMATION_FETCH_ERROR,
    GAS_ESTIMATION_FETCH_IN_PROGRESS,
    GAS_ESTIMATION_FETCH_SUCCESS,
    GAS_PRICE_FETCH_ERROR,
    GAS_PRICE_FETCH_IN_PROGRESS,
    GAS_PRICE_FETCH_SUCCESS,
} from "constants/gasPrice";
import { combineReducers } from "redux";

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
}, action) => {
    switch (action.type) {
    case GAS_ESTIMATION_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
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
    default:
        return state;
    }
};

export default combineReducers({
    gasPrice,
    gasEstimation,
});
