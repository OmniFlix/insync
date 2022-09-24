import React from 'react';
import { Dialog, DialogContent, IconButton, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../Stake/DelegateDialog/index.css';
import { hideConnectDialog } from '../../../actions/navBar';
import ConnectButton from './KeplrConnectButton';
import CosmostationConnectButton from './CosmostationConnectButton';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import insync from '../../../assets/insync.png';
import './index.css';
import { config } from '../../../config';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

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
                    <img alt="insync" src={insync}/>
                    supported wallets
                </h2>
                <div className="connect_wallets">
                    <div className="button_div">
                        <ConnectButton proposalTab={props.proposalTab} stake={props.stake}/>
                        <LightTooltip title="Download the Keplr Extension">
                            <IconButton
                                className="download_button"
                                onClick={() => window.open('https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en')}>
                                <GetAppRoundedIcon/>
                            </IconButton>
                        </LightTooltip>
                    </div>
                    {config.COSMOSTAION && <div className="button_div">
                        <CosmostationConnectButton proposalTab={props.proposalTab} stake={props.stake}/>
                        <LightTooltip title="Download the Cosmostation Extension">
                            <IconButton
                                className="download_button"
                                onClick={() => window.open('https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf')}>
                                <GetAppRoundedIcon/>
                            </IconButton>
                        </LightTooltip>
                    </div>}
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
