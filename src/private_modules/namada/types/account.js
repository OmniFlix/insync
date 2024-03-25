// Type of account for storage
export var AccountType;
(function (AccountType) {
    // A stored mnemonic phrase
    AccountType["Mnemonic"] = "mnemonic";
    // A stored private key
    AccountType["PrivateKey"] = "private-key";
    // Stored, stringified spending and viewing keys
    AccountType["ShieldedKeys"] = "shielded-keys";
    // Ledger account
    AccountType["Ledger"] = "ledger";
})(AccountType || (AccountType = {}));
