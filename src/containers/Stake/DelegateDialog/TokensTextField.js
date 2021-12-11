import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from '../../../components/TextField';
import { setTokens } from '../../../actions/stake';
import { config } from '../../../config';
import variables from '../../../utils/variables';
import { connect } from 'react-redux';

const TokensTextField = (props) => {
    const balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
    const available = (balance && balance.amount && Number(balance.amount));
    const availableTokens = available / (10 ** config.COIN_DECIMALS);
    const staked = props.delegations.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue.balance.amount);
    }, 0);
    let stakedTokens = staked / (10 ** config.COIN_DECIMALS);

    if (props.selectedValidator && (props.name === 'Undelegate' || props.name === 'Redelegate')) {
        const filterList = props.delegations.find((value) => value.delegation &&
            (value.delegation.validator_address === props.selectedValidator));

        if (filterList && filterList.balance && filterList.balance.amount) {
            const balance = filterList.balance.amount;

            stakedTokens = balance / (10 ** config.COIN_DECIMALS);
        }
    }

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

    const vestingTokens = (vesting - delegatedVesting) / (10 ** config.COIN_DECIMALS);

    return (
        <>
            <TextField
                error={(props.name === 'Delegate' || props.name === 'Stake') && vestingTokens
                    ? props.value > parseFloat(availableTokens + vestingTokens)
                    : props.name === 'Delegate' || props.name === 'Stake'
                        ? props.value > parseFloat(availableTokens)
                        : props.name === 'Undelegate' || props.name === 'Redelegate'
                            ? props.value > parseFloat(stakedTokens) : false}
                errorText="Invalid Amount"
                id="tokens-text-field"
                name="tokens"
                type="number"
                value={props.value}
                onChange={props.onChange}/>
            <div className="available_tokens">
                <p className="heading">
                    Max Available tokens:
                </p>
                {props.name === 'Delegate' || props.name === 'Stake'
                    ? <p className="value" onClick={() => props.onChange(availableTokens)}>
                        {availableTokens}
                    </p>
                    : (props.name === 'Undelegate' || props.name === 'Redelegate') && props.selectedValidator
                        ? <p className="value" onClick={() => props.onChange(stakedTokens)}>
                            {stakedTokens}
                        </p>
                        : null}
            </div>
            {vestingTokens && (props.name === 'Delegate' || props.name === 'Stake')
                ? <div className="available_tokens">
                    <p className="heading">
                        {variables[props.lang]['vesting_tokens']}:
                    </p>
                    <p className="value" onClick={() => props.onChange(vestingTokens)}>
                        {vestingTokens}
                    </p>
                </div>
                : null}
        </>
    );
};

TokensTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selectedValidator: PropTypes.string.isRequired,
    vestingBalance: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.array,
    delegations: PropTypes.array,
    value: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        vestingBalance: state.accounts.vestingBalance.result,
        delegations: state.accounts.delegations.result,
        lang: state.language,
        value: state.stake.tokens,
        name: state.stake.delegateDialog.name,
        selectedValidator: state.stake.validator.value,
    };
};

const actionsToProps = {
    onChange: setTokens,
};

export default connect(stateToProps, actionsToProps)(TokensTextField);
