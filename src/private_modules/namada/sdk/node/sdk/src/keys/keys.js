"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKeyToBech32 = exports.Keys = void 0;
const chains_1 = require("../../../chains/src");
const crypto_1 = require("../../../crypto/src");
const shared_1 = require("../../../shared/src");
const utils_1 = require("../utils");
const DEFAULT_BIP44_PATH = {
    account: 0,
    change: 0,
    index: 0,
};
const DEFAULT_ZIP32_PATH = {
    account: 0,
};
/**
 * Namespace for key related functions
 */
class Keys {
    /**
     * @param cryptoMemory - Memory accessor for crypto lib
     */
    constructor(cryptoMemory) {
        this.cryptoMemory = cryptoMemory;
    }
    /**
     * Get address and public key from private key
     * @param privateKey - Private key
     * @returns Address and public key
     */
    getAddress(privateKey) {
        const addr = new shared_1.Address(privateKey);
        const address = addr.implicit();
        const publicKey = addr.public();
        return {
            address,
            publicKey,
        };
    }
    /**
     * Get transparent keys and address from private key
     * @param privateKey - Private key
     * @returns Keys and address
     */
    fromPrivateKey(privateKey) {
        return Object.assign(Object.assign({}, this.getAddress(privateKey)), { privateKey });
    }
    /**
     * Derive transparent keys and address from a mnemonic and path
     * @param phrase - Mnemonic phrase
     * @param [path] - Bip44 path object
     * @param [passphrase] - Bip39 passphrase
     * @returns Keys and address
     */
    deriveFromMnemonic(phrase, path = DEFAULT_BIP44_PATH, passphrase) {
        const mnemonic = crypto_1.Mnemonic.from_phrase(phrase);
        const passphrasePtr = typeof passphrase === "string" ?
            new crypto_1.StringPointer(passphrase)
            : undefined;
        const seedPtr = mnemonic.to_seed(passphrasePtr);
        const hdWallet = new crypto_1.HDWallet(seedPtr);
        const bip44Path = (0, utils_1.makeBip44PathArray)(chains_1.chains.namada.bip44.coinType, path);
        const key = hdWallet.derive(new Uint32Array(bip44Path));
        const privateKeyStringPtr = key.to_hex();
        const privateKey = (0, crypto_1.readStringPointer)(privateKeyStringPtr, this.cryptoMemory);
        // Clear wasm resources from memory
        mnemonic.free();
        hdWallet.free();
        key.free();
        privateKeyStringPtr.free();
        return Object.assign(Object.assign({}, this.getAddress(privateKey)), { privateKey });
    }
    /**
     * Derive transparent keys and address from a seed and path
     * @param seed - Seed
     * @param [path] - Bip44 path object
     * @returns Keys and address
     */
    deriveFromSeed(seed, path = DEFAULT_BIP44_PATH) {
        const hdWallet = crypto_1.HDWallet.from_seed(seed);
        const bip44Path = (0, utils_1.makeBip44PathArray)(chains_1.chains.namada.bip44.coinType, path);
        const key = hdWallet.derive(new Uint32Array(bip44Path));
        const privateKeyStringPtr = key.to_hex();
        const privateKey = (0, crypto_1.readStringPointer)(privateKeyStringPtr, this.cryptoMemory);
        // Clear wasm resources from memory
        hdWallet.free();
        key.free();
        privateKeyStringPtr.free();
        return Object.assign(Object.assign({}, this.getAddress(privateKey)), { privateKey });
    }
    /**
     * Derive shielded keys and address from a seed and path
     * @param seed - Seed
     * @param [bip44Path] - Bip44 path object to derive private key to seed the shielded keys
     * @param [zip32Path] - Zip32 path object to derive the shielded keys
     * @param [diversifier] - Diversifier bytes
     * @returns Shielded keys and address
     */
    deriveShieldedFromSeed(seed, bip44Path = DEFAULT_BIP44_PATH, zip32Path = DEFAULT_ZIP32_PATH, diversifier) {
        const shieldedHdWallet = new crypto_1.ShieldedHDWallet(seed, (0, utils_1.makeBip44PathArray)(chains_1.chains.namada.bip44.coinType, bip44Path));
        return this.deriveFromShieldedWallet(shieldedHdWallet, zip32Path, diversifier);
    }
    /**
     * Derive shielded keys and address from private key bytes
     * @param seed - Seed
     * @param [path] - Zip32 path object
     * @param [diversifier] - Diversifier bytes
     * @returns Shielded keys and address
     */
    deriveShieldedFromPrivateKey(privateKeyBytes, path = DEFAULT_ZIP32_PATH, diversifier) {
        const shieldedHdWallet = crypto_1.ShieldedHDWallet.new_from_sk(privateKeyBytes);
        return this.deriveFromShieldedWallet(shieldedHdWallet, path, diversifier);
    }
    deriveFromShieldedWallet(shieldedHdWallet, path, diversifier) {
        const { account, index } = path;
        const saplingPath = (0, utils_1.makeSaplingPathArray)(877, account, index);
        const derivedAccount = shieldedHdWallet.derive(saplingPath, diversifier);
        // Retrieve serialized types from wasm
        const xsk = derivedAccount.xsk();
        const xfvk = derivedAccount.xfvk();
        const paymentAddress = derivedAccount.payment_address();
        // Deserialize and encode keys and address
        const extendedSpendingKey = new shared_1.ExtendedSpendingKey(xsk);
        const extendedViewingKey = new shared_1.ExtendedViewingKey(xfvk);
        const address = new shared_1.PaymentAddress(paymentAddress).encode();
        const spendingKey = extendedSpendingKey.encode();
        const viewingKey = extendedViewingKey.encode();
        // Clear wasm resources from memory
        shieldedHdWallet.free();
        derivedAccount.free();
        extendedViewingKey.free();
        extendedSpendingKey.free();
        return {
            address,
            spendingKey,
            viewingKey,
        };
    }
}
exports.Keys = Keys;
//TODO: think where to put this function
const publicKeyToBech32 = (publicKey) => {
    return (0, shared_1.public_key_to_bech32)(publicKey);
};
exports.publicKeyToBech32 = publicKeyToBech32;
//# sourceMappingURL=keys.js.map