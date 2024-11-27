/**
 * Initialize the SDK memory
 * @returns - The SDK crypto memory
 */
export default function init(): {
    cryptoMemory: WebAssembly.Memory;
};
/**
 * Initialize the SDK memory, with multicore support.
 * If you built wasm without multicore support, this will work as regular init.
 * @async
 * @returns - The SDK crypto memory
 */
export declare function initMulticore(): Promise<{
    cryptoMemory: WebAssembly.Memory;
}>;
