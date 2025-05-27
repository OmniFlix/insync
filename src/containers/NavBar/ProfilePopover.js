import { connect } from 'react-redux';
import React from 'react';
import { Popover, makeStyles } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import DisconnectButton from './DisconnectButton';
import './index.css';
import CopyButton from '../../components/CopyButton/TextButton';
import variables from '../../utils/variables';

const useStyles = makeStyles((theme) => ({
    popover: {
    },
    paper: {
        padding: theme.spacing(2),
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontFamily: 'Blinker, sans-serif',
        minWidth: '200px',
        top: '135px',
    },
}));

const ProfilePopover = (props) => {
    const classes = useStyles();

    return (
        <Popover
            className={classes.popover}
            classes={{
                paper: classes.paper,
            }}
            open={props.open}
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            onClose={props.onClose}
            disableRestoreFocus
        >
            <div
                className="content"
                onMouseLeave={props.onClose}
            >
                <div className="hash_text" title={props.address}>
                    <p className="name">{props.address}</p>
                    {props.address && props.address.slice(props.address.length - 6, props.address.length)}

                     <CopyButton data={props.address}>
                        {variables[props.lang].copy}
                    </CopyButton>
                </div>
                <DisconnectButton />
            </div>
        </Popover>
    );
};

ProfilePopover.propTypes = {
    open: PropTypes.bool.isRequired,
    anchorEl: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    address: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.accounts.address.value,
    };
};

export default connect(stateToProps)(ProfilePopover);
