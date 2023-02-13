export const convertToCamelCase = (value) => {
    const object = {};
    if (Object.keys(value).length) {
        Object.keys(value).map((val) => {
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
            if (object2 && typeof (object2) === 'object' && !Array.isArray(object2)) {
                object2 = convertToCamelCase(object2);
            }
            object[string] = object2;

            return null;
        });

        return object;
    }
};
