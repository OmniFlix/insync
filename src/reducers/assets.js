import { ASSETS_TABS_SET } from "constants/assets";
import { combineReducers } from "redux";

const assetsTab = (state = {
    value: 'transparent',
}, action) => {
    switch (action.type) {
    case ASSETS_TABS_SET:
        return {
            value: action.value,
        };
    default:
        return state;
    }
};

export default combineReducers({
    assetsTab,
});
