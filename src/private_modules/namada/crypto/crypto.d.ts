/* tslint:disable */
/* eslint-disable */
/**
*/
export enum ByteSize {
  N12 = 12,
  N24 = 24,
  N32 = 32,
}
/**
*/
export enum PhraseSize {
  N12 = 12,
  N24 = 24,
}
/**
*/
export class AES {
  free(): void;
/**
* @param {VecU8Pointer} key
* @param {Uint8Array} iv
*/
  constructor(key: VecU8Pointer, iv: Uint8Array);
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
  free(): void;
/**
* @param {string} password
* @param {string | undefined} salt
* @param {Argon2Params | undefined} params
*/
  constructor(password: string, salt?: string, params?: Argon2Params);
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
  free(): void;
/**
* @param {number} m_cost
* @param {number} t_cost
* @param {number} p_cost
*/
  constructor(m_cost: number, t_cost: number, p_cost: number);
/**
*/
  readonly m_cost: number;
/**
*/
  readonly p_cost: number;
/**
*/
  readonly t_cost: number;
}
/**
*/
export class ExtFullViewingKey {
  free(): void;
}
/**
*/
export class ExtSpendingKey {
  free(): void;
}
/**
*/
export class ExtendedKeys {
  free(): void;
/**
* @returns {ExtSpendingKey}
*/
  xsk(): ExtSpendingKey;
/**
* @returns {ExtFullViewingKey}
*/
  xfvk(): ExtFullViewingKey;
}
/**
*/
export class HDWallet {
  free(): void;
/**
* @param {VecU8Pointer} seed_ptr
*/
  constructor(seed_ptr: VecU8Pointer);
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
  free(): void;
/**
* @param {Uint8Array} bytes
*/
  constructor(bytes: Uint8Array);
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
  free(): void;
/**
* @param {number} size
*/
  constructor(size: number);
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
* @param {StringPointer | undefined} passphrase
* @returns {VecU8Pointer}
*/
  to_seed(passphrase?: StringPointer): VecU8Pointer;
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
  free(): void;
/**
* @param {number | undefined} size
* @returns {Uint8Array}
*/
  static generate_bytes(size?: number): Uint8Array;
}
/**
*/
export class Salt {
  free(): void;
/**
* @param {string} salt
*/
  constructor(salt: string);
/**
* @returns {Salt}
*/
  static generate(): Salt;
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
export class Serialized {
  free(): void;
/**
* @returns {Uint8Array}
*/
  payment_address(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  xsk(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  xfvk(): Uint8Array;
}
/**
*/
export class ShieldedHDWallet {
  free(): void;
/**
* @param {VecU8Pointer} seed
*/
  constructor(seed: VecU8Pointer);
/**
* @param {number} index
* @returns {Serialized}
*/
  derive_to_serialized_keys(index: number): Serialized;
}
/**
*/
export class StringPointer {
  free(): void;
/**
* @param {string} string
*/
  constructor(string: string);
/**
* @returns {StringPointer}
*/
  clone(): StringPointer;
/**
*/
  length: number;
/**
*/
  pointer: number;
}
/**
*/
export class VecStringPointer {
  free(): void;
/**
*/
  readonly lengths: Uint32Array;
/**
*/
  readonly pointers: Uint32Array;
}
/**
*/
export class VecU8Pointer {
  free(): void;
/**
* @param {Uint8Array} vec
*/
  constructor(vec: Uint8Array);
/**
* @returns {VecU8Pointer}
*/
  clone(): VecU8Pointer;
/**
*/
  length: number;
/**
*/
  pointer: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly rng_generate_bytes: (a: number, b: number) => void;
  readonly __wbg_rng_free: (a: number) => void;
  readonly __wbg_salt_free: (a: number) => void;
  readonly salt_new: (a: number, b: number, c: number) => void;
  readonly salt_generate: () => number;
  readonly salt_to_bytes: (a: number, b: number) => void;
  readonly salt_as_string: (a: number, b: number) => void;
  readonly __wbg_extspendingkey_free: (a: number) => void;
  readonly __wbg_extfullviewingkey_free: (a: number) => void;
  readonly __wbg_extendedkeys_free: (a: number) => void;
  readonly extendedkeys_xsk: (a: number) => number;
  readonly extendedkeys_xfvk: (a: number) => number;
  readonly __wbg_serialized_free: (a: number) => void;
  readonly serialized_payment_address: (a: number, b: number) => void;
  readonly serialized_xsk: (a: number, b: number) => void;
  readonly serialized_xfvk: (a: number, b: number) => void;
  readonly shieldedhdwallet_new: (a: number, b: number) => void;
  readonly shieldedhdwallet_derive_to_serialized_keys: (a: number, b: number, c: number) => void;
  readonly __wbg_shieldedhdwallet_free: (a: number) => void;
  readonly __wbg_vecu8pointer_free: (a: number) => void;
  readonly vecu8pointer_clone: (a: number) => number;
  readonly __wbg_stringpointer_free: (a: number) => void;
  readonly __wbg_get_stringpointer_pointer: (a: number) => number;
  readonly __wbg_set_stringpointer_pointer: (a: number, b: number) => void;
  readonly __wbg_get_stringpointer_length: (a: number) => number;
  readonly __wbg_set_stringpointer_length: (a: number, b: number) => void;
  readonly stringpointer_new: (a: number, b: number) => number;
  readonly stringpointer_clone: (a: number) => number;
  readonly __wbg_vecstringpointer_free: (a: number) => void;
  readonly vecstringpointer_pointers: (a: number, b: number) => void;
  readonly vecstringpointer_lengths: (a: number, b: number) => void;
  readonly __wbg_set_vecu8pointer_length: (a: number, b: number) => void;
  readonly __wbg_get_vecu8pointer_pointer: (a: number) => number;
  readonly __wbg_get_vecu8pointer_length: (a: number) => number;
  readonly __wbg_set_vecu8pointer_pointer: (a: number, b: number) => void;
  readonly vecu8pointer_new: (a: number, b: number) => number;
  readonly __wbg_argon2params_free: (a: number) => void;
  readonly argon2params_new: (a: number, b: number, c: number) => number;
  readonly argon2params_m_cost: (a: number) => number;
  readonly argon2params_t_cost: (a: number) => number;
  readonly argon2params_p_cost: (a: number) => number;
  readonly __wbg_argon2_free: (a: number) => void;
  readonly argon2_new: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly argon2_to_hash: (a: number, b: number) => void;
  readonly argon2_verify: (a: number, b: number, c: number, d: number) => void;
  readonly argon2_params: (a: number) => number;
  readonly argon2_key: (a: number, b: number) => void;
  readonly __wbg_key_free: (a: number) => void;
  readonly key_new: (a: number, b: number, c: number) => void;
  readonly key_to_bytes: (a: number, b: number) => void;
  readonly key_to_hex: (a: number) => number;
  readonly __wbg_hdwallet_free: (a: number) => void;
  readonly hdwallet_new: (a: number, b: number) => void;
  readonly hdwallet_derive: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_mnemonic_free: (a: number) => void;
  readonly mnemonic_new: (a: number) => number;
  readonly mnemonic_validate: (a: number, b: number) => number;
  readonly mnemonic_from_phrase: (a: number, b: number, c: number) => void;
  readonly mnemonic_to_seed: (a: number, b: number, c: number) => void;
  readonly mnemonic_to_words: (a: number, b: number) => void;
  readonly mnemonic_phrase: (a: number, b: number) => void;
  readonly __wbg_aes_free: (a: number) => void;
  readonly aes_new: (a: number, b: number, c: number, d: number) => void;
  readonly aes_encrypt: (a: number, b: number, c: number, d: number) => void;
  readonly aes_decrypt: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path: InitInput | Promise<InitInput>): Promise<InitOutput>;
