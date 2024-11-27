import { Sdk as SdkWasm } from "../../shared/src";
import { TxProps } from "../../types/src";
type Signature = [string, string];
/**
 * Non-Tx signing functions
 */
export declare class Signing {
    protected readonly sdk: SdkWasm;
    /**
     * Signing constructor
     * @param sdk - Instance of Sdk struct from wasm lib
     */
    constructor(sdk: SdkWasm);
    /**
     * Sign Namada transaction
     * @param txProps - TxProps
     * @param signingKey - private key
     * @param [chainId] - optional chain ID, will enforce validation if present
     * @returns signed tx bytes - Promise resolving to Uint8Array
     */
    sign(txProps: TxProps, signingKey: string, chainId?: string): Promise<Uint8Array>;
    /**
     * Sign arbitrary data
     * @param signingKey - private key
     * @param data - data to sign
     * @returns hash and signature
     */
    signArbitrary(signingKey: string, data: string): Signature;
    /**
     * Verify arbitrary signature. Will throw an error if the signature is invalid
     * @param publicKey - public key to verify with
     * @param hash - signed hash
     * @param signature - Hex-encoded signature
     * @returns void
     */
    verifyArbitrary(publicKey: string, hash: string, signature: string): void;
}
export {};
