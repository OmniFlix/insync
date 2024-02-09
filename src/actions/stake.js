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
    VALIDATOR_IMAGE_FETCH_ERROR,
    VALIDATOR_IMAGE_FETCH_IN_PROGRESS,
    VALIDATOR_IMAGE_FETCH_SUCCESS,
    VALIDATOR_SET,
    VALIDATORS_FETCH_ERROR,
    VALIDATORS_FETCH_IN_PROGRESS,
    VALIDATORS_FETCH_SUCCESS,
    SELECTED_MULTI_VALIDATORS,
} from '../constants/stake';
import Axios from 'axios';
import {
    getDelegatedValidatorsURL,
    getValidatorURL,
    INACTIVE_VALIDATORS_UNBONDING_URL,
    INACTIVE_VALIDATORS_URL,
    validatorImageURL,
    VALIDATORS_LIST_URL,
} from '../constants/url';
import { config } from '../config';
import { calculateNominalAPR, calculateRealAPR, getBlocksPerYearReal, getParams } from '../utils/aprCalculation';

const axios = require('axios').default;

const fetchValidatorsInProgress = () => {
    return {
        type: VALIDATORS_FETCH_IN_PROGRESS,
    };
};

const fetchValidatorsSuccess = (list) => {
    return {
        type: VALIDATORS_FETCH_SUCCESS,
        list,
    };
};

const fetchValidatorsError = (message) => {
    return {
        type: VALIDATORS_FETCH_ERROR,
        message,
    };
};

export const getValidators = (cb) => (dispatch) => {
    dispatch(fetchValidatorsInProgress());
    Axios.get(VALIDATORS_LIST_URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchValidatorsSuccess(res.data && res.data.validators));
            cb(res.data && res.data.validators);
        })
        .catch((error) => {
            dispatch(fetchValidatorsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const setSearch = (value) => {
    return {
        type: SEARCH_LIST_SET,
        value,
    };
};

export const showDelegateDialog = (name, address) => {
    return {
        type: DELEGATE_DIALOG_SHOW,
        name,
        address,
    };
};

export const hideDelegateDialog = () => {
    return {
        type: DELEGATE_DIALOG_HIDE,
    };
};

export const showDelegateSuccessDialog = (value) => {
    return {
        type: DELEGATE_SUCCESS_DIALOG_SHOW,
        value,
    };
};

export const hideDelegateSuccessDialog = () => {
    return {
        type: DELEGATE_SUCCESS_DIALOG_HIDE,
    };
};

export const showDelegateProcessingDialog = () => {
    return {
        type: DELEGATE_PROCESSING_DIALOG_SHOW,
    };
};

export const hideDelegateProcessingDialog = () => {
    return {
        type: DELEGATE_PROCESSING_DIALOG_HIDE,
    };
};

export const showDelegateFailedDialog = () => {
    return {
        type: DELEGATE_FAILED_DIALOG_SHOW,
    };
};

export const hideDelegateFailedDialog = () => {
    return {
        type: DELEGATE_FAILED_DIALOG_HIDE,
    };
};

export const setValidator = (value) => {
    return {
        type: VALIDATOR_SET,
        value,
    };
};

export const setToValidator = (value) => {
    return {
        type: TO_VALIDATOR_SET,
        value,
    };
};

export const setTokens = (value) => {
    return {
        type: TOKENS_SET,
        value,
    };
};

const fetchValidatorInProgress = () => {
    return {
        type: VALIDATOR_FETCH_IN_PROGRESS,
    };
};

const fetchValidatorSuccess = (value) => {
    return {
        type: VALIDATOR_FETCH_SUCCESS,
        value,
    };
};

const fetchValidatorError = (message) => {
    return {
        type: VALIDATOR_FETCH_ERROR,
        message,
    };
};

export const getValidatorDetails = (address, cb) => (dispatch) => {
    dispatch(fetchValidatorInProgress());
    const URL = getValidatorURL(address);
    Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchValidatorSuccess(res.data && res.data.validators));
            cb(res.data && res.data.validators);
        })
        .catch((error) => {
            dispatch(fetchValidatorError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const fetchDelegatedValidatorsInProgress = () => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_IN_PROGRESS,
    };
};

const fetchDelegatedValidatorsSuccess = (list) => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_SUCCESS,
        list,
    };
};

const fetchDelegatedValidatorsError = (message) => {
    return {
        type: DELEGATED_VALIDATORS_FETCH_ERROR,
        message,
    };
};

export const getDelegatedValidatorsDetails = (address) => (dispatch) => {
    dispatch(fetchDelegatedValidatorsInProgress());
    const URL = getDelegatedValidatorsURL(address);
    Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchDelegatedValidatorsSuccess(res.data && res.data.validators));
        })
        .catch((error) => {
            dispatch(fetchDelegatedValidatorsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const showClaimRewardsDialog = () => {
    return {
        type: CLAIM_REWARDS_DIALOG_SHOW,
    };
};

export const hideClaimRewardsDialog = () => {
    return {
        type: CLAIM_REWARDS_DIALOG_HIDE,
    };
};

export const setClaimRewardsValidator = (value) => {
    return {
        type: CLAIM_REWARDS_VALIDATOR_SET,
        value,
    };
};

export const showClaimDelegateDialog = () => {
    return {
        type: CLAIM_DELEGATE_DIALOG_SHOW,
    };
};

export const hideClaimDelegateDialog = () => {
    return {
        type: CLAIM_DELEGATE_DIALOG_HIDE,
    };
};

export const setClaimDelegateValidator = (value) => {
    return {
        type: CLAIM_DELEGATE_VALIDATOR_SET,
        value,
    };
};

const fetchValidatorImageInProgress = () => {
    return {
        type: VALIDATOR_IMAGE_FETCH_IN_PROGRESS,
    };
};

export const fetchValidatorImageSuccess = (value) => {
    return {
        type: VALIDATOR_IMAGE_FETCH_SUCCESS,
        value,
    };
};

const fetchValidatorImageError = (message) => {
    return {
        type: VALIDATOR_IMAGE_FETCH_ERROR,
        message,
    };
};

export const fetchValidatorImage = (id) => (dispatch) => {
    dispatch(fetchValidatorImageInProgress());
    const URL = validatorImageURL(id);
    return Axios.get(URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            let obj = sessionStorage.getItem(`${config.PREFIX}_images`) || '{}';
            obj = obj && JSON.parse(obj);
            obj[id] = res.data;
            obj = obj && JSON.stringify(obj);
            sessionStorage.setItem(`${config.PREFIX}_images`, obj);
            dispatch(fetchValidatorImageSuccess({
                ...res.data,
                _id: id,
            }));
        })
        .catch((error) => {
            dispatch(fetchValidatorImageError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchInActiveValidatorsInProgress = () => {
    return {
        type: INACTIVE_VALIDATORS_FETCH_IN_PROGRESS,
    };
};

const fetchInActiveValidatorsSuccess = (list) => {
    return {
        type: INACTIVE_VALIDATORS_FETCH_SUCCESS,
        list,
    };
};

const fetchInActiveValidatorsError = (message) => {
    return {
        type: INACTIVE_VALIDATORS_FETCH_ERROR,
    };
};

export const getInActiveValidators = (cb) => (dispatch) => {
    dispatch(fetchInActiveValidatorsInProgress());
    (async () => {
        try {
            const result = await Axios.get(INACTIVE_VALIDATORS_URL, {
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    Connection: 'keep-alive',
                },
            });
            const unBondingResult = await Axios.get(INACTIVE_VALIDATORS_UNBONDING_URL, {
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    Connection: 'keep-alive',
                },
            });
            const updatedResult = [...result.data && result.data.result, ...unBondingResult.data && unBondingResult.data.result];
            dispatch(fetchInActiveValidatorsSuccess(updatedResult));
            cb(updatedResult);
        } catch (error) {
            dispatch(fetchInActiveValidatorsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        }
    })();
};

const fetchAPRInProgress = () => {
    return {
        type: APR_FETCH_IN_PROGRESS,
    };
};

export const fetchAPRSuccess = (nominalAPR, actualAPR) => {
    return {
        type: APR_FETCH_SUCCESS,
        nominalAPR,
        actualAPR,
    };
};

const fetchAPRError = (message) => {
    return {
        type: APR_FETCH_ERROR,
        message,
    };
};

export const fetchAPR = () => (dispatch) => {
    dispatch(fetchAPRInProgress());
    (async () => {
        try {
            const apiUrl = config.REST_URL;
            const lcdApi = axios.create({
                baseURL: apiUrl,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                },
                timeout: 10000,
            });

            const params = await getParams(lcdApi);
            const blocksYearReal = await getBlocksPerYearReal(lcdApi);
            const nominalAPR = calculateNominalAPR(params);
            const actualAPR = calculateRealAPR(params, nominalAPR, blocksYearReal);

            dispatch(fetchAPRSuccess((nominalAPR * 100), (actualAPR * 100)));
        } catch (error) {
            dispatch(fetchAPRError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : error,
            ));
            return null;
        }
    })();
};

export const selectMultiValidators = (value) => {
    return {
        type: SELECTED_MULTI_VALIDATORS,
        value,
    };
};
