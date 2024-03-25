import BigNumber from "bignumber.js";
export var BigNumberSerializer = {
    serialize: function (value, writer) {
        writer.string(value.toString());
    },
    deserialize: function (reader) {
        var valueString = reader.string();
        return new BigNumber(valueString);
    },
};
