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
exports.Tx = void 0;
const borsh_1 = require("@dao-xyz/borsh");
const shared_1 = require("../../../shared/src");
const types_1 = require("../../../types/src");
/**
 * SDK functionality related to transactions
 */
class Tx {
    /**
     * @param sdk - Instance of Sdk struct from wasm lib
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Build Transparent Transfer Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param transferProps -  properties of the transfer
     * @returns promise that resolves to an TxMsgValue
     */
    buildTransparentTransfer(wrapperTxProps, transferProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedTransfer = transferMsg.encode(new types_1.TransparentTransferMsgValue(transferProps));
            const serializedTx = yield this.sdk.build_transparent_transfer(encodedTransfer, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Shielded Transfer Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param shieldedTransferProps -  properties of the shielded transfer
     * @returns promise that resolves to an TxMsgValue
     */
    buildShieldedTransfer(wrapperTxProps, shieldedTransferProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const shieldedTransferMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedTransfer = shieldedTransferMsg.encode(new types_1.ShieldedTransferMsgValue(shieldedTransferProps));
            const serializedTx = yield this.sdk.build_shielded_transfer(encodedTransfer, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Shielding Transfer Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param shieldingTransferProps -  properties of the shielding transfer
     * @returns promise that resolves to an TxMsgValue
     */
    buildShieldingTransfer(wrapperTxProps, shieldingTransferProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const shieldingTransferMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedTransfer = shieldingTransferMsg.encode(new types_1.ShieldingTransferMsgValue(shieldingTransferProps));
            const serializedTx = yield this.sdk.build_shielding_transfer(encodedTransfer, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Unshielding Transfer Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param unshieldingTransferProps -  properties of the unshielding transfer
     * @returns promise that resolves to an TxMsgValue
     */
    buildUnshieldingTransfer(wrapperTxProps, unshieldingTransferProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const shieldingTransferMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedTransfer = shieldingTransferMsg.encode(new types_1.UnshieldingTransferMsgValue(unshieldingTransferProps));
            const serializedTx = yield this.sdk.build_unshielding_transfer(encodedTransfer, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build RevealPK Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @returns promise that resolves to an TxMsgValue
     */
    buildRevealPk(wrapperTxProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const serializedTx = yield this.sdk.build_reveal_pk(encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Bond Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param bondProps -  properties of the bond tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildBond(wrapperTxProps, bondProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const bondMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedBond = bondMsg.encode(new types_1.BondMsgValue(bondProps));
            const serializedTx = yield this.sdk.build_bond(encodedBond, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Unbond Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param unbondProps - properties of the unbond tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildUnbond(wrapperTxProps, unbondProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const unbondMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedUnbond = unbondMsg.encode(new types_1.UnbondMsgValue(unbondProps));
            const serializedTx = yield this.sdk.build_unbond(encodedUnbond, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Withdraw Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param withdrawProps - properties of the withdraw tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildWithdraw(wrapperTxProps, withdrawProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const bondMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedWithdraw = bondMsg.encode(new types_1.WithdrawMsgValue(withdrawProps));
            const serializedTx = yield this.sdk.build_withdraw(encodedWithdraw, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Redelegate Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param redelegateProps -  properties of the redelegate tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildRedelegate(wrapperTxProps, redelegateProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const redelegateMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedRedelegate = redelegateMsg.encode(new types_1.RedelegateMsgValue(redelegateProps));
            const serializedTx = yield this.sdk.build_redelegate(encodedRedelegate, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Ibc Transfer Tx
     * `ibcTransferProps.amountInBaseDenom` is the amount in the **base** denom
     * e.g. the value of 1 NAM should be BigNumber(1_000_000), not BigNumber(1).
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param ibcTransferProps - properties of the ibc transfer tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildIbcTransfer(wrapperTxProps, ibcTransferProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const ibcTransferMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedIbcTransfer = ibcTransferMsg.encode(new types_1.IbcTransferMsgValue(ibcTransferProps));
            const serializedTx = yield this.sdk.build_ibc_transfer(encodedIbcTransfer, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Ethereum Bridge Transfer Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param ethBridgeTransferProps - properties of the eth bridge transfer tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildEthBridgeTransfer(wrapperTxProps, ethBridgeTransferProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const ethBridgeTransferMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedEthBridgeTransfer = ethBridgeTransferMsg.encode(new types_1.EthBridgeTransferMsgValue(ethBridgeTransferProps));
            const serializedTx = yield this.sdk.build_eth_bridge_transfer(encodedEthBridgeTransfer, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Vote Proposal Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param voteProposalProps - properties of the vote proposal tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildVoteProposal(wrapperTxProps, voteProposalProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const voteProposalMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedVoteProposal = voteProposalMsg.encode(new types_1.VoteProposalMsgValue(voteProposalProps));
            const serializedTx = yield this.sdk.build_vote_proposal(encodedVoteProposal, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build Claim Rewards Tx
     * @async
     * @param wrapperTxProps - properties of the transaction
     * @param claimRewardsProps - properties of the claim rewards tx
     * @returns promise that resolves to an TxMsgValue
     */
    buildClaimRewards(wrapperTxProps, claimRewardsProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const claimRewardsMsg = new types_1.Message();
            const encodedWrapperArgs = this.encodeTxArgs(wrapperTxProps);
            const encodedClaimRewards = claimRewardsMsg.encode(new types_1.ClaimRewardsMsgValue(claimRewardsProps));
            const serializedTx = yield this.sdk.build_claim_rewards(encodedClaimRewards, encodedWrapperArgs);
            return (0, borsh_1.deserialize)(Buffer.from(serializedTx), types_1.TxMsgValue);
        });
    }
    /**
     * Build a batched transaction
     * @param txs - array of TxProp
     * @returns a serialized TxMsgValue type
     */
    buildBatch(txs) {
        const encodedTxs = txs.map((txProps) => {
            const txMsgValue = new types_1.TxMsgValue(txProps);
            const msg = new types_1.Message();
            return msg.encode(txMsgValue);
        });
        const batch = shared_1.Sdk.build_batch(encodedTxs.map((tx) => [...tx]));
        return (0, borsh_1.deserialize)(Buffer.from(batch), types_1.TxMsgValue);
    }
    /**
     * Append signature for transactions signed by Ledger Hardware Wallet
     * @param txBytes - Serialized transaction
     * @param ledgerSignatureResponse - Serialized signature as returned from Ledger
     * @returns - Serialized Tx bytes with signature appended
     */
    appendSignature(txBytes, ledgerSignatureResponse) {
        const { signature } = ledgerSignatureResponse;
        if (!signature) {
            throw new Error("Signature was not returned from Ledger!");
        }
        const { rawPubkey, raw_indices, raw_signature, wrapper_indices, wrapper_signature, } = signature;
        // Construct props from ledgerSignature
        /* eslint-disable */
        const props = {
            pubkey: new Uint8Array(rawPubkey.data),
            rawIndices: new Uint8Array(raw_indices.data),
            rawSignature: new Uint8Array(raw_signature.data),
            wrapperIndices: new Uint8Array(wrapper_indices.data),
            wrapperSignature: new Uint8Array(wrapper_signature.data),
        };
        /* eslint-enable */
        // Serialize signature
        const value = new types_1.SignatureMsgValue(props);
        const msg = new types_1.Message();
        const encodedSignature = msg.encode(value);
        return this.sdk.append_signature(txBytes, encodedSignature);
    }
    /**
     * Helper to encode Tx args given TxProps
     * @param wrapperTxProps - properties of the transaction
     * @returns Serialized WrapperTxMsgValue
     */
    encodeTxArgs(wrapperTxProps) {
        const wrapperTxMsgValue = new types_1.WrapperTxMsgValue(wrapperTxProps);
        const msg = new types_1.Message();
        return msg.encode(wrapperTxMsgValue);
    }
    /**
     * Method to retrieve JSON strings for all commitments of a Tx
     * @param txBytes - Bytes of a transaction
     * @param checksums - Record of paths mapped to their respective hashes
     * @returns a TxDetails object
     */
    deserialize(txBytes, checksums) {
        const wasmHashes = [];
        for (const path in checksums) {
            wasmHashes.push({
                path,
                hash: checksums[path],
            });
        }
        const tx = (0, shared_1.deserialize_tx)(txBytes, wasmHashes);
        const { wrapperTx, commitments } = (0, borsh_1.deserialize)(tx, types_1.TxDetailsMsgValue);
        const getProps = (txType, data) => {
            switch (txType) {
                case shared_1.TxType.Bond:
                    return (0, borsh_1.deserialize)(data, types_1.BondMsgValue);
                case shared_1.TxType.Unbond:
                    return (0, borsh_1.deserialize)(data, types_1.UnbondMsgValue);
                case shared_1.TxType.Withdraw:
                    return (0, borsh_1.deserialize)(data, types_1.WithdrawMsgValue);
                case shared_1.TxType.Redelegate:
                    return (0, borsh_1.deserialize)(data, types_1.RedelegateMsgValue);
                case shared_1.TxType.VoteProposal:
                    return (0, borsh_1.deserialize)(data, types_1.VoteProposalMsgValue);
                case shared_1.TxType.ClaimRewards:
                    return (0, borsh_1.deserialize)(data, types_1.ClaimRewardsMsgValue);
                case shared_1.TxType.Transfer:
                    return (0, borsh_1.deserialize)(data, types_1.TransferMsgValue);
                case shared_1.TxType.RevealPK:
                    return (0, borsh_1.deserialize)(data, types_1.RevealPkMsgValue);
                case shared_1.TxType.IBCTransfer:
                    return (0, borsh_1.deserialize)(data, types_1.IbcTransferMsgValue);
                default:
                    throw "Unsupported Tx type!";
            }
        };
        return Object.assign(Object.assign({}, wrapperTx), { commitments: commitments.map(({ txType, hash, txCodeId, memo, data }) => (Object.assign({ txType: txType, hash,
                txCodeId,
                memo }, getProps(txType, data)))) });
    }
    /**
     * Generate the memo needed for performing an IBC transfer to a Namada shielded
     * address.
     * @async
     * @param target - the Namada shielded address to send tokens to
     * @param token - the token to transfer
     * @param amount - the amount to transfer
     * @param channelId - the IBC channel ID on the Namada side
     * @returns promise that resolves to the shielding memo
     */
    generateIbcShieldingMemo(target, token, amount, channelId) {
        return this.sdk.generate_ibc_shielding_memo(target, token, amount.toString(), channelId);
    }
    /**
     * Return the inner tx hashes from the provided tx bytes
     * @param bytes - Uint8Array
     * @returns array of inner Tx hashes
     */
    getInnerTxHashes(bytes) {
        return (0, shared_1.get_inner_tx_hashes)(bytes);
    }
}
exports.Tx = Tx;
//# sourceMappingURL=tx.js.map