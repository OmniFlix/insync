import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../../components/SelectField/WithChildren';
import { setClaimRewardsValidator } from '../../../actions/stake';
import { MenuItem } from '@material-ui/core';
import { config } from '../../../config';

const ValidatorSelectField = (props) => {
    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    let total = 0;

    const totalRewards = props.rewards && props.rewards.rewards &&
        props.rewards.rewards.length &&
        props.rewards.rewards.map((value) => {
            const rewards = value.reward && value.reward[0] && value.reward[0].amount
                ? value.reward[0].amount / 10 ** config.COIN_DECIMALS : 0;
            total = rewards + total;

            return total;
        });

    return (
        <SelectField
            id="claim_validator_select_field"
            items={props.rewards && props.rewards.rewards}
            name="validators"
            value={props.value}
            onChange={handleChange}>
            <MenuItem disabled value="none">
                Select the validator
            </MenuItem>
            {props.rewards && props.rewards.rewards &&
            props.rewards.rewards.length &&
            props.rewards.rewards.map((item) => {
                const validator = item && item.validator_address && props.validatorList && props.validatorList.length &&
                        props.validatorList.filter((value) => value.operator_address === item.validator_address);

                const image = validator && validator.length && validator[0] &&
                        validator[0].description && validator[0].description.identity &&
                        props.validatorImages && props.validatorImages.length &&
                        props.validatorImages.filter((value) => value._id === validator[0].description.identity.toString());

                return (
                    <MenuItem
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
                            : <span className="image"/>}
                        {props.validatorList && props.validatorList.map((value) => {
                            const rewards = item.reward && item.reward[0] && item.reward[0].amount
                                ? item.reward[0].amount / 10 ** config.COIN_DECIMALS : 0;

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
                    </MenuItem>
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

ValidatorSelectField.propTypes = {
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
        value: state.stake.claimDialog.validator,
        rewards: state.accounts.rewards.result,
        validatorList: state.stake.validators.list,
        inProgress: state.accounts.rewards.inProgress,
        validatorImages: state.stake.validators.images,
    };
};

const actionToProps = {
    onChange: setClaimRewardsValidator,
};

export default connect(stateToProps, actionToProps)(ValidatorSelectField);
