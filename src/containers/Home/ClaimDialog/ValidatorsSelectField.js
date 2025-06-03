import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../../components/SelectField/WithChildren';
import { setClaimRewardsValidator } from '../../../actions/stake';
import { MenuItem } from '@material-ui/core';
import { config } from '../../../config';
import variables from 'utils/variables';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
    '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const ValidatorSelectField = (props) => {
    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    let total = 0;

    const totalRewards = props.rewards && props.rewards.length &&
        props.rewards.map((value) => {
            const rewards = value && value.minDenomAmount ? value.minDenomAmount / 10 ** config.COIN_DECIMALS : 0;
            total = rewards + total;

            return total;
        });

    return (
        <SelectField
            id="claim_validator_select_field"
            items={props.rewards}
            name="validators"
            value={props.value}
            onChange={handleChange}>
            <MenuItem disabled value="none">
                {variables[props.lang].select_validator}
            </MenuItem>
            {props.rewards && props.rewards.length &&
                props.rewards.map((item, index) => {
                    const validator = item && item.validator;
                    const rewards = item && item.minDenomAmount ? item.minDenomAmount / 10 ** config.COIN_DECIMALS : 0;
                    const image = validator && validator.length && validator[0] &&
                            validator[0].description && validator[0].description.identity &&
                            props.validatorImages && props.validatorImages.length &&
                            props.validatorImages.filter((value) => value._id === validator[0].description.identity.toString());

                    return (
                        <MenuItem
                            key={validator.address}
                            value={validator.address}>
                            {image && image.length && image[0] && image[0].them && image[0].them.length &&
                                image[0].them[0] && image[0].them[0].pictures && image[0].them[0].pictures.primary &&
                                image[0].them[0].pictures.primary.url
                                ? <img
                                    alt={validator && validator.length && validator[0] &&
                                            validator[0].description && validator[0].description.moniker}
                                    className="image"
                                    src={image[0].them[0].pictures.primary.url}/>
                                : <span className="image" style={{ background: colors[index % 6] }}/>}
                            <span key={validator.address}>
                                {validator.name || validator.address}
                                {rewards && rewards > 0
                                    ? <b>&nbsp;({rewards.toFixed(4)})</b>
                                    : null}
                            </span>
                        </MenuItem>
                    );
                },
                )}
            <MenuItem value="all">
                <span>
                All <b>&nbsp;({total.toFixed(4)})</b>
                </span>
            </MenuItem>
            {/* {totalRewards && totalRewards.length &&
                <MenuItem value="all">
                    <span>
                    All <b>&nbsp;({total.toFixed(4)})</b>
                    </span>
                </MenuItem>} */}
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
    validatorList: PropTypes.array,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
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
