import { combineReducers } from 'redux';
import { AMOUNT_SET, SELECT_SOURCE_SET } from '../constants/shieldedAssets';

const amount = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case AMOUNT_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

const selectedAsset = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case SELECT_SOURCE_SET:
        return {
            ...state,
            value: action.value,
        };
    default:
        return state;
    }
};

export default combineReducers({
    amount,
    selectedAsset,
});
