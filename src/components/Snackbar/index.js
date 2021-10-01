import { Slide, Snackbar as MaterialSnackbar } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React from 'react';
import icon from '../../assets/userDetails/warning.svg';
import './index.css';

const TransitionUp = (props) => <Slide direction="up" {...props}/>;

const Snackbar = (props) => {
    return (
        <MaterialSnackbar
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            TransitionComponent={TransitionUp}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            autoHideDuration={5000}
            className="snackbar"
            message={<span className="message" id="message-id">
                {props.message === 'Account not connected. Please connect to wallet'
                    ? <img alt="snackImage" src={icon}/>
                    : null}
                {props.message}
            </span>}
            open={props.open}
            onClose={props.onClose}/>
    );
};

Snackbar.propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Snackbar;
