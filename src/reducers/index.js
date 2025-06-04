import { combineReducers } from 'redux';
import accounts from './accounts';
import language from './language';
import snackbar from './snackbar';
import stake from './stake';
import proposals from './proposals';
import navBar from './navBar';
import shieldedAssets from './shieldedAssets';
import ibcTransfer from './IBCTransfer';
import assets from './assets';
import gasPrice from './gasPrice';

const reduxObjects = combineReducers({
    accounts,
    language,
    snackbar,
    stake,
    proposals,
    navBar,
    shieldedAssets,
    ibcTransfer,
    assets,
    gasPrice,
});

const rootReducer = (state, action) => {
    if (action.type === 'DISCONNECT_SUCCESS') {
        state = undefined;
    }

    return reduxObjects(state, action);
};

export default rootReducer;
