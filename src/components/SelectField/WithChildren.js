import { makeStyles, TextField } from '@material-ui/core';
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
            {props.children}
        </TextField>
    );
};

SelectField.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.any,
    className: PropTypes.string,
    placeholder: PropTypes.string,
};

export default SelectField;
