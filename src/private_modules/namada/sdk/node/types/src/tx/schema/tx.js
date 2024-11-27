"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxMsgValue = exports.SigningDataMsgValue = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const borsh_1 = require("@dao-xyz/borsh");
const wrapperTx_1 = require("./wrapperTx");
class SigningDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.SigningDataMsgValue = SigningDataMsgValue;
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)("string") })
], SigningDataMsgValue.prototype, "owner", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)("string") })
], SigningDataMsgValue.prototype, "publicKeys", void 0);
__decorate([
    (0, borsh_1.field)({ type: "u8" })
], SigningDataMsgValue.prototype, "threshold", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)((0, borsh_1.vec)("u8")) })
], SigningDataMsgValue.prototype, "accountPublicKeysMap", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], SigningDataMsgValue.prototype, "feePayer", void 0);
class TxMsgValue {
    constructor(data) {
        Object.assign(this, Object.assign(Object.assign({}, data), { args: new wrapperTx_1.WrapperTxMsgValue(data.args), signingData: data.signingData.map((props) => new SigningDataMsgValue(props)) }));
    }
}
exports.TxMsgValue = TxMsgValue;
__decorate([
    (0, borsh_1.field)({ type: wrapperTx_1.WrapperTxMsgValue })
], TxMsgValue.prototype, "args", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], TxMsgValue.prototype, "hash", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)("u8") })
], TxMsgValue.prototype, "bytes", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(SigningDataMsgValue) })
], TxMsgValue.prototype, "signingData", void 0);
//# sourceMappingURL=tx.js.map