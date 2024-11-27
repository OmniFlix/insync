import Transport from "@ledgerhq/hw-transport";
import { NamadaApp, ResponseAppInfo, ResponseSign, ResponseVersion } from "@zondax/ledger-namada";
export type LedgerAddressAndPublicKey = {
    address: string;
    publicKey: string;
};
export type LedgerShieldedKeys = {
    viewingKey: {
        viewKey?: string;
        ivk?: string;
        ovk?: string;
    };
    proofGenerationKey: {
        ak?: string;
        nsk?: string;
    };
};
export type LedgerStatus = {
    version: ResponseVersion;
    info: ResponseAppInfo;
};
/**
 * Initialize USB transport
 * @async
 * @returns Transport object
 */
export declare const initLedgerUSBTransport: () => Promise<Transport>;
/**
 * Initialize HID transport
 * @async
 * @returns Transport object
 */
export declare const initLedgerHIDTransport: () => Promise<Transport>;
export declare const DEFAULT_LEDGER_BIP44_PATH: string;
/**
 * Functionality for interacting with NamadaApp for Ledger Hardware Wallets
 */
export declare class Ledger {
    readonly namadaApp: NamadaApp;
    /**
     * @param namadaApp - Inititalized NamadaApp class from Zondax package
     */
    private constructor();
    /**
     * Initialize and return Ledger class instance with initialized Transport
     * @async
     * @param [transport] Ledger transport
     * @returns Ledger class instance
     */
    static init(transport?: Transport): Promise<Ledger>;
    /**
     * Return status and version info of initialized NamadaApp.
     * Throw exception if app is not initialized.
     * @async
     * @returns Version and info of NamadaApp
     */
    status(): Promise<LedgerStatus>;
    /**
     * Get address and public key associated with optional path, otherwise, use default path
     * Throw exception if app is not initialized.
     * @async
     * @param [path] Bip44 path for deriving key
     * @returns Address and public key
     */
    getAddressAndPublicKey(path?: string): Promise<LedgerAddressAndPublicKey>;
    /**
     * Prompt user to get address and public key associated with optional path, otherwise, use default path.
     * Throw exception if app is not initialized.
     * @async
     * @param [path] Bip44 path for deriving key
     * @returns Address and public key
     */
    showAddressAndPublicKey(path?: string): Promise<LedgerAddressAndPublicKey>;
    /**
     * Prompt user to get viewing and proof gen key associated with optional path, otherwise, use default path.
     * Throw exception if app is not initialized.
     * @async
     * @param [path] Bip44 path for deriving key
     * @param [promptUser] boolean to determine whether to display on Ledger device and require approval
     * @returns ShieldedKeys
     */
    getShieldedKeys(path?: string, promptUser?: boolean): Promise<LedgerShieldedKeys>;
    /**
     * Sign tx bytes with the key associated with the provided (or default) path.
     * Throw exception if app is not initialized.
     * @async
     * @param tx - tx data blob to sign
     * @param [path] Bip44 path for signing account
     * @returns Response signature
     */
    sign(tx: Uint8Array, path?: string): Promise<ResponseSign>;
    /**
     * Sign a Masp tx with the shielded keys associated with the provided (or default) path.
     * Throw exception if app is not initialized.
     * @async
     * @param tx - masp tx data blob to sign
     * @param [path] Bip44 path for signing account
     * @returns Response signature
     */
    signMasp(tx: Uint8Array, path?: string): Promise<ResponseSign>;
    /**
     * Query status to determine if device has thrown an error.
     * Throw exception if app is not initialized.
     * @async
     * @returns Error message if error is found
     */
    queryErrors(): Promise<string>;
    /**
     * Close the initialized transport, which may be needed if Ledger needs to be reinitialized due to error state
     * Throw exception if app is not initialized.
     * @async
     * @returns void
     */
    closeTransport(): Promise<void>;
}
