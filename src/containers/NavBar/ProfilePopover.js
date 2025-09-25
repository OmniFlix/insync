import { connect } from 'react-redux';
import React from 'react';
import { Popover, makeStyles } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import DisconnectButton from './DisconnectButton';
import './index.css';
import CopyButton from '../../components/CopyButton/index';
import variables from '../../utils/variables';

const useStyles = makeStyles((theme) => ({
    popover: {
        marginTop: '5px',
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(2),
        backgroundColor: '#000000b3',
        backdropFilter: 'blur(10px)',
        border: '1px solid #FFFFFF3D',
        borderRadius: '18px',
        color: '#FFFFFF',
        fontFamily: 'Blinker, sans-serif',
        minWidth: '200px',
        pointerEvents: 'auto',
    },
}));

const ProfilePopover = (props) => {
    const classes = useStyles();
    return (
        <Popover
            disableRestoreFocus
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            className={classes.popover}
            classes={{
                paper: classes.paper,
            }}
            open={props.open && Boolean(props.anchorEl)}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            onClose={props.onClose}
        >
            <div
                className="content"
                onMouseLeave={props.onClose}
            >
                <div className="address_section">
                    <p className="address_heading">{variables[props.lang].transparent_address}</p>
                    <div className="hash_text" title={props.address}>
                        <p className="name">{props.address}</p>
                        {props.address &&
  props.address.slice(props.address.length - 6)}
                        <CopyButton data={props.address}>
                            {variables[props.lang].copy}
                        </CopyButton>
                    </div>
                    <p className="address_heading">{variables[props.lang].shielded_address}</p>
                    <div className="hash_text" title={props.address}>
                        <p className="name">{props.shieldedaddress?.shieldedDetails || '-'}</p>
                        {props.shieldedaddress?.shieldedDetails &&
                            props.shieldedaddress.shieldedDetails.slice(
                                props.shieldedaddress.shieldedDetails.length - 6
                            )}
                        <CopyButton data={props.shieldedaddress?.shieldedDetails}>
                            {variables[props.lang].copy}
                        </CopyButton>
                    </div>
                </div>
                <span></span>
                <DisconnectButton onClose={props.onClose}/>
            </div>
        </Popover>
    );
};

ProfilePopover.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    address: PropTypes.string,
    anchorEl: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.accounts.address.value,
        shieldedaddress: state.accounts.address,
    };
};

export default connect(stateToProps)(ProfilePopover);
