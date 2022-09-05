import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import './index.css';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInput-underline': {
            '&.Mui-focused:after': {
                transform: 'scaleX(0)',
            },
        },
    },
}));

const SelectField = (props) => {
    const onChange = (e) => props.onChange(e.target.value);

    return (
        <TextField
            select
            className={classNames(useStyles().root, 'text_field select_field ' + (props.className ? props.className : ''))}
            id={props.id}
            margin="normal"
            name={props.name}
            placeholder={props.placeholder ? props.placeholder : null}
            value={props.value}
            onChange={onChange}>
            {props.placeholder &&
                <MenuItem disabled value="none">
                    {props.placeholder}
                </MenuItem>}
            {props.items.map((item) => (
                <MenuItem
                    key={item.key || item.value || item.name || item.type}
                    value={item.value || item.name || item.type}>
                    {item.name ? item.name : item.type}
                </MenuItem>
            ))}
        </TextField>
    );
};

SelectField.propTypes = {
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string,
            value: PropTypes.string,
            type: PropTypes.string,
        }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
};

export default SelectField;
