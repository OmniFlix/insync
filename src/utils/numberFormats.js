export const commaSeparator = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const tally = (value, sum) => {
    const total = (value / sum) * 100;
    if (value === 0 && sum === 0) {
        return '0%';
    }

    return total.toFixed(2) + '%';
};

const COUNT_ABBRS = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];

export const formatCountAbbr = (count, withAbbr = false, decimals = 4) => {
    const i = (count === 0) ? count : Math.floor(Math.log(count) / Math.log(1000));
    let result = parseFloat((count / Math.pow(1000, i)).toFixed(decimals));
    if (withAbbr) {
        result += `${COUNT_ABBRS[i]}`;
    }

    return result;
};

export const floatDecimals = (count, decimals = 2) => {
    return parseFloat(count).toFixed(decimals);
};

export const formatCount = (value, decimals) => {
    if (value === 0) {
        return value;
    }

    if (!value) {
        return formatCountAbbr(value, true);
    }

    if (parseInt(value) === value) {
        return formatCountAbbr(value, true);
    }

    if (value < 1) {
        return floatDecimals(value, decimals || 5);
    }

    if (value < 1000) {
        return floatDecimals(value, decimals);
    }

    return formatCountAbbr(value, true, decimals || 2);
};
