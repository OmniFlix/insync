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
import { Sdk } from "./index";
export * from "./index";
export * from "./utils";
/**
 * Get the SDK instance
 * @async
 * @param cryptoMemory - WebAssembly.Memory of crypto package
 * @param url - URL of the node
 * @param maspIndexerUrl - optional URL of the MASP indexer
 * @param dbName - Name of the database for the serialized wallet
 * @param [token] - Native token of the chain
 * @throws {Error} - Unable to Query native token
 * @returns - Sdk instance
 */
export function getSdk(cryptoMemory, url, maspIndexerUrl, dbName, token) {
    // We change empty string to undefined so it "maps" to the Option<String> in Rust
    const maspIndexerUrlOpt = maspIndexerUrl.length === 0 ? undefined : maspIndexerUrl;
    // Instantiate QueryWasm
    const query = new QueryWasm(url, maspIndexerUrlOpt);
    // Instantiate SdkWasm
    const sdk = new SdkWasm(url, token, dbName);
    return new Sdk(sdk, query, cryptoMemory, url, token);
}
/**
 * Query native token from the node
 * @async
 * @param rpc - URL of the node
 * @returns
 */
export function getNativeToken(rpc) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new QueryWasm(rpc).query_native_token();
    });
}
//# sourceMappingURL=indexWeb.js.map