"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proposals = exports.Proposal = exports.Query = void 0;
const borsh_schemas_1 = require("./borsh-schemas");
Object.defineProperty(exports, "Proposal", { enumerable: true, get: function () { return borsh_schemas_1.Proposal; } });
Object.defineProperty(exports, "Proposals", { enumerable: true, get: function () { return borsh_schemas_1.Proposals; } });
const shared_1 = require("./shared/shared");
__exportStar(require("./shared/shared"), exports);
__exportStar(require("./types"), exports);
const DEFAULT_TIMEOUT = 60000;
const DEFAULT_OPTS = {
    timeout: DEFAULT_TIMEOUT,
    error: (timeout) => `Promise timed out after ${timeout} ms.`,
};
/**
 *  promiseWithTimeout - calls an async function with specified timeout
 */
const promiseWithTimeout = (fn, opts) => (...args) => {
    const { timeout, error } = Object.assign(Object.assign({}, DEFAULT_OPTS), opts);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const t = setTimeout(() => {
            reject(error(timeout));
        }, timeout);
        const res = yield fn(...args);
        clearTimeout(t);
        resolve(res);
    }));
};
//Fallbacks for rust panics
class Query extends shared_1.Query {
    constructor() {
        super(...arguments);
        this.query_balance = super.query_balance.bind(this);
        this.query_epoch = promiseWithTimeout(super.query_epoch.bind(this));
        this.query_all_validator_addresses = promiseWithTimeout(super.query_all_validator_addresses.bind(this));
        this.query_my_validators = promiseWithTimeout(super.query_my_validators.bind(this));
        this.query_total_bonds = promiseWithTimeout(super.query_total_bonds.bind(this));
        this.delegators_votes = promiseWithTimeout(super.delegators_votes.bind(this));
        this.get_total_delegations = promiseWithTimeout(super.get_total_delegations.bind(this));
    }
}
exports.Query = Query;
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map