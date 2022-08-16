import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../Stake/DelegateDialog/index.css';
import {hideConnectDialog} from "../../../actions/navBar";
import ConnectButton from "./KeplrConnectButton";
import CosmostationConnectButton from "./CosmostationConnectButton";
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
                <p className="heading">
                    Connect Wallet
                </p>
                <div className="connect_wallets">
                    <ConnectButton proposalTab={props.proposalTab} stake={props.stake} />
                    <p className="heading">OR</p>
                    <CosmostationConnectButton proposalTab={props.proposalTab} stake={props.stake} />
                </div>
            </DialogContent>
            <DialogActions className="download_actions">
                <a
                    className="keplr_link"
                    href="https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en"
                    rel="noopener noreferrer"
                    target="_blank">
                    Download Keplr
                </a>
                <span className="border_break"/>
                <a
                    className="keplr_link"
                    href="https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf?utm_source=chrome-ntp-icon"
                    rel="noopener noreferrer"
                    target="_blank">
                    Download Cosmostation
                </a>
            </DialogActions>
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
