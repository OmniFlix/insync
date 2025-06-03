import React from 'react';
import * as PropTypes from 'prop-types';
import { fetchProposalTally, fetchVoteDetails, hideProposalDialog } from '../../../actions/proposals';
import { connect } from 'react-redux';
import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import CircularProgress from '../../../components/CircularProgress';
import { config } from '../../../config';
import variables from '../../../utils/variables';
import { showMessage } from '../../../actions/snackbar';
import {
    showDelegateFailedDialog,
    showDelegateProcessingDialog,
    showDelegateSuccessDialog,
} from '../../../actions/stake';
import { fetchVestingBalance, getBalance } from '../../../actions/accounts';
import Long from 'long';
import { voteTransaction } from 'helper';
import BigNumber from 'bignumber.js';

const Voting = (props) => {
    const [value, setValue] = React.useState('');
    const [approval, setApproval] = React.useState(false);
    const [inProgress, setInProgress] = React.useState(false);

    React.useEffect(() => {
        if (!props.voteDetails || !props.proposal) return;

        const votedOption = props.voteDetails && props.voteDetails.find((vote) =>
            vote &&
            (String(vote.proposalId) === String(props.proposal.id) ||
             (String(vote.proposalId) === '0' && String(props.proposal.id) === '0'))
        );

        if (votedOption && votedOption.vote !== undefined) {
            switch (votedOption.vote) {
                case 1:
                case 'yay':
                    setValue('Yes');
                    break;
                case 2:
                case 'abstain':
                    setValue('Abstain');
                    break;
                case 3:
                case 'nay':
                    setValue('No');
                    break;
                case 4:
                case 'VOTE_OPTION_NO_WITH_VETO':
                    setValue('NoWithVeto');
                    break;
                default:
                    break;
            }
        }
    }, [props.voteDetails, props.proposal]);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !disable) {
            handleVote();
        }
    };

    const handleVote = () => {
        if (!props.address) {
            props.showMessage(variables[props.lang]['connect_account']);
            return;
        }

        setInProgress(true);

        const option = value === 'Yes' ? 'yay'
            : value === 'Abstain' ? 'abstain'
                : value === 'No' ? 'nay'
                    : null;

        const tx = {
            voter: props.address,
            proposalId: Long.fromString(props.proposalId),
            option: option,
        };

        if (props.name === 'Delegate' || props.name === 'Stake') {
            tx.nativeToken = 'NAAN';
        }

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(50000),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

        setApproval(true);
        voteTransaction(tx, txs, props.details && props.details.type, handleFetch);
    };

    const handleFetch = (error, result, approval) => {
        if (approval) {
            setApproval(false);
            return;
        }
        setInProgress(false);
        setApproval(false);
        if (error) {
            if (error.indexOf('not yet found on the chain') > -1) {
                props.pendingDialog();
                return;
            }
            props.failedDialog();
            props.showMessage(error);
            return;
        }
        if (result) {
            props.successDialog(value && value.hash);
            props.fetchVoteDetails(props.proposalId, props.address);
            props.fetchProposalTally(props.proposalId);
            props.getBalance(props.address);
            props.fetchVestingBalance(props.address);
        }
    };

    const disable = value === '' || approval || inProgress;

    return (
        <div className="proposal_dialog_section3_right">
            <p className="pds3r_heading">Please choose your vote</p>
            <form
                noValidate
                autoComplete="off"
                className="voting_card"
                onKeyPress={handleKeyPress}
                onSubmit={(e) => {
                    e.preventDefault();
                }}>
                <RadioGroup name="voting" value={value} onChange={handleChange}>
                    <FormControlLabel control={<Radio/>} label="Yes" value="Yes"/>
                    <FormControlLabel control={<Radio/>} label="No" value="No"/>
                    {/* <FormControlLabel control={<Radio/>} label="NoWithVeto" value="NoWithVeto"/> */}
                    <FormControlLabel control={<Radio/>} label="Abstain" value="Abstain"/>
                </RadioGroup>
                <div className="buttons_div">
                    <Button
                        className="cancel_button"
                        variant="outlined"
                        onClick={props.handleClose}>
                        Cancel
                    </Button>
                    <Button
                        className="confirm_button"
                        disabled={disable}
                        variant="contained"
                        onClick={handleVote}>
                        {approval
                            ? 'Approval pending...'
                            : inProgress
                                ? 'InProgress...' : 'Confirm'}
                         {inProgress || approval ? <CircularProgress className="action_loader"/>
                            : null}
                    </Button>
                </div>
            </form>
        </div>
    );
};

Voting.propTypes = {
    details: PropTypes.object.isRequired,
    failedDialog: PropTypes.func.isRequired,
    fetchProposalTally: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    fetchVoteDetails: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    voteDetails: PropTypes.array.isRequired,
    address: PropTypes.string,
    proposalId: PropTypes.string,
    proposal: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        details: state.accounts.address.details,

        voteDetails: state.proposals.voteDetails.value,
        proposal: state.proposals.dialog.value,
    };
};

const actionToProps = {
    fetchProposalTally,
    fetchVoteDetails,
    getBalance,
    fetchVestingBalance,
    failedDialog: showDelegateFailedDialog,
    successDialog: showDelegateSuccessDialog,
    pendingDialog: showDelegateProcessingDialog,
    handleClose: hideProposalDialog,
    showMessage,
};

export default connect(stateToProps, actionToProps)(Voting);
