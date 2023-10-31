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
import { withRouter } from 'react-router';

const Cards = (props) => {
    const [page, setPage] = useState(1);
    let rowsPerPage = 15;
    if (props.home) {
        rowsPerPage = 6;
    }

    const handleChangePage = (event, page) => {
        setPage(page);
    };

    const count = Math.ceil(props.proposals.length / rowsPerPage);

    const reversedItems = props.proposals.length &&
        props.proposals.map(function iterateItems (item) {
            return item;
        }).reverse();

    const VoteCalculation = (proposal, val) => {
        if (proposal.status === 2 || proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD') {
            const value = props.tallyDetails && props.tallyDetails[proposal.id];
            const sum = value && value.yes_count && value.no_count && value.no_with_veto_count && value.abstain_count &&
                (parseInt(value.yes_count) + parseInt(value.no_count) + parseInt(value.no_with_veto_count) + parseInt(value.abstain_count));

            return (props.tallyDetails && props.tallyDetails[proposal.id] && props.tallyDetails[proposal.id][val]
                ? tally(props.tallyDetails[proposal.id][val], sum) : '0%');
        } else {
            const sum = proposal.final_tally_result && proposal.final_tally_result.yes_count &&
                proposal.final_tally_result.no_count && proposal.final_tally_result.no_with_veto_count &&
                proposal.final_tally_result.abstain_count &&
                (parseInt(proposal.final_tally_result.yes_count) + parseInt(proposal.final_tally_result.no_count) +
                    parseInt(proposal.final_tally_result.no_with_veto_count) + parseInt(proposal.final_tally_result.abstain_count));

            return (proposal && proposal.final_tally_result &&
            proposal.final_tally_result[val]
                ? tally(proposal.final_tally_result[val], sum) : '0%');
        }
    };

    const handleProposal = (proposal) => {
        props.history.push(`/proposals/${proposal.id}`);
        props.handleShow(proposal);
    };

    return (
        <div className="cards_content">
            <div className="cards">
                {reversedItems.length &&
                    reversedItems.map((proposal, index) => {
                        if (index < (page * rowsPerPage) && index >= (page - 1) * rowsPerPage) {
                            const votedOption = props.voteDetails && props.voteDetails.length &&
                                proposal && proposal.id &&
                                props.voteDetails.filter((vote) => vote.id === proposal.id)[0];
                            let proposer = proposal.proposer;
                            props.proposalDetails && Object.keys(props.proposalDetails).length &&
                            Object.keys(props.proposalDetails).filter((key) => {
                                if (key === proposal.id) {
                                    if (props.proposalDetails[key] &&
                                        props.proposalDetails[key][0] &&
                                        props.proposalDetails[key][0].body &&
                                        props.proposalDetails[key][0].body.messages &&
                                        props.proposalDetails[key][0].body.messages.length &&
                                        props.proposalDetails[key][0].body.messages[0].proposer) {
                                        proposer = props.proposalDetails[key][0].body.messages[0].proposer;
                                    }
                                }

                                return null;
                            });
                            let inProgress = props.proposalDetails && Object.keys(props.proposalDetails).length &&
                                Object.keys(props.proposalDetails).find((key) => key === proposal.id);
                            inProgress = !inProgress && props.proposalDetailsInProgress;

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
                                            proposal.title
                                        }</h2>
                                        {proposal.status === 3 || proposal.status === 'PROPOSAL_STATUS_PASSED'
                                            ? <Icon className="success" icon="success"/>
                                            : (proposal.status === 2 || proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD') &&
                                            votedOption
                                                ? <div className="details">
                                                    <p>your vote is taken: <b>
                                                        {votedOption && votedOption.option === 1 ? 'Yes'
                                                            : votedOption && votedOption.option === 2 ? 'Abstain'
                                                                : votedOption && votedOption.option === 3 ? 'No'
                                                                    : votedOption && votedOption.option === 4 ? 'NoWithVeto'
                                                                        : votedOption && votedOption.option}
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
                                    <p className="description">{proposal.summary}</p>
                                    <div className="row">
                                        <div className="icon_info">
                                            <Icon className="person" icon="person"/>
                                            <span className="key_text">Proposer &nbsp;/&nbsp;
                                                {inProgress
                                                    ? <DotsLoading/>
                                                    : proposer && <div className="hash_text" title={proposer}>
                                                        <p className="name">{proposer}</p>
                                                        {proposer &&
                                                        proposer.slice(proposer.length - 6, proposer.length)}
                                                    </div>}
                                            </span>
                                        </div>
                                        <p className="key_text">Submitted on &nbsp;/&nbsp; {proposal.submit_time
                                            ? moment(proposal.submit_time).format('DD-MMM-YYYY HH:mm:ss') : ''}</p>
                                    </div>
                                    <div className="row">
                                        <div className="icon_info">
                                            <Icon className="time" icon="time"/>
                                            <p className="key_text">Voting Period</p>
                                            <p className="value_text">
                                                {`${proposal && proposal.voting_start_time
                                                    ? moment(proposal.voting_start_time).format('DD-MMM-YYYY HH:mm:ss') : ''} -> 
                                                ${proposal && proposal.voting_end_time
                                    ? moment(proposal.voting_end_time).format('DD-MMM-YYYY HH:mm:ss') : ''}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={ClassNames('status', (proposal.status === 2 ||
                                        proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD')
                                        ? 'voting_period'
                                        : (proposal.status === 4 ||
                                            proposal.status === 'PROPOSAL_STATUS_REJECTED')
                                            ? 'rejected'
                                            : null)}>
                                        <p>Proposal Status: {
                                            proposal.status === 0 ||
                                            proposal.status === 'PROPOSAL_STATUS_UNSPECIFIED' ? 'Nil'
                                                : proposal.status === 1 ||
                                                proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD' ? 'DepositPeriod'
                                                    : proposal.status === 2 ||
                                                    proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD' ? 'VotingPeriod'
                                                        : proposal.status === 3 ||
                                                        proposal.status === 'PROPOSAL_STATUS_PASSED' ? 'Passed'
                                                            : proposal.status === 4 ||
                                                            proposal.status === 'PROPOSAL_STATUS_REJECTED' ? 'Rejected'
                                                                : proposal.status === 5 ||
                                                                proposal.status === 'PROPOSAL_STATUS_FAILED' ? 'Failed' : ''
                                        }</p>
                                    </div>
                                    <div className="vote_details">
                                        <div className="yes">
                                            <span/>
                                            <p>YES ({VoteCalculation(proposal, 'yes_count')})</p>
                                        </div>
                                        <div className="no">
                                            <span/>
                                            <p>NO ({VoteCalculation(proposal, 'no_count')})</p>
                                        </div>
                                        <div className="option3">
                                            <span/>
                                            <p>NoWithVeto ({VoteCalculation(proposal, 'no_with_veto_count')})</p>
                                        </div>
                                        <div className="option4">
                                            <span/>
                                            <p>Abstain ({VoteCalculation(proposal, 'abstain_count')})</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })}
            </div>
            {!props.home && <div className="pagination">
                <Pagination
                    count={count}
                    page={page}
                    onChange={handleChangePage}/>
            </div>}
        </div>
    );
};

Cards.propTypes = {
    handleShow: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    proposalDetails: PropTypes.object.isRequired,
    proposalDetailsInProgress: PropTypes.bool.isRequired,
    tallyDetails: PropTypes.object.isRequired,
    voteDetails: PropTypes.array.isRequired,
    cards: PropTypes.array,
    home: PropTypes.bool,
    proposals: PropTypes.array,
    proposalsInProgress: PropTypes.bool,
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
