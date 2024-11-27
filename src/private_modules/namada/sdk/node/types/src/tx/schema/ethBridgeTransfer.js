"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthBridgeTransferMsgValue = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const borsh_1 = require("@dao-xyz/borsh");
const utils_1 = require("./utils");
class EthBridgeTransferMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.EthBridgeTransferMsgValue = EthBridgeTransferMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "bool" })
], EthBridgeTransferMsgValue.prototype, "nut", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], EthBridgeTransferMsgValue.prototype, "asset", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], EthBridgeTransferMsgValue.prototype, "recipient", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], EthBridgeTransferMsgValue.prototype, "sender", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], EthBridgeTransferMsgValue.prototype, "amount", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], EthBridgeTransferMsgValue.prototype, "feeAmount", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)("string") })
], EthBridgeTransferMsgValue.prototype, "feePayer", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], EthBridgeTransferMsgValue.prototype, "feeToken", void 0);
//# sourceMappingURL=ethBridgeTransfer.js.map