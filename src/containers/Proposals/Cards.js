import React, { useState } from 'react';
import { Pagination } from '@material-ui/lab';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '../../components/Icon';
import ClassNames from 'classnames';
import { Button } from '@material-ui/core';
import { showProposalDialog } from '../../actions/proposals';
import moment from 'moment';
import { tally } from '../../utils/numberFormats';
import DotsLoading from '../../components/DotsLoading';
import withRouter from '../../components/WithRouter';
import { fixDateString } from 'utils/date';

const Cards = (props) => {
    const [page, setPage] = useState(1);
    let rowsPerPage = 15;
    if (props.home) {
        rowsPerPage = 6;
    }

    // const handleChangePage = (event, page) => {
    //     setPage(page);
    // };

    const count = Math.ceil(props.proposals.length / rowsPerPage);

    const reversedItems = props.proposals.length &&
        props.proposals.map(function iterateItems (item) {
            return item;
        });

    const VoteCalculation = (proposal, val) => {
        if (proposal.status === 2 || proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD') {
            const value = props.tallyDetails && props.tallyDetails[proposal.id];
            const sum = value && value.yes && value.no && value.no_with_veto && value.abstain &&
                (parseInt(value.yes) + parseInt(value.no) + parseInt(value.no_with_veto) + parseInt(value.abstain));
            let val1 = null;
            if (val === 'yes_count') {
                val1 = 'yes';
            } else if (val === 'no_count') {
                val1 = 'no';
            } else if (val === 'no_with_veto_count') {
                val1 = 'no_with_veto';
            } else if (val === 'abstain_count') {
                val1 = 'abstain';
            }

            return (props.tallyDetails && props.tallyDetails[proposal.id] && props.tallyDetails[proposal.id][val1]
                ? tally(props.tallyDetails[proposal.id][val1], sum) : '0%');
        } else {
            const sum = proposal && proposal.yayVotes && proposal.nayVotes && proposal.abstainVotes &&
                (parseInt(proposal.yayVotes) + parseInt(proposal.nayVotes) + parseInt(proposal.abstainVotes));

            return (proposal && proposal[val]
                ? tally(proposal[val], sum) : '0%');
        }
    };

    const handleProposal = (proposal) => {
        props.router.navigate(`/proposals/${proposal.id}`);
        props.handleShow(proposal);
    };

    return (
        <div className="cards_content">
            <div className="cards">
                {reversedItems.length &&
                    reversedItems.map((proposal, index) => {
                        if (index < (page * rowsPerPage) && index >= (page - 1) * rowsPerPage) {
                            let votedOption = props.voteDetails && props.voteDetails.length &&
                                proposal && proposal.id &&
                                props.voteDetails.filter((vote) => vote && ((String(vote.proposalId) === String(proposal.id)) || (String(vote.proposalId) === '0' && String(proposal.id) === '0')));
                            if (votedOption && votedOption.length && votedOption[0]) {
                                votedOption = votedOption[0];
                            }
                            let inProgress = props.proposalDetails && Object.keys(props.proposalDetails).length &&
                                Object.keys(props.proposalDetails).find((key) => key === proposal.proposal_id);
                            inProgress = !inProgress && props.proposalDetailsInProgress;

                            const content = proposal && proposal.content
                                ? JSON.parse(proposal.content) : {};
                            return (
                                <div
                                    key={index}
                                    className="card"
                                    onClick={() => handleProposal(proposal)}>
                                    <span className="number">
                                        {proposal.id}
                                    </span>
                                    <div className="card_heading">
                                        <h2 onClick={() => props.handleShow(proposal)}> {
                                            content?.title
                                        }</h2>
                                        {proposal.status === 3 || proposal.status === 'passed'
                                            ? <Icon className="success" icon="success"/>
                                            : (proposal.status === 2 || proposal.status === 'voting') &&
                                            votedOption
                                                ? <div className="details">
                                                    <p>your vote is taken: <b>
                                                        {votedOption && (votedOption.vote === 1 || votedOption.vote === 'yay') ? 'Yes'
                                                            : votedOption && (votedOption.vote === 2 || votedOption.vote === 'abstain') ? 'Abstain'
                                                                : votedOption && (votedOption.vote === 3 || votedOption.vote === 'nay') ? 'No'
                                                                    : votedOption && (votedOption.vote === 4 || votedOption.vote === 'VOTE_OPTION_NO_WITH_VETO') ? 'NoWithVeto'
                                                                        : votedOption && votedOption.vote}
                                                    </b></p>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => props.handleShow(proposal)}>
                                                        Details
                                                    </Button>
                                                </div>
                                                : proposal.status === 2 || proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD'
                                                    ? <Button
                                                        className="vote_button"
                                                        variant="contained"
                                                        onClick={() => props.handleShow(proposal)}>
                                                        Vote
                                                    </Button>
                                                    : null}
                                    </div>
                                    <p className="description">{content?.abstract}</p>
                                    <div className="row">
                                        <div className="icon_info">
                                            <Icon className="person" icon="person"/>
                                            <span className="key_text">Proposer &nbsp;/&nbsp;
                                                {inProgress
                                                    ? <DotsLoading/>
                                                    : proposal && proposal.author && <div className="hash_text" title={proposal.author}>
                                                        <p className="name">{proposal.author}</p>
                                                        {proposal.author &&
                                                        proposal.author.slice(proposal.author.length - 6, proposal.author.length)}
                                                    </div>}
                                            </span>
                                        </div>
                                        {content && content.created
                                            ? <p className="key_text">Submitted
                                                on &nbsp;/&nbsp; {moment(fixDateString(content.created)).format('DD-MMM-YYYY HH:mm:ss')}</p>
                                            : null}
                                    </div>
                                    <div className="row">
                                        <div className="icon_info">
                                            <Icon className="time" icon="time"/>
                                            <p className="key_text">Voting Period</p>
                                            <p className="value_text">
                                                {`${proposal && proposal.startTime
                                                    ? moment.unix(proposal.startTime).format('DD-MMM-YYYY HH:mm:ss') : ''} -> 
                                                ${proposal && proposal.endTime
                                                    ? moment.unix(proposal.endTime).format('DD-MMM-YYYY HH:mm:ss') : ''}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={ClassNames('status', (proposal.status === 2 ||
                                        proposal.status === 'voting')
                                        ? 'voting_period'
                                        : (proposal.status === 4 ||
                                            proposal.status === 'rejected')
                                            ? 'rejected'
                                            : null)}>
                                        <p>Proposal Status: {
                                            proposal.status === 0 ||
                                            proposal.status === 'pending' ? 'Nil'
                                                : proposal.status === 1 ||
                                                proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD' ? 'DepositPeriod'
                                                    : proposal.status === 2 ||
                                                    proposal.status === 'voting' ? 'VotingPeriod'
                                                        : proposal.status === 3 ||
                                                        proposal.status === 'passed' ? 'Passed'
                                                            : proposal.status === 4 ||
                                                            proposal.status === 'rejected' ? 'Rejected'
                                                                : proposal.status === 5 ||
                                                                proposal.status === 'PROPOSAL_STATUS_FAILED' ? 'Failed' : ''
                                        }</p>
                                    </div>
                                    <div className="vote_details">
                                        <div className="yes">
                                            <span/>
                                            <p>YES ({VoteCalculation(proposal, 'yayVotes')})</p>
                                        </div>
                                        <div className="no">
                                            <span/>
                                            <p>NO ({VoteCalculation(proposal, 'nayVotes')})</p>
                                        </div>
                                        {/* <div className="option3">
                                            <span/>
                                            <p>NoWithVeto ({VoteCalculation(proposal, 'no_with_veto_count')})</p>
                                        </div> */}
                                        <div className="option4">
                                            <span/>
                                            <p>Abstain ({VoteCalculation(proposal, 'abstainVotes')})</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })}
            </div>
            {/* {!props.home && <div className="pagination">
                <Pagination
                    count={count}
                    page={page}
                    onChange={handleChangePage}/>
            </div>} */}
        </div>
    );
};

Cards.propTypes = {
    handleShow: PropTypes.func.isRequired,
    proposalDetails: PropTypes.object.isRequired,
    proposalDetailsInProgress: PropTypes.bool.isRequired,
    tallyDetails: PropTypes.object.isRequired,
    voteDetails: PropTypes.array.isRequired,
    cards: PropTypes.array,
    home: PropTypes.bool,
    proposals: PropTypes.array,
    proposalsInProgress: PropTypes.bool,
    router: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        proposalDetails: state.proposals.proposalDetails.value,
        proposalDetailsInProgress: state.proposals.proposalDetails.inProgress,
        proposalsInProgress: state.proposals._.inProgress,
        voteDetails: state.proposals.voteDetails.value,
        tallyDetails: state.proposals.tallyDetails.value,
    };
};

const actionToProps = {
    handleShow: showProposalDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(Cards));
