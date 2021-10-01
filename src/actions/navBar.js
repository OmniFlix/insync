import { HIDE_SIDE_BAR_SET, SHOW_SIDE_BAR_SET } from '../constants/navBar';

export const showSideBar = () => {
    return {
        type: SHOW_SIDE_BAR_SET,
    };
};

export const hideSideBar = () => {
    return {
        type: HIDE_SIDE_BAR_SET,
    };
};
