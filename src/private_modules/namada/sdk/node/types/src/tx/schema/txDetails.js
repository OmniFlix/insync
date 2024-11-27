"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxDetailsMsgValue = exports.CommitmentMsgValue = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const borsh_1 = require("@dao-xyz/borsh");
const wrapperTx_1 = require("./wrapperTx");
class CommitmentMsgValue {
}
exports.CommitmentMsgValue = CommitmentMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "u8" })
], CommitmentMsgValue.prototype, "txType", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], CommitmentMsgValue.prototype, "hash", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], CommitmentMsgValue.prototype, "txCodeId", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)("string") })
], CommitmentMsgValue.prototype, "memo", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)("u8") })
], CommitmentMsgValue.prototype, "data", void 0);
class TxDetailsMsgValue {
}
exports.TxDetailsMsgValue = TxDetailsMsgValue;
__decorate([
    (0, borsh_1.field)({ type: wrapperTx_1.WrapperTxMsgValue })
], TxDetailsMsgValue.prototype, "wrapperTx", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(CommitmentMsgValue) })
], TxDetailsMsgValue.prototype, "commitments", void 0);
//# sourceMappingURL=txDetails.js.map