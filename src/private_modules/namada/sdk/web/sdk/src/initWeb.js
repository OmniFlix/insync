var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// We have to use relative improts here othewise ts-patch is getting confused and produces wrong paths after compialtion
import { init as initCrypto } from "../../crypto/src/init";
import { init as initShared } from "../../shared/src/init";
import { initThreadPool } from "../../shared/src/init-thread-pool";
/**
 * Initialize the SDK memory
 * @async
 * @returns
 
 - The SDK crypto memory
 */
export default function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // Load and initialize shared wasm
        const sharedWasm = yield fetch("shared.namada.wasm").then((wasm) => wasm.arrayBuffer());
        yield initShared(sharedWasm);
        // Load and initialize crypto wasm
        const cryptoWasm = yield fetch("crypto.namada.wasm").then((wasm) => wasm.arrayBuffer());
        const { memory: cryptoMemory } = yield initCrypto(cryptoWasm);
        return { cryptoMemory };
    });
}
/**
 * Initialize the SDK memory, with multicore support.
 * If you built wasm without multicore support, this will work as regular init.
 * @async
 * @returns - The SDK crypto memory
 */
export function initMulticore() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield init();
        yield initThreadPool(navigator.hardwareConcurrency);
        return res;
    });
}
//# sourceMappingURL=initWeb.js.map