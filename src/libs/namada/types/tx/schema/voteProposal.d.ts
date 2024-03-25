import { SubmitVoteProposalProps } from "../types";
export declare class SubmitVoteProposalMsgValue {
    signer: string;
    proposalId: bigint;
    vote: string;
    constructor(data: SubmitVoteProposalProps);
}
