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
