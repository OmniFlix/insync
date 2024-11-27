/**
* Helper function to bech32 encode a public key from bytes
* @param {Uint8Array} bytes
* @returns {string}
*/
export function public_key_to_bech32(bytes: Uint8Array): string;
/**
* @param {number} _threads
* @returns {Promise<void>}
*/
export function initThreadPool(_threads: number): Promise<void>;
/**
* @param {Uint8Array} tx_bytes
* @returns {(string)[]}
*/
export function get_inner_tx_hashes(tx_bytes: Uint8Array): (string)[];
/**
* @param {Uint8Array} tx_bytes
* @param {any} wasm_hashes
* @returns {Uint8Array}
*/
export function deserialize_tx(tx_bytes: Uint8Array, wasm_hashes: any): Uint8Array;
/**
*/
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
    * @param {any} _db_name
    * @returns {Promise<void>}
    */
    load_masp_params(_db_name: any): Promise<void>;
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
export default __wbg_init;
export function initSync(module: any): any;
declare function __wbg_init(input: any): Promise<any>;
