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

    let validatorList = [];
    if (props.validatorList && props.validatorList.length) {
        props.validatorList.map((val) => {
            if (val && val.name && val.name.toLowerCase() === 'cosmic validator') {
                validatorList.splice(0, 0, val);
            } else if (val && val.name && val.name.toLowerCase() === 'mandragora') {
                const find = validatorList.find((val1) => val1 && val1.name && val1.name.toLowerCase() === 'cosmic validator');
                if (!find) {
                    validatorList.splice(0, 0, val);
                } else {
                    validatorList.splice(1, 0, val);
                }
            } else {
                validatorList.push(val);
            }
        });
    } else {
        validatorList = dataToMap;
    }

    return (
        <SelectField
            id="validator_select_field"
            items={validatorList}
            name="validators"
            value={props.value}
            onChange={handleChange}>
            {validatorList && validatorList.length &&
                validatorList.map((item, index) => {
                    return (
                        props.removeValue !== item.operator_address && <MenuItem
                            key={item.key || item.value || item.name || item.address || item.type ||
                                    item.operator_address}
                            value={item.value || item.name || item.address || item.type ||
                                    (item.operator_address)}>
                            {item && item.avatar
                                ? <img
                                    alt={item.name || item.address}
                                    className="image"
                                    src={item.avatar}/>
                                : item.description && item.description.moniker
                                    ? <span
                                        className="image"
                                        style={{ background: colors[index % 6] }}>
                                        {item.description.moniker[0]}
                                    </span>
                                    : <span className="image" style={{ background: colors[index % 6] }}/>}
                            {item.name ? item.name : item.address
                                ? item.address : item.description && item.description.moniker}
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
