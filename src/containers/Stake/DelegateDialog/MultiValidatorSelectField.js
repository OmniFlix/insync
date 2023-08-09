import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setValidator, selectMultiValidators } from '../../../actions/stake';
import { MenuItem, Checkbox, FormControl, Select, OutlinedInput, Divider, ListItemIcon } from '@material-ui/core';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2',
    '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const MultiValidatorSelectField = (props) => {
    const validatorList = [...props.validatorList];
    const handleChange = (event) => {
        const value = event.target.value;

        if (value[value.length - 1] === 'all') {
            props.selectMultiValidators(props.selectedMultiValidatorArray.length === validatorList.length ? [] : (validatorList.map((item) => item.operator_address)));
        } else {
            props.selectMultiValidators(typeof value === 'string' ? value.split(',') : value);
        }

        if (props.value === value) {
            return;
        }
        props.onChange(value);
    };

    const isAllSelected = validatorList.length > 0 && props.selectedMultiValidatorArray.length === validatorList.length;

    return (
        <>
            <FormControl className={'mv_formControl'}>
                <Select
                    displayEmpty
                    fullWidth
                    multiple
                    MenuProps={{
                        variant: 'menu',
                        getContentAnchorEl: () => null,
                        PaperProps: {
                            style: {
                                maxHeight: 420,
                                width: 350,
                                backgroundColor: '#1E1E1E',
                                color: 'white',
                            },
                        },
                    }}
                    className={'mv_select select_field'}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Nothing Selected</em>;
                        }
                        return <em>{selected.length} out of {validatorList.length} Selected</em>;
                    } }
                    value={props.selectedMultiValidatorArray}
                    onChange={handleChange}>
                    <MenuItem className={'mv_menuItem'} value={'all'}>
                        <ListItemIcon>
                            <Checkbox checked={isAllSelected} className={'checkbox'}/>
                        </ListItemIcon>
                        Select All
                    </MenuItem>
                    <Divider className={'divider'} />
                    {validatorList && validatorList.length > 0 &&
                        validatorList.map((item, index) => {
                            const image = item && item.description && item.description.identity &&
                                    props.validatorImages && props.validatorImages.length &&
                                    props.validatorImages.filter((value) => value._id === item.description.identity.toString());

                            return (
                                <MenuItem
                                    key={item.key}
                                    className={'mv_menuItem'}
                                    value={(item.operator_address)}>
                                    <Checkbox
                                        checked={props.selectedMultiValidatorArray.indexOf(item.operator_address) > -1} className={'checkbox'}/>
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
                </Select>
            </FormControl>
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
