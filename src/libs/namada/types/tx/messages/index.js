import { deserialize, serialize } from "@dao-xyz/borsh";
var Message = /** @class */ (function () {
    function Message() {
    }
    Message.prototype.encode = function (value) {
        try {
            return serialize(value);
        }
        catch (e) {
            throw new Error("Unable to serialize message: ".concat(e));
        }
    };
    Message.prototype.decode = function (buffer, parser) {
        try {
            return deserialize(Buffer.from(buffer), parser);
        }
        catch (e) {
            throw new Error("Unable to deserialize message: ".concat(e));
        }
    };
    return Message;
}());
export { Message };
