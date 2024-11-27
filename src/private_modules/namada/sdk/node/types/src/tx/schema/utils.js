"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigNumberSerializer = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.BigNumberSerializer = {
    serialize: (value, writer) => {
        writer.string(value.toString());
    },
    deserialize: (reader) => {
        const valueString = reader.string();
        return new bignumber_js_1.default(valueString);
    },
};
//# sourceMappingURL=utils.js.map