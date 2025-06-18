import { combineReducers } from 'redux';
import {
    ACCOUNT_ADDRESS_SET,
    ACCOUNT_DETAILS_SET,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS,
    BALANCE_FETCH_SUCCESS,
    DELEGATIONS_FETCH_ERROR,
    DELEGATIONS_FETCH_IN_PROGRESS,
    DELEGATIONS_FETCH_SUCCESS,
    DISCONNECT_SET,
    REVEALED_PUB_KEY_FETCH_ERROR,
    REVEALED_PUB_KEY_FETCH_IN_PROGRESS,
    REVEALED_PUB_KEY_FETCH_SUCCESS,
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
    FETCH_SHIELDED_BALANCE_IN_PROGRESS,
    FETCH_SHIELDED_BALANCE_SUCCESS,
    FETCH_SHIELDED_BALANCE_ERROR,
    TOKENS_LIST_FETCH_IN_PROGRESS,
    TOKENS_LIST_FETCH_SUCCESS,
    TOKENS_LIST_FETCH_ERROR,
    BALANCE_LIST_FETCH_IN_PROGRESS,
    BALANCE_LIST_FETCH_SUCCESS,
    BALANCE_LIST_FETCH_ERROR,
    SHIELDED_BALANCE_PROGRESS_SET,
    FETCH_SHIELDED_REWARDS_IN_PROGRESS,
    FETCH_SHIELDED_REWARDS_SUCCESS,
    FETCH_SHIELDED_REWARDS_ERROR,
} from '../../constants/accounts';

const address = (state = {
    value: '',
    details: {},
    shieldedDetails: '',
    shieldedData: {},
    disposableSigner: null,
}, action) => {
    switch (action.type) {
    case ACCOUNT_ADDRESS_SET:
        return {
            ...state,
            value: action.value,
            shieldedDetails: action.shieldedAddress,
            shieldedData: action.shieldedDetails,
        };
    case ACCOUNT_DETAILS_SET:
        return {
            ...state,
            details: action.value,
            disposableSigner: action.disposableSigner,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            value: '',
            details: {},
            shieldedDetails: '',
            shieldedData: {},
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

export const shieldedBalance = (state = {
    result: [],
    inProgress: false,
    progress: null,
    // shieldedSyncInProgress: false
}, action) => {
    switch (action.type) {
    case FETCH_SHIELDED_BALANCE_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    // case FETCH_SHIELDED_SYNC_IN_PROGRESS:
    //     return {
    //         ...state,
    //         shieldedSyncInProgress: true,
    //     };
    case FETCH_SHIELDED_BALANCE_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.balance,
            progress: null,
        };
    case SHIELDED_BALANCE_PROGRESS_SET:
        return {
            ...state,
            progress: action.progress,
        };
    case FETCH_SHIELDED_BALANCE_ERROR:
        return {
            ...state,
            inProgress: false,
            progress: null,
        };
    // case FETCH_SHIELDED_SYNC_ERROR:
    // case FETCH_SHIELDED_SYNC_SUCCESS:
    //     return {
    //         ...state,
    //         shieldedSyncInProgress: false,
    //     };
    case DISCONNECT_SET:
        return {
            ...state,
            result: [],
        };
    default:
        return state;
    }
};

export const tokensList = (state = {
    result: [],
    inProgress: false,
}, action) => {
    switch (action.type) {
    case TOKENS_LIST_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TOKENS_LIST_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case TOKENS_LIST_FETCH_ERROR:
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

export const balanceList = (state = {
    result: [],
    inProgress: false,
}, action) => {
    switch (action.type) {
    case BALANCE_LIST_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case BALANCE_LIST_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case BALANCE_LIST_FETCH_ERROR:
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

const revealPublicKey = (state = {
    result: {},
    inProgress: false,
}, action) => {
    switch (action.type) {
    case REVEALED_PUB_KEY_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case REVEALED_PUB_KEY_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case REVEALED_PUB_KEY_FETCH_ERROR:
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

const shieldedRewards = (state = {
    result: 0,
    inProgress: false,
}, action) => {
    switch (action.type) {
    case FETCH_SHIELDED_REWARDS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_SHIELDED_REWARDS_SUCCESS:
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    case FETCH_SHIELDED_REWARDS_ERROR:
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
    tokensList,
    balanceList,
    vestingBalance,
    selectDialog,
    unBondingDelegations,
    stakeAccountAddress,
    rewards,
    revealPublicKey,
    shieldedBalance,
    shieldedRewards,
});
