var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { field, option, vec } from "@dao-xyz/borsh";
import { BigNumberSerializer } from "./utils";
/**
 * Transparent Transfer schemas
 */
export class TransparentTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    field({ type: "string" })
], TransparentTransferDataMsgValue.prototype, "source", void 0);
__decorate([
    field({ type: "string" })
], TransparentTransferDataMsgValue.prototype, "target", void 0);
__decorate([
    field({ type: "string" })
], TransparentTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    field(BigNumberSerializer)
], TransparentTransferDataMsgValue.prototype, "amount", void 0);
export class TransparentTransferMsgValue {
    constructor({ data }) {
        Object.assign(this, {
            data: data.map((transferProps) => new TransparentTransferDataMsgValue(transferProps)),
        });
    }
}
__decorate([
    field({ type: vec(TransparentTransferDataMsgValue) })
], TransparentTransferMsgValue.prototype, "data", void 0);
/**
 * Shielded Transfer schemas
 */
export class ShieldedTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    field({ type: "string" })
], ShieldedTransferDataMsgValue.prototype, "source", void 0);
__decorate([
    field({ type: "string" })
], ShieldedTransferDataMsgValue.prototype, "target", void 0);
__decorate([
    field({ type: "string" })
], ShieldedTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    field(BigNumberSerializer)
], ShieldedTransferDataMsgValue.prototype, "amount", void 0);
export class ShieldedTransferMsgValue {
    constructor({ data, gasSpendingKey }) {
        Object.assign(this, {
            data: data.map((shieldedTransferDataProps) => new ShieldedTransferDataMsgValue(shieldedTransferDataProps)),
            gasSpendingKey,
        });
    }
}
__decorate([
    field({ type: vec(ShieldedTransferDataMsgValue) })
], ShieldedTransferMsgValue.prototype, "data", void 0);
__decorate([
    field({ type: option(vec("string")) })
], ShieldedTransferMsgValue.prototype, "gasSpendingKey", void 0);
/**
 * Shielding Transfer schemas
 */
export class ShieldingTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    field({ type: "string" })
], ShieldingTransferDataMsgValue.prototype, "source", void 0);
__decorate([
    field({ type: "string" })
], ShieldingTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    field(BigNumberSerializer)
], ShieldingTransferDataMsgValue.prototype, "amount", void 0);
export class ShieldingTransferMsgValue {
    constructor({ data, target }) {
        Object.assign(this, {
            target,
            data: data.map((shieldingTransferDataProps) => new ShieldingTransferDataMsgValue(shieldingTransferDataProps)),
        });
    }
}
__decorate([
    field({ type: "string" })
], ShieldingTransferMsgValue.prototype, "target", void 0);
__decorate([
    field({ type: vec(ShieldingTransferDataMsgValue) })
], ShieldingTransferMsgValue.prototype, "data", void 0);
/**
 * Unshielding Transfer schemas
 */
export class UnshieldingTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    field({ type: "string" })
], UnshieldingTransferDataMsgValue.prototype, "target", void 0);
__decorate([
    field({ type: "string" })
], UnshieldingTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    field(BigNumberSerializer)
], UnshieldingTransferDataMsgValue.prototype, "amount", void 0);
export class UnshieldingTransferMsgValue {
    constructor({ source, data, gasSpendingKey }) {
        Object.assign(this, {
            source,
            data: data.map((unshieldingTransferDataProps) => new UnshieldingTransferDataMsgValue(unshieldingTransferDataProps)),
            gasSpendingKey,
        });
    }
}
__decorate([
    field({ type: "string" })
], UnshieldingTransferMsgValue.prototype, "source", void 0);
__decorate([
    field({ type: vec(UnshieldingTransferDataMsgValue) })
], UnshieldingTransferMsgValue.prototype, "data", void 0);
__decorate([
    field({ type: option(vec("string")) })
], UnshieldingTransferMsgValue.prototype, "gasSpendingKey", void 0);
/**
 * General Transfer schema used for displaying details
 */
export class TransferDataMsgValue {
}
__decorate([
    field({ type: "string" })
], TransferDataMsgValue.prototype, "owner", void 0);
__decorate([
    field({ type: "string" })
], TransferDataMsgValue.prototype, "token", void 0);
__decorate([
    field(BigNumberSerializer)
], TransferDataMsgValue.prototype, "amount", void 0);
export class TransferMsgValue {
}
__decorate([
    field({ type: vec(TransferDataMsgValue) })
], TransferMsgValue.prototype, "sources", void 0);
__decorate([
    field({ type: vec(TransferDataMsgValue) })
], TransferMsgValue.prototype, "targets", void 0);
__decorate([
    field({ type: option(vec("u8")) })
], TransferMsgValue.prototype, "shieldedSectionHash", void 0);
//# sourceMappingURL=transfer.js.map