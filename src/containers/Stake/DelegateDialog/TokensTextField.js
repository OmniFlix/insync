import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from '../../../components/TextField';
import { setTokens } from '../../../actions/stake';
import { config } from '../../../config';
import variables from '../../../utils/variables';
import { connect } from 'react-redux';

const TokensTextField = (props) => {
    // const balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
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

    // const available = (balance && balance.amount && Number(balance.amount));
    // const availableTokens = available / (10 ** config.COIN_DECIMALS);
    const availableTokens = balance;
    let stakedTokens = props.delegations && props.delegations.reduce((accumulator, currentValue) => {
        if (currentValue && currentValue.length && currentValue[2]) {
            return accumulator + Number(currentValue[2]);
        }
    }, 0);

    if (props.selectedValidator && (props.name === 'Undelegate' || props.name === 'Redelegate')) {
        let address = null;
        if (props.genesisValidatorList && props.genesisValidatorList[props.selectedValidator]) {
            address = props.genesisValidatorList[props.selectedValidator];
        }

        const filterList = props.delegations.find((value) => value && value.length && value[1] && address &&
            address.nam_address && (address.nam_address === value[1]));

        if (filterList && filterList.length && filterList[2]) {
            stakedTokens = Number(filterList[2]);
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
                    : props.name === 'Delegate' || props.name === 'Stake' || props.name === 'Multi-Delegate'
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
                        : props.name === 'Multi-Delegate'
                            ? <p className="value" onClick={() => props.onChange(availableTokens)}>
                                {availableTokens}
                            </p> : null}
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
    genesisValidatorList: PropTypes.object.isRequired,
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
        genesisValidatorList: state.stake.genesisValidators.list,
    };
};

const actionsToProps = {
    onChange: setTokens,
};

export default connect(stateToProps, actionsToProps)(TokensTextField);
