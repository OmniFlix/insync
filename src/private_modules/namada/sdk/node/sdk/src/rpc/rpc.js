"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rpc = void 0;
const borsh_1 = require("@dao-xyz/borsh");
const types_1 = require("../../../types/src");
/**
 * API for executing RPC requests with Namada
 */
class Rpc {
    /**
     * @param sdk - Instance of Sdk struct from wasm lib
     * @param query - Instance of Query struct from wasm lib
     */
    constructor(sdk, query) {
        this.sdk = sdk;
        this.query = query;
    }
    /**
     * Query balances from chain
     * @async
     * @param owner - Owner address
     * @param tokens - Array of token addresses
     * @returns [[tokenAddress, amount]]
     */
    queryBalance(owner, tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.query_balance(owner, tokens);
        });
    }
    /**
     * Query native token from chain
     * @async
     * @returns Address of native token
     */
    queryNativeToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.query_native_token();
        });
    }
    /**
     * Query public key
     * Return string of public key if it has been revealed on chain, otherwise, return null
     * @async
     * @param address - Address to query
     * @returns String of public key if found
     */
    queryPublicKey(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const pk = yield this.query.query_public_key(address);
            return pk;
        });
    }
    /**
     * Query all validator addresses
     * @async
     * @returns Array of all validator addresses
     */
    queryAllValidators() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.query_all_validator_addresses();
        });
    }
    /**
     * Query total delegations
     * @async
     * @param owners - Array of owner addresses
     * @param [epoch] - delegations at epoch
     * @returns Promise resolving to total delegations
     */
    queryTotalDelegations(owners, epoch) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.get_total_delegations(owners, epoch);
        });
    }
    /**
     * Query delegators votes
     * @async
     * @param proposalId - ID of the proposal
     * @returns Promise resolving to delegators votes
     */
    queryDelegatorsVotes(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.delegators_votes(proposalId);
        });
    }
    /**
     * Query staking totals by owner addresses
     * @async
     * @param owners - Array of owner addresses
     * @returns Promise resolving to staking totals
     */
    queryStakingTotals(owners) {
        return __awaiter(this, void 0, void 0, function* () {
            const stakingAmounts = yield this.query.query_my_validators(owners);
            return stakingAmounts.map(([owner, validator, bonds, unbonds, withdrawable,]) => {
                return {
                    owner,
                    validator,
                    bonds,
                    unbonds,
                    withdrawable,
                };
            });
        });
    }
    /**
     * Query bond and unbond details by owner addresses
     * @async
     * @param owners - Array of owner addresses
     * @returns Promise resolving to staking positions
     */
    queryStakingPositions(owners) {
        return __awaiter(this, void 0, void 0, function* () {
            const [bonds, unbonds] = yield this.query.query_staking_positions(owners);
            return {
                bonds: bonds.map(([owner, validator, amount, startEpoch]) => ({
                    owner,
                    validator,
                    amount,
                    startEpoch,
                })),
                unbonds: unbonds.map(([owner, validator, amount, startEpoch, withdrawableEpoch,]) => ({
                    owner,
                    validator,
                    amount,
                    startEpoch,
                    withdrawableEpoch,
                })),
            };
        });
    }
    /**
     * Query total bonds by owner address
     * @param owner - Owner address
     * @returns Total bonds amount
     */
    queryTotalBonds(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.query_total_bonds(owner);
        });
    }
    /**
     * Query pending transactions in the signed bridge pool
     * @async
     * @param owners - Array of owner addresses
     * @returns Promise resolving to pending ethereum transfers
     */
    querySignedBridgePool(owners) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.query_signed_bridge_pool(owners);
        });
    }
    /**
     * Query gas costs
     * @async
     * @returns [[tokenAddress, gasCost]]
     */
    queryGasCosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.query_gas_costs();
        });
    }
    /**
     * Query code paths and their associated hash on chain
     * @async
     * @returns Object
     */
    queryChecksums() {
        return __awaiter(this, void 0, void 0, function* () {
            const wasmHashes = yield this.query.query_wasm_hashes();
            const checksums = wasmHashes.reduce((acc, { path, hash }) => {
                acc[path] = hash;
                return acc;
            }, {});
            return checksums;
        });
    }
    /**
     * Broadcast a Tx to the ledger
     * @async
     * @param signedTxBytes - Transaction with signature
     * @param args - WrapperTxProps
     * @returns TxResponseProps object
     */
    broadcastTx(signedTxBytes, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrapperTxMsgValue = new types_1.WrapperTxMsgValue(args);
            const msg = new types_1.Message();
            const encodedArgs = msg.encode(wrapperTxMsgValue);
            const response = yield this.sdk.process_tx(signedTxBytes, encodedArgs);
            return (0, borsh_1.deserialize)(Buffer.from(response), types_1.TxResponseMsgValue);
        });
    }
    /**
     * Sync the shielded context
     * @async
     * @param vks - Array of viewing keys
     * @returns
     */
    shieldedSync(vks) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query.shielded_sync(vks);
        });
    }
}
exports.Rpc = Rpc;
//# sourceMappingURL=rpc.js.map