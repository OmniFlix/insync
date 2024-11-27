"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapperTxMsgValue = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const borsh_1 = require("@dao-xyz/borsh");
const utils_1 = require("./utils");
class WrapperTxMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.WrapperTxMsgValue = WrapperTxMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], WrapperTxMsgValue.prototype, "token", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], WrapperTxMsgValue.prototype, "feeAmount", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], WrapperTxMsgValue.prototype, "gasLimit", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], WrapperTxMsgValue.prototype, "chainId", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)("string") })
], WrapperTxMsgValue.prototype, "publicKey", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)("string") })
], WrapperTxMsgValue.prototype, "memo", void 0);
//# sourceMappingURL=wrapperTx.js.map