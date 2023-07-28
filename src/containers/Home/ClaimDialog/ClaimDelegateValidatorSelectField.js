import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../../components/SelectField/WithChildren';
import { setClaimDelegateValidator } from '../../../actions/stake';
import { MenuItem } from '@material-ui/core';
import { config } from '../../../config';
import { gas } from '../../../defaultGasValues';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
    '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const ClaimDelegateValidatorSelectField = (props) => {
    const gasValue = (gas.claim_reward + gas.delegate) * config.GAS_PRICE_STEP_AVERAGE;
    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    let total = 0;
    const totalRewards = props.rewards && props.rewards.rewards &&
        props.rewards.rewards.length && props.rewards.rewards.map((value) => {
        let rewards = value.reward && value.reward.length &&
                value.reward.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        rewards = rewards && rewards.amount && rewards.amount > gasValue ? rewards.amount / 10 ** config.COIN_DECIMALS : 0;
        if (rewards) {
            total = rewards + total;
            return total;
        }
        return null;
    });

    return (
        <SelectField
            id="claim_delegate_validator_select_field"
            items={props.rewards && props.rewards.rewards}
            name="validators"
            value={props.value}
            onChange={handleChange}>
            <MenuItem disabled value="none">
                Select the validator
            </MenuItem>
            {props.rewards && props.rewards.rewards &&
                props.rewards.rewards.length &&
                props.rewards.rewards.map((item, index) => {
                    const validator = item && item.validator_address && props.validatorList && props.validatorList.length &&
                            props.validatorList.filter((value) => value.operator_address === item.validator_address);

                    const image = validator && validator.length && validator[0] &&
                            validator[0].description && validator[0].description.identity &&
                            props.validatorImages && props.validatorImages.length &&
                            props.validatorImages.filter((value) => value._id === validator[0].description.identity.toString());

                    let rewards = item.reward && item.reward.length &&
                            item.reward.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
                    rewards = rewards && rewards.amount && rewards.amount > gasValue ? rewards.amount / 10 ** config.COIN_DECIMALS : 0;

                    return (
                        rewards && rewards > 0.00001
                            ? <MenuItem
                                key={item.validator_address}
                                value={item.validator_address}>
                                {image && image.length && image[0] && image[0].them && image[0].them.length &&
                                    image[0].them[0] && image[0].them[0].pictures && image[0].them[0].pictures.primary &&
                                    image[0].them[0].pictures.primary.url
                                    ? <img
                                        alt={validator && validator.length && validator[0] &&
                                                validator[0].description && validator[0].description.moniker}
                                        className="image"
                                        src={image[0].them[0].pictures.primary.url}/>
                                    : <span className="image" style={{ background: colors[index % 6] }}/>}
                                {props.validatorList && props.validatorList.map((value) => {
                                    if (value.operator_address === item.validator_address) {
                                        return <span key={value.operator_address}>
                                            {value.description && value.description.moniker}
                                            {rewards && rewards > 0
                                                ? <b>&nbsp;({rewards.toFixed(4)})</b>
                                                : null}
                                        </span>;
                                    }

                                    return null;
                                })}
                            </MenuItem> : null
                    );
                },
                )}
            {totalRewards && totalRewards.length &&
                <MenuItem value="all">
                    <span>
                    All <b>&nbsp;({total.toFixed(4)})</b>
                    </span>
                </MenuItem>}
        </SelectField>
    );
};

ClaimDelegateValidatorSelectField.propTypes = {
    rewards: PropTypes.shape({
        rewards: PropTypes.array,
        total: PropTypes.array,
    }).isRequired,
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    inProgress: PropTypes.bool,
    items: PropTypes.array,
    validatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
};

const stateToProps = (state) => {
    return {
        value: state.stake.claimDelegateDialog.validator,
        rewards: state.accounts.rewards.result,
        validatorList: state.stake.validators.list,
        inProgress: state.accounts.rewards.inProgress,
        validatorImages: state.stake.validators.images,
    };
};

const actionToProps = {
    onChange: setClaimDelegateValidator,
};

export default connect(stateToProps, actionToProps)(ClaimDelegateValidatorSelectField);
