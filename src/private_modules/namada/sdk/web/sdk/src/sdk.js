var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Query as QueryWasm, Sdk as SdkWasm } from "../../shared/src";
import packageJson from "../package.json";
import { Crypto } from "./crypto";
import { Keys } from "./keys";
import { Ledger } from "./ledger";
import { Masp } from "./masp";
import { Mnemonic } from "./mnemonic";
import { Rpc } from "./rpc";
import { Signing } from "./signing";
import { Tx } from "./tx";
/**
 * API for interacting with Namada SDK
 */
export class Sdk {
    /**
     * @param sdk - Instance of Sdk struct from wasm lib
     * @param query - Instance of Query struct from wasm lib
     * @param cryptoMemory - Memory accessor for crypto lib
     * @param url - RPC url
     * @param nativeToken - Address of chain's native token
     */
    constructor(sdk, query, cryptoMemory, url, nativeToken) {
        this.sdk = sdk;
        this.query = query;
        this.cryptoMemory = cryptoMemory;
        this.url = url;
        this.nativeToken = nativeToken;
    }
    /**
     * Re-initialize wasm instances and return this instance
     * @param url - RPC url
     * @param [nativeToken] - Address of chain's native token
     * @returns this instance of Sdk
     */
    updateNetwork(url, nativeToken) {
        const query = new QueryWasm(url);
        this.query = query;
        // Update nativeToken as well if provided
        const sdk = new SdkWasm(url, nativeToken || this.nativeToken, "");
        this.sdk = sdk;
        return this;
    }
    /**
     * Return initialized Rpc class
     * @returns Namada RPC client
     */
    getRpc() {
        return new Rpc(this.sdk, this.query);
    }
    /**
     * Return initialized Tx class
     * @returns Tx-related functionality
     */
    getTx() {
        return new Tx(this.sdk);
    }
    /**
     * Return initialized Mnemonic class
     * @returns mnemonic-related functionality
     */
    getMnemonic() {
        return new Mnemonic(this.cryptoMemory);
    }
    /**
     * Return initialized Keys class
     * @returns key-related functionality
     */
    getKeys() {
        return new Keys(this.cryptoMemory);
    }
    /**
     * Return initialized Signing class
     * @returns Non-Tx signing functionality
     */
    getSigning() {
        return new Signing(this.sdk);
    }
    /**
     * Return initialized Masp class
     * @returns Masp utilities for handling params
     */
    getMasp() {
        return new Masp(this.sdk);
    }
    /**
     * Return initialized Crypto class
     * @returns Utilities for encrypting and decrypting data
     */
    getCrypto() {
        return new Crypto(this.cryptoMemory);
    }
    /**
     * Intialize Ledger class for use with NamadaApp
     * @async
     * @param [transport] - Will default to USB transport if not specified
     * @returns Class for interacting with NamadaApp for Ledger Hardware Wallets
     */
    initLedger(transport) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Ledger.init(transport);
        });
    }
    /**
     * Return SDK Package version
     */
    getVersion() {
        return packageJson.version;
    }
    /**
     * Define rpc getter to use with destructuring assignment
     * @returns rpc client
     */
    get rpc() {
        return this.getRpc();
    }
    /**
     * Define tx getter to use with destructuring assignment
     * @returns tx-related functionality
     */
    get tx() {
        return this.getTx();
    }
    /**
     * Define mnemonic getter to use with destructuring assignment
     * @returns mnemonic-related functionality
     */
    get mnemonic() {
        return this.getMnemonic();
    }
    /**
     * Define keys getter to use with destructuring assignment
     * @returns key-related functionality
     */
    get keys() {
        return this.getKeys();
    }
    /**
     * Define signing getter to use with destructuring assignment
     * @returns Non-Tx signing functionality
     */
    get signing() {
        return this.getSigning();
    }
    /**
     * Define signing getter to use with destructuring assignment
     * @returns Masp utilities for handling params
     */
    get masp() {
        return this.getMasp();
    }
    /**
     * Define crypto getter to use with destructuring assignment
     * @returns Utilities for encrypting and decrypting data
     */
    get crypto() {
        return this.getCrypto();
    }
    /**
     * Define version getter for use with destructuring assignment
     * @returns Version from package.json
     */
    get version() {
        return this.getVersion();
    }
}
//# sourceMappingURL=sdk.js.map