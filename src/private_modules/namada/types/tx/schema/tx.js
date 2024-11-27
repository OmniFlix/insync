var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { field, option, vec } from "@dao-xyz/borsh";
import { WrapperTxMsgValue } from "./wrapperTx";
var SigningDataMsgValue = /** @class */ (function () {
    function SigningDataMsgValue(data) {
        Object.assign(this, data);
    }
    __decorate([
        field({ type: option("string") })
    ], SigningDataMsgValue.prototype, "owner", void 0);
    __decorate([
        field({ type: vec("string") })
    ], SigningDataMsgValue.prototype, "publicKeys", void 0);
    __decorate([
        field({ type: "u8" })
    ], SigningDataMsgValue.prototype, "threshold", void 0);
    __decorate([
        field({ type: option(vec("u8")) })
    ], SigningDataMsgValue.prototype, "accountPublicKeysMap", void 0);
    __decorate([
        field({ type: "string" })
    ], SigningDataMsgValue.prototype, "feePayer", void 0);
    return SigningDataMsgValue;
}());
export { SigningDataMsgValue };
var TxMsgValue = /** @class */ (function () {
    function TxMsgValue(data) {
        Object.assign(this, __assign(__assign({}, data), { args: new WrapperTxMsgValue(data.args), signingData: data.signingData.map(function (props) { return new SigningDataMsgValue(props); }) }));
    }
    __decorate([
        field({ type: WrapperTxMsgValue })
    ], TxMsgValue.prototype, "args", void 0);
    __decorate([
        field({ type: "string" })
    ], TxMsgValue.prototype, "hash", void 0);
    __decorate([
        field({ type: vec("u8") })
    ], TxMsgValue.prototype, "bytes", void 0);
    __decorate([
        field({ type: vec(SigningDataMsgValue) })
    ], TxMsgValue.prototype, "signingData", void 0);
    return TxMsgValue;
}());
export { TxMsgValue };
