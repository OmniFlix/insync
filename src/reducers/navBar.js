import { combineReducers } from 'redux';
import { HIDE_SIDE_BAR_SET, SHOW_SIDE_BAR_SET } from '../constants/navBar';

const show = (state = false, action) => {
    switch (action.type) {
    case SHOW_SIDE_BAR_SET:
        return true;
    case HIDE_SIDE_BAR_SET:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    show,
});
