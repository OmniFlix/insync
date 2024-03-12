import { combineReducers } from 'redux';
import {
    APR_FETCH_ERROR,
    APR_FETCH_IN_PROGRESS,
    APR_FETCH_SUCCESS,
    CLAIM_REWARDS_DIALOG_HIDE,
    CLAIM_REWARDS_DIALOG_SHOW,
    CLAIM_REWARDS_VALIDATOR_SET,
    CLAIM_DELEGATE_DIALOG_SHOW,
    CLAIM_DELEGATE_DIALOG_HIDE,
    CLAIM_DELEGATE_VALIDATOR_SET,
    DELEGATE_DIALOG_HIDE,
    DELEGATE_DIALOG_SHOW,
    DELEGATE_FAILED_DIALOG_HIDE,
    DELEGATE_FAILED_DIALOG_SHOW,
    DELEGATE_PROCESSING_DIALOG_HIDE,
    DELEGATE_PROCESSING_DIALOG_SHOW,
    DELEGATE_SUCCESS_DIALOG_HIDE,
    DELEGATE_SUCCESS_DIALOG_SHOW,
    DELEGATED_VALIDATORS_FETCH_ERROR,
    DELEGATED_VALIDATORS_FETCH_IN_PROGRESS,
    DELEGATED_VALIDATORS_FETCH_SUCCESS,
    INACTIVE_VALIDATORS_FETCH_ERROR,
    INACTIVE_VALIDATORS_FETCH_IN_PROGRESS,
    INACTIVE_VALIDATORS_FETCH_SUCCESS,
    SEARCH_LIST_SET,
    TO_VALIDATOR_SET,
    TOKENS_SET,
    VALIDATOR_FETCH_ERROR,
    VALIDATOR_FETCH_IN_PROGRESS,
    VALIDATOR_FETCH_SUCCESS,
    VALIDATOR_IMAGE_FETCH_SUCCESS,
    VALIDATOR_SET,
    VALIDATORS_FETCH_ERROR,
    VALIDATORS_FETCH_IN_PROGRESS,
    VALIDATORS_FETCH_SUCCESS,
    SELECTED_MULTI_VALIDATORS,
    GENESIS_VALIDATORS_FETCH_IN_PROGRESS,
    GENESIS_VALIDATORS_FETCH_SUCCESS,
    GENESIS_VALIDATORS_FETCH_ERROR,
} from '../constants/stake';
import { DISCONNECT_SET } from '../constants/accounts';
import { DEFAULT_PAGE } from '../config';

const search = (state = '', action) => {
    if (action.type === SEARCH_LIST_SET) {
        return action.value;
    }

    return state;
};

const validators = (state = {
    inProgress: false,
    list: [],
    page: DEFAULT_PAGE,
    total: null,
    images: [],
}, action) => {
    switch (action.type) {
    case VALIDATORS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case VALIDATORS_FETCH_SUCCESS:
        if (action.page === DEFAULT_PAGE) {
            return {
                ...state,
                list: action.list,
                total: action.total,
                page: action.page,
                inProgress: false,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                list: [...state.list, ...action.list],
                page: action.page,
                total: action.total,
            };
        }
    case VALIDATORS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case VALIDATOR_IMAGE_FETCH_SUCCESS: {
        const array = [...state.images];
        if (action.value && array.indexOf(action.value) === -1) {
            array.push(action.value);
        }

        return {
            ...state,
            images: [...array],
        };
    }
    default:
        return state;
    }
};

const genesisValidators = (state = {
    inProgress: false,
    list: {},
}, action) => {
    switch (action.type) {
    case GENESIS_VALIDATORS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case GENESIS_VALIDATORS_FETCH_SUCCESS:
        return {
            ...state,
            list: action.list,
            inProgress: false,
        };
    case GENESIS_VALIDATORS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const delegateDialog = (state = {
    open: false,
    name: '',
}, action) => {
    switch (action.type) {
    case DELEGATE_DIALOG_SHOW:
        return {
            open: true,
            name: action.name,
        };
    case DELEGATE_DIALOG_HIDE:
    case DELEGATE_SUCCESS_DIALOG_HIDE:
    case DELEGATE_FAILED_DIALOG_HIDE:
    case DELEGATE_PROCESSING_DIALOG_HIDE:
        return {
            ...state,
            open: false,
            name: '',
            address: '',
        };
    default:
        return state;
    }
};

const successDialog = (state = {
    open: false,
    hash: '',
}, action) => {
    switch (action.type) {
    case DELEGATE_SUCCESS_DIALOG_SHOW:
        return {
            open: true,
            hash: action.value,
        };
    case DELEGATE_SUCCESS_DIALOG_HIDE:
        return {
            open: false,
            hash: '',
        };
    default:
        return state;
    }
};

const processingDialog = (state = false, action) => {
    switch (action.type) {
    case DELEGATE_PROCESSING_DIALOG_SHOW:
        return true;
    case DELEGATE_PROCESSING_DIALOG_HIDE:
        return false;
    default:
        return state;
    }
};

const failedDialog = (state = false, action) => {
    switch (action.type) {
    case DELEGATE_FAILED_DIALOG_SHOW:
        return true;
    case DELEGATE_FAILED_DIALOG_HIDE:
        return false;
    default:
        return state;
    }
};

const validator = (state = {
    options: [],
    value: '',
}, action) => {
    switch (action.type) {
    case DELEGATE_SUCCESS_DIALOG_HIDE:
    case DELEGATE_FAILED_DIALOG_HIDE:
    case DELEGATE_DIALOG_HIDE: {
        return {
            options: [],
            value: '',
        };
    }
    case VALIDATOR_SET:
        return {
            ...state,
            value: action.value,
        };
    case DELEGATE_DIALOG_SHOW:
        return {
            ...state,
            value: action.address ? action.address : '',
        };
    default:
        return state;
    }
};

const toValidator = (state = {
    options: [],
    value: '',
}, action) => {
    switch (action.type) {
    case DELEGATE_SUCCESS_DIALOG_HIDE:
    case DELEGATE_FAILED_DIALOG_HIDE:
    case DELEGATE_DIALOG_HIDE: {
        return {
            options: [],
            value: '',
        };
    }
    case TO_VALIDATOR_SET:
        return {
            ...state,
            value: action.value,
        };
    default:
        return state;
    }
};

const tokens = (state = null, action) => {
    switch (action.type) {
    case DELEGATE_SUCCESS_DIALOG_HIDE:
    case DELEGATE_FAILED_DIALOG_HIDE:
    case DELEGATE_DIALOG_HIDE: {
        return null;
    }
    case TOKENS_SET:
        return action.value;
    default:
        return state;
    }
};

const validatorDetails = (state = {
    inProgress: false,
    value: '',
}, action) => {
    switch (action.type) {
    case VALIDATOR_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case VALIDATOR_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case VALIDATOR_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const delegatedValidators = (state = {
    inProgress: false,
    list: [],
}, action) => {
    switch (action.type) {
    case DELEGATED_VALIDATORS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case DELEGATED_VALIDATORS_FETCH_SUCCESS:
        return {
            ...state,
            list: action.list,
        };
    case DELEGATED_VALIDATORS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            list: [],
        };
    default:
        return state;
    }
};

const claimDialog = (state = {
    open: false,
    validator: 'all',
}, action) => {
    switch (action.type) {
    case CLAIM_REWARDS_DIALOG_SHOW:
        return {
            ...state,
            open: true,
        };
    case CLAIM_REWARDS_DIALOG_HIDE:
        return {
            ...state,
            open: false,
            validator: 'all',
        };
    case DELEGATE_SUCCESS_DIALOG_HIDE:
    case DELEGATE_FAILED_DIALOG_HIDE:
        return {
            ...state,
            open: false,
            validator: 'all',
        };
    case CLAIM_REWARDS_VALIDATOR_SET:
        return {
            ...state,
            validator: action.value,
        };
    default:
        return state;
    }
};

const claimDelegateDialog = (state = {
    open: false,
    validator: 'all',
}, action) => {
    switch (action.type) {
    case CLAIM_DELEGATE_DIALOG_SHOW:
        return {
            ...state,
            open: true,
        };
    case CLAIM_DELEGATE_DIALOG_HIDE:
        return {
            ...state,
            open: false,
            validator: 'all',
        };
    case DELEGATE_SUCCESS_DIALOG_HIDE:
    case DELEGATE_FAILED_DIALOG_HIDE:
        return {
            ...state,
            open: false,
            validator: 'all',
        };
    case CLAIM_DELEGATE_VALIDATOR_SET:
        return {
            ...state,
            validator: action.value,
        };
    default:
        return state;
    }
};

const inActiveValidators = (state = {
    inProgress: false,
    list: [],
    images: [],
}, action) => {
    switch (action.type) {
    case INACTIVE_VALIDATORS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case INACTIVE_VALIDATORS_FETCH_SUCCESS:
        return {
            ...state,
            list: action.list,
            inProgress: false,
        };
    case INACTIVE_VALIDATORS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const apr = (state = {
    inProgress: false,
    nominalAPR: null,
    actualAPR: null,
}, action) => {
    switch (action.type) {
    case APR_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case APR_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            nominalAPR: action.nominalAPR,
            actualAPR: action.actualAPR,
        };
    case APR_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const selectMultiValidators = (state = {
    list: [],
}, action) => {
    switch (action.type) {
    case SELECTED_MULTI_VALIDATORS:
        return {
            ...state,
            list: action.value,
        };
    case DELEGATE_DIALOG_HIDE:
    case DELEGATE_SUCCESS_DIALOG_HIDE:
    case DELEGATE_PROCESSING_DIALOG_HIDE:
    case DELEGATE_FAILED_DIALOG_HIDE:
        return {
            list: [],
        };
    default:
        return state;
    }
};

export default combineReducers({
    search,
    genesisValidators,
    delegateDialog,
    successDialog,
    processingDialog,
    failedDialog,
    validator,
    toValidator,
    tokens,
    validators,
    validatorDetails,
    delegatedValidators,
    claimDialog,
    claimDelegateDialog,
    inActiveValidators,
    apr,
    selectMultiValidators,
});
