/**
*/
export const PhraseSize: Readonly<{
    N12: 12;
    "12": "N12";
    N24: 24;
    "24": "N24";
}>;
/**
*/
export const ByteSize: Readonly<{
    N12: 12;
    "12": "N12";
    N24: 24;
    "24": "N24";
    N32: 32;
    "32": "N32";
}>;
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
    constructor(size: Readonly<{
        N12: 12;
        "12": "N12";
        N24: 24;
        "24": "N24";
    }>);
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
    static generate_bytes(size?: Readonly<{
        N12: 12;
        "12": "N12";
        N24: 24;
        "24": "N24";
        N32: 32;
        "32": "N32";
    }> | undefined): Uint8Array;
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
export default __wbg_init;
export function initSync(module: any): any;
declare function __wbg_init(module_or_path: any): Promise<any>;
