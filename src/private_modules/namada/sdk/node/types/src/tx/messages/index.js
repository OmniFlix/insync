"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const borsh_1 = require("@dao-xyz/borsh");
class Message {
    encode(value) {
        try {
            return (0, borsh_1.serialize)(value);
        }
        catch (e) {
            throw new Error(`Unable to serialize message: ${e}`);
        }
    }
    static decode(buffer, parser) {
        try {
            return (0, borsh_1.deserialize)(Buffer.from(buffer), parser);
        }
        catch (e) {
            throw new Error(`Unable to deserialize message: ${e}`);
        }
    }
}
exports.Message = Message;
//# sourceMappingURL=index.js.map