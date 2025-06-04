export const commaSeparator = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    if (value && Number(value) < 1000) {
        return value.toString();
    }
    const [integerPart, decimalPart] = value.toString().split('.');
    const updatedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${updatedInteger}.${decimalPart}` : updatedInteger;
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

    if (value < 0.0001) {
        return floatDecimals(value, 5);
    }

    if (value < 0.01) {
        return floatDecimals(value, decimals || 4);
    }

    if (value < 0.1) {
        return floatDecimals(value, decimals || 2);
    }

    if (value < 1) {
        return floatDecimals(value, decimals || 2);
    }

    if (value < 1000) {
        return floatDecimals(value, decimals);
    }

    return formatCountAbbr(value, true, decimals || 2);
};

export const floatCountWithoutABBRS = (value, decimals) => {
    if (value === 0) {
        return value;
    }

    if (!value) {
        return formatCountAbbr(value, false);
    }

    if (parseInt(value) === value) {
        return formatCountAbbr(value, false);
    }

    if (value < 0.0001) {
        return floatDecimals(value, 5);
    }

    if (value < 0.01) {
        return floatDecimals(value, 4);
    }

    if (value < 0.1) {
        return floatDecimals(value, 2);
    }

    if (value < 1000) {
        return floatDecimals(value, decimals);
    }

    return floatDecimals(value, decimals || 2);
};
