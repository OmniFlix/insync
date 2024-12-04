export const randomNoRepeats = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
};

export const getRandomElement = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
        return arr;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};
