"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mnemonic = exports.PhraseSize = void 0;
const crypto_1 = require("../../crypto/src");
var crypto_2 = require("../../crypto/src");
Object.defineProperty(exports, "PhraseSize", { enumerable: true, get: function () { return crypto_2.PhraseSize; } });
/**
 * Class for accessing mnemonic functionality from wasm
 */
class Mnemonic {
    /**
     * @param cryptoMemory - Memory accessor for crypto lib
     */
    constructor(cryptoMemory) {
        this.cryptoMemory = cryptoMemory;
    }
    /**
     * Generate a new 12 or 24 word mnemonic
     * @param [size] Mnemonic length
     * @returns An array of words
     */
    generate(size = crypto_1.PhraseSize.N12) {
        const mnemonic = new crypto_1.Mnemonic(size);
        const vecStringPointer = mnemonic.to_words();
        const words = (0, crypto_1.readVecStringPointer)(vecStringPointer, this.cryptoMemory);
        mnemonic.free();
        vecStringPointer.free();
        return words;
    }
    /**
     * Convert mnemonic to seed bytes
     * @param phrase - Mnemonic phrase
     * @param [passphrase] Bip39 passphrase
     * @returns Seed bytes
     */
    toSeed(phrase, passphrase) {
        const mnemonic = crypto_1.Mnemonic.from_phrase(phrase);
        const passphrasePtr = typeof passphrase === "string" ?
            new crypto_1.StringPointer(passphrase)
            : undefined;
        const seedPtr = mnemonic.to_seed(passphrasePtr);
        return new Uint8Array((0, crypto_1.readVecU8Pointer)(seedPtr, this.cryptoMemory));
    }
    /**
     * Validate a mnemonic string, raise an exception providing reason
     * for failure if invalid, otherwise return nothing
     * @param phrase - Mnemonic phrase
     * @returns Object with validation result and error message if invalid
     */
    validateMnemonic(phrase) {
        const isValid = crypto_1.Mnemonic.validate(phrase);
        try {
            crypto_1.Mnemonic.from_phrase(phrase);
            return { isValid };
        }
        catch (e) {
            // Throw exception in order to provide reason to client
            return { isValid, error: `${e}` };
        }
    }
}
exports.Mnemonic = Mnemonic;
//# sourceMappingURL=mnemonic.js.map