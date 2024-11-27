export function initThreadPool(_threads: number): Promise<void>;
export function get_inner_tx_hashes(tx_bytes: Uint8Array): (string)[];
export function deserialize_tx(tx_bytes: Uint8Array, wasm_hashes: any): Uint8Array;
export function public_key_to_bech32(bytes: Uint8Array): string;
export const TxType: Readonly<{
    Bond: 1;
    "1": "Bond";
    Unbond: 2;
    "2": "Unbond";
    Withdraw: 3;
    "3": "Withdraw";
    Transfer: 4;
    "4": "Transfer";
    IBCTransfer: 5;
    "5": "IBCTransfer";
    EthBridgeTransfer: 6;
    "6": "EthBridgeTransfer";
    RevealPK: 7;
    "7": "RevealPK";
    VoteProposal: 8;
    "8": "VoteProposal";
    Redelegate: 9;
    "9": "Redelegate";
    Batch: 10;
    "10": "Batch";
    ClaimRewards: 11;
    "11": "ClaimRewards";
}>;
export function __wbindgen_string_get(arg0: any, arg1: any): void;
export function __wbindgen_object_drop_ref(arg0: any): void;
export function __wbindgen_error_new(arg0: any, arg1: any): number;
export function __wbindgen_bigint_from_u64(arg0: any): number;
export function __wbg_fetchAndStoreMaspParams_4db58e4a95fdc955(...args: any[]): any;
export function __wbindgen_string_new(arg0: any, arg1: any): number;
export function __wbg_hasMaspParams_118d7216d8ceab38(...args: any[]): any;
export function __wbindgen_boolean_get(arg0: any): 1 | 0 | 2;
export function __wbg_writeFileSync_14bda46173d4c6d1(...args: any[]): any;
export function __wbg_readFileSync_b05b4debde47df43(...args: any[]): any;
export function __wbg_existsSync_24cbdb58768334ed(...args: any[]): any;
export function __wbindgen_object_clone_ref(arg0: any): number;
export function __wbg_renameSync_b40ffeed036f9c19(...args: any[]): any;
export function __wbg_unlinkSync_6bded25457b36fde(...args: any[]): any;
export function __wbindgen_is_undefined(arg0: any): boolean;
export function __wbindgen_cb_drop(arg0: any): boolean;
export function __wbg_wasmFetch_8bfe453b156a2250(...args: any[]): any;
export function __wbg_fetch_bc7c8e27076a5c84(arg0: any): number;
export function __wbg_queueMicrotask_3cbae2ec6b6cd3d6(arg0: any): number;
export function __wbindgen_is_function(arg0: any): boolean;
export function __wbg_queueMicrotask_481971b0d87f3dd4(arg0: any): void;
export function __wbg_performance_1430613edb72ce03(arg0: any): number;
export function __wbg_now_eab901b1d3b8a295(arg0: any): any;
export function __wbg_setTimeout_fba1b48a90e30862(...args: any[]): any;
export function __wbg_crypto_1d1f22824a6a080c(arg0: any): number;
export function __wbindgen_is_object(arg0: any): boolean;
export function __wbg_process_4a72847cc503995b(arg0: any): number;
export function __wbg_versions_f686565e586dd935(arg0: any): number;
export function __wbg_node_104a2ff8d6ea03a2(arg0: any): number;
export function __wbindgen_is_string(arg0: any): boolean;
export function __wbg_require_cca90b1a94a0255b(...args: any[]): any;
export function __wbg_msCrypto_eb05e62b530a1508(arg0: any): number;
export function __wbg_randomFillSync_5c9c955aa56b6049(...args: any[]): any;
export function __wbg_getRandomValues_3aa56aa6edec874c(...args: any[]): any;
export function __wbg_fetch_921fad6ef9e883dd(arg0: any, arg1: any): number;
export function __wbg_error_8e3928cfb8a43e2b(arg0: any): void;
export function __wbg_log_5bb5f88f245d7762(arg0: any): void;
export function __wbg_instanceof_Response_849eb93e75734b6e(arg0: any): boolean;
export function __wbg_url_5f6dc4009ac5f99d(arg0: any, arg1: any): void;
export function __wbg_status_61a01141acd3cf74(arg0: any): any;
export function __wbg_headers_9620bfada380764a(arg0: any): number;
export function __wbg_arrayBuffer_29931d52c7206b02(...args: any[]): any;
export function __wbg_json_1d5f113e916d8675(...args: any[]): any;
export function __wbg_new_ab6fd82b10560829(...args: any[]): any;
export function __wbg_append_7bfcb4937d1d5e29(...args: any[]): any;
export function __wbg_signal_a61f78a3478fd9bc(arg0: any): number;
export function __wbg_new_0d76b0581eca6298(...args: any[]): any;
export function __wbg_abort_2aa7521d5690750e(arg0: any): void;
export function __wbg_newwithstrandinit_3fd6fba4083ff2d0(...args: any[]): any;
export function __wbg_newnoargs_e258087cd0daa0ea(arg0: any, arg1: any): number;
export function __wbg_next_40fc327bfc8770e6(arg0: any): number;
export function __wbg_next_196c84450b364254(...args: any[]): any;
export function __wbg_done_298b57d23c0fc80c(arg0: any): any;
export function __wbg_value_d93c65011f51a456(arg0: any): number;
export function __wbg_iterator_2cee6dadfd956dfa(): number;
export function __wbg_get_e3c254076557e348(...args: any[]): any;
export function __wbg_call_27c0f87801dedf93(...args: any[]): any;
export function __wbg_new_72fb9a18b5ae2624(): number;
export function __wbg_self_ce0dbfc45cf2f5be(...args: any[]): any;
export function __wbg_window_c6fb939a7f436783(...args: any[]): any;
export function __wbg_globalThis_d1e6af4856ba331b(...args: any[]): any;
export function __wbg_global_207b558942527489(...args: any[]): any;
export function __wbg_call_b3ca7c6051f9bec1(...args: any[]): any;
export function __wbg_getTime_2bc4375165f02d15(arg0: any): any;
export function __wbg_new0_7d84e5b2cd9fdc73(): number;
export function __wbg_new_81740750da40724f(arg0: any, arg1: any): number;
export function __wbg_resolve_b0083a7967828ec8(arg0: any): number;
export function __wbg_then_0c86a60e8fcfe9f6(arg0: any, arg1: any): number;
export function __wbg_then_a73caa9a87991566(arg0: any, arg1: any, arg2: any): number;
export function __wbg_buffer_12d079cc21e14bdb(arg0: any): number;
export function __wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb(arg0: any, arg1: any, arg2: any): number;
export function __wbg_new_63b92bc8671ed464(arg0: any): number;
export function __wbg_set_a47bac70306a19a7(arg0: any, arg1: any, arg2: any): void;
export function __wbg_length_c20a40f15020d68a(arg0: any): any;
export function __wbg_newwithlength_e9b4878cebadb3d3(arg0: any): number;
export function __wbg_subarray_a1f73cd4b5b42fe1(arg0: any, arg1: any, arg2: any): number;
export function __wbg_has_0af94d20077affa2(...args: any[]): any;
export function __wbg_set_1f9b04f170055d33(...args: any[]): any;
export function __wbg_parse_66d1801634e099ac(...args: any[]): any;
export function __wbg_stringify_8887fe74e1c50d81(...args: any[]): any;
export function __wbindgen_debug_string(arg0: any, arg1: any): void;
export function __wbindgen_throw(arg0: any, arg1: any): never;
export function __wbindgen_memory(): number;
export function __wbindgen_closure_wrapper5730(arg0: any, arg1: any, arg2: any): number;
export function __wbindgen_closure_wrapper7094(arg0: any, arg1: any, arg2: any): number;
/**
*/
export class Address {
    /**
    * Address helpers for wasm_bindgen
    * @param {string} secret
    */
    constructor(secret: string);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
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
export class BatchTxResult {
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
}
/**
* Wrap ExtendedSpendingKey
*/
export class ExtendedSpendingKey {
    /**
    * Instantiate ExtendedSpendingKey from serialized vector
    * @param {Uint8Array} key
    */
    constructor(key: Uint8Array);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * Return ExtendedSpendingKey as Bech32-encoded String
    * @returns {string}
    */
    encode(): string;
}
/**
* Wrap ExtendedViewingKey
*/
export class ExtendedViewingKey {
    /**
    * Instantiate ExtendedViewingKey from serialized vector
    * @param {Uint8Array} key
    */
    constructor(key: Uint8Array);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * Return ExtendedViewingKey as Bech32-encoded String
    * @returns {string}
    */
    encode(): string;
}
/**
* Wrap PaymentAddress
*/
export class PaymentAddress {
    /**
    * Instantiate PaymentAddress from serialized vector
    * @param {Uint8Array} address
    */
    constructor(address: Uint8Array);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
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
    /**
    * @returns {(string)[]}
    */
    static code_paths(): (string)[];
    /**
    * @param {string} url
    * @param {string | undefined} [masp_url]
    */
    constructor(url: string, masp_url?: string | undefined);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * Gets current epoch
    *
    * # Errors
    *
    * Returns an error if the RPC call fails
    * @returns {Promise<bigint>}
    */
    query_epoch(): Promise<bigint>;
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
    * @param {bigint} epoch
    * @returns {Promise<any>}
    */
    query_total_staked_tokens(epoch: bigint): Promise<any>;
    /**
    * @returns {Promise<any>}
    */
    query_proposal_counter(): Promise<any>;
    /**
    * @param {bigint} id
    * @returns {Promise<Uint8Array>}
    */
    query_proposal_by_id(id: bigint): Promise<Uint8Array>;
    /**
    * @param {bigint} proposal_id
    * @param {bigint} epoch
    * @returns {Promise<any>}
    */
    query_proposal_votes(proposal_id: bigint, epoch: bigint): Promise<any>;
    /**
    * @param {bigint} proposal_id
    * @param {bigint} epoch
    * @returns {Promise<any>}
    */
    query_proposal_result(proposal_id: bigint, epoch: bigint): Promise<any>;
    /**
    * @param {bigint} proposal_id
    * @returns {Promise<Uint8Array>}
    */
    query_proposal_code(proposal_id: bigint): Promise<Uint8Array>;
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
    get_total_delegations(addresses: any[], epoch?: bigint | undefined): Promise<any>;
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
    /**
    * @returns {Promise<any>}
    */
    query_wasm_hashes(): Promise<any>;
    /**
    * @param {string} tx_code_path
    * @returns {Promise<string | undefined>}
    */
    query_wasm_hash(tx_code_path: string): Promise<string | undefined>;
}
/**
* Represents the Sdk public API.
*/
export class Sdk {
    /**
    * @returns {Promise<any>}
    */
    static has_masp_params(): Promise<any>;
    /**
    * @param {string | undefined} [url]
    * @returns {Promise<void>}
    */
    static fetch_and_store_masp_params(url?: string | undefined): Promise<void>;
    /**
    * Build a batch Tx from built transactions and return the bytes
    * @param {any} txs
    * @returns {any}
    */
    static build_batch(txs: any): any;
    /**
    * @param {string} url
    * @param {string} native_token
    * @param {string} path_or_db_name
    */
    constructor(url: string, native_token: string, path_or_db_name: string);
    __destroy_into_raw(): number;
    __wbg_ptr: number;
    free(): void;
    /**
    * @param {any} context_dir
    * @returns {Promise<void>}
    */
    load_masp_params(context_dir: any): Promise<void>;
    /**
    * @param {string} xsk
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_spending_key(xsk: string, alias: string): Promise<void>;
    /**
    * @param {string} xvk
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_viewing_key(xvk: string, alias: string): Promise<void>;
    /**
    * @param {string} pa
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_payment_address(pa: string, alias: string): Promise<void>;
    /**
    * @param {string} xvk
    * @param {string} alias
    * @returns {Promise<void>}
    */
    add_default_payment_address(xvk: string, alias: string): Promise<void>;
    /**
    * @param {string} secret_key
    * @param {string} alias
    * @param {string | undefined} [password]
    * @returns {Promise<void>}
    */
    add_keypair(secret_key: string, alias: string, password?: string | undefined): Promise<void>;
    /**
    * @returns {Promise<void>}
    */
    save_wallet(): Promise<void>;
    /**
    * @returns {Promise<void>}
    */
    load_wallet(): Promise<void>;
    /**
    * @param {Uint8Array} tx
    * @param {string | undefined} [private_key]
    * @param {string | undefined} [chain_id]
    * @returns {Promise<any>}
    */
    sign_tx(tx: Uint8Array, private_key?: string | undefined, chain_id?: string | undefined): Promise<any>;
    /**
    * @param {Uint8Array} tx_bytes
    * @param {Uint8Array} tx_msg
    * @returns {Promise<any>}
    */
    process_tx(tx_bytes: Uint8Array, tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} tx_bytes
    * @param {Uint8Array} sig_msg_bytes
    * @returns {any}
    */
    append_signature(tx_bytes: Uint8Array, sig_msg_bytes: Uint8Array): any;
    /**
    * @param {Uint8Array} transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_transparent_transfer(transfer_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} shielded_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_shielded_transfer(shielded_transfer_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} unshielding_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_unshielding_transfer(unshielding_transfer_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} shielding_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_shielding_transfer(shielding_transfer_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} ibc_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_ibc_transfer(ibc_transfer_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} eth_bridge_transfer_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_eth_bridge_transfer(eth_bridge_transfer_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} vote_proposal_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_vote_proposal(vote_proposal_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} claim_rewards_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_claim_rewards(claim_rewards_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} bond_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_bond(bond_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} unbond_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_unbond(unbond_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} withdraw_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_withdraw(withdraw_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} redelegate_msg
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_redelegate(redelegate_msg: Uint8Array, wrapper_tx_msg: Uint8Array): Promise<any>;
    /**
    * @param {Uint8Array} wrapper_tx_msg
    * @returns {Promise<any>}
    */
    build_reveal_pk(wrapper_tx_msg: Uint8Array): Promise<any>;
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
    */
    verify_arbitrary(public_key: string, signed_hash: string, signature: string): void;
    /**
    * @param {string} target
    * @param {string} token
    * @param {string} amount
    * @param {string} channel_id
    * @returns {Promise<any>}
    */
    generate_ibc_shielding_memo(target: string, token: string, amount: string, channel_id: string): Promise<any>;
    /**
    * @returns {string}
    */
    masp_address(): string;
}
/**
* Serializable response for process_tx calls
*/
export class TxResponse {
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
}
declare let wasm: any;
export { wasm as __wasm };
