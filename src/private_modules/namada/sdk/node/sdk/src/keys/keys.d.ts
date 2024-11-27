import { Bip44Path, Zip32Path } from "../../../types/src";
import { Address, ShieldedKeys, TransparentKeys } from "./types";
/**
 * Namespace for key related functions
 */
export declare class Keys {
    protected readonly cryptoMemory: WebAssembly.Memory;
    /**
     * @param cryptoMemory - Memory accessor for crypto lib
     */
    constructor(cryptoMemory: WebAssembly.Memory);
    /**
     * Get address and public key from private key
     * @param privateKey - Private key
     * @returns Address and public key
     */
    getAddress(privateKey: string): Address;
    /**
     * Get transparent keys and address from private key
     * @param privateKey - Private key
     * @returns Keys and address
     */
    fromPrivateKey(privateKey: string): TransparentKeys;
    /**
     * Derive transparent keys and address from a mnemonic and path
     * @param phrase - Mnemonic phrase
     * @param [path] - Bip44 path object
     * @param [passphrase] - Bip39 passphrase
     * @returns Keys and address
     */
    deriveFromMnemonic(phrase: string, path?: Bip44Path, passphrase?: string): TransparentKeys;
    /**
     * Derive transparent keys and address from a seed and path
     * @param seed - Seed
     * @param [path] - Bip44 path object
     * @returns Keys and address
     */
    deriveFromSeed(seed: Uint8Array, path?: Bip44Path): TransparentKeys;
    /**
     * Derive shielded keys and address from a seed and path
     * @param seed - Seed
     * @param [bip44Path] - Bip44 path object to derive private key to seed the shielded keys
     * @param [zip32Path] - Zip32 path object to derive the shielded keys
     * @param [diversifier] - Diversifier bytes
     * @returns Shielded keys and address
     */
    deriveShieldedFromSeed(seed: Uint8Array, bip44Path?: Bip44Path, zip32Path?: Zip32Path, diversifier?: Uint8Array): ShieldedKeys;
    /**
     * Derive shielded keys and address from private key bytes
     * @param seed - Seed
     * @param [path] - Zip32 path object
     * @param [diversifier] - Diversifier bytes
     * @returns Shielded keys and address
     */
    deriveShieldedFromPrivateKey(privateKeyBytes: Uint8Array, path?: Zip32Path, diversifier?: Uint8Array): ShieldedKeys;
    private deriveFromShieldedWallet;
}
export declare const publicKeyToBech32: (publicKey: Uint8Array) => string;
