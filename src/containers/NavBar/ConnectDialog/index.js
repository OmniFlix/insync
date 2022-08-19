import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../Stake/DelegateDialog/index.css';
import { hideConnectDialog } from '../../../actions/navBar';
import ConnectButton from './KeplrConnectButton';
import CosmostationConnectButton from './CosmostationConnectButton';
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
                    Connect Wallet
                </h2>
                <div className="connect_wallets">
                    <ConnectButton proposalTab={props.proposalTab} stake={props.stake}/>
                    <CosmostationConnectButton proposalTab={props.proposalTab} stake={props.stake}/>
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
    proposalTab: PropTypes.bool,
    stake: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        open: state.navBar.connectDialog.open,
        proposalTab: state.navBar.connectDialog.proposalTab,
        stake: state.navBar.connectDialog.stake,
    };
};

const actionToProps = {
    handleClose: hideConnectDialog,
};

export default connect(stateToProps, actionToProps)(ConnectDialog);
