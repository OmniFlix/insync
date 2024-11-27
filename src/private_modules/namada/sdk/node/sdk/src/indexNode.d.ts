import { Sdk } from "./sdk";
export * from "./index";
export * from "./utils";
/**
 * Get the SDK instance
 * @async
 * @param cryptoMemory - WebAssembly.Memory of crypto package
 * @param url - URL of the node
 * @param storagePath - Path to store wallet files
 * @param [token] - Native token of the chain
 * @throws {Error} - Unable to Query native token
 * @returns - Sdk instance
 */
export declare function getSdk(cryptoMemory: WebAssembly.Memory, url: string, storagePath: string, token: string): Sdk;
/**
 * Query native token from the node
 * @async
 * @param rpc - URL of the node
 * @returns
 */
export declare function getNativeToken(rpc: string): Promise<string>;
