import { combineReducers } from 'redux';
import accounts from './accounts';
import language from './language';
import snackbar from './snackbar';
import stake from './stake';
import proposals from './proposals';
import navBar from './navBar';

const reduxObjects = combineReducers({
    accounts,
    language,
    snackbar,
    stake,
    proposals,
    navBar,
});

const rootReducer = (state, action) => {
    if (action.type === 'DISCONNECT_SUCCESS') {
        state = undefined;
    }

    return reduxObjects(state, action);
};

export default rootReducer;
