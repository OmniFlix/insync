import React from 'react';
import * as PropTypes from 'prop-types';
import { fetchProposalTally, fetchVoteDetails, hideProposalDialog } from '../../../actions/proposals';
import { connect } from 'react-redux';
import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import CircularProgress from '../../../components/CircularProgress';
import { aminoSignTxAndBroadcast } from '../../../helper';
import { config } from '../../../config';
import variables from '../../../utils/variables';
import { showMessage } from '../../../actions/snackbar';
import { showDelegateFailedDialog, showDelegateProcessingDialog } from '../../../actions/stake';

const Voting = (props) => {
    const [value, setValue] = React.useState('');
    const [inProgress, setInProgress] = React.useState(false);

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

        const option = value === 'Yes' ? 1
            : value === 'Abstain' ? 2
                : value === 'No' ? 3
                    : value === 'NoWithVeto' ? 4 : null;

        const tx = {
            msg: {
                type: 'cosmos-sdk/MsgVote',
                value: {
                    option: option,
                    proposal_id: props.proposalId,
                    voter: props.address,
                },
            },
            fee: {
                amount: [{
                    amount: String(5000),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(200000),
            },
            memo: '',
        };

        aminoSignTxAndBroadcast(tx, props.address, (error, result) => {
            setInProgress(false);
            console.log('55555555', error, result);
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
                props.handleClose();
                props.fetchVoteDetails(props.proposalId, props.address);
                props.fetchProposalTally(props.proposalId);
            }
        });
    };

    const disable = value === '';

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
                    <FormControlLabel control={<Radio/>} label="NoWithVeto" value="NoWithVeto"/>
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
                        {inProgress ? <CircularProgress/>
                            : 'Confirm'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

Voting.propTypes = {
    failedDialog: PropTypes.func.isRequired,
    fetchProposalTally: PropTypes.func.isRequired,
    fetchVoteDetails: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    address: PropTypes.string,
    proposalId: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
    };
};

const actionToProps = {
    fetchProposalTally,
    fetchVoteDetails,
    failedDialog: showDelegateFailedDialog,
    pendingDialog: showDelegateProcessingDialog,
    handleClose: hideProposalDialog,
    showMessage,
};

export default connect(stateToProps, actionToProps)(Voting);
