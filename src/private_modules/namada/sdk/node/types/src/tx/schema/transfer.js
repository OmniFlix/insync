"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferMsgValue = exports.TransferDataMsgValue = exports.UnshieldingTransferMsgValue = exports.UnshieldingTransferDataMsgValue = exports.ShieldingTransferMsgValue = exports.ShieldingTransferDataMsgValue = exports.ShieldedTransferMsgValue = exports.ShieldedTransferDataMsgValue = exports.TransparentTransferMsgValue = exports.TransparentTransferDataMsgValue = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const borsh_1 = require("@dao-xyz/borsh");
const utils_1 = require("./utils");
/**
 * Transparent Transfer schemas
 */
class TransparentTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.TransparentTransferDataMsgValue = TransparentTransferDataMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], TransparentTransferDataMsgValue.prototype, "source", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], TransparentTransferDataMsgValue.prototype, "target", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], TransparentTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], TransparentTransferDataMsgValue.prototype, "amount", void 0);
class TransparentTransferMsgValue {
    constructor({ data }) {
        Object.assign(this, {
            data: data.map((transferProps) => new TransparentTransferDataMsgValue(transferProps)),
        });
    }
}
exports.TransparentTransferMsgValue = TransparentTransferMsgValue;
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(TransparentTransferDataMsgValue) })
], TransparentTransferMsgValue.prototype, "data", void 0);
/**
 * Shielded Transfer schemas
 */
class ShieldedTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ShieldedTransferDataMsgValue = ShieldedTransferDataMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], ShieldedTransferDataMsgValue.prototype, "source", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], ShieldedTransferDataMsgValue.prototype, "target", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], ShieldedTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], ShieldedTransferDataMsgValue.prototype, "amount", void 0);
class ShieldedTransferMsgValue {
    constructor({ data, gasSpendingKey }) {
        Object.assign(this, {
            data: data.map((shieldedTransferDataProps) => new ShieldedTransferDataMsgValue(shieldedTransferDataProps)),
            gasSpendingKey,
        });
    }
}
exports.ShieldedTransferMsgValue = ShieldedTransferMsgValue;
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(ShieldedTransferDataMsgValue) })
], ShieldedTransferMsgValue.prototype, "data", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)((0, borsh_1.vec)("string")) })
], ShieldedTransferMsgValue.prototype, "gasSpendingKey", void 0);
/**
 * Shielding Transfer schemas
 */
class ShieldingTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ShieldingTransferDataMsgValue = ShieldingTransferDataMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], ShieldingTransferDataMsgValue.prototype, "source", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], ShieldingTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], ShieldingTransferDataMsgValue.prototype, "amount", void 0);
class ShieldingTransferMsgValue {
    constructor({ data, target }) {
        Object.assign(this, {
            target,
            data: data.map((shieldingTransferDataProps) => new ShieldingTransferDataMsgValue(shieldingTransferDataProps)),
        });
    }
}
exports.ShieldingTransferMsgValue = ShieldingTransferMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], ShieldingTransferMsgValue.prototype, "target", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(ShieldingTransferDataMsgValue) })
], ShieldingTransferMsgValue.prototype, "data", void 0);
/**
 * Unshielding Transfer schemas
 */
class UnshieldingTransferDataMsgValue {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.UnshieldingTransferDataMsgValue = UnshieldingTransferDataMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], UnshieldingTransferDataMsgValue.prototype, "target", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], UnshieldingTransferDataMsgValue.prototype, "token", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], UnshieldingTransferDataMsgValue.prototype, "amount", void 0);
class UnshieldingTransferMsgValue {
    constructor({ source, data, gasSpendingKey }) {
        Object.assign(this, {
            source,
            data: data.map((unshieldingTransferDataProps) => new UnshieldingTransferDataMsgValue(unshieldingTransferDataProps)),
            gasSpendingKey,
        });
    }
}
exports.UnshieldingTransferMsgValue = UnshieldingTransferMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], UnshieldingTransferMsgValue.prototype, "source", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(UnshieldingTransferDataMsgValue) })
], UnshieldingTransferMsgValue.prototype, "data", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)((0, borsh_1.vec)("string")) })
], UnshieldingTransferMsgValue.prototype, "gasSpendingKey", void 0);
/**
 * General Transfer schema used for displaying details
 */
class TransferDataMsgValue {
}
exports.TransferDataMsgValue = TransferDataMsgValue;
__decorate([
    (0, borsh_1.field)({ type: "string" })
], TransferDataMsgValue.prototype, "owner", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], TransferDataMsgValue.prototype, "token", void 0);
__decorate([
    (0, borsh_1.field)(utils_1.BigNumberSerializer)
], TransferDataMsgValue.prototype, "amount", void 0);
class TransferMsgValue {
}
exports.TransferMsgValue = TransferMsgValue;
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(TransferDataMsgValue) })
], TransferMsgValue.prototype, "sources", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(TransferDataMsgValue) })
], TransferMsgValue.prototype, "targets", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)((0, borsh_1.vec)("u8")) })
], TransferMsgValue.prototype, "shieldedSectionHash", void 0);
//# sourceMappingURL=transfer.js.map