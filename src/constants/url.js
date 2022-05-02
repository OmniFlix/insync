import { config } from '../config';

export const REST_URL = config.REST_URL;
export const RPC_URL = config.RPC_URL;

export const urlFetchDelegations = (address) => `${REST_URL}/staking/delegators/${address}/delegations`;
export const urlFetchBalance = (address) => `${REST_URL}/bank/balances/${address}`;
export const urlFetchVestingBalance = (address) => `${REST_URL}/auth/accounts/${address}`;
export const urlFetchUnBondingDelegations = (address) => `${REST_URL}/staking/delegators/${address}/unbonding_delegations`;

export const urlFetchRewards = (address) => `${REST_URL}/distribution/delegators/${address}/rewards`;
export const urlFetchVoteDetails = (proposalId, address) => `${REST_URL}/gov/proposals/${proposalId}/votes/${address}`;

export const VALIDATORS_LIST_URL = `${REST_URL}/staking/validators`;
export const INACTIVE_VALIDATORS_URL = `${REST_URL}/staking/validators?status=BOND_STATUS_UNBONDED`;
export const getValidatorURL = (address) => `${REST_URL}/staking/validators/${address}`;
export const PROPOSALS_LIST_URL = `${REST_URL}/gov/proposals`;
export const getDelegatedValidatorsURL = (address) => `${REST_URL}/staking/delegators/${address}/validators`;
export const urlFetchProposalVotes = (id) => `${REST_URL}/gov/proposals/${id}/votes`;
export const urlFetchTallyDetails = (id) => `${REST_URL}/gov/proposals/${id}/tally`;
export const urlFetchProposalDetails = (id) => `${REST_URL}/txs?message.module=governance&submit_proposal.proposal_id=${id}`;

export const validatorImageURL = (id) => `https://keybase.io/_/api/1.0/user/lookup.json?fields=pictures&key_suffix=${id}`;
