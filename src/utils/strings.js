export const getWrapAddress = (string, limit, endLimit = 6) => {
    const dots = '...';
    if (string && string.length > limit) {
        string = string.substring(0, limit) + dots + string.slice(string.length - endLimit, string.length);
    }

    return string;
};

export const convertToCamelCase = (value) => {
    const object = {};
    if (value && Object.keys(value).length) {
        value && Object.keys(value).map((val) => {
            let string = val && val.split('_');
            if (string.length > 1) {
                string.map((str, index) => {
                    if (index > 0) {
                        string[index] = str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
                    }

                    return null;
                });

                string = string.join('');
            }

            let object2 = value[val];
            if (typeof (object2) === 'object' && !Array.isArray(object2)) {
                object2 = convertToCamelCase(object2);
            }
            object[string] = object2;

            return null;
        });

        return object;
    }
};
