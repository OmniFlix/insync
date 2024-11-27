"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimRewardsMsgValue = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const borsh_1 = require("@dao-xyz/borsh");
class ClaimRewardsMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ClaimRewardsMsgValue = ClaimRewardsMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], ClaimRewardsMsgValue.prototype, "validator", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)("string") })
], ClaimRewardsMsgValue.prototype, "source", void 0);
//# sourceMappingURL=claimRewards.js.map