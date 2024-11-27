"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxTypeLabel = void 0;
const shared_1 = require("./shared/shared");
exports.TxTypeLabel = {
    [shared_1.TxType.Bond]: "Bond",
    [shared_1.TxType.Unbond]: "Unbond",
    [shared_1.TxType.Withdraw]: "Withdraw",
    [shared_1.TxType.Transfer]: "Transfer",
    [shared_1.TxType.IBCTransfer]: "IBC Transfer",
    [shared_1.TxType.EthBridgeTransfer]: "Add to Eth Bridge Pool",
    [shared_1.TxType.RevealPK]: "RevealPK",
    [shared_1.TxType.VoteProposal]: "Vote Proposal",
    [shared_1.TxType.ClaimRewards]: "Claim Rewards",
    [shared_1.TxType.Redelegate]: "Redelegate",
    [shared_1.TxType.Batch]: "Batch",
};
//# sourceMappingURL=types.js.map