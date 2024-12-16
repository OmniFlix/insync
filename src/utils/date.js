export const fixDateString = (input) => {
    return input.replace(/T(\d{2}:\d{2}:\d)Z/, 'T$10Z'); // Ensure two digits for seconds
};
