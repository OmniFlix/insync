export const handleErrorMessage = (error, defaultMessage) => {
    let message = defaultMessage || 'Failed!';

    if (error.response && error.response.data && error.response.data.error && error.response.data.error.details &&
    error.response.data.error.details.length && error.response.data.error.details[0] &&
    error.response.data.error.details[0].message) {
        message = error.response.data.error.details[0].message;
    } else if (error.response && error.response.data && error.response.data.message && error.response.data.message.message) {
        message = error.response.data.message.message;
    } else if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
    } else if (error.response && error.response.data && error.response.data.error && error.response.data.error.code) {
        message = error.response.data.error.code;
    } else if (error.response && error.response.data && error.response.data.error) {
        message = error.response.data.error;
    } else if (error.message) {
        message = error.message;
    }

    return message;
};
