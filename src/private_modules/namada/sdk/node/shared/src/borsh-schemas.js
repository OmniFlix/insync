"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proposals = exports.Proposal = exports.BigNumberSerializer = void 0;
const borsh_1 = require("@dao-xyz/borsh");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.BigNumberSerializer = {
    serialize: (value, writer) => {
        writer.string(value.toString());
    },
    deserialize: (reader) => {
        const valueString = reader.string();
        return new bignumber_js_1.default(valueString);
    },
};
class Proposal {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Proposal = Proposal;
__decorate([
    (0, borsh_1.field)({ type: "u64" })
], Proposal.prototype, "id", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], Proposal.prototype, "content", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], Proposal.prototype, "author", void 0);
__decorate([
    (0, borsh_1.field)({ type: "u64" })
], Proposal.prototype, "startEpoch", void 0);
__decorate([
    (0, borsh_1.field)({ type: "u64" })
], Proposal.prototype, "endEpoch", void 0);
__decorate([
    (0, borsh_1.field)({ type: "u64" })
], Proposal.prototype, "graceEpoch", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], Proposal.prototype, "tallyType", void 0);
__decorate([
    (0, borsh_1.field)({ type: "string" })
], Proposal.prototype, "proposalType", void 0);
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.option)("string") })
], Proposal.prototype, "data", void 0);
class Proposals {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Proposals = Proposals;
__decorate([
    (0, borsh_1.field)({ type: (0, borsh_1.vec)(Proposal) })
], Proposals.prototype, "proposals", void 0);
//# sourceMappingURL=borsh-schemas.js.map