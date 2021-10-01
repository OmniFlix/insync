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
import Axios from 'axios';
import {
    urlFetchBalance,
    urlFetchDelegations,
    urlFetchRewards,
    urlFetchUnBondingDelegations,
    urlFetchVestingBalance,
} from '../../constants/url';

export const setAccountAddress = (value) => {
    return {
        type: ACCOUNT_ADDRESS_SET,
        value,
    };
};

const fetchDelegationsInProgress = () => {
    return {
        type: DELEGATIONS_FETCH_IN_PROGRESS,
    };
};

const fetchDelegationsSuccess = (value) => {
    return {
        type: DELEGATIONS_FETCH_SUCCESS,
        value,
    };
};

const fetchDelegationsError = (message) => {
    return {
        type: DELEGATIONS_FETCH_ERROR,
        message,
    };
};

export const getDelegations = (address) => (dispatch) => {
    dispatch(fetchDelegationsInProgress());
    const url = urlFetchDelegations(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchDelegationsSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchDelegationsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchBalanceInProgress = () => {
    return {
        type: BALANCE_FETCH_IN_PROGRESS,
    };
};

const fetchBalanceSuccess = (value) => {
    return {
        type: BALANCE_FETCH_SUCCESS,
        value,
    };
};

const fetchBalanceError = (message) => {
    return {
        type: BALANCE_FETCH_ERROR,
        message,
    };
};

export const getBalance = (address) => (dispatch) => {
    dispatch(fetchBalanceInProgress());
    const url = urlFetchBalance(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchBalanceSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchBalanceError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchVestingBalanceInProgress = () => {
    return {
        type: VESTING_BALANCE_FETCH_IN_PROGRESS,
    };
};

const fetchVestingBalanceSuccess = (value) => {
    return {
        type: VESTING_BALANCE_FETCH_SUCCESS,
        value,
    };
};

const fetchVestingBalanceError = (message) => {
    return {
        type: VESTING_BALANCE_FETCH_ERROR,
        message,
    };
};

export const fetchVestingBalance = (address) => (dispatch) => {
    dispatch(fetchVestingBalanceInProgress());
    const url = urlFetchVestingBalance(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchVestingBalanceSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchVestingBalanceError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const showSelectAccountDialog = () => {
    return {
        type: SELECT_ACCOUNT_DIALOG_SHOW,
    };
};

export const hideSelectAccountDialog = () => {
    return {
        type: SELECT_ACCOUNT_DIALOG_HIDE,
    };
};

const fetchUnBondingDelegationsInProgress = () => {
    return {
        type: UN_BONDING_DELEGATIONS_FETCH_IN_PROGRESS,
    };
};

const fetchUnBondingDelegationsSuccess = (value) => {
    return {
        type: UN_BONDING_DELEGATIONS_FETCH_SUCCESS,
        value,
    };
};

const fetchUnBondingDelegationsError = (message) => {
    return {
        type: UN_BONDING_DELEGATIONS_FETCH_ERROR,
        message,
    };
};

export const getUnBondingDelegations = (address) => (dispatch) => {
    dispatch(fetchUnBondingDelegationsInProgress());
    const url = urlFetchUnBondingDelegations(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchUnBondingDelegationsSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchUnBondingDelegationsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const setStakeAccountAddress = (value) => {
    return {
        type: STAKE_ACCOUNT_ADDRESS_SET,
        value,
    };
};

const fetchRewardsInProgress = () => {
    return {
        type: REWARDS_FETCH_IN_PROGRESS,
    };
};

const fetchRewardsSuccess = (value) => {
    return {
        type: REWARDS_FETCH_SUCCESS,
        value,
    };
};

const fetchRewardsError = (message) => {
    return {
        type: REWARDS_FETCH_ERROR,
        message,
    };
};

export const fetchRewards = (address) => (dispatch) => {
    dispatch(fetchRewardsInProgress());
    const url = urlFetchRewards(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchRewardsSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchRewardsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const disconnectSet = () => {
    return {
        type: DISCONNECT_SET,
    };
};
