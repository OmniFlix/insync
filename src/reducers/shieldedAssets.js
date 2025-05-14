import { combineReducers } from 'redux';
import { AMOUNT_SET, EXTERNAL_SHIELDING_SUB_TABS_SET, SELECT_SOURCE_SET, SHIELDING_SUB_TABS_SET } from '../constants/shieldedAssets';

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
            result: action.result || {},
        };
    default:
        return state;
    }
};

const subTabs = (state = {
    value: 'transparent_to_shielding',
}, action) => {
    switch (action.type) {
    case SHIELDING_SUB_TABS_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

const externalShieldingSubTabs = (state = {
    value: 'ibc_chain_to_namada_transparent_transfer',
}, action) => {
    switch (action.type) {
    case EXTERNAL_SHIELDING_SUB_TABS_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

export default combineReducers({
    amount,
    selectedAsset,
    subTabs,
    externalShieldingSubTabs,
});
