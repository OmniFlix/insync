import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setValidator, selectMultiValidators } from '../../../actions/stake';
// import { MenuItem, Checkbox, FormControl, Select, OutlinedInput, Divider, ListItemIcon } from '@material-ui/core';
import { Autocomplete, TextField } from '@mui/material';
import { Checkbox } from '@material-ui/core';

// const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
//     '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const MultiValidatorSelectField = (props) => {
    const validatorList = [...props.validatorList];
    const images = [...props.validatorImages];
    const parentProps = { ...props };
    console.log(images);
    console.log(validatorList);
    console.log(validatorList.map((item) => item.description.moniker));
    // const handleChange = (event) => {
    //     const value = event.target.value;
    //
    //     if (value[value.length - 1] === 'all') {
    //         props.selectMultiValidators(props.selectedMultiValidatorArray.length === validatorList.length ? [] : (validatorList.map((item) => item.operator_address)));
    //     } else {
    //         props.selectMultiValidators(typeof value === 'string' ? value.split(',') : value);
    //     }
    //
    //     if (props.value === value) {
    //         return;
    //     }
    //     props.onChange(value);
    // };

    // const isAllSelected = validatorList.length > 0 && props.selectedMultiValidatorArray.length === validatorList.length;

    return (
        <>
            <Autocomplete
                disableCloseOnSelect
                multiple
                getOptionLabel={(option) => option.description.moniker}
                id="checkboxes-tags-demo"
                options={ validatorList }
                renderInput={(params) => (
                    <TextField {...params} label="Checkboxes" placeholder="Favorites" />
                )}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            checked={selected}
                            style={{ marginRight: 8 }}
                        />
                        {option.description.moniker}
                    </li>
                )}
                style={{ width: 500 }}
            />
        </>
    );
};

MultiValidatorSelectField.propTypes = {
    selectMultiValidators: PropTypes.func.isRequired,
    selectedMultiValidatorArray: PropTypes.array.isRequired,
    validatorImages: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
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
        value: state.stake.validator.value,
        validatorList: state.stake.validators.list,
        validatorImages: state.stake.validators.images,
        selectedMultiValidatorArray: state.stake.selectMultiValidators.list,
    };
};

const actionToProps = {
    onChange: setValidator,
    selectMultiValidators,
};

export default connect(stateToProps, actionToProps)(MultiValidatorSelectField);
