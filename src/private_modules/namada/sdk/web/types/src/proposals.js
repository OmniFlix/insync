export const proposalStatuses = [
    "pending",
    "ongoing",
    "passed",
    "rejected",
];
export const isProposalStatus = (str) => proposalStatuses.includes(str);
export const voteTypes = ["yay", "nay", "abstain"];
export const isVoteType = (str) => voteTypes.includes(str);
export const isValidatorVote = (vote) => vote.isValidator;
export const isDelegatorVote = (vote) => !vote.isValidator;
export const tallyTypes = [
    "two-fifths",
    "one-half-over-one-third",
    "less-one-half-over-one-third-nay",
];
export const isTallyType = (tallyType) => tallyTypes.includes(tallyType);
//# sourceMappingURL=proposals.js.map