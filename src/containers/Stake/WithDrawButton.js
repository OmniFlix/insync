import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { fetchUnBondingValidators, getDelegatedValidatorsDetails, showDelegateDialog, showDelegateFailedDialog, showDelegateProcessingDialog, showDelegateSuccessDialog } from '../../actions/stake';
import { showMessage } from '../../actions/snackbar';
import { withdrawTransaction } from 'helper';
import { config } from '../../config';
import BigNumber from 'bignumber.js';
import { fetchRewards, getBalance, getDelegations } from 'actions/accounts';

const WithDrawButton = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const [approval, setApproval] = useState(false);

    const handleClick = () => {
        setInProgress(true);

        if (!props.address) {
            props.showMessage(variables[props.lang]['connect_account']);
            return;
        }

        const tx = {
            source: props.address,
            validator: props.validator,
        };

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000001),
            gasLimit: new BigNumber(50000),
            chainId: config.CHAIN_ID,
            publicKey: props.details && props.details.publicKey,
        };

        setApproval(true);
        withdrawTransaction(tx, txs, props.revealPublicKey, props.details && props.details.type, handleFetch);
    };

    const handleFetch = (error, value, approval) => {
        if (approval) {
            setApproval(false);
            return;
        }

        if (error) {
            setInProgress(false);
            setApproval(false);
            if (error.indexOf('not yet found on the chain') > -1) {
                props.pendingDialog();
                return;
            }
            props.failedDialog();
            props.showMessage(error);
            return;
        }
        let balance = null;
        props.balance && props.balance.length && props.balance.map((val) => {
            if (val && val.length) {
                val.map((value) => {
                    if (value === config.TOKEN_ADDRESS) {
                        balance = val[1];
                    }
                });
            }

            return null;
        });

        const available = balance;
        const intervalTime = setInterval(() => {
            props.getBalance(props.address, (result) => {
                if (result && result.length) {
                    let localBalance = null;
                    result && result.length && result.map((val) => {
                        if (val && val.length) {
                            val.map((value) => {
                                if (value === config.TOKEN_ADDRESS) {
                                    localBalance = val[1];
                                }
                            });
                        }

                        return null;
                    });

                    if (localBalance !== available) {
                        setInProgress(false);
                        setApproval(false);
                        clearInterval(intervalTime);
                        props.successDialog(value && value.hash);
                        updateBalance();
                    }
                }
            });
        }, 2000);

        if (intervalTime) {
            setTimeout(() => {
                setInProgress(false);
                setApproval(false);
                clearInterval(intervalTime);
            }, 60000);
        }
    };

    const updateBalance = () => {
        setTimeout(() => {
            props.getBalance(props.address);
        }, 4000);
        props.getDelegations(props.address);
        props.fetchRewards(props.address);
        props.getDelegatedValidatorsDetails(props.address);
        props.fetchUnBondingValidators(props.address);
    };

    return (
        <Button
            className="delegate_button"
            variant="outlined"
            disabled={inProgress}
            onClick={handleClick}>
            {approval
                ? 'Approval pending...'
                : inProgress
                    ? 'InProgress...' : 'Withdraw'}
        </Button>
    );
};

WithDrawButton.propTypes = {
    handleOpen: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    address: PropTypes.string,
    valAddress: PropTypes.string,
    balance: PropTypes.array.isRequired,
    delegations: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    failedDialog: PropTypes.func.isRequired,
    fetchRewards: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    failedDialog: PropTypes.func.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    genesisValidatorList: PropTypes.object.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    fetchRewards: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    fetchUnBondingValidators: PropTypes.func.isRequired,
    fetchUnBondingValidators: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    pendingDialog: PropTypes.func.isRequired,
    selectedMultiValidatorArray: PropTypes.array.isRequired,
    showMessage: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    vestingBalance: PropTypes.object.isRequired,
    address: PropTypes.string,
    amount: PropTypes.any,
    revealPublicKey: PropTypes.object,
    toValidator: PropTypes.string,
    validator: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        balance: state.accounts.balance.result,
        delegations: state.accounts.delegations.result,
        lang: state.language,
        open: state.stake.delegateDialog.open,
        name: state.stake.delegateDialog.name,
        address: state.accounts.address.value,
        amount: state.stake.tokens,
        vestingBalance: state.accounts.vestingBalance.result,
        revealPublicKey: state.accounts.revealPublicKey.result,
        toValidator: state.stake.toValidator.value,
        selectedMultiValidatorArray: state.stake.selectMultiValidators.list,
        details: state.accounts.address.details,
        genesisValidatorList: state.stake.genesisValidators.list,
    };
};

const actionToProps = {
    handleOpen: showDelegateDialog,
    showMessage,
    successDialog: showDelegateSuccessDialog,
    failedDialog: showDelegateFailedDialog,
    pendingDialog: showDelegateProcessingDialog,
    getBalance,
    getDelegations,
    fetchRewards,
    getDelegatedValidatorsDetails,
    fetchUnBondingValidators,
};

export default connect(stateToProps, actionToProps)(WithDrawButton);
