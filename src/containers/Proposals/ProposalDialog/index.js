import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import './index.css';
import {
    fetchProposalDetails,
    fetchProposalTally,
    fetchVoteDetails,
    getProposals,
    hideProposalDialog,
    showProposalDialog,
} from '../../../actions/proposals';
import Icon from '../../../components/Icon';
import Voting from './Voting';
import moment from 'moment';
import ClassNames from 'classnames';
import { formatCount, tally } from '../../../utils/numberFormats';
import NavBar from '../../NavBar';
import variables from '../../../utils/variables';
import UnSuccessDialog from '../../Stake/DelegateDialog/UnSuccessDialog';
import PendingDialog from '../../Stake/DelegateDialog/PendingDialog';
import SuccessDialog from '../../Stake/DelegateDialog/SuccessDialog';
import withRouter from '../../../components/WithRouter';
import { fixDateString } from 'utils/date';

class ProposalDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            show: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.VoteCalculation = this.VoteCalculation.bind(this);
    }

    componentDidMount () {
        let votedOption = this.props.voteDetails && this.props.voteDetails.length && this.props.proposal && this.props.proposal.id &&
            this.props.voteDetails.filter((vote) => vote.proposal_id === this.props.proposal.id)[0];
        if (votedOption && votedOption.options && votedOption.options.length && votedOption.options[0]) {
            votedOption = votedOption.options[0];
        }
        if (!votedOption && this.props.proposal && this.props.proposal.id && this.props.address) {
            this.props.fetchVoteDetails(this.props.proposal.id, this.props.address);
        }

        if (this.props.router && this.props.router.params && this.props.router.params.proposalID) {
            if (this.props.proposal && !this.props.proposal.id) {
                this.props.getProposals((result) => {
                    if (result && result.length) {
                        const proposal = result.find((val) => val.id === this.props.router.params.proposalID);
                        this.props.showProposalDialog(proposal);
                        if (proposal && (proposal.status === 2 || proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD')) {
                            this.props.fetchProposalTally(proposal.id);
                        }
                    }
                });
            }

            if (this.props.proposalDetails && !this.props.proposalDetails[this.props.router.params.proposalID]) {
                this.props.fetchProposalDetails(this.props.router.params.proposalID);
            }
        }
    }

    handleChange () {
        this.setState({
            show: !this.state.show,
        });
    }

    VoteCalculation (val) {
        const { proposal } = this.props;

        if (proposal && (proposal.status === 2 || proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD')) {
            const value = this.props.tallyDetails && this.props.tallyDetails[proposal.id];
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

            return (this.props.tallyDetails && this.props.tallyDetails[proposal.id] && this.props.tallyDetails[proposal.id][val1]
                ? tally(this.props.tallyDetails[proposal.id][val1], sum) : '0%');
        } else {
            const sum = proposal && proposal.yayVotes && proposal.nayVotes && proposal.abstainVotes &&
                (parseInt(proposal.yayVotes) + parseInt(proposal.nayVotes) + parseInt(proposal.abstainVotes));

            return (proposal && proposal[val]
                ? tally(proposal[val], sum) : '0%');
        }
    }

    handleClose () {
        this.props.router.navigate('/proposals');
        this.props.handleClose();
    }

    render () {
        let votedOption = this.props.voteDetails && this.props.voteDetails.length &&
            this.props.proposal && this.props.proposal.id &&
            this.props.voteDetails.filter((vote) => vote && ((String(vote.proposalId) === String(this.props.proposal.id)) || (String(vote.proposalId) === '0' && String(this.props.proposal.id) === '0')));
        if (votedOption && votedOption.length && votedOption[0]) {
            votedOption = votedOption[0];
        }
        const content = this.props.proposal && this.props.proposal.content
        ? JSON.parse(this.props.proposal.content) : {};
        return (
            <div className="proposals">
                <NavBar proposalTab={true}/>
                {this.props.proposalsInProgress
                    ? <div className="proposals_content padding">
                        <div className="cards_content loading_card">Loading...</div>
                    </div>
                    : this.props.proposal && this.props.proposal.id
                        ? <div className="proposal_dialog padding">
                            <div className="content">
                                <IconButton className="close_button" onClick={this.handleClose}>
                                    <Icon className="close" icon="close"/>
                                </IconButton>
                                <div className="proposal_dialog_section1">
                                    <div
                                        className="proposal_dialog_section1_header">{content?.title}</div>
                                    <div
                                        className={ClassNames('proposal_dialog_section1_status', this.props.proposal &&
                                        (this.props.proposal.status === 2 || this.props.proposal.status === 'voting')
                                            ? 'voting_period'
                                            : this.props.proposal && (this.props.proposal.status === 4 ||
                                                this.props.proposal.status === 'rejected')
                                                ? 'rejected'
                                                : null)}> Proposal
                                        Status: &nbsp;{this.props.proposal && this.props.proposal.status
                                            ? this.props.proposal.status === 0 ||
                                            this.props.proposal.status === 'pending' ? 'Nil'
                                                : this.props.proposal.status === 1 ||
                                                this.props.proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD' ? 'DepositPeriod'
                                                    : this.props.proposal.status === 2 ||
                                                    this.props.proposal.status === 'voting' ? 'VotingPeriod'
                                                        : this.props.proposal.status === 3 ||
                                                        this.props.proposal.status === 'passed' ? 'Passed'
                                                            : this.props.proposal.status === 4 ||
                                                            this.props.proposal.status === 'rejected' ? 'Rejected'
                                                                : this.props.proposal.status === 5 ||
                                                                this.props.proposal.status === 'PROPOSAL_STATUS_FAILED' ? 'Failed' : ''
                                            : ''}</div>
                                </div>
                                <div className="proposal_dialog_section2">
                                    <pre
                                        className={ClassNames('proposal_dialog_section2_content', this.state.show ? 'show_more' : '')}>
                                        {content?.abstract}
                                        <br/>
                                        {content?.details}
                                    </pre>
                                    <div
                                        className="proposal_dialog_section2_more"
                                        onClick={this.handleChange}>
                                        {this.state.show
                                            ? 'Read Less...'
                                            : 'Read More...'}
                                    </div>
                                </div>
                                <div className="proposal_dialog_section3">
                                    <div className="proposal_dialog_section3_left">
                                        <div className="pds3l_c">
                                            <p className="pds3l_c1">Proposer</p>
                                            {this.props.proposal?.author && <div className="pds3l_c2 hash_text" title={this.props.proposal.author}>
                                                <p className="name">{this.props.proposal.author}</p>
                                                {this.props.proposal.author &&
                                                    this.props.proposal.author.slice(this.props.proposal.author.length - 6, this.props.proposal.author.length)}
                                            </div>}
                                        </div>
                                        <div className="pds3l_c">
                                            <p className="pds3l_c1">Submitted on</p>
                                            <p className="pds3l_c2">{content && content.created
                                                ? moment(fixDateString(content.created)).format('DD-MMM-YYYY HH:mm:ss') : ''}</p>
                                        </div>
                                        <div className="pds3l_c">
                                            <p className="pds3l_c1">Voting Period</p>
                                            <div className="pds3l_c2 vp_cards">
                                                <p>{this.props.proposal && this.props.proposal.startTime
                                                    ? moment.unix(this.props.proposal.startTime).format('DD-MMM-YYYY HH:mm:ss') : ''}</p>
                                                <p>{this.props.proposal && this.props.proposal.endTime
                                                    ? moment.unix(this.props.proposal.endTime).format('DD-MMM-YYYY HH:mm:ss') : ''}</p>
                                            </div>
                                        </div>
                                        <div className="pds3l_c">
                                            <p className="pds3l_c1">Voting Status</p>
                                            <div className={ClassNames('pds3l_c2 vote_details',
                                                this.props.proposal && (this.props.proposal.status === 2 ||
                                                    this.props.proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD') ? 'vote_in_progress' : '')}>
                                                <div className="yes">
                                                    <div>
                                                        <span/>
                                                        <p>YES ({this.VoteCalculation('yayVotes')})</p>
                                                    </div>
                                                    <p className="total_nam_count">{formatCount(this.props && this.props.proposal && this.props.proposal.yayVotes)} NAM</p>
                                                </div>
                                                <div className="no">
                                                    <div>
                                                        <span/>
                                                        <p>NO ({this.VoteCalculation('nayVotes')})</p>
                                                    </div>
                                                    <p className="total_nam_count">{formatCount(this.props && this.props.proposal && this.props.proposal.nayVotes)} NAM</p>
                                                </div>
                                                {/* <div className="option3">
                                                    <span/>
                                                    <p>NoWithVeto ({this.VoteCalculation('no_with_veto_count')})</p>
                                                </div> */}
                                                <div className="option4">
                                                    <div>
                                                        <span/>
                                                        <p>Abstain ({this.VoteCalculation('abstainVotes')})</p>
                                                    </div>
                                                    <p className="total_nam_count">{formatCount(this.props && this.props.proposal && this.props.proposal.abstainVotes)} NAM</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pds3l_c">
                                            <p className="pds3l_c1">Type</p>
                                            <p className="pds3l_c2 type">{this.props.proposal && this.props.proposal.type
                                                ? this.props.proposal.type
                                                : null}</p>
                                        </div>
                                    </div>
                                    {this.props.proposal && (this.props.proposal.status === 2 ||
                                        this.props.proposal.status === 'voting') && !this.props.voteDetailsInProgress
                                        ? <Voting proposalId={this.props.proposal && this.props.proposal.id}/>
                                        : null}
                                </div>
                                {votedOption && votedOption.voterAddress
                                    ? <div className="already_voted">
                                        <Icon className="right-arrow" icon="right-arrow"/>
                                        <p>{`you voted “${
                                            votedOption && (votedOption.vote === 1 || votedOption.vote === 'yay') ? 'Yes'
                                                : votedOption && (votedOption.vote === 2 || votedOption.vote === 'abstain') ? 'Abstain'
                                                    : votedOption && (votedOption.vote === 3 || votedOption.vote === 'nay') ? 'No'
                                                        : votedOption && (votedOption.vote === 4 || votedOption.vote === 'VOTE_OPTION_NO_WITH_VETO') ? 'NoWithVeto'
                                                            : votedOption && votedOption.vote
                                        }” for this proposal`}</p>
                                    </div>
                                    : null}
                            </div>
                        </div>
                        : <div className="proposal_dialog padding">
                            <div className="content loading_card">
                                {variables[this.props.lang]['no_data_found']}
                                <IconButton className="close_button" onClick={this.handleClose}>
                                    <Icon className="close" icon="close"/>
                                </IconButton>
                            </div>
                        </div>}
                <UnSuccessDialog/>
                <PendingDialog/>
                <SuccessDialog/>
            </div>
        );
    }
}

ProposalDialog.propTypes = {
    fetchProposalDetails: PropTypes.func.isRequired,
    fetchProposalTally: PropTypes.func.isRequired,
    fetchVoteDetails: PropTypes.func.isRequired,
    getProposals: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    proposalDetails: PropTypes.object.isRequired,
    showProposalDialog: PropTypes.func.isRequired,
    tallyDetails: PropTypes.object.isRequired,
    voteDetails: PropTypes.array.isRequired,
    voteDetailsInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
    proposal: PropTypes.object,
    proposalsInProgress: PropTypes.bool,
    router: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }).isRequired,
    }),
    votes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            voter: PropTypes.string.isRequired,
            option: PropTypes.number,
        }),
    ),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        proposalsInProgress: state.proposals._.inProgress,
        proposalDetails: state.proposals.proposalDetails.value,
        proposal: state.proposals.dialog.value,
        votes: state.proposals.votes.list,
        address: state.accounts.address.value,
        voteDetails: state.proposals.voteDetails.value,
        voteDetailsInProgress: state.proposals.voteDetails.inProgress,
        tallyDetails: state.proposals.tallyDetails.value,
    };
};

const actionToProps = {
    handleClose: hideProposalDialog,
    fetchProposalDetails,
    fetchProposalTally,
    fetchVoteDetails,
    getProposals,
    showProposalDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(ProposalDialog));
