import { MESSAGE_SHOW, SNACKBAR_HIDE } from '../constants/snackbar';

export const hideSnackbar = () => {
    return {
        type: SNACKBAR_HIDE,
    };
};

export const showMessage = (message) => {
    return {
        type: MESSAGE_SHOW,
        message,
    };
};
