export const getWrapAddress = (string, limit, endLimit = 6) => {
    const dots = '...';
    if (string && string.length > limit) {
        string = string.substring(0, limit) + dots + string.slice(string.length - endLimit, string.length);
    }

    return string;
};
