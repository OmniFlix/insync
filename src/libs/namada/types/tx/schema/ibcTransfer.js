var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { field, option } from "@dao-xyz/borsh";
import { BigNumberSerializer } from "./utils";
export var IbcTransferMsgValue = /** @class */ (function () {
    function IbcTransferMsgValue(data) {
        Object.assign(this, data);
        this.token = data.token.address;
    }
    __decorate([
        field({ type: "string" })
    ], IbcTransferMsgValue.prototype, "source", void 0);
    __decorate([
        field({ type: "string" })
    ], IbcTransferMsgValue.prototype, "receiver", void 0);
    __decorate([
        field({ type: "string" })
    ], IbcTransferMsgValue.prototype, "token", void 0);
    __decorate([
        field(BigNumberSerializer)
    ], IbcTransferMsgValue.prototype, "amount", void 0);
    __decorate([
        field({ type: "string" })
    ], IbcTransferMsgValue.prototype, "portId", void 0);
    __decorate([
        field({ type: "string" })
    ], IbcTransferMsgValue.prototype, "channelId", void 0);
    __decorate([
        field({ type: option("u64") })
    ], IbcTransferMsgValue.prototype, "timeoutHeight", void 0);
    __decorate([
        field({ type: option("u64") })
    ], IbcTransferMsgValue.prototype, "timeoutSecOffset", void 0);
    return IbcTransferMsgValue;
}());
