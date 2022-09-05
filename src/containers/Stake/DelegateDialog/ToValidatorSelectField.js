import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../../components/SelectField/WithChildren';
import { setToValidator } from '../../../actions/stake';
import { MenuItem } from '@material-ui/core';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
    '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const ToValidatorSelectField = (props) => {
    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    return (
        <SelectField
            id="validator_select_field"
            items={props.validatorList}
            name="validators"
            value={props.value}
            onChange={handleChange}>
            {props.validatorList && props.validatorList.length &&
                props.validatorList.map((item, index) => {
                    const image = item && item.description && item.description.identity &&
                            props.validatorImages && props.validatorImages.length &&
                            props.validatorImages.filter((value) => value._id === item.description.identity.toString());

                    return (
                        props.removeValue !== item.operator_address && <MenuItem
                            key={item.key || item.value || item.name || item.type ||
                                    item.operator_address}
                            value={item.value || item.name || item.type ||
                                    (item.operator_address)}>
                            {image && image.length && image[0] && image[0].them && image[0].them.length &&
                                image[0].them[0] && image[0].them[0].pictures && image[0].them[0].pictures.primary &&
                                image[0].them[0].pictures.primary.url
                                ? <img
                                    alt={item.description && item.description.moniker}
                                    className="image"
                                    src={image[0].them[0].pictures.primary.url}/>
                                : item.description && item.description.moniker
                                    ? <span
                                        className="image"
                                        style={{ background: colors[index % 6] }}>
                                        {item.description.moniker[0]}
                                    </span>
                                    : <span className="image" style={{ background: colors[index % 6] }}/>}
                            {item.name ? item.name : item.type
                                ? item.name : item.description && item.description.moniker}
                        </MenuItem>
                    );
                },
                )}
        </SelectField>
    );
};

ToValidatorSelectField.propTypes = {
    items: PropTypes.array.isRequired,
    removeValue: PropTypes.string.isRequired,
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    inProgress: PropTypes.bool,
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
        items: state.stake.toValidator.options,
        value: state.stake.toValidator.value,
        removeValue: state.stake.validator.value,
        validatorList: state.stake.validators.list,
        inProgress: state.stake.validators.inProgress,
        validatorImages: state.stake.validators.images,
    };
};

const actionToProps = {
    onChange: setToValidator,
};

export default connect(stateToProps, actionToProps)(ToValidatorSelectField);
