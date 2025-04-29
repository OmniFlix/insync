import React from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
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
            SelectProps={{
                MenuProps: props.MenuProps || {
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                },
            }}
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
    onChange: PropTypes.func.isRequired,
    MenuProps: PropTypes.object,
    children: PropTypes.any,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default SelectField;
