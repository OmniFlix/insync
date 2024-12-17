import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import {
    hideClaimRewardsDialog,
    setTokens,
    showDelegateFailedDialog,
    showDelegateProcessingDialog,
    showDelegateSuccessDialog,
} from '../../../actions/stake';
import { connect } from 'react-redux';
import '../../Stake/DelegateDialog/index.css';
import ValidatorsSelectField from './ValidatorsSelectField';
import { claimTransaction } from '../../../helper';
import { showMessage } from '../../../actions/snackbar';
import { fetchRewards, fetchVestingBalance, getBalance } from '../../../actions/accounts';
import { config } from '../../../config';
import variables from '../../../utils/variables';
import CircularProgress from '../../../components/CircularProgress';
import BigNumber from 'bignumber.js';

const ClaimDialog = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const handleClaimAll = () => {
        setInProgress(true);
        let gasValue = 50000;
        if (props.rewards && props.rewards.length) {
            gasValue = 50000 + ((props.rewards.length - 1) * 30000);
        }

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(gasValue),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

        const msg = [];
        if (props.rewards && props.rewards.length) {
            props.rewards.map((item) => {
                msg.push({
                    source: props.address,
                    validator: item.validator && item.validator.address,
                });

                return null;
            });
        }

        claimTransaction(msg, txs, props.details && props.details.type, handleFetch);
    };

    const handleFetch = (error, result) => {
        setInProgress(false);
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
            props.setTokens(tokens);
            props.successDialog(result.hash);
            props.fetchRewards(props.address);
            props.getBalance(props.address);
            // props.fetchVestingBalance(props.address);
        }
    };

    const handleClaim = () => {
        setInProgress(true);

        const tx = {
            source: props.address,
            validator: props.value,
        };

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000010),
            gasLimit: new BigNumber(50000),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

        claimTransaction(tx, txs, props.details && props.details.type, handleFetch);
    };

    const rewards = props.rewards && props.rewards.length &&
        props.rewards.find((value) => value.validator && value.validator.address === props.value);

    let tokens = rewards && rewards.minDenomAmount;
    tokens = tokens ? tokens / 10 ** config.COIN_DECIMALS : 0;

    if (props.value === 'all' && props.rewards && props.rewards.length) {
        let total = 0;

        props.rewards.map((value) => {
            let rewards = value.minDenomAmount;
            rewards = rewards ? rewards / 10 ** config.COIN_DECIMALS : 0;
            total = rewards + total;

            return total;
        });

        tokens = total;
    }

    const disable = props.value === 'none' || inProgress;

    return (
        <Dialog
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog delegate_dialog claim_dialog"
            open={props.open}
            onClose={props.handleClose}>
            {inProgress && <CircularProgress className="full_screen"/>}
            <DialogContent className="content">
                <h1>Claim Rewards</h1>
                <p>Select validator</p>
                <ValidatorsSelectField/>
                {tokens && tokens > 0
                    ? <p>rewards: {tokens.toFixed(4)}</p>
                    : null}
            </DialogContent>
            <DialogActions className="footer">
                <Button
                    disabled={disable}
                    variant="contained"
                    onClick={props.value === 'all' ? handleClaimAll : handleClaim}>
                    {inProgress
                        ? variables[props.lang]['approval_pending']
                        : variables[props.lang].claim}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ClaimDialog.propTypes = {
    details: PropTypes.object.isRequired,
    failedDialog: PropTypes.func.isRequired,
    fetchRewards: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    rewards: PropTypes.shape({
        rewards: PropTypes.array,
        total: PropTypes.array,
    }).isRequired,
    setTokens: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    address: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        open: state.stake.claimDialog.open,
        value: state.stake.claimDialog.validator,
        rewards: state.accounts.rewards.result,
        details: state.accounts.address.details,
    };
};

const actionToProps = {
    handleClose: hideClaimRewardsDialog,
    failedDialog: showDelegateFailedDialog,
    successDialog: showDelegateSuccessDialog,
    pendingDialog: showDelegateProcessingDialog,
    getBalance,
    fetchVestingBalance,
    showMessage,
    fetchRewards,
    setTokens,
};

export default connect(stateToProps, actionToProps)(ClaimDialog);
