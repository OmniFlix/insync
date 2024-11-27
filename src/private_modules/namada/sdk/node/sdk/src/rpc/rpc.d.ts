import { Query as QueryWasm, Sdk as SdkWasm, TransferToEthereum } from "../../../shared/src";
import { TxResponseProps, WrapperTxProps } from "../../../types/src";
import { Balance, DelegationTotals, DelegatorsVotes, GasCosts, StakingPositions, StakingTotals } from "./types";
/**
 * API for executing RPC requests with Namada
 */
export declare class Rpc {
    protected readonly sdk: SdkWasm;
    protected readonly query: QueryWasm;
    /**
     * @param sdk - Instance of Sdk struct from wasm lib
     * @param query - Instance of Query struct from wasm lib
     */
    constructor(sdk: SdkWasm, query: QueryWasm);
    /**
     * Query balances from chain
     * @async
     * @param owner - Owner address
     * @param tokens - Array of token addresses
     * @returns [[tokenAddress, amount]]
     */
    queryBalance(owner: string, tokens: string[]): Promise<Balance>;
    /**
     * Query native token from chain
     * @async
     * @returns Address of native token
     */
    queryNativeToken(): Promise<string>;
    /**
     * Query public key
     * Return string of public key if it has been revealed on chain, otherwise, return null
     * @async
     * @param address - Address to query
     * @returns String of public key if found
     */
    queryPublicKey(address: string): Promise<string | undefined>;
    /**
     * Query all validator addresses
     * @async
     * @returns Array of all validator addresses
     */
    queryAllValidators(): Promise<string[]>;
    /**
     * Query total delegations
     * @async
     * @param owners - Array of owner addresses
     * @param [epoch] - delegations at epoch
     * @returns Promise resolving to total delegations
     */
    queryTotalDelegations(owners: string[], epoch?: bigint): Promise<DelegationTotals>;
    /**
     * Query delegators votes
     * @async
     * @param proposalId - ID of the proposal
     * @returns Promise resolving to delegators votes
     */
    queryDelegatorsVotes(proposalId: bigint): Promise<DelegatorsVotes>;
    /**
     * Query staking totals by owner addresses
     * @async
     * @param owners - Array of owner addresses
     * @returns Promise resolving to staking totals
     */
    queryStakingTotals(owners: string[]): Promise<StakingTotals[]>;
    /**
     * Query bond and unbond details by owner addresses
     * @async
     * @param owners - Array of owner addresses
     * @returns Promise resolving to staking positions
     */
    queryStakingPositions(owners: string[]): Promise<StakingPositions>;
    /**
     * Query total bonds by owner address
     * @param owner - Owner address
     * @returns Total bonds amount
     */
    queryTotalBonds(owner: string): Promise<number>;
    /**
     * Query pending transactions in the signed bridge pool
     * @async
     * @param owners - Array of owner addresses
     * @returns Promise resolving to pending ethereum transfers
     */
    querySignedBridgePool(owners: string[]): Promise<TransferToEthereum[]>;
    /**
     * Query gas costs
     * @async
     * @returns [[tokenAddress, gasCost]]
     */
    queryGasCosts(): Promise<GasCosts>;
    /**
     * Query code paths and their associated hash on chain
     * @async
     * @returns Object
     */
    queryChecksums(): Promise<Record<string, string>>;
    /**
     * Broadcast a Tx to the ledger
     * @async
     * @param signedTxBytes - Transaction with signature
     * @param args - WrapperTxProps
     * @returns TxResponseProps object
     */
    broadcastTx(signedTxBytes: Uint8Array, args: WrapperTxProps): Promise<TxResponseProps>;
    /**
     * Sync the shielded context
     * @async
     * @param vks - Array of viewing keys
     * @returns
     */
    shieldedSync(vks: string[]): Promise<void>;
}
