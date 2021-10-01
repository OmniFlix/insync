import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import './index.css';
import variables from '../../../utils/variables';
import { hideDelegateDialog, showDelegateFailedDialog, showDelegateSuccessDialog } from '../../../actions/stake';
import ValidatorSelectField from './ValidatorSelectField';
import TokensTextField from './TokensTextField';
import ToValidatorSelectField from './ToValidatorSelectField';
import { signTxAndBroadcast } from '../../../helper';
import { fetchVestingBalance, getBalance, getDelegations, getUnBondingDelegations } from '../../../actions/accounts';
import { showMessage } from '../../../actions/snackbar';
import { config } from '../../../config';

const COIN_DECI_VALUE = 1000000;
const DelegateDialog = (props) => {
    const [inProgress, setInProgress] = useState(false);
    const handleDelegateType = () => {
        setInProgress(true);
        const updatedTx = {
            msg: {
                typeUrl: props.name === 'Delegate' || props.name === 'Stake'
                    ? '/cosmos.staking.v1beta1.MsgDelegate' : props.name === 'Undelegate'
                        ? '/cosmos.staking.v1beta1.MsgUndelegate' : props.name === 'Redelegate'
                            ? '/cosmos.staking.v1beta1.MsgBeginRedelegate' : '',
                value: getValueObject(props.name),
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
        signTxAndBroadcast(updatedTx, props.address, (error, result) => {
            setInProgress(false);
            if (error) {
                props.failedDialog();
                props.showMessage(error);
                return;
            }
            if (result) {
                props.successDialog(result.transactionHash);
                updateBalance();
            }
        });
    };

    const updateBalance = () => {
        props.getBalance(props.address);
        props.fetchVestingBalance(props.address);
        props.getDelegations(props.address);
        props.getUnBondingDelegations(props.address);
    };

    const getValueObject = (type) => {
        switch (type) {
        case 'Stake':
        case 'Delegate':
        case 'Undelegate':
            return {
                delegatorAddress: props.address,
                validatorAddress: props.validator,
                amount: {
                    amount: String(props.amount * COIN_DECI_VALUE),
                    denom: config.COIN_MINIMAL_DENOM,
                },
            };
        case 'Redelegate':
            return {
                delegatorAddress: props.address,
                validatorSrcAddress: props.validator,
                validatorDstAddress: props.toValidator,
                amount: {
                    amount: String(props.amount * COIN_DECI_VALUE),
                    denom: config.COIN_MINIMAL_DENOM,
                },
            };
        default:
            return {};
        }
    };

    let staked = props.delegations.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue.balance.amount);
    }, 0);
    const available = (props.balance && props.balance.length && Number(props.balance[0].amount));

    const vesting = props.vestingBalance && props.vestingBalance.value && props.vestingBalance.value['base_vesting_account'] &&
        props.vestingBalance.value['base_vesting_account']['original_vesting'] &&
        props.vestingBalance.value['base_vesting_account']['original_vesting'].reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.amount);
        }, 0);
    const delegatedVesting = props.vestingBalance && props.vestingBalance.value && props.vestingBalance.value['base_vesting_account'] &&
        props.vestingBalance.value['base_vesting_account']['delegated_vesting'] &&
        props.vestingBalance.value['base_vesting_account']['delegated_vesting'].reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.amount);
        }, 0);

    const vestingTokens = vesting - delegatedVesting;

    if (props.validator && (props.name === 'Undelegate' || props.name === 'Redelegate')) {
        const filterList = props.delegations.find((value) => value.delegation &&
            (value.delegation.validator_address === props.validator));
        if (filterList && filterList.balance && filterList.balance.amount) {
            staked = filterList.balance.amount;
        }
    }

    const disable = !props.validator || !props.amount || inProgress ||
        ((props.name === 'Delegate' || props.name === 'Stake') && vestingTokens
            ? props.amount > parseFloat((available + vestingTokens) / (10 ** config.COIN_DECIMALS))
            : props.name === 'Delegate' || props.name === 'Stake'
                ? props.amount > parseFloat(available / (10 ** config.COIN_DECIMALS))
                : props.name === 'Undelegate' || props.name === 'Redelegate'
                    ? props.amount > parseFloat(staked / (10 ** config.COIN_DECIMALS)) : false);

    return (
        <Dialog
            aria-describedby="delegate-dialog-description"
            aria-labelledby="delegate-dialog-title"
            className="dialog delegate_dialog"
            open={props.open}
            onClose={props.handleClose}>
            <DialogContent className="content">
                <h1>{props.name + ' ' + variables[props.lang].tokens}</h1>
                {props.name === 'Redelegate'
                    ? <>
                        <p>From validator</p>
                        <ValidatorSelectField/>
                        <p>To validator</p>
                        <ToValidatorSelectField/>
                    </>
                    : <>
                        <p>Choose the validator</p>
                        <ValidatorSelectField/>
                    </>}
                <p>Enter tokens to {props.name || 'Delegate'}</p>
                <TokensTextField/>
            </DialogContent>
            <DialogActions className="footer">
                <Button
                    disabled={disable}
                    variant="contained"
                    onClick={handleDelegateType}>
                    {inProgress
                        ? variables[props.lang]['approval_pending']
                        : props.name}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

DelegateDialog.propTypes = {
    failedDialog: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    showMessage: PropTypes.func.isRequired,
    successDialog: PropTypes.func.isRequired,
    vestingBalance: PropTypes.object.isRequired,
    address: PropTypes.string,
    amount: PropTypes.any,
    balance: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.any,
            denom: PropTypes.string,
        }),
    ),
    delegations: PropTypes.arrayOf(
        PropTypes.shape({
            validator_address: PropTypes.string,
            balance: PropTypes.shape({
                amount: PropTypes.any,
                denom: PropTypes.string,
            }),
        }),
    ),
    toValidator: PropTypes.string,
    validator: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        delegations: state.accounts.delegations.result,
        lang: state.language,
        open: state.stake.delegateDialog.open,
        name: state.stake.delegateDialog.name,
        address: state.accounts.address.value,
        amount: state.stake.tokens,
        validator: state.stake.validator.value,
        vestingBalance: state.accounts.vestingBalance.result,
        toValidator: state.stake.toValidator.value,
    };
};

const actionToProps = {
    handleClose: hideDelegateDialog,
    successDialog: showDelegateSuccessDialog,
    failedDialog: showDelegateFailedDialog,
    fetchVestingBalance,
    getBalance,
    getDelegations,
    getUnBondingDelegations,
    showMessage,
};

export default connect(stateToProps, actionToProps)(DelegateDialog);
