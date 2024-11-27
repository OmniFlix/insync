"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = void 0;
// Type of account for storage
var AccountType;
(function (AccountType) {
    // A stored mnemonic phrase
    AccountType["Mnemonic"] = "mnemonic";
    // A stored private key
    AccountType["PrivateKey"] = "private-key";
    // Stored, stringified spending and viewing keys
    AccountType["ShieldedKeys"] = "shielded-keys";
    // Ledger account
    AccountType["Ledger"] = "ledger";
})(AccountType || (exports.AccountType = AccountType = {}));
//# sourceMappingURL=account.js.map