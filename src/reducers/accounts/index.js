import { combineReducers } from 'redux';
import {
    ACCOUNT_ADDRESS_SET,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS,
    BALANCE_FETCH_SUCCESS,
    DELEGATIONS_FETCH_ERROR,
    DELEGATIONS_FETCH_IN_PROGRESS,
    DELEGATIONS_FETCH_SUCCESS,
    DISCONNECT_SET,
    REWARDS_FETCH_ERROR,
    REWARDS_FETCH_IN_PROGRESS,
    REWARDS_FETCH_SUCCESS,
    SELECT_ACCOUNT_DIALOG_HIDE,
    SELECT_ACCOUNT_DIALOG_SHOW,
    STAKE_ACCOUNT_ADDRESS_SET,
    UN_BONDING_DELEGATIONS_FETCH_ERROR,
    UN_BONDING_DELEGATIONS_FETCH_IN_PROGRESS,
    UN_BONDING_DELEGATIONS_FETCH_SUCCESS,
    VESTING_BALANCE_FETCH_ERROR,
    VESTING_BALANCE_FETCH_IN_PROGRESS,
    VESTING_BALANCE_FETCH_SUCCESS,
} from '../../constants/accounts';

const address = (state = {
    value: '',
}, action) => {
    switch (action.type) {
    case ACCOUNT_ADDRESS_SET:
        return {
            ...state,
            value: action.value,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            value: '',
        };

    default:
        return state;
    }
};

const delegations = (state = {
    result: [],
    inProgress: false,
}, action) => {
    switch (action.type) {
    case DELEGATIONS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case DELEGATIONS_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case DELEGATIONS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            result: [],
        };
    default:
        return state;
    }
};

const balance = (state = {
    result: [],
    inProgress: false,
}, action) => {
    switch (action.type) {
    case BALANCE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case BALANCE_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case BALANCE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            result: [],
        };
    default:
        return state;
    }
};

const vestingBalance = (state = {
    result: {},
    inProgress: false,
}, action) => {
    switch (action.type) {
    case VESTING_BALANCE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case VESTING_BALANCE_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case VESTING_BALANCE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            result: {},
        };
    default:
        return state;
    }
};

const selectDialog = (state = false, action) => {
    switch (action.type) {
    case SELECT_ACCOUNT_DIALOG_SHOW:
        return true;
    case SELECT_ACCOUNT_DIALOG_HIDE:
        return false;
    default:
        return state;
    }
};

const unBondingDelegations = (state = {
    result: [],
    inProgress: false,
}, action) => {
    switch (action.type) {
    case UN_BONDING_DELEGATIONS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case UN_BONDING_DELEGATIONS_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case UN_BONDING_DELEGATIONS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            result: [],
        };
    default:
        return state;
    }
};

const stakeAccountAddress = (state = '', action) => {
    if (action.type === STAKE_ACCOUNT_ADDRESS_SET) {
        return action.value;
    }

    return state;
};

const rewards = (state = {
    result: {},
    inProgress: false,
}, action) => {
    switch (action.type) {
    case REWARDS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case REWARDS_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case REWARDS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            result: {},
        };
    default:
        return state;
    }
};

export default combineReducers({
    address,
    delegations,
    balance,
    vestingBalance,
    selectDialog,
    unBondingDelegations,
    stakeAccountAddress,
    rewards,
});
