var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { field, option } from "@dao-xyz/borsh";
import { BigNumberSerializer } from "./utils";
export var TxMsgValue = /** @class */ (function () {
    function TxMsgValue(data) {
        Object.assign(this, data);
    }
    __decorate([
        field({ type: "string" })
    ], TxMsgValue.prototype, "token", void 0);
    __decorate([
        field(BigNumberSerializer)
    ], TxMsgValue.prototype, "feeAmount", void 0);
    __decorate([
        field(BigNumberSerializer)
    ], TxMsgValue.prototype, "gasLimit", void 0);
    __decorate([
        field({ type: "string" })
    ], TxMsgValue.prototype, "chainId", void 0);
    __decorate([
        field({ type: option("string") })
    ], TxMsgValue.prototype, "publicKey", void 0);
    __decorate([
        field({ type: option("bool") })
    ], TxMsgValue.prototype, "disposableSigningKey", void 0);
    __decorate([
        field({ type: option("string") })
    ], TxMsgValue.prototype, "feeUnshield", void 0);
    __decorate([
        field({ type: option("string") })
    ], TxMsgValue.prototype, "memo", void 0);
    return TxMsgValue;
}());
