import { combineReducers } from 'redux';
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
import { DISCONNECT_SET } from '../constants/accounts';

const dialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case PROPOSAL_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case PROPOSAL_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
};

const _ = (state = {
    inProgress: false,
    list: [],
}, action) => {
    switch (action.type) {
    case PROPOSALS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case PROPOSALS_FETCH_SUCCESS:
        return {
            ...state,
            list: action.list,
            inProgress: false,
        };
    case PROPOSALS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const votes = (state = {
    inProgress: false,
    list: [],
}, action) => {
    switch (action.type) {
    case PROPOSAL_VOTES_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case PROPOSAL_VOTES_FETCH_SUCCESS:
        return {
            ...state,
            list: action.list,
            inProgress: false,
        };
    case PROPOSAL_VOTES_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const voteDetails = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case VOTE_DETAILS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
            value: [],
        };
    case VOTE_DETAILS_FETCH_SUCCESS: {
        const arr = [...state.value];
        const filter = state.value && state.value.length &&
            action.value && action.value.proposal_id &&
            state.value.filter((val) => val.proposal_id === action.value.proposal_id);
        if (!filter.length) {
            arr.push(action.value);
        }

        return {
            inProgress: false,
            value: [...arr],
        };
    }
    case VOTE_DETAILS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            value: [],
        };
    default:
        return state;
    }
};

const tallyDetails = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case PROPOSAL_TALLY_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case PROPOSAL_TALLY_FETCH_SUCCESS: {
        const obj = {
            ...state.value,
            [action.id]: action.value,
        };

        return {
            inProgress: false,
            value: obj,
        };
    }
    case PROPOSAL_TALLY_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const proposalDetails = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case PROPOSAL_DETAILS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case PROPOSAL_DETAILS_FETCH_SUCCESS: {
        const obj = {
            ...state.value,
            [action.id]: action.value,
        };

        return {
            inProgress: false,
            value: obj,
        };
    }
    case PROPOSAL_DETAILS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    dialog,
    _,
    votes,
    voteDetails,
    tallyDetails,
    proposalDetails,
});
