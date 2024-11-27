"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTallyType = exports.tallyTypes = exports.isDelegatorVote = exports.isValidatorVote = exports.isVoteType = exports.voteTypes = exports.isProposalStatus = exports.proposalStatuses = void 0;
exports.proposalStatuses = [
    "pending",
    "ongoing",
    "passed",
    "rejected",
];
const isProposalStatus = (str) => exports.proposalStatuses.includes(str);
exports.isProposalStatus = isProposalStatus;
exports.voteTypes = ["yay", "nay", "abstain"];
const isVoteType = (str) => exports.voteTypes.includes(str);
exports.isVoteType = isVoteType;
const isValidatorVote = (vote) => vote.isValidator;
exports.isValidatorVote = isValidatorVote;
const isDelegatorVote = (vote) => !vote.isValidator;
exports.isDelegatorVote = isDelegatorVote;
exports.tallyTypes = [
    "two-fifths",
    "one-half-over-one-third",
    "less-one-half-over-one-third-nay",
];
const isTallyType = (tallyType) => exports.tallyTypes.includes(tallyType);
exports.isTallyType = isTallyType;
//# sourceMappingURL=proposals.js.map