import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../Stake/DelegateDialog/index.css';
import { hideConnectDialog } from '../../../actions/navBar';
import NamadaConnectButton from './NamadaConnectButton';
import KeplrConnectButton from './KeplrConnectButton';
import './index.css';

const ConnectDialog = (props) => {
    return (
        <Dialog
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog connect_dialog"
            open={props.open}
            onClose={props.handleClose}>
            <DialogContent className="content">
                <h2 className="heading">
                    Supported Wallets
                </h2>
                <div className="connect_wallets">
                    {props.ibc
                        ? <KeplrConnectButton/>
                        : <NamadaConnectButton proposalTab={props.proposalTab} stake={props.stake}/>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

ConnectDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    address: PropTypes.string,
    ibc: PropTypes.bool,
    proposalTab: PropTypes.bool,
    stake: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        open: state.navBar.connectDialog.open,
        ibc: state.navBar.connectDialog.ibc,
        proposalTab: state.navBar.connectDialog.proposalTab,
        stake: state.navBar.connectDialog.stake,
    };
};

const actionToProps = {
    handleClose: hideConnectDialog,
};

export default connect(stateToProps, actionToProps)(ConnectDialog);
