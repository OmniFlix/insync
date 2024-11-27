var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { field, option, vec } from "@dao-xyz/borsh";
import { WrapperTxMsgValue } from "./wrapperTx";
var CommitmentMsgValue = /** @class */ (function () {
    function CommitmentMsgValue() {
    }
    __decorate([
        field({ type: "u8" })
    ], CommitmentMsgValue.prototype, "txType", void 0);
    __decorate([
        field({ type: "string" })
    ], CommitmentMsgValue.prototype, "hash", void 0);
    __decorate([
        field({ type: "string" })
    ], CommitmentMsgValue.prototype, "txCodeId", void 0);
    __decorate([
        field({ type: option("string") })
    ], CommitmentMsgValue.prototype, "memo", void 0);
    __decorate([
        field({ type: vec("u8") })
    ], CommitmentMsgValue.prototype, "data", void 0);
    return CommitmentMsgValue;
}());
export { CommitmentMsgValue };
var TxDetailsMsgValue = /** @class */ (function () {
    function TxDetailsMsgValue() {
    }
    __decorate([
        field({ type: WrapperTxMsgValue })
    ], TxDetailsMsgValue.prototype, "wrapperTx", void 0);
    __decorate([
        field({ type: vec(CommitmentMsgValue) })
    ], TxDetailsMsgValue.prototype, "commitments", void 0);
    return TxDetailsMsgValue;
}());
export { TxDetailsMsgValue };
