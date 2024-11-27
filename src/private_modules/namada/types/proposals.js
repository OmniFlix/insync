export var proposalStatuses = [
    "pending",
    "ongoing",
    "passed",
    "rejected",
];
export var isProposalStatus = function (str) {
    return proposalStatuses.includes(str);
};
export var voteTypes = ["yay", "nay", "abstain"];
export var isVoteType = function (str) {
    return voteTypes.includes(str);
};
export var isValidatorVote = function (vote) {
    return vote.isValidator;
};
export var isDelegatorVote = function (vote) {
    return !vote.isValidator;
};
export var tallyTypes = [
    "two-thirds",
    "one-half-over-one-third",
    "less-one-half-over-one-third-nay",
];
export var isTallyType = function (tallyType) {
    return tallyTypes.includes(tallyType);
};
