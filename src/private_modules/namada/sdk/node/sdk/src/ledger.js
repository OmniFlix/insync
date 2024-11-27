"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ledger = exports.DEFAULT_LEDGER_BIP44_PATH = exports.initLedgerHIDTransport = exports.initLedgerUSBTransport = void 0;
const hw_transport_webhid_1 = __importDefault(require("@ledgerhq/hw-transport-webhid"));
const hw_transport_webusb_1 = __importDefault(require("@ledgerhq/hw-transport-webusb"));
const chains_1 = require("../../chains/src");
const ledger_namada_1 = require("@zondax/ledger-namada");
const utils_1 = require("./utils");
const { coinType } = chains_1.chains.namada.bip44;
/**
 * Initialize USB transport
 * @async
 * @returns Transport object
 */
const initLedgerUSBTransport = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield hw_transport_webusb_1.default.create();
});
exports.initLedgerUSBTransport = initLedgerUSBTransport;
/**
 * Initialize HID transport
 * @async
 * @returns Transport object
 */
const initLedgerHIDTransport = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield hw_transport_webhid_1.default.create();
});
exports.initLedgerHIDTransport = initLedgerHIDTransport;
exports.DEFAULT_LEDGER_BIP44_PATH = (0, utils_1.makeBip44Path)(coinType, {
    account: 0,
    change: 0,
    index: 0,
});
/**
 * Functionality for interacting with NamadaApp for Ledger Hardware Wallets
 */
class Ledger {
    /**
     * @param namadaApp - Inititalized NamadaApp class from Zondax package
     */
    constructor(namadaApp) {
        this.namadaApp = namadaApp;
    }
    /**
     * Initialize and return Ledger class instance with initialized Transport
     * @async
     * @param [transport] Ledger transport
     * @returns Ledger class instance
     */
    static init(transport) {
        return __awaiter(this, void 0, void 0, function* () {
            const initializedTransport = transport !== null && transport !== void 0 ? transport : (yield (0, exports.initLedgerUSBTransport)());
            try {
                const namadaApp = new ledger_namada_1.NamadaApp(initializedTransport);
                const ledger = new Ledger(namadaApp);
                return ledger;
            }
            catch (e) {
                throw new Error(`${e}`);
            }
        });
    }
    /**
     * Return status and version info of initialized NamadaApp.
     * Throw exception if app is not initialized.
     * @async
     * @returns Version and info of NamadaApp
     */
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield this.namadaApp.getVersion();
            const info = yield this.namadaApp.getAppInfo();
            return {
                version,
                info,
            };
        });
    }
    /**
     * Get address and public key associated with optional path, otherwise, use default path
     * Throw exception if app is not initialized.
     * @async
     * @param [path] Bip44 path for deriving key
     * @returns Address and public key
     */
    getAddressAndPublicKey() {
        return __awaiter(this, arguments, void 0, function* (path = exports.DEFAULT_LEDGER_BIP44_PATH) {
            const { address, pubkey } = yield this.namadaApp.getAddressAndPubKey(path);
            return {
                // Return address as bech32-encoded string
                address: address.toString(),
                // Return public key as bech32-encoded string
                publicKey: pubkey.toString(),
            };
        });
    }
    /**
     * Prompt user to get address and public key associated with optional path, otherwise, use default path.
     * Throw exception if app is not initialized.
     * @async
     * @param [path] Bip44 path for deriving key
     * @returns Address and public key
     */
    showAddressAndPublicKey() {
        return __awaiter(this, arguments, void 0, function* (path = exports.DEFAULT_LEDGER_BIP44_PATH) {
            try {
                const { address, pubkey } = yield this.namadaApp.showAddressAndPubKey(path);
                return {
                    // Return address as bech32-encoded string
                    address: address.toString(),
                    // Return public key as bech32-encoded string
                    publicKey: pubkey.toString(),
                };
            }
            catch (e) {
                throw new Error(`Connect Ledger rejected by user: ${e}`);
            }
        });
    }
    /**
     * Prompt user to get viewing and proof gen key associated with optional path, otherwise, use default path.
     * Throw exception if app is not initialized.
     * @async
     * @param [path] Bip44 path for deriving key
     * @param [promptUser] boolean to determine whether to display on Ledger device and require approval
     * @returns ShieldedKeys
     */
    getShieldedKeys() {
        return __awaiter(this, arguments, void 0, function* (path = exports.DEFAULT_LEDGER_BIP44_PATH, promptUser = true) {
            try {
                const { viewKey, ivk, ovk } = yield this.namadaApp.retrieveKeys(path, ledger_namada_1.NamadaKeys.ViewKey, promptUser);
                const { ak, nsk } = yield this.namadaApp.retrieveKeys(path, ledger_namada_1.NamadaKeys.ProofGenerationKey, promptUser);
                return {
                    viewingKey: {
                        viewKey: viewKey === null || viewKey === void 0 ? void 0 : viewKey.toString(),
                        ivk: ivk === null || ivk === void 0 ? void 0 : ivk.toString(),
                        ovk: ovk === null || ovk === void 0 ? void 0 : ovk.toString(),
                    },
                    proofGenerationKey: {
                        ak: ak === null || ak === void 0 ? void 0 : ak.toString(),
                        nsk: nsk === null || nsk === void 0 ? void 0 : nsk.toString(),
                    },
                };
            }
            catch (e) {
                throw new Error(`Could not retrieve Viewing Key`);
            }
        });
    }
    /**
     * Sign tx bytes with the key associated with the provided (or default) path.
     * Throw exception if app is not initialized.
     * @async
     * @param tx - tx data blob to sign
     * @param [path] Bip44 path for signing account
     * @returns Response signature
     */
    sign(tx_1) {
        return __awaiter(this, arguments, void 0, function* (tx, path = exports.DEFAULT_LEDGER_BIP44_PATH) {
            const buffer = Buffer.from(tx);
            return yield this.namadaApp.sign(path, buffer);
        });
    }
    /**
     * Sign a Masp tx with the shielded keys associated with the provided (or default) path.
     * Throw exception if app is not initialized.
     * @async
     * @param tx - masp tx data blob to sign
     * @param [path] Bip44 path for signing account
     * @returns Response signature
     */
    signMasp(tx_1) {
        return __awaiter(this, arguments, void 0, function* (tx, path = exports.DEFAULT_LEDGER_BIP44_PATH) {
            const buffer = Buffer.from(tx);
            return yield this.namadaApp.signMasp(path, buffer);
        });
    }
    /**
     * Query status to determine if device has thrown an error.
     * Throw exception if app is not initialized.
     * @async
     * @returns Error message if error is found
     */
    queryErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            const { info: { returnCode, errorMessage }, } = yield this.status();
            if (returnCode !== ledger_namada_1.LedgerError.NoErrors) {
                return errorMessage;
            }
            return "";
        });
    }
    /**
     * Close the initialized transport, which may be needed if Ledger needs to be reinitialized due to error state
     * Throw exception if app is not initialized.
     * @async
     * @returns void
     */
    closeTransport() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.namadaApp.transport.close();
        });
    }
}
exports.Ledger = Ledger;
//# sourceMappingURL=ledger.js.map