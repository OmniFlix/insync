import BigNumber from "bignumber.js";
export declare const proposalStatuses: readonly ["pending", "ongoing", "passed", "rejected"];
export type ProposalStatus = (typeof proposalStatuses)[number];
export declare const isProposalStatus: (str: string) => str is ProposalStatus;
export type Proposal = {
    id: bigint;
    author: string;
    content: {
        [key: string]: string | undefined;
    };
    startEpoch: bigint;
    endEpoch: bigint;
    activationEpoch: bigint;
    startTime: bigint;
    endTime: bigint;
    activationTime: bigint;
    currentTime: bigint;
    proposalType: ProposalType;
    tallyType: TallyType;
    status: ProposalStatus;
    totalVotingPower: BigNumber;
} & {
    [VT in VoteType]: BigNumber;
};
export type AddRemove = {
    add?: string;
    remove: string[];
};
export type PgfTarget = {
    internal: {
        amount: BigNumber;
        target: string;
    };
};
export type PgfActions = {
    continuous: {
        add: PgfTarget[];
        remove: PgfTarget[];
    };
    retro: PgfTarget[];
};
export type Default = {
    type: "default";
};
export type DefaultWithWasm = {
    type: "default_with_wasm";
    data: Uint8Array;
};
export type PgfSteward = {
    type: "pgf_steward";
    data: AddRemove;
};
export type PgfPayment = {
    type: "pgf_payment";
    data: PgfActions;
};
export type ProposalType = Default | DefaultWithWasm | PgfSteward | PgfPayment;
export type ProposalTypeString = ProposalType["type"];
export declare const voteTypes: readonly ["yay", "nay", "abstain"];
export type VoteType = (typeof voteTypes)[number];
export declare const isVoteType: (str: string) => str is VoteType;
export type Votes = Record<VoteType, BigNumber>;
type VoteCommonProperties = {
    address: string;
    voteType: VoteType;
};
export type ValidatorVote = {
    isValidator: true;
    votingPower: BigNumber;
} & VoteCommonProperties;
export declare const isValidatorVote: (vote: Vote) => vote is ValidatorVote;
export type DelegatorVote = {
    isValidator: false;
    votingPower: [string, BigNumber][];
} & VoteCommonProperties;
export declare const isDelegatorVote: (vote: Vote) => vote is DelegatorVote;
export type Vote = DelegatorVote | ValidatorVote;
export declare const tallyTypes: readonly ["two-fifths", "one-half-over-one-third", "less-one-half-over-one-third-nay"];
export type TallyType = (typeof tallyTypes)[number];
export declare const isTallyType: (tallyType: string) => tallyType is TallyType;
export {};
