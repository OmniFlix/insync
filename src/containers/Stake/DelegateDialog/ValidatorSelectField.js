import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../../components/SelectField/WithChildren';
import { setValidator } from '../../../actions/stake';
import { MenuItem } from '@material-ui/core';
import variables from '../../../utils/variables';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
    '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const ValidatorSelectField = (props) => {
    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    let validatorList = [...props.validatorList];
    validatorList.push(...props.inActiveValidators);

    if (props.name === 'Undelegate' || props.name === 'Redelegate') {
        validatorList = [];
        props.validatorList && props.validatorList.length && props.validatorList.map((val) => {
            if (val && val.address) {
                props.delegations && props.delegations.length &&
                props.delegations.map((value) => {
                    if (value && value.length && value[1] && val && val.address &&
                        (String(val.address) === String(value[1]))) {
                        validatorList.push(val);
                    }
                });
            }
        });
    } else {
        let newData = [];
        if (validatorList && validatorList.length) {
            validatorList.map((val) => {
                if (val && val.name && val.name.toLowerCase() === 'cosmic validator') {
                    newData.splice(0, 0, val);
                } else if (val && val.name && val.name.toLowerCase() === 'mandragora') {
                    const find = newData.find((val1) => val1 && val1.name && val1.name.toLowerCase() === 'cosmic validator');
                    if (!find) {
                        newData.splice(0, 0, val);
                    } else {
                        newData.splice(1, 0, val);
                    }
                } else {
                    newData.push(val);
                }
            });
        } else {
            newData = dataToMap;
        }
        validatorList = newData;
    }

    return (
        <SelectField
            id="validator_select_field"
            items={props.validatorList}
            name="validators"
            placeholder={variables[props.lang]['select_validator']}
            value={props.dialogValidatorAddress || props.value}
            onChange={handleChange}>
            <MenuItem disabled value="none">
                {variables[props.lang]['select_validator']}
            </MenuItem>
            {validatorList && validatorList.length > 0 &&
                validatorList.map((item, index) => {
                    const image = item && item.avatar;
                    // const image = item && item.description && item.description.identity &&
                    //         props.validatorImages && props.validatorImages.length &&
                    //         props.validatorImages.filter((value) => value._id === item.description.identity.toString());
                    // let value = null;
                    // if (props.genesisValidatorList && props.genesisValidatorList[item.address]) {
                    //     value = props.genesisValidatorList[item.address];
                    // }
                    const value = item;

                    return (
                        value && <MenuItem
                            key={item.key || item.value || item.name || item.type ||
                                    item.address || item.operator_address}
                            value={item.address || item.name || item.type ||
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
                            {value && value.alias
                                ? value.alias
                                : item.name ? item.name : item.type
                                    ? item.name
                                    : item.address ? item.address : item.description && item.description.moniker}
                        </MenuItem>
                    );
                },
                )}
        </SelectField>
    );
};

ValidatorSelectField.propTypes = {
    genesisValidatorList: PropTypes.object.isRequired,
    inActiveValidators: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    delegatedValidatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
    delegations: PropTypes.array,
    dialogValidatorAddress: PropTypes.string,
    inProgress: PropTypes.bool,
    validatorList: PropTypes.array,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        items: state.stake.validator.options,
        value: state.stake.validator.value,
        validatorList: state.stake.validators.list,
        inProgress: state.stake.validators.inProgress,
        dialogValidatorAddress: state.stake.delegateDialog.address,
        name: state.stake.delegateDialog.name,
        validatorImages: state.stake.validators.images,
        delegatedValidatorList: state.stake.delegatedValidators.list,
        inActiveValidators: state.stake.inActiveValidators.list,
        genesisValidatorList: state.stake.genesisValidators.list,
        delegations: state.accounts.delegations.result,
    };
};

const actionToProps = {
    onChange: setValidator,
};

export default connect(stateToProps, actionToProps)(ValidatorSelectField);
