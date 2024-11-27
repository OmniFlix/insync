export const PhraseSize: Readonly<{
    N12: 12;
    "12": "N12";
    N24: 24;
    "24": "N24";
}>;
export const ByteSize: Readonly<{
    N12: 12;
    "12": "N12";
    N24: 24;
    "24": "N24";
    N32: 32;
    "32": "N32";
}>;
export function __wbindgen_object_drop_ref(arg0: any): void;
export function __wbindgen_string_new(arg0: any, arg1: any): number;
export function __wbg_crypto_1d1f22824a6a080c(arg0: any): number;
export function __wbindgen_is_object(arg0: any): boolean;
export function __wbg_process_4a72847cc503995b(arg0: any): number;
export function __wbg_versions_f686565e586dd935(arg0: any): number;
export function __wbg_node_104a2ff8d6ea03a2(arg0: any): number;
export function __wbindgen_is_string(arg0: any): boolean;
export function __wbg_require_cca90b1a94a0255b(...args: any[]): any;
export function __wbindgen_is_function(arg0: any): boolean;
export function __wbg_msCrypto_eb05e62b530a1508(arg0: any): number;
export function __wbg_randomFillSync_5c9c955aa56b6049(...args: any[]): any;
export function __wbg_getRandomValues_3aa56aa6edec874c(...args: any[]): any;
export function __wbg_newnoargs_76313bd6ff35d0f2(arg0: any, arg1: any): number;
export function __wbg_call_1084a111329e68ce(...args: any[]): any;
export function __wbindgen_object_clone_ref(arg0: any): number;
export function __wbg_self_3093d5d1f7bcb682(...args: any[]): any;
export function __wbg_window_3bcfc4d31bc012f8(...args: any[]): any;
export function __wbg_globalThis_86b222e13bdf32ed(...args: any[]): any;
export function __wbg_global_e5a3fe56f8be9485(...args: any[]): any;
export function __wbindgen_is_undefined(arg0: any): boolean;
export function __wbg_call_89af060b4e1523f2(...args: any[]): any;
export function __wbg_buffer_b7b08af79b0b0974(arg0: any): number;
export function __wbg_newwithbyteoffsetandlength_8a2cb9ca96b27ec9(arg0: any, arg1: any, arg2: any): number;
export function __wbg_new_ea1883e1e5e86686(arg0: any): number;
export function __wbg_set_d1e79e2388520f18(arg0: any, arg1: any, arg2: any): void;
export function __wbg_length_8339fcf5d8ecd12e(arg0: any): any;
export function __wbg_newwithlength_ec548f448387c968(arg0: any): number;
export function __wbg_subarray_7c2e3576afe181d1(arg0: any, arg1: any, arg2: any): number;
export function __wbindgen_throw(arg0: any, arg1: any): never;
export function __wbindgen_memory(): number;
/**
*/
export class AES {
    /**
    * @param {VecU8Pointer} key
    * @param {Uint8Array} iv
    */
    constructor(key: VecU8Pointer, iv: Uint8Array);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @param {string} text
    * @returns {Uint8Array}
    */
    encrypt(text: string): Uint8Array;
    /**
    * @param {Uint8Array} ciphertext
    * @returns {VecU8Pointer}
    */
    decrypt(ciphertext: Uint8Array): VecU8Pointer;
}
/**
*/
export class Argon2 {
    /**
    * @param {string} password
    * @param {string | undefined} [salt]
    * @param {Argon2Params | undefined} [params]
    */
    constructor(password: string, salt?: string | undefined, params?: Argon2Params | undefined);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @returns {string}
    */
    to_hash(): string;
    /**
    * @param {string} hash
    */
    verify(hash: string): void;
    /**
    * @returns {Argon2Params}
    */
    params(): Argon2Params;
    /**
    * Convert PHC string to serialized key
    * @returns {VecU8Pointer}
    */
    key(): VecU8Pointer;
}
/**
*/
export class Argon2Params {
    static __wrap(ptr: any): any;
    /**
    * @param {number} m_cost
    * @param {number} t_cost
    * @param {number} p_cost
    */
    constructor(m_cost: number, t_cost: number, p_cost: number);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @returns {number}
    */
    get m_cost(): number;
    /**
    * @returns {number}
    */
    get t_cost(): number;
    /**
    * @returns {number}
    */
    get p_cost(): number;
}
/**
*/
export class DerivationResult {
    static __wrap(ptr: any): any;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
    * @returns {Uint8Array}
    */
    xsk(): Uint8Array;
    /**
    * @returns {Uint8Array}
    */
    xfvk(): Uint8Array;
    /**
    * @returns {Uint8Array}
    */
    payment_address(): Uint8Array;
}
/**
*/
export class HDWallet {
    static __wrap(ptr: any): any;
    /**
    * @param {Uint8Array} seed
    * @returns {HDWallet}
    */
    static from_seed(seed: Uint8Array): HDWallet;
    /**
    * @param {VecU8Pointer} seed_ptr
    */
    constructor(seed_ptr: VecU8Pointer);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * Derive account from a seed and a path
    * @param {Uint32Array} path
    * @returns {Key}
    */
    derive(path: Uint32Array): Key;
}
/**
*/
export class Key {
    static __wrap(ptr: any): any;
    /**
    * @param {Uint8Array} bytes
    */
    constructor(bytes: Uint8Array);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @returns {Uint8Array}
    */
    to_bytes(): Uint8Array;
    /**
    * @returns {StringPointer}
    */
    to_hex(): StringPointer;
}
/**
*/
export class Mnemonic {
    static __wrap(ptr: any): any;
    /**
    * @param {string} phrase
    * @returns {boolean}
    */
    static validate(phrase: string): boolean;
    /**
    * @param {string} phrase
    * @returns {Mnemonic}
    */
    static from_phrase(phrase: string): Mnemonic;
    /**
    * @param {PhraseSize} size
    */
    constructor(size: PhraseSize);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @param {StringPointer | undefined} [passphrase]
    * @returns {VecU8Pointer}
    */
    to_seed(passphrase?: StringPointer | undefined): VecU8Pointer;
    /**
    * @returns {VecStringPointer}
    */
    to_words(): VecStringPointer;
    /**
    * @returns {string}
    */
    phrase(): string;
}
/**
*/
export class Rng {
    /**
    * @param {ByteSize | undefined} [size]
    * @returns {Uint8Array}
    */
    static generate_bytes(size?: ByteSize | undefined): Uint8Array;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
}
/**
*/
export class Salt {
    static __wrap(ptr: any): any;
    /**
    * @returns {Salt}
    */
    static generate(): Salt;
    /**
    * @param {string} salt
    */
    constructor(salt: string);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @returns {Uint8Array}
    */
    to_bytes(): Uint8Array;
    /**
    * @returns {string}
    */
    as_string(): string;
}
/**
*/
export class ShieldedHDWallet {
    static __wrap(ptr: any): any;
    /**
    * @param {Uint8Array} sk_bytes
    * @returns {ShieldedHDWallet}
    */
    static new_from_sk(sk_bytes: Uint8Array): ShieldedHDWallet;
    /**
    * @param {any} seed
    * @param {Uint32Array} path
    */
    constructor(seed: any, path: Uint32Array);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @param {Uint32Array} path
    * @param {Uint8Array | undefined} [diversifier]
    * @returns {DerivationResult}
    */
    derive(path: Uint32Array, diversifier?: Uint8Array | undefined): DerivationResult;
}
/**
*/
export class StringPointer {
    static __wrap(ptr: any): any;
    /**
    * @param {string} string
    */
    constructor(string: string);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @param {number} arg0
    */
    set pointer(arg0: number);
    /**
    * @returns {number}
    */
    get pointer(): number;
    /**
    * @param {number} arg0
    */
    set length(arg0: number);
    /**
    * @returns {number}
    */
    get length(): number;
    /**
    * @returns {StringPointer}
    */
    clone(): StringPointer;
}
/**
*/
export class VecStringPointer {
    static __wrap(ptr: any): any;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
    * @returns {Uint32Array}
    */
    get pointers(): Uint32Array;
    /**
    * @returns {Uint32Array}
    */
    get lengths(): Uint32Array;
}
/**
*/
export class VecU8Pointer {
    static __wrap(ptr: any): any;
    /**
    * @param {Uint8Array} vec
    */
    constructor(vec: Uint8Array);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @param {number} arg0
    */
    set pointer(arg0: number);
    /**
    * @returns {number}
    */
    get pointer(): number;
    /**
    * @param {number} arg0
    */
    set length(arg0: number);
    /**
    * @returns {number}
    */
    get length(): number;
    /**
    * @returns {VecU8Pointer}
    */
    clone(): VecU8Pointer;
}
declare let wasm: any;
export { wasm as __wasm };
