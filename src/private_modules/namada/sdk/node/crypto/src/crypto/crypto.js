"use strict";
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);
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
let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}
function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function addHeapObject(obj) {
    if (heap_next === heap.length)
        heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
}
function isLikeNone(x) {
    return x === undefined || x === null;
}
let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}
function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
let WASM_VECTOR_LEN = 0;
let cachedTextEncoder = new TextEncoder('utf-8');
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
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();
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
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
}
let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}
function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
function handleError(f, args) {
    try {
        return f.apply(this, args);
    }
    catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
module.exports.PhraseSize = Object.freeze({ N12: 12, "12": "N12", N24: 24, "24": "N24", });
/**
*/
module.exports.ByteSize = Object.freeze({ N12: 12, "12": "N12", N24: 24, "24": "N24", N32: 32, "32": "N32", });
const AESFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_aes_free(ptr >>> 0, 1));
/**
*/
class AES {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AESFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_aes_free(ptr, 0);
    }
    /**
    * @param {VecU8Pointer} key
    * @param {Uint8Array} iv
    */
    constructor(key, iv) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key, VecU8Pointer);
            var ptr0 = key.__destroy_into_raw();
            const ptr1 = passArray8ToWasm0(iv, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.aes_new(retptr, ptr0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            AESFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} text
    * @returns {Uint8Array}
    */
    encrypt(text) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.aes_encrypt(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
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
    /**
    * @param {Uint8Array} ciphertext
    * @returns {VecU8Pointer}
    */
    decrypt(ciphertext) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.aes_decrypt(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return VecU8Pointer.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.AES = AES;
const Argon2Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_argon2_free(ptr >>> 0, 1));
/**
*/
class Argon2 {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Argon2Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_argon2_free(ptr, 0);
    }
    /**
    * @param {string} password
    * @param {string | undefined} [salt]
    * @param {Argon2Params | undefined} [params]
    */
    constructor(password, salt, params) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            var ptr1 = isLikeNone(salt) ? 0 : passStringToWasm0(salt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            let ptr2 = 0;
            if (!isLikeNone(params)) {
                _assertClass(params, Argon2Params);
                ptr2 = params.__destroy_into_raw();
            }
            wasm.argon2_new(retptr, ptr0, len0, ptr1, len1, ptr2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            Argon2Finalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    to_hash() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.argon2_to_hash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0;
                len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * @param {string} hash
    */
    verify(hash) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.argon2_verify(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Argon2Params}
    */
    params() {
        const ret = wasm.argon2_params(this.__wbg_ptr);
        return Argon2Params.__wrap(ret);
    }
    /**
    * Convert PHC string to serialized key
    * @returns {VecU8Pointer}
    */
    key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.argon2_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return VecU8Pointer.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Argon2 = Argon2;
const Argon2ParamsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_argon2params_free(ptr >>> 0, 1));
/**
*/
class Argon2Params {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Argon2Params.prototype);
        obj.__wbg_ptr = ptr;
        Argon2ParamsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Argon2ParamsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_argon2params_free(ptr, 0);
    }
    /**
    * @param {number} m_cost
    * @param {number} t_cost
    * @param {number} p_cost
    */
    constructor(m_cost, t_cost, p_cost) {
        const ret = wasm.argon2params_new(m_cost, t_cost, p_cost);
        this.__wbg_ptr = ret >>> 0;
        Argon2ParamsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * @returns {number}
    */
    get m_cost() {
        const ret = wasm.argon2params_m_cost(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get t_cost() {
        const ret = wasm.argon2params_t_cost(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get p_cost() {
        const ret = wasm.argon2params_p_cost(this.__wbg_ptr);
        return ret >>> 0;
    }
}
module.exports.Argon2Params = Argon2Params;
const DerivationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_derivationresult_free(ptr >>> 0, 1));
/**
*/
class DerivationResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DerivationResult.prototype);
        obj.__wbg_ptr = ptr;
        DerivationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DerivationResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_derivationresult_free(ptr, 0);
    }
    /**
    * @returns {Uint8Array}
    */
    xsk() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.derivationresult_xsk(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    xfvk() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.derivationresult_xfvk(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    payment_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.derivationresult_payment_address(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.DerivationResult = DerivationResult;
const HDWalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_hdwallet_free(ptr >>> 0, 1));
/**
*/
class HDWallet {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(HDWallet.prototype);
        obj.__wbg_ptr = ptr;
        HDWalletFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HDWalletFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hdwallet_free(ptr, 0);
    }
    /**
    * @param {VecU8Pointer} seed_ptr
    */
    constructor(seed_ptr) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(seed_ptr, VecU8Pointer);
            var ptr0 = seed_ptr.__destroy_into_raw();
            wasm.hdwallet_new(retptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            HDWalletFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} seed
    * @returns {HDWallet}
    */
    static from_seed(seed) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hdwallet_from_seed(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return HDWallet.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Derive account from a seed and a path
    * @param {Uint32Array} path
    * @returns {Key}
    */
    derive(path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray32ToWasm0(path, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hdwallet_derive(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Key.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.HDWallet = HDWallet;
const KeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_key_free(ptr >>> 0, 1));
/**
*/
class Key {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Key.prototype);
        obj.__wbg_ptr = ptr;
        KeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_key_free(ptr, 0);
    }
    /**
    * @param {Uint8Array} bytes
    */
    constructor(bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.key_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            KeyFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    to_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.key_to_bytes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {StringPointer}
    */
    to_hex() {
        const ret = wasm.key_to_hex(this.__wbg_ptr);
        return StringPointer.__wrap(ret);
    }
}
module.exports.Key = Key;
const MnemonicFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_mnemonic_free(ptr >>> 0, 1));
/**
*/
class Mnemonic {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Mnemonic.prototype);
        obj.__wbg_ptr = ptr;
        MnemonicFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MnemonicFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mnemonic_free(ptr, 0);
    }
    /**
    * @param {PhraseSize} size
    */
    constructor(size) {
        const ret = wasm.mnemonic_new(size);
        this.__wbg_ptr = ret >>> 0;
        MnemonicFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * @param {string} phrase
    * @returns {boolean}
    */
    static validate(phrase) {
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mnemonic_validate(ptr0, len0);
        return ret !== 0;
    }
    /**
    * @param {string} phrase
    * @returns {Mnemonic}
    */
    static from_phrase(phrase) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.mnemonic_from_phrase(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Mnemonic.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {StringPointer | undefined} [passphrase]
    * @returns {VecU8Pointer}
    */
    to_seed(passphrase) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            let ptr0 = 0;
            if (!isLikeNone(passphrase)) {
                _assertClass(passphrase, StringPointer);
                ptr0 = passphrase.__destroy_into_raw();
            }
            wasm.mnemonic_to_seed(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return VecU8Pointer.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {VecStringPointer}
    */
    to_words() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mnemonic_to_words(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return VecStringPointer.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    phrase() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mnemonic_phrase(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
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
module.exports.Mnemonic = Mnemonic;
const RngFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_rng_free(ptr >>> 0, 1));
/**
*/
class Rng {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RngFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rng_free(ptr, 0);
    }
    /**
    * @param {ByteSize | undefined} [size]
    * @returns {Uint8Array}
    */
    static generate_bytes(size) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.rng_generate_bytes(retptr, isLikeNone(size) ? 13 : size);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Rng = Rng;
const SaltFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_salt_free(ptr >>> 0, 1));
/**
*/
class Salt {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Salt.prototype);
        obj.__wbg_ptr = ptr;
        SaltFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SaltFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_salt_free(ptr, 0);
    }
    /**
    * @param {string} salt
    */
    constructor(salt) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(salt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.salt_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            SaltFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Salt}
    */
    static generate() {
        const ret = wasm.salt_generate();
        return Salt.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    to_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.salt_to_bytes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    as_string() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.salt_as_string(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
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
module.exports.Salt = Salt;
const ShieldedHDWalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_shieldedhdwallet_free(ptr >>> 0, 1));
/**
*/
class ShieldedHDWallet {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShieldedHDWallet.prototype);
        obj.__wbg_ptr = ptr;
        ShieldedHDWalletFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ShieldedHDWalletFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shieldedhdwallet_free(ptr, 0);
    }
    /**
    * @param {any} seed
    * @param {Uint32Array} path
    */
    constructor(seed, path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray32ToWasm0(path, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shieldedhdwallet_new(retptr, addHeapObject(seed), ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ShieldedHDWalletFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} sk_bytes
    * @returns {ShieldedHDWallet}
    */
    static new_from_sk(sk_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(sk_bytes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shieldedhdwallet_new_from_sk(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ShieldedHDWallet.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint32Array} path
    * @param {Uint8Array | undefined} [diversifier]
    * @returns {DerivationResult}
    */
    derive(path, diversifier) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray32ToWasm0(path, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            var ptr1 = isLikeNone(diversifier) ? 0 : passArray8ToWasm0(diversifier, wasm.__wbindgen_malloc);
            var len1 = WASM_VECTOR_LEN;
            wasm.shieldedhdwallet_derive(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return DerivationResult.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.ShieldedHDWallet = ShieldedHDWallet;
const StringPointerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_stringpointer_free(ptr >>> 0, 1));
/**
*/
class StringPointer {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StringPointer.prototype);
        obj.__wbg_ptr = ptr;
        StringPointerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StringPointerFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stringpointer_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get pointer() {
        const ret = wasm.__wbg_get_stringpointer_pointer(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set pointer(arg0) {
        wasm.__wbg_set_stringpointer_pointer(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get length() {
        const ret = wasm.__wbg_get_stringpointer_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set length(arg0) {
        wasm.__wbg_set_stringpointer_length(this.__wbg_ptr, arg0);
    }
    /**
    * @param {string} string
    */
    constructor(string) {
        const ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.stringpointer_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        StringPointerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * @returns {StringPointer}
    */
    clone() {
        const ret = wasm.stringpointer_clone(this.__wbg_ptr);
        return StringPointer.__wrap(ret);
    }
}
module.exports.StringPointer = StringPointer;
const VecStringPointerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_vecstringpointer_free(ptr >>> 0, 1));
/**
*/
class VecStringPointer {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VecStringPointer.prototype);
        obj.__wbg_ptr = ptr;
        VecStringPointerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VecStringPointerFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vecstringpointer_free(ptr, 0);
    }
    /**
    * @returns {Uint32Array}
    */
    get pointers() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vecstringpointer_pointers(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint32Array}
    */
    get lengths() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.vecstringpointer_lengths(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.VecStringPointer = VecStringPointer;
const VecU8PointerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_vecu8pointer_free(ptr >>> 0, 1));
/**
*/
class VecU8Pointer {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VecU8Pointer.prototype);
        obj.__wbg_ptr = ptr;
        VecU8PointerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VecU8PointerFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vecu8pointer_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get pointer() {
        const ret = wasm.__wbg_get_stringpointer_pointer(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set pointer(arg0) {
        wasm.__wbg_set_stringpointer_pointer(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get length() {
        const ret = wasm.__wbg_get_stringpointer_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set length(arg0) {
        wasm.__wbg_set_stringpointer_length(this.__wbg_ptr, arg0);
    }
    /**
    * @param {Uint8Array} vec
    */
    constructor(vec) {
        const ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.stringpointer_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        VecU8PointerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * @returns {VecU8Pointer}
    */
    clone() {
        const ret = wasm.vecu8pointer_clone(this.__wbg_ptr);
        return VecU8Pointer.__wrap(ret);
    }
}
module.exports.VecU8Pointer = VecU8Pointer;
module.exports.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0);
};
module.exports.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};
module.exports.__wbg_crypto_1d1f22824a6a080c = function (arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};
module.exports.__wbindgen_is_object = function (arg0) {
    const val = getObject(arg0);
    const ret = typeof (val) === 'object' && val !== null;
    return ret;
};
module.exports.__wbg_process_4a72847cc503995b = function (arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};
module.exports.__wbg_versions_f686565e586dd935 = function (arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};
module.exports.__wbg_node_104a2ff8d6ea03a2 = function (arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};
module.exports.__wbindgen_is_string = function (arg0) {
    const ret = typeof (getObject(arg0)) === 'string';
    return ret;
};
module.exports.__wbg_require_cca90b1a94a0255b = function () {
    return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments);
};
module.exports.__wbindgen_is_function = function (arg0) {
    const ret = typeof (getObject(arg0)) === 'function';
    return ret;
};
module.exports.__wbg_msCrypto_eb05e62b530a1508 = function (arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};
module.exports.__wbg_randomFillSync_5c9c955aa56b6049 = function () {
    return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments);
};
module.exports.__wbg_getRandomValues_3aa56aa6edec874c = function () {
    return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments);
};
module.exports.__wbg_newnoargs_76313bd6ff35d0f2 = function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};
module.exports.__wbg_call_1084a111329e68ce = function () {
    return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments);
};
module.exports.__wbindgen_object_clone_ref = function (arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};
module.exports.__wbg_self_3093d5d1f7bcb682 = function () {
    return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments);
};
module.exports.__wbg_window_3bcfc4d31bc012f8 = function () {
    return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments);
};
module.exports.__wbg_globalThis_86b222e13bdf32ed = function () {
    return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments);
};
module.exports.__wbg_global_e5a3fe56f8be9485 = function () {
    return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments);
};
module.exports.__wbindgen_is_undefined = function (arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};
module.exports.__wbg_call_89af060b4e1523f2 = function () {
    return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments);
};
module.exports.__wbg_buffer_b7b08af79b0b0974 = function (arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};
module.exports.__wbg_newwithbyteoffsetandlength_8a2cb9ca96b27ec9 = function (arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
module.exports.__wbg_new_ea1883e1e5e86686 = function (arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};
module.exports.__wbg_set_d1e79e2388520f18 = function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};
module.exports.__wbg_length_8339fcf5d8ecd12e = function (arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
module.exports.__wbg_newwithlength_ec548f448387c968 = function (arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};
module.exports.__wbg_subarray_7c2e3576afe181d1 = function (arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
module.exports.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
module.exports.__wbindgen_memory = function () {
    const ret = wasm.memory;
    return addHeapObject(ret);
};
const path = require('path').join(__dirname, 'crypto_bg.wasm');
const bytes = require('fs').readFileSync(path);
const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
//# sourceMappingURL=crypto.js.map