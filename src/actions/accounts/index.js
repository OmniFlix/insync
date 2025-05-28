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
} from '../../constants/accounts';
import Axios from 'axios';
import { urlFetchRevealedPubkey, urlFetchRewards, urlFetchUnBondingDelegations, urlFetchVestingBalance, urlFetchBlockHeight, urlFetchTokensList, urlFetchBalanceList } from '../../constants/url';
// import { Query } from '@namada/shared';
import { config } from '../../config';
// import { init as initShared } from '@namada/shared/dist/init-inline';
// import { Sdk, getSdk } from '@heliaxdev/namada-sdk/web';
// import init from '@heliaxdev/namada-sdk/web-init';

import { getSdk } from '@harish551/namada-sdk/web';
import init from '@harish551/namada-sdk/web-init';
// import { Tokens } from '@namada/types';

export const setAccountAddress = (value, shieldedAddress, shieldedDetails) => {
    return {
        type: ACCOUNT_ADDRESS_SET,
        value,
        shieldedAddress,
        shieldedDetails,
    };
};

export const setAccountDetails = (value) => {
    return {
        type: ACCOUNT_DETAILS_SET,
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
    (async () => {
        const { cryptoMemory } = await init();
        const sdk = getSdk(
            cryptoMemory,
            config.RPC_URL,
            config.MAPS_REST_URL,
            '',
            config.TOKEN_ADDRESS,
        );

        const { rpc } = sdk;
        const query = rpc.query;
        const array = [address];
        query.query_my_validators(array)
            .then((res) => {
                dispatch(fetchDelegationsSuccess(res));
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
    })();
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

export const getBalance = (address, cb) => (dispatch) => {
    dispatch(fetchBalanceInProgress());
    (async () => {
        // await initShared();

        // const query = new Query(config.RPC_URL);
        // // console.log('5555', Tokens);
        const array = [config.TOKEN_ADDRESS];
        // if (Tokens && Object.keys(Tokens).length) {
        //     Object.keys(Tokens).map((key) => {
        //         if (key && Tokens[key] && Tokens[key].address) {
        //             array.push(Tokens[key].address);
        //         }
        //
        //         return null;
        //     });
        // }
        const { cryptoMemory } = await init();
        const sdk = getSdk(
            cryptoMemory,
            config.RPC_URL,
            config.MAPS_REST_URL,
            '',
            config.TOKEN_ADDRESS,
        );

        const { rpc } = sdk;
        const query = rpc.query;
        // const tokens = await query.query_native_token();
        query.query_balance(address, array, config.CHAIN_ID)
            .then((res) => {
                dispatch(fetchBalanceSuccess(res));
                if (cb) {
                    cb(res);
                }
            })
            .catch((error) => {
                dispatch(fetchBalanceError(
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                        ? error.response.data.message
                        : 'Failed!',
                ));
                if (cb) {
                    cb(null);
                }
            });
    })();
};

const fetchTokensListInProgress = () => {
    return {
        type: TOKENS_LIST_FETCH_IN_PROGRESS,
    };
};

const fetchTokensListSuccess = (value) => {
    return {
        type: TOKENS_LIST_FETCH_SUCCESS,
        value,
    };
};

const fetchTokensListError = (message) => {
    return {
        type: TOKENS_LIST_FETCH_ERROR,
        message,
    };
};

export const fetchTokensList = () => (dispatch) => {
    dispatch(fetchTokensListInProgress());
    const url = urlFetchTokensList();
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchTokensListSuccess(res.data));
        })
        .catch((error) => {
            dispatch(fetchTokensListError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchBalanceListInProgress = () => {
    return {
        type: BALANCE_LIST_FETCH_IN_PROGRESS,
    };
};

const fetchBalanceListSuccess = (value) => {
    return {
        type: BALANCE_LIST_FETCH_SUCCESS,
        value,
    };
};

const fetchBalanceListError = (message) => {
    return {
        type: BALANCE_LIST_FETCH_ERROR,
        message,
    };
};

export const fetchBalanceList = (address, cb) => (dispatch) => {
    dispatch(fetchBalanceListInProgress());
    const url = urlFetchBalanceList(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchBalanceListSuccess(res.data));
            if (cb) {
                cb(res.data);
            }
        })
        .catch((error) => {
            dispatch(fetchBalanceListError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            if (cb) {
                cb(null);
            }
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
        },
    })
        .then((res) => {
            dispatch(fetchVestingBalanceSuccess(res.data && res.data.balances));
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
        },
    })
        .then((res) => {
            dispatch(fetchUnBondingDelegationsSuccess(res.data && res.data.unbonding_responses));
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
        },
    })
        .then((res) => {
            dispatch(fetchRewardsSuccess(res.data));
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

const fetchRevealedPubKeyInProgress = () => {
    return {
        type: REVEALED_PUB_KEY_FETCH_IN_PROGRESS,
    };
};

const fetchRevealedPubKeySuccess = (value) => {
    return {
        type: REVEALED_PUB_KEY_FETCH_SUCCESS,
        value,
    };
};

const fetchRevealedPubKeyError = (message) => {
    return {
        type: REVEALED_PUB_KEY_FETCH_ERROR,
        message,
    };
};

export const fetchRevealedPubKey = (address) => (dispatch) => {
    dispatch(fetchRevealedPubKeyInProgress());
    const url = urlFetchRevealedPubkey(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchRevealedPubKeySuccess(res.data));
        })
        .catch((error) => {
            dispatch(fetchRevealedPubKeyError(
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

export const shieldedBalanceFetchInProgress = () => ({
    type: FETCH_SHIELDED_BALANCE_IN_PROGRESS,
});

export const shieldedBalanceFetchSuccess = (balance) => ({
    type: FETCH_SHIELDED_BALANCE_SUCCESS,
    balance, // Format: { [asset]: string } (e.g., { "NAM": "100" })
});

export const shieldedBalanceFetchError = (error) => ({
    type: FETCH_SHIELDED_BALANCE_ERROR,
    error: error.message || 'Failed to fetch shielded balance',
});


export const getShieldedBalance = (viewingKey, timestamp, tnam, znam, chainId = config.CHAIN_ID, cb) => async (dispatch) => {
        dispatch({ type: FETCH_SHIELDED_BALANCE_IN_PROGRESS });
        try {
            const url = urlFetchBlockHeight(timestamp);
            let response = 0;
            if (timestamp > 0) {
                response = await Axios.get(url);
            }

            const birthday = response?.data?.height || 0;
            const { cryptoMemory } = await init();
            const sdk = getSdk(
                cryptoMemory,
                config.RPC_URL,
                config.MAPS_REST_URL,
                '',
                config.TOKEN_ADDRESS,
            );

            const datedViewingKeys = [{
                key: viewingKey,
                birthday: birthday,
            }];
            await sdk.rpc.shieldedSync(datedViewingKeys, chainId);
            const balance = await sdk.rpc.queryBalance(
                viewingKey,
                [config.TOKEN_ADDRESS],
                chainId,
            );
            dispatch(shieldedBalanceFetchSuccess(balance));
            if (cb) {
                cb(balance);
            }
        } catch (error) {
            console.error('❌ Shielded balance error:', {
                message: error.message || 'Unknown error',
                error,
                chainId,
            });
            dispatch(shieldedBalanceFetchError(error.message || 'Unknown error'));
            if (cb) {
                cb(null);
            }
        }
    };
