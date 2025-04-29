import { CONNECT_DIALOG_HIDE, CONNECT_DIALOG_SHOW, HIDE_SIDE_BAR_SET, SHOW_SIDE_BAR_SET } from '../constants/navBar';

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

export const showConnectDialog = (proposalTab, stake, ibc) => {
    return {
        type: CONNECT_DIALOG_SHOW,
        proposalTab,
        stake,
        ibc,
    };
};

export const hideConnectDialog = () => {
    return {
        type: CONNECT_DIALOG_HIDE,
    };
};
