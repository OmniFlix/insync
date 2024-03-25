/* tslint:disable */
/* eslint-disable */
/**
* @param {number} _threads
* @returns {Promise<void>}
*/
export function initThreadPool(_threads: number): Promise<void>;
/**
* Helper function to bech32 encode a public key from bytes
* @param {Uint8Array} bytes
* @returns {string}
*/
export function public_key_to_bech32(bytes: Uint8Array): string;
/**
*/
export enum TxType {
  Bond = 1,
  Unbond = 2,
  Withdraw = 3,
  Transfer = 4,
  IBCTransfer = 5,
  EthBridgeTransfer = 6,
  RevealPK = 7,
  VoteProposal = 8,
}
/**
*/
export class Address {
  free(): void;
/**
* Address helpers for wasm_bindgen
* @param {string} secret
*/
  constructor(secret: string);
/**
* @returns {string}
*/
  implicit(): string;
/**
* @returns {string}
*/
  public(): string;
/**
* @returns {string}
*/
  hash(): string;
}
/**
*/
export class BuiltTx {
  free(): void;
/**
* @returns {Uint8Array}
*/
  tx_bytes(): Uint8Array;
}
/**
* Wrap masp::ExtendedSpendingKey
*/
export class ExtendedSpendingKey {
  free(): void;
/**
* Instantiate ExtendedSpendingKey from serialized vector
* @param {Uint8Array} key
*/
  constructor(key: Uint8Array);
/**
* Return ExtendedSpendingKey as Bech32-encoded String
* @returns {string}
*/
  encode(): string;
}
/**
* Wrap masp::ExtendedViewingKey
*/
export class ExtendedViewingKey {
  free(): void;
/**
* Instantiate ExtendedViewingKey from serialized vector
* @param {Uint8Array} key
*/
  constructor(key: Uint8Array);
/**
* Return ExtendedViewingKey as Bech32-encoded String
* @returns {string}
*/
  encode(): string;
}
/**
* Wrap masp::PaymentAddress
*/
export class PaymentAddress {
  free(): void;
/**
* Instantiate PaymentAddress from serialized vector
* @param {Uint8Array} address
*/
  constructor(address: Uint8Array);
/**
* Returns a pinned or non-pinned PaymentAddress
* @param {boolean} pin
* @returns {PaymentAddress}
*/
  pinned(pin: boolean): PaymentAddress;
/**
* Determine whether this PaymentAddress is pinned
* @returns {boolean}
*/
  is_pinned(): boolean;
/**
* Retrieve PaymentAddress hash
* @returns {string}
*/
  hash(): string;
/**
* Return PaymentAddress as Bech32-encoded String
* @returns {string}
*/
  encode(): string;
}
/**
* Represents an API for querying the ledger
*/
export class Query {
  free(): void;
/**
* @param {string} url
*/
  constructor(url: string);
/**
* Gets current epoch
*
* # Errors
*
* Returns an error if the RPC call fails
* @returns {Promise<any>}
*/
  query_epoch(): Promise<any>;
/**
* Gets all active validator addresses
*
* # Errors
*
* Returns an error if the RPC call fails
* @returns {Promise<any>}
*/
  query_all_validator_addresses(): Promise<any>;
/**
* Gets total bonds by validator address
*
* # Errors
*
* Returns an error if the RPC call fails
* @param {string} address
* @returns {Promise<any>}
*/
  query_total_bonds(address: string): Promise<any>;
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
  query_my_validators(owner_addresses: any[]): Promise<any>;
/**
* @param {any[]} owner_addresses
* @returns {Promise<any>}
*/
  query_staking_positions(owner_addresses: any[]): Promise<any>;
/**
* @param {any[]} owners
* @returns {Promise<void>}
*/
  shielded_sync(owners: any[]): Promise<void>;
/**
* @param {string} owner
* @param {any[]} tokens
* @returns {Promise<any>}
*/
  query_balance(owner: string, tokens: any[]): Promise<any>;
/**
* @param {string} address
* @returns {Promise<any>}
*/
  query_public_key(address: string): Promise<any>;
/**
* @param {any[]} owner_addresses
* @returns {Promise<any>}
*/
  query_signed_bridge_pool(owner_addresses: any[]): Promise<any>;
/**
* Returns a list of all proposals
* @returns {Promise<Uint8Array>}
*/
  query_proposals(): Promise<Uint8Array>;
/**
* Returns a list of all delegations for given addresses and epoch
*
* # Arguments
*
* * `addresses` - delegators addresses
* * `epoch` - epoch in which we want to query delegations
* @param {any[]} addresses
* @param {bigint | undefined} epoch
* @returns {Promise<any>}
*/
  get_total_delegations(addresses: any[], epoch?: bigint): Promise<any>;
/**
* Returns list of delegators that already voted on a proposal
*
* # Arguments
*
* * `proposal_id` - id of proposal to get delegators votes from
* @param {bigint} proposal_id
* @returns {Promise<any>}
*/
  delegators_votes(proposal_id: bigint): Promise<any>;
/**
* @returns {Promise<any>}
*/
  query_gas_costs(): Promise<any>;
/**
* @returns {Promise<any>}
*/
  query_native_token(): Promise<any>;
}
/**
* Represents the Sdk public API.
*/
export class Sdk {
  free(): void;
/**
* @param {string} url
* @param {string} native_token
*/
  constructor(url: string, native_token: string);
/**
* @returns {Promise<any>}
*/
  static has_masp_params(): Promise<any>;
/**
* @returns {Promise<void>}
*/
  static fetch_and_store_masp_params(): Promise<void>;
/**
* @returns {Promise<void>}
*/
  load_masp_params(): Promise<void>;
/**
* @param {string} xsk
* @param {string} alias
* @returns {Promise<void>}
*/
  add_spending_key(xsk: string, alias: string): Promise<void>;
/**
* @param {BuiltTx} built_tx
* @param {Uint8Array} tx_msg
* @param {string | undefined} private_key
* @returns {Promise<any>}
*/
  sign_tx(built_tx: BuiltTx, tx_msg: Uint8Array, private_key?: string): Promise<any>;
/**
* @param {Uint8Array} tx_bytes
* @param {Uint8Array} tx_msg
* @returns {Promise<void>}
*/
  process_tx(tx_bytes: Uint8Array, tx_msg: Uint8Array): Promise<void>;
/**
* Build transaction for specified type, return bytes to client
* @param {number} tx_type
* @param {Uint8Array} specific_msg
* @param {Uint8Array} tx_msg
* @param {string} gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_tx(tx_type: number, specific_msg: Uint8Array, tx_msg: Uint8Array, gas_payer: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} tx_bytes
* @param {Uint8Array} sig_msg_bytes
* @returns {any}
*/
  append_signature(tx_bytes: Uint8Array, sig_msg_bytes: Uint8Array): any;
/**
* @param {Uint8Array} transfer_msg
* @param {Uint8Array} tx_msg
* @param {string | undefined} xsk
* @param {string | undefined} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_transfer(transfer_msg: Uint8Array, tx_msg: Uint8Array, xsk?: string, _gas_payer?: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} ibc_transfer_msg
* @param {Uint8Array} tx_msg
* @param {string | undefined} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_ibc_transfer(ibc_transfer_msg: Uint8Array, tx_msg: Uint8Array, _gas_payer?: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} eth_bridge_transfer_msg
* @param {Uint8Array} tx_msg
* @param {string | undefined} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_eth_bridge_transfer(eth_bridge_transfer_msg: Uint8Array, tx_msg: Uint8Array, _gas_payer?: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} vote_proposal_msg
* @param {Uint8Array} tx_msg
* @param {string | undefined} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_vote_proposal(vote_proposal_msg: Uint8Array, tx_msg: Uint8Array, _gas_payer?: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} bond_msg
* @param {Uint8Array} tx_msg
* @param {string | undefined} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_bond(bond_msg: Uint8Array, tx_msg: Uint8Array, _gas_payer?: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} unbond_msg
* @param {Uint8Array} tx_msg
* @param {string | undefined} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_unbond(unbond_msg: Uint8Array, tx_msg: Uint8Array, _gas_payer?: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} withdraw_msg
* @param {Uint8Array} tx_msg
* @param {string | undefined} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_withdraw(withdraw_msg: Uint8Array, tx_msg: Uint8Array, _gas_payer?: string): Promise<BuiltTx>;
/**
* @param {Uint8Array} tx_msg
* @param {string} _gas_payer
* @returns {Promise<BuiltTx>}
*/
  build_reveal_pk(tx_msg: Uint8Array, _gas_payer: string): Promise<BuiltTx>;
/**
* @param {string} signing_key
* @param {Uint8Array} tx_msg
* @returns {Promise<void>}
*/
  reveal_pk(signing_key: string, tx_msg: Uint8Array): Promise<void>;
/**
* @param {string} signing_key
* @param {string} data
* @returns {any}
*/
  sign_arbitrary(signing_key: string, data: string): any;
/**
* @param {string} public_key
* @param {string} signed_hash
* @param {string} signature
* @returns {any}
*/
  verify_arbitrary(public_key: string, signed_hash: string, signature: string): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_query_free: (a: number) => void;
  readonly query_new: (a: number, b: number) => number;
  readonly query_query_epoch: (a: number) => number;
  readonly query_query_all_validator_addresses: (a: number) => number;
  readonly query_query_total_bonds: (a: number, b: number, c: number) => number;
  readonly query_query_my_validators: (a: number, b: number, c: number) => number;
  readonly query_query_staking_positions: (a: number, b: number, c: number) => number;
  readonly query_shielded_sync: (a: number, b: number, c: number) => number;
  readonly query_query_balance: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly query_query_public_key: (a: number, b: number, c: number) => number;
  readonly query_query_signed_bridge_pool: (a: number, b: number, c: number) => number;
  readonly query_query_proposals: (a: number) => number;
  readonly query_get_total_delegations: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly query_delegators_votes: (a: number, b: number) => number;
  readonly query_query_gas_costs: (a: number) => number;
  readonly query_query_native_token: (a: number) => number;
  readonly initThreadPool: (a: number) => number;
  readonly __wbg_builttx_free: (a: number) => void;
  readonly builttx_tx_bytes: (a: number, b: number) => void;
  readonly __wbg_sdk_free: (a: number) => void;
  readonly sdk_new: (a: number, b: number, c: number, d: number) => number;
  readonly sdk_has_masp_params: () => number;
  readonly sdk_fetch_and_store_masp_params: () => number;
  readonly sdk_load_masp_params: (a: number) => number;
  readonly sdk_add_spending_key: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly sdk_sign_tx: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly sdk_process_tx: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly sdk_build_tx: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly sdk_append_signature: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly sdk_build_transfer: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly sdk_build_ibc_transfer: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly sdk_build_eth_bridge_transfer: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly sdk_build_vote_proposal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly sdk_build_bond: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly sdk_build_unbond: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly sdk_build_withdraw: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly sdk_build_reveal_pk: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly sdk_reveal_pk: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly sdk_sign_arbitrary: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly sdk_verify_arbitrary: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly public_key_to_bech32: (a: number, b: number, c: number) => void;
  readonly __wbg_address_free: (a: number) => void;
  readonly address_new: (a: number, b: number) => number;
  readonly address_implicit: (a: number, b: number) => void;
  readonly address_public: (a: number, b: number) => void;
  readonly address_hash: (a: number, b: number) => void;
  readonly __wbg_extendedviewingkey_free: (a: number) => void;
  readonly extendedviewingkey_new: (a: number, b: number, c: number) => void;
  readonly extendedviewingkey_encode: (a: number, b: number) => void;
  readonly __wbg_extendedspendingkey_free: (a: number) => void;
  readonly extendedspendingkey_new: (a: number, b: number, c: number) => void;
  readonly extendedspendingkey_encode: (a: number, b: number) => void;
  readonly __wbg_paymentaddress_free: (a: number) => void;
  readonly paymentaddress_new: (a: number, b: number, c: number) => void;
  readonly paymentaddress_pinned: (a: number, b: number) => number;
  readonly paymentaddress_is_pinned: (a: number) => number;
  readonly paymentaddress_hash: (a: number, b: number) => void;
  readonly paymentaddress_encode: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4ad85e59a9848e80: (a: number, b: number, c: number, d: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1b3bf99411c5436b: (a: number, b: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h62c2f546ec44ebe7: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h333e072d6857f9f0: (a: number, b: number, c: number, d: number) => void;
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
