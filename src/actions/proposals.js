import {
    PROPOSAL_DETAILS_FETCH_ERROR,
    PROPOSAL_DETAILS_FETCH_IN_PROGRESS,
    PROPOSAL_DETAILS_FETCH_SUCCESS,
    PROPOSAL_DIALOG_HIDE,
    PROPOSAL_DIALOG_SHOW,
    PROPOSAL_TALLY_FETCH_ERROR,
    PROPOSAL_TALLY_FETCH_IN_PROGRESS,
    PROPOSAL_TALLY_FETCH_SUCCESS,
    PROPOSAL_VOTES_FETCH_ERROR,
    PROPOSAL_VOTES_FETCH_IN_PROGRESS,
    PROPOSAL_VOTES_FETCH_SUCCESS,
    PROPOSALS_FETCH_ERROR,
    PROPOSALS_FETCH_IN_PROGRESS,
    PROPOSALS_FETCH_SUCCESS,
    VOTE_DETAILS_FETCH_ERROR,
    VOTE_DETAILS_FETCH_IN_PROGRESS,
    VOTE_DETAILS_FETCH_SUCCESS,
} from '../constants/proposals';

import Axios from 'axios';
import {
    PROPOSALS_LIST_URL,
    urlFetchProposalDetails,
    urlFetchProposalVotes,
    urlFetchTallyDetails,
    urlFetchVoteDetails,
} from '../constants/url';

const fetchProposalsInProgress = () => {
    return {
        type: PROPOSALS_FETCH_IN_PROGRESS,
    };
};

const fetchProposalsSuccess = (list) => {
    return {
        type: PROPOSALS_FETCH_SUCCESS,
        list,
    };
};

const fetchProposalsError = (message) => {
    return {
        type: PROPOSALS_FETCH_ERROR,
        message,
    };
};

export const getProposals = (cb) => (dispatch) => {
    dispatch(fetchProposalsInProgress());
    Axios.get(PROPOSALS_LIST_URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchProposalsSuccess(res.data && res.data.result));
            cb(res.data && res.data.result);
        })
        .catch((error) => {
            dispatch(fetchProposalsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const fetchProposalVotesInProgress = () => {
    return {
        type: PROPOSAL_VOTES_FETCH_IN_PROGRESS,
    };
};

const fetchProposalVotesSuccess = (list) => {
    return {
        type: PROPOSAL_VOTES_FETCH_SUCCESS,
        list,
    };
};

const fetchProposalVotesError = (message) => {
    return {
        type: PROPOSAL_VOTES_FETCH_ERROR,
        message,
    };
};

export const getProposalVotes = (id) => (dispatch) => {
    dispatch(fetchProposalVotesInProgress());
    const url = urlFetchProposalVotes(id);

    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchProposalVotesSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchProposalVotesError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const showProposalDialog = (value) => {
    return {
        type: PROPOSAL_DIALOG_SHOW,
        value,
    };
};

export const hideProposalDialog = () => {
    return {
        type: PROPOSAL_DIALOG_HIDE,
    };
};

const fetchVoteDetailsInProgress = () => {
    return {
        type: VOTE_DETAILS_FETCH_IN_PROGRESS,
    };
};

const fetchVoteDetailsSuccess = (value) => {
    return {
        type: VOTE_DETAILS_FETCH_SUCCESS,
        value,
    };
};

const fetchVoteDetailsError = (message) => {
    return {
        type: VOTE_DETAILS_FETCH_ERROR,
        message,
    };
};

export const fetchVoteDetails = (id, address) => (dispatch) => {
    dispatch(fetchVoteDetailsInProgress());
    const url = urlFetchVoteDetails(id, address);

    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchVoteDetailsSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchVoteDetailsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchProposalTallyInProgress = () => {
    return {
        type: PROPOSAL_TALLY_FETCH_IN_PROGRESS,
    };
};

const fetchProposalTallySuccess = (value, id) => {
    return {
        type: PROPOSAL_TALLY_FETCH_SUCCESS,
        value,
        id,
    };
};

const fetchProposalTallyError = (message) => {
    return {
        type: PROPOSAL_TALLY_FETCH_ERROR,
        message,
    };
};

export const fetchProposalTally = (id) => (dispatch) => {
    dispatch(fetchProposalTallyInProgress());

    const url = urlFetchTallyDetails(id);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchProposalTallySuccess(res.data && res.data.result, id));
        })
        .catch((error) => {
            dispatch(fetchProposalTallyError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchProposalDetailsInProgress = () => {
    return {
        type: PROPOSAL_DETAILS_FETCH_IN_PROGRESS,
    };
};

const fetchProposalDetailsSuccess = (value, id) => {
    return {
        type: PROPOSAL_DETAILS_FETCH_SUCCESS,
        value,
        id,
    };
};

const fetchProposalDetailsError = (message) => {
    return {
        type: PROPOSAL_DETAILS_FETCH_ERROR,
        message,
    };
};

export const fetchProposalDetails = (id, cb) => (dispatch) => {
    dispatch(fetchProposalDetailsInProgress());

    const url = urlFetchProposalDetails(id);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchProposalDetailsSuccess(res.data && res.data.txs, id));
            if (cb) {
                cb(res);
            }
        })
        .catch((error) => {
            dispatch(fetchProposalDetailsError(
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
