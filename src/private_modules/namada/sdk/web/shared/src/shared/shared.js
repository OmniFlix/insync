var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { wasmFetch } from './snippets/shared-801e3fcea73932a3/src/rpc_client.js';
import { getMaspParams, hasMaspParams, fetchAndStoreMaspParams } from './snippets/shared-801e3fcea73932a3/src/sdk/mod.js';
let wasm;
const heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
function getObject(idx) { return heap[idx]; }
let heap_next = heap.length;
function dropObject(idx) {
    if (idx < 132)
        return;
    heap[idx] = heap_next;
    heap_next = idx;
}
function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available'); } });
if (typeof TextDecoder !== 'undefined') {
    cachedTextDecoder.decode();
}
;
let cachedUint8Memory0 = null;
function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function addHeapObject(obj) {
    if (heap_next === heap.length)
        heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
}
let WASM_VECTOR_LEN = 0;
const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available'); } });
const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });
function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F)
            break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
}
function isLikeNone(x) {
    return x === undefined || x === null;
}
let cachedInt32Memory0 = null;
function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        }
        else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        }
        else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for (let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    }
    else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        }
        catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(state => {
        wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
    });
function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        }
        finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            }
            else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_32(arg0, arg1, arg2) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hec070092d52367b0(retptr, arg0, arg1, addHeapObject(arg2));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
function __wbg_adapter_35(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h721b312e38e4c79c(arg0, arg1, addHeapObject(arg2));
}
function __wbg_adapter_38(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc028a27cb92cc501(arg0, arg1);
}
function handleError(f, args) {
    try {
        return f.apply(this, args);
    }
    catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* Helper function to bech32 encode a public key from bytes
* @param {Uint8Array} bytes
* @returns {string}
*/
export function public_key_to_bech32(bytes) {
    let deferred3_0;
    let deferred3_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.public_key_to_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr2 = r0;
        var len2 = r1;
        if (r3) {
            ptr2 = 0;
            len2 = 0;
            throw takeObject(r2);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}
let cachedUint32Memory0 = null;
function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}
function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
/**
* @param {number} _threads
* @returns {Promise<void>}
*/
export function initThreadPool(_threads) {
    const ret = wasm.initThreadPool(_threads);
    return takeObject(ret);
}
/**
* @param {Uint8Array} tx_bytes
* @returns {(string)[]}
*/
export function get_inner_tx_hashes(tx_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(tx_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.get_inner_tx_hashes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v2;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} tx_bytes
* @param {any} wasm_hashes
* @returns {Uint8Array}
*/
export function deserialize_tx(tx_bytes, wasm_hashes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(tx_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.deserialize_tx(retptr, ptr0, len0, addHeapObject(wasm_hashes));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v2;
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
function __wbg_adapter_253(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h1643b0ce57d5e216(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}
/**
*/
export const TxType = Object.freeze({ Bond: 1, "1": "Bond", Unbond: 2, "2": "Unbond", Withdraw: 3, "3": "Withdraw", Transfer: 4, "4": "Transfer", IBCTransfer: 5, "5": "IBCTransfer", EthBridgeTransfer: 6, "6": "EthBridgeTransfer", RevealPK: 7, "7": "RevealPK", VoteProposal: 8, "8": "VoteProposal", Redelegate: 9, "9": "Redelegate", Batch: 10, "10": "Batch", ClaimRewards: 11, "11": "ClaimRewards", });
const AddressFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_address_free(ptr >>> 0));
/**
*/
export class Address {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AddressFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr);
    }
    /**
    * Address helpers for wasm_bindgen
    * @param {string} secret
    */
    constructor(secret) {
        const ptr0 = passStringToWasm0(secret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.address_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * @returns {string}
    */
    implicit() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_implicit(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {string}
    */
    public() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_public(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {string}
    */
    hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_hash(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
const BatchTxResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_batchtxresult_free(ptr >>> 0));
/**
*/
export class BatchTxResult {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BatchTxResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_batchtxresult_free(ptr);
    }
}
const ExtendedSpendingKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_extendedspendingkey_free(ptr >>> 0));
/**
* Wrap ExtendedSpendingKey
*/
export class ExtendedSpendingKey {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ExtendedSpendingKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_extendedspendingkey_free(ptr);
    }
    /**
    * Instantiate ExtendedSpendingKey from serialized vector
    * @param {Uint8Array} key
    */
    constructor(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.extendedspendingkey_new(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Return ExtendedSpendingKey as Bech32-encoded String
    * @returns {string}
    */
    encode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.extendedspendingkey_encode(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
const ExtendedViewingKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_extendedviewingkey_free(ptr >>> 0));
/**
* Wrap ExtendedViewingKey
*/
export class ExtendedViewingKey {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ExtendedViewingKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_extendedviewingkey_free(ptr);
    }
    /**
    * Instantiate ExtendedViewingKey from serialized vector
    * @param {Uint8Array} key
    */
    constructor(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.extendedviewingkey_new(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Return ExtendedViewingKey as Bech32-encoded String
    * @returns {string}
    */
    encode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.extendedviewingkey_encode(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
const PaymentAddressFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_paymentaddress_free(ptr >>> 0));
/**
* Wrap PaymentAddress
*/
export class PaymentAddress {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PaymentAddressFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paymentaddress_free(ptr);
    }
    /**
    * Instantiate PaymentAddress from serialized vector
    * @param {Uint8Array} address
    */
    constructor(address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(address, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.paymentaddress_new(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Retrieve PaymentAddress hash
    * @returns {string}
    */
    hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paymentaddress_hash(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Return PaymentAddress as Bech32-encoded String
    * @returns {string}
    */
    encode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paymentaddress_encode(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
const QueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_query_free(ptr >>> 0));
/**
* Represents an API for querying the ledger
*/
export class Query {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_query_free(ptr);
    }
    /**
    * @param {string} url
    * @param {string | undefined} [masp_url]
    */
    constructor(url, masp_url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(masp_url) ? 0 : passStringToWasm0(masp_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.query_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * Gets current epoch
    *
    * # Errors
    *
    * Returns an error if the RPC call fails
    * @returns {Promise<bigint>}
    */
    query_epoch() {
        const ret = wasm.query_query_epoch(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Gets all active validator addresses
    *
    * # Errors
    *
    * Returns an error if the RPC call fails
    * @returns {Promise<any>}
    */
    query_all_validator_addresses() {
        const ret = wasm.query_query_all_validator_addresses(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * Gets total bonds by validator address
    *
    * # Errors
    *
    * Returns an error if the RPC call fails
    * @param {string} address
    * @returns {Promise<any>}
    */
    query_total_bonds(address) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_query_total_bonds(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Gets all delegations for every provided address.
    * Returns a tuple of:
    * (owner_address, validator_address, total_bonds, total_unbonds, withdrawable)
    *
    * # Arguments
    *
    * * `owner_addresses` - Account address in form of bech32, base64 encoded string
    *
    * # Errors
    *
    * Panics if address can't be deserialized
    * @param {any[]} owner_addresses
    * @returns {Promise<any>}
    */
    query_my_validators(owner_addresses) {
        const ptr0 = passArrayJsValueToWasm0(owner_addresses, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_query_my_validators(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {any[]} owner_addresses
    * @returns {Promise<any>}
    */
    query_staking_positions(owner_addresses) {
        const ptr0 = passArrayJsValueToWasm0(owner_addresses, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_query_staking_positions(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {any[]} owners
    * @returns {Promise<void>}
    */
    shielded_sync(owners) {
        const ptr0 = passArrayJsValueToWasm0(owners, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_shielded_sync(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} owner
    * @param {any[]} tokens
    * @returns {Promise<any>}
    */
    query_balance(owner, tokens) {
        const ptr0 = passStringToWasm0(owner, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(tokens, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.query_query_balance(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} address
    * @returns {Promise<any>}
    */
    query_public_key(address) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_query_public_key(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {any[]} owner_addresses
    * @returns {Promise<any>}
    */
    query_signed_bridge_pool(owner_addresses) {
        const ptr0 = passArrayJsValueToWasm0(owner_addresses, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_query_signed_bridge_pool(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {bigint} epoch
    * @returns {Promise<any>}
    */
    query_total_staked_tokens(epoch) {
        const ret = wasm.query_query_total_staked_tokens(this.__wbg_ptr, epoch);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<any>}
    */
    query_proposal_counter() {
        const ret = wasm.query_query_proposal_counter(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @param {bigint} id
    * @returns {Promise<Uint8Array>}
    */
    query_proposal_by_id(id) {
        const ret = wasm.query_query_proposal_by_id(this.__wbg_ptr, id);
        return takeObject(ret);
    }
    /**
    * @param {bigint} proposal_id
    * @param {bigint} epoch
    * @returns {Promise<any>}
    */
    query_proposal_votes(proposal_id, epoch) {
        const ret = wasm.query_query_proposal_votes(this.__wbg_ptr, proposal_id, epoch);
        return takeObject(ret);
    }
    /**
    * @param {bigint} proposal_id
    * @param {bigint} epoch
    * @returns {Promise<any>}
    */
    query_proposal_result(proposal_id, epoch) {
        const ret = wasm.query_query_proposal_result(this.__wbg_ptr, proposal_id, epoch);
        return takeObject(ret);
    }
    /**
    * @param {bigint} proposal_id
    * @returns {Promise<Uint8Array>}
    */
    query_proposal_code(proposal_id) {
        const ret = wasm.query_query_proposal_code(this.__wbg_ptr, proposal_id);
        return takeObject(ret);
    }
    /**
    * Returns a list of all delegations for given addresses and epoch
    *
    * # Arguments
    *
    * * `addresses` - delegators addresses
    * * `epoch` - epoch in which we want to query delegations
    * @param {any[]} addresses
    * @param {bigint | undefined} [epoch]
    * @returns {Promise<any>}
    */
    get_total_delegations(addresses, epoch) {
        const ptr0 = passArrayJsValueToWasm0(addresses, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_get_total_delegations(this.__wbg_ptr, ptr0, len0, !isLikeNone(epoch), isLikeNone(epoch) ? BigInt(0) : epoch);
        return takeObject(ret);
    }
    /**
    * Returns list of delegators that already voted on a proposal
    *
    * # Arguments
    *
    * * `proposal_id` - id of proposal to get delegators votes from
    * @param {bigint} proposal_id
    * @returns {Promise<any>}
    */
    delegators_votes(proposal_id) {
        const ret = wasm.query_delegators_votes(this.__wbg_ptr, proposal_id);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<any>}
    */
    query_gas_costs() {
        const ret = wasm.query_query_gas_costs(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<any>}
    */
    query_native_token() {
        const ret = wasm.query_query_native_token(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @returns {(string)[]}
    */
    static code_paths() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.query_code_paths(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Promise<any>}
    */
    query_wasm_hashes() {
        const ret = wasm.query_query_wasm_hashes(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @param {string} tx_code_path
    * @returns {Promise<string | undefined>}
    */
    query_wasm_hash(tx_code_path) {
        const ptr0 = passStringToWasm0(tx_code_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.query_query_wasm_hash(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
}
const SdkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_sdk_free(ptr >>> 0));
/**
* Represents the Sdk public API.
*/
export class Sdk {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SdkFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sdk_free(ptr);
    }
    /**
    * @param {string} url
    * @param {string} native_token
    * @param {string} path_or_db_name
    */
    constructor(url, native_token, path_or_db_name) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(native_token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(path_or_db_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_new(ptr0, len0, ptr1, len1, ptr2, len2);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * @returns {Promise<any>}
    */
    static has_masp_params() {
        const ret = wasm.sdk_has_masp_params();
        return takeObject(ret);
    }
    /**
    * @param {string | undefined} [url]
    * @returns {Promise<void>}
    */
    static fetch_and_store_masp_params(url) {
        var ptr0 = isLikeNone(url) ? 0 : passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_fetch_and_store_masp_params(ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {any} _db_name
    * @returns {Promise<void>}
    */
    load_masp_params(_db_name) {
        const ret = wasm.sdk_load_masp_params(this.__wbg_ptr, addHeapObject(_db_name));
        return takeObject(ret);
    }
    /**
    * @param {string} xsk
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_spending_key(xsk, alias) {
        const ptr0 = passStringToWasm0(xsk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(alias, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_add_spending_key(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} xvk
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_viewing_key(xvk, alias) {
        const ptr0 = passStringToWasm0(xvk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(alias, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_add_viewing_key(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} pa
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_payment_address(pa, alias) {
        const ptr0 = passStringToWasm0(pa, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(alias, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_add_payment_address(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} xvk
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_default_payment_address(xvk, alias) {
        const ptr0 = passStringToWasm0(xvk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(alias, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_add_default_payment_address(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} secret_key
    * @param {string} alias
    * @param {string | undefined} [password]
    * @returns {Promise<void>}
    */
    add_keypair(secret_key, alias, password) {
        const ptr0 = passStringToWasm0(secret_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(alias, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_add_keypair(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<void>}
    */
    save_wallet() {
        const ret = wasm.sdk_save_wallet(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<void>}
    */
    load_wallet() {
        const ret = wasm.sdk_load_wallet(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} tx
    * @param {string | undefined} [private_key]
    * @param {string | undefined} [chain_id]
    * @returns {Promise<any>}
    */
    sign_tx(tx, private_key, chain_id) {
        const ptr0 = passArray8ToWasm0(tx, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(private_key) ? 0 : passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(chain_id) ? 0 : passStringToWasm0(chain_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_sign_tx(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} tx_bytes
    * @param {Uint8Array} tx_msg
    * @returns {Promise<any>}
    */
    process_tx(tx_bytes, tx_msg) {
        const ptr0 = passArray8ToWasm0(tx_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_process_tx(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * Build a batch Tx from built transactions and return the bytes
    * @param {any} txs
    * @returns {any}
    */
    static build_batch(txs) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.sdk_build_batch(retptr, addHeapObject(txs));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} tx_bytes
    * @param {Uint8Array} sig_msg_bytes
    * @returns {any}
    */
    append_signature(tx_bytes, sig_msg_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(tx_bytes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(sig_msg_bytes, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.sdk_append_signature(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_transparent_transfer(transfer_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(transfer_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_transparent_transfer(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} shielded_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_shielded_transfer(shielded_transfer_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(shielded_transfer_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_shielded_transfer(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} unshielding_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_unshielding_transfer(unshielding_transfer_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(unshielding_transfer_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_unshielding_transfer(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} shielding_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_shielding_transfer(shielding_transfer_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(shielding_transfer_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_shielding_transfer(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} ibc_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_ibc_transfer(ibc_transfer_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(ibc_transfer_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_ibc_transfer(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} eth_bridge_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_eth_bridge_transfer(eth_bridge_transfer_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(eth_bridge_transfer_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_eth_bridge_transfer(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} vote_proposal_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_vote_proposal(vote_proposal_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(vote_proposal_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_vote_proposal(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} claim_rewards_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_claim_rewards(claim_rewards_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(claim_rewards_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_claim_rewards(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} bond_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_bond(bond_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(bond_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_bond(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} unbond_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_unbond(unbond_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(unbond_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_unbond(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} withdraw_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_withdraw(withdraw_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(withdraw_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_withdraw(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} redelegate_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_redelegate(redelegate_msg, wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(redelegate_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_redelegate(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_reveal_pk(wrapper_tx_msg) {
        const ptr0 = passArray8ToWasm0(wrapper_tx_msg, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_build_reveal_pk(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} signing_key
    * @param {string} data
    * @returns {any}
    */
    sign_arbitrary(signing_key, data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(signing_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.sdk_sign_arbitrary(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} public_key
    * @param {string} signed_hash
    * @param {string} signature
    */
    verify_arbitrary(public_key, signed_hash, signature) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(public_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(signed_hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(signature, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            wasm.sdk_verify_arbitrary(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} target
    * @param {string} token
    * @param {string} amount
    * @param {string} channel_id
    * @returns {Promise<any>}
    */
    generate_ibc_shielding_memo(target, token, amount, channel_id) {
        const ptr0 = passStringToWasm0(target, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(channel_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.sdk_generate_ibc_shielding_memo(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return takeObject(ret);
    }
    /**
    * @returns {string}
    */
    masp_address() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.sdk_masp_address(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
const TxResponseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_txresponse_free(ptr >>> 0));
/**
* Serializable response for process_tx calls
*/
export class TxResponse {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TxResponseFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txresponse_free(ptr);
    }
}
function __wbg_load(module, imports) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return yield WebAssembly.instantiateStreaming(module, imports);
                }
                catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                    }
                    else {
                        throw e;
                    }
                }
            }
            const bytes = yield module.arrayBuffer();
            return yield WebAssembly.instantiate(bytes, imports);
        }
        else {
            const instance = yield WebAssembly.instantiate(module, imports);
            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };
            }
            else {
                return instance;
            }
        }
    });
}
function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_error_new = function (arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_hasMaspParams_118d7216d8ceab38 = function () {
        return handleError(function () {
            const ret = hasMaspParams();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbindgen_boolean_get = function (arg0) {
        const v = getObject(arg0);
        const ret = typeof (v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbg_getMaspParams_db61915652297d14 = function () {
        return handleError(function () {
            const ret = getMaspParams();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbindgen_cb_drop = function (arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function (arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetchAndStoreMaspParams_4db58e4a95fdc955 = function () {
        return handleError(function (arg0, arg1) {
            let v0;
            if (arg0 !== 0) {
                v0 = getStringFromWasm0(arg0, arg1).slice();
                wasm.__wbindgen_free(arg0, arg1 * 1, 1);
            }
            const ret = fetchAndStoreMaspParams(v0);
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbindgen_string_get = function (arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof (obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_is_undefined = function (arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_wasmFetch_8bfe453b156a2250 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = wasmFetch(takeObject(arg0), takeObject(arg1), takeObject(arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbindgen_object_clone_ref = function (arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetch_bc7c8e27076a5c84 = function (arg0) {
        const ret = fetch(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_queueMicrotask_3cbae2ec6b6cd3d6 = function (arg0) {
        const ret = getObject(arg0).queueMicrotask;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function (arg0) {
        const ret = typeof (getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_481971b0d87f3dd4 = function (arg0) {
        queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_performance_1430613edb72ce03 = function (arg0) {
        const ret = getObject(arg0).performance;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_now_eab901b1d3b8a295 = function (arg0) {
        const ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__wbg_setTimeout_fba1b48a90e30862 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
            return ret;
        }, arguments);
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function (arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function (arg0) {
        const val = getObject(arg0);
        const ret = typeof (val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function (arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function (arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function (arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function (arg0) {
        const ret = typeof (getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function () {
        return handleError(function () {
            const ret = module.require;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function (arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function () {
        return handleError(function (arg0, arg1) {
            getObject(arg0).randomFillSync(takeObject(arg1));
        }, arguments);
    };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function () {
        return handleError(function (arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        }, arguments);
    };
    imports.wbg.__wbg_fetch_921fad6ef9e883dd = function (arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_8e3928cfb8a43e2b = function (arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_log_5bb5f88f245d7762 = function (arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_indexNames_fd89e01c0b29fe18 = function (arg0) {
        const ret = getObject(arg0).indexNames;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createIndex_d786564b37de8e73 = function () {
        return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = getObject(arg0).createIndex(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_delete_f60bba7d0ae59a4f = function () {
        return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).delete(getObject(arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_deleteIndex_cbeab45ca61aff12 = function () {
        return handleError(function (arg0, arg1, arg2) {
            getObject(arg0).deleteIndex(getStringFromWasm0(arg1, arg2));
        }, arguments);
    };
    imports.wbg.__wbg_get_5361b64cac0d0826 = function () {
        return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).get(getObject(arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_put_0a0d7ca0f7fa8f83 = function () {
        return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).put(getObject(arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_put_22792e17580ca18b = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).put(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_objectStoreNames_588b5924274239fd = function (arg0) {
        const ret = getObject(arg0).objectStoreNames;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createObjectStore_f494613cd1a00d43 = function () {
        return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = getObject(arg0).createObjectStore(getStringFromWasm0(arg1, arg2), getObject(arg3));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_deleteObjectStore_1732efdd0f8a351d = function () {
        return handleError(function (arg0, arg1, arg2) {
            getObject(arg0).deleteObjectStore(getStringFromWasm0(arg1, arg2));
        }, arguments);
    };
    imports.wbg.__wbg_transaction_b39e2665b40b6324 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).transaction(getObject(arg1), takeObject(arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_result_6cedf5f78600a79c = function () {
        return handleError(function (arg0) {
            const ret = getObject(arg0).result;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_error_685b20024dc2d6ca = function () {
        return handleError(function (arg0) {
            const ret = getObject(arg0).error;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_transaction_9c6c3c7e1f9283c7 = function (arg0) {
        const ret = getObject(arg0).transaction;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_setonsuccess_632ce0a1460455c2 = function (arg0, arg1) {
        getObject(arg0).onsuccess = getObject(arg1);
    };
    imports.wbg.__wbg_setonerror_8479b33e7568a904 = function (arg0, arg1) {
        getObject(arg0).onerror = getObject(arg1);
    };
    imports.wbg.__wbg_instanceof_Response_849eb93e75734b6e = function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Response;
        }
        catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_url_5f6dc4009ac5f99d = function (arg0, arg1) {
        const ret = getObject(arg1).url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_status_61a01141acd3cf74 = function (arg0) {
        const ret = getObject(arg0).status;
        return ret;
    };
    imports.wbg.__wbg_headers_9620bfada380764a = function (arg0) {
        const ret = getObject(arg0).headers;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_arrayBuffer_29931d52c7206b02 = function () {
        return handleError(function (arg0) {
            const ret = getObject(arg0).arrayBuffer();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_json_1d5f113e916d8675 = function () {
        return handleError(function (arg0) {
            const ret = getObject(arg0).json();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_new_ab6fd82b10560829 = function () {
        return handleError(function () {
            const ret = new Headers();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_append_7bfcb4937d1d5e29 = function () {
        return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments);
    };
    imports.wbg.__wbg_target_2fc177e386c8b7b0 = function (arg0) {
        const ret = getObject(arg0).target;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_setonupgradeneeded_ad7645373c7d5e1b = function (arg0, arg1) {
        getObject(arg0).onupgradeneeded = getObject(arg1);
    };
    imports.wbg.__wbg_objectStore_da468793bd9df17b = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).objectStore(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_signal_a61f78a3478fd9bc = function (arg0) {
        const ret = getObject(arg0).signal;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_0d76b0581eca6298 = function () {
        return handleError(function () {
            const ret = new AbortController();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_abort_2aa7521d5690750e = function (arg0) {
        getObject(arg0).abort();
    };
    imports.wbg.__wbg_length_9ae5daf9a690cba9 = function (arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_contains_c65b44400b549286 = function (arg0, arg1, arg2) {
        const ret = getObject(arg0).contains(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_get_910bbb94abdcf488 = function (arg0, arg1, arg2) {
        const ret = getObject(arg1)[arg2 >>> 0];
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_newwithstrandinit_3fd6fba4083ff2d0 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_instanceof_IdbFactory_c70f8c7294f93655 = function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof IDBFactory;
        }
        catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_open_f0d7259fd7e689ce = function () {
        return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = getObject(arg0).open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_open_a05198d687357536 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).open(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_new_16b304a2cfa7ff4a = function () {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_40fc327bfc8770e6 = function (arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_196c84450b364254 = function () {
        return handleError(function (arg0) {
            const ret = getObject(arg0).next();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_done_298b57d23c0fc80c = function (arg0) {
        const ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_value_d93c65011f51a456 = function (arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_iterator_2cee6dadfd956dfa = function () {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_e3c254076557e348 = function () {
        return handleError(function (arg0, arg1) {
            const ret = Reflect.get(getObject(arg0), getObject(arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function () {
        return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_new_72fb9a18b5ae2624 = function () {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function () {
        return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_window_c6fb939a7f436783 = function () {
        return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function () {
        return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_global_207b558942527489 = function () {
        return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_push_a5b05aedc7234f9f = function (arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_toString_ffe4c9ea3b3532e9 = function (arg0) {
        const ret = getObject(arg0).toString();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_getTime_2bc4375165f02d15 = function (arg0) {
        const ret = getObject(arg0).getTime();
        return ret;
    };
    imports.wbg.__wbg_new0_7d84e5b2cd9fdc73 = function () {
        const ret = new Date();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_81740750da40724f = function (arg0, arg1) {
        try {
            var state0 = { a: arg0, b: arg1 };
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_253(a, state0.b, arg0, arg1);
                }
                finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        }
        finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_b0083a7967828ec8 = function (arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_0c86a60e8fcfe9f6 = function (arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_a73caa9a87991566 = function (arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function (arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function (arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function (arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function (arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_c20a40f15020d68a = function (arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function (arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function (arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_has_0af94d20077affa2 = function () {
        return handleError(function (arg0, arg1) {
            const ret = Reflect.has(getObject(arg0), getObject(arg1));
            return ret;
        }, arguments);
    };
    imports.wbg.__wbg_set_1f9b04f170055d33 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments);
    };
    imports.wbg.__wbg_parse_66d1801634e099ac = function () {
        return handleError(function (arg0, arg1) {
            const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_stringify_8887fe74e1c50d81 = function () {
        return handleError(function (arg0) {
            const ret = JSON.stringify(getObject(arg0));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function (arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function () {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper3461 = function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 999, __wbg_adapter_32);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper5792 = function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1806, __wbg_adapter_35);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper7155 = function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2316, __wbg_adapter_38);
        return addHeapObject(ret);
    };
    return imports;
}
function __wbg_init_memory(imports, maybe_memory) {
}
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;
    return wasm;
}
function initSync(module) {
    if (wasm !== undefined)
        return wasm;
    const imports = __wbg_get_imports();
    __wbg_init_memory(imports);
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}
function __wbg_init(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (wasm !== undefined)
            return wasm;
        const imports = __wbg_get_imports();
        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }
        __wbg_init_memory(imports);
        const { instance, module } = yield __wbg_load(yield input, imports);
        return __wbg_finalize_init(instance, module);
    });
}
export { initSync };
export default __wbg_init;
//# sourceMappingURL=shared.js.map