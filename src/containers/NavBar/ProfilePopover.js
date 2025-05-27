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
    },
    paper: {
        padding: theme.spacing(2),
        backgroundColor: '#FFFFFF17',
        backdropFilter: 'blur(10px)',
        border: '1px solid #FFFFFF3D',
        borderRadius: '18px',
        color: '#FFFFFF',
        fontFamily: 'Blinker, sans-serif',
        minWidth: '200px',
        
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
                <div className="address_section">
                    <p className="address_heading">Address</p>
                    <div className="hash_text" title={props.address}>
                        <p className="name">{props.address}</p>
                        {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                        <CopyButton data={props.address}>
                            {variables[props.lang].copy}
                        </CopyButton>
                    </div>
                </div>
                
                <span></span>
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
