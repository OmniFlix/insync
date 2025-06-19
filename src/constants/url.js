import { config } from '../config';

export const REST_URL = config.REST_URL;
export const RPC_URL = config.RPC_URL;

export const urlFetchDelegations = (address) => `${REST_URL}/cosmos/staking/v1beta1/delegations/${address}`;
export const urlFetchBalance = (address) => `${REST_URL}/cosmos/bank/v1beta1/balances/${address}`;
export const urlFetchVestingBalance = (address) => `${REST_URL}/cosmos/auth/v1beta1/accounts/${address}`;
export const urlFetchTokensList = () => `${REST_URL}/api/v1/chain/token`;
export const urlFetchBalanceList = (address) => `${REST_URL}/api/v1/account/${address}`;
export const urlFetchUnBondingDelegations = (address) => `${REST_URL}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;

export const urlFetchRewards = (address) => `${REST_URL}/api/v1/pos/reward/${address}`;
// export const urlFetchVoteDetails = (proposalId, address) => `${REST_URL}/api/v1/gov/voter/${proposalId}/votes/${address}`
export const urlFetchVoteDetails = (proposalId, address) => `${REST_URL}/api/v1/gov/voter/${address}/votes`;
export const urlFetchRevealedPubkey = (address) => `${REST_URL}/api/v1/revealed-public-key/${address}`;

export const VALIDATORS_LIST_URL = () => `${REST_URL}/api/v1/pos/validator/all?state=consensus`;
export const GENESIS_VALIDATORS_LIST_URL = 'https://namada.info/shielded-expedition.88f17d1d14/output/genesis_tm_address_to_alias.json';
export const INACTIVE_VALIDATORS_URL = `${REST_URL}/api/v1/pos/validator/all?state=belowCapacity&state=belowThreshold&state=inactive&state=jailed&state=unknown`;
export const APR_PARAMETERS_URL = `${REST_URL}/api/v1/chain/parameters`;
export const INACTIVE_VALIDATORS_UNBONDING_URL = `${REST_URL}/cosmos/staking/v1beta1/validators?pagination.limit=1000&status=BOND_STATUS_UNBONDING`;
export const getValidatorURL = (address) => `${REST_URL}/cosmos/staking/v1beta1/validators/${address}`;
export const PROPOSALS_LIST_URL = `${REST_URL}/api/v1/gov/proposal/all`;
export const getDelegatedValidatorsURL = (address) => `${REST_URL}/api/v1/pos/bond/${address}`;
export const getUnBondingValidatorsURL = (address) => `${REST_URL}/api/v1/pos/merged-unbonds/${address}`;
export const urlFetchProposalVotes = (id) => `${REST_URL}/cosmos/gov/v1beta1/proposals/${id}/votes`;
export const urlFetchTallyDetails = (id) => `${REST_URL}/cosmos/gov/v1beta1/proposals/${id}/tally`;
export const urlFetchProposalDetails = (id) => `${REST_URL}/api/v1/gov/proposal/${id}`;
export const urlFetchBlockHeight = (timestamp) => `${REST_URL}/api/v1/block/timestamp/${timestamp}`;

export const validatorImageURL = (id) => `https://keybase.io/_/api/1.0/user/lookup.json?fields=pictures&key_suffix=${id}`;

export const urlFetchTimeoutHeight = (url, channel) => {
    let version = 'v1';
    if (url.indexOf('bluenet') > -1) {
        version = 'v1beta1';
    }

    return `${url}/ibc/core/channel/${version}/channels/${channel}/ports/transfer`;
};
export const urlFetchIBCBalance = (url, address) => `${url}/cosmos/bank/v1beta1/balances/${address}`;
export const urlFetchGasPrice = () => `${REST_URL}/api/v1/gas-price`;
export const urlFetchGasEstimation = (transactionTypes) => {
    const params = [];
    if (transactionTypes && transactionTypes.length) {
        transactionTypes.map((val) => {
            params.push(`${val}=1`);
        });
    }

    return `${REST_URL}/api/v1/gas/estimate?${params.join('&')}`;
};
