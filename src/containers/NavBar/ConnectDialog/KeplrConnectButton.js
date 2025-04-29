import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showMessage } from '../../../actions/snackbar';
import keplrIcon from '../../../assets/keplr.png';
import variables from '../../../utils/variables';
import { connectIBCAccount, fetchIBCBalance, fetchIBCChannel } from 'actions/IBCTransfer';
import { ibcList } from 'dummy/ibcList';
import { hideConnectDialog } from '../../../actions/navBar';

const KeplrConnectButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const initKeplr = () => {
        const selectedChain = props.selectedChain || ibcList[0];

        const config = {
            RPC_URL: selectedChain && selectedChain.config && selectedChain.config.RPC_URL,
            REST_URL: selectedChain && selectedChain.config && selectedChain.config.REST_URL,
            CHAIN_ID: selectedChain && selectedChain.config && selectedChain.config.CHAIN_ID,
            CHAIN_NAME: selectedChain && selectedChain.config && selectedChain.config.CHAIN_NAME,
            COIN_DENOM: selectedChain && selectedChain.config && selectedChain.config.COIN_DENOM,
            COIN_MINIMAL_DENOM: selectedChain && selectedChain.config && selectedChain.config.COIN_MINIMAL_DENOM,
            COIN_DECIMALS: selectedChain && selectedChain.config && selectedChain.config.COIN_DECIMALS,
            PREFIX: selectedChain && selectedChain.config && selectedChain.config.PREFIX,
        };

        setInProgress(true);
        props.connectIBCAccount(config, (address) => {
            setInProgress(false);
            localStorage.setItem('namada_keplr_address', address[0].address);
            props.fetchIBCBalance(config.REST_URL, address[0].address);
            props.fetchIBCChannel(selectedChain.channel_link);
            props.hideConnectDialog();
        });
    };

    return (
        <Button
            className="disconnect_button"
            disabled={inProgress}
            variant="contained"
            onClick={initKeplr}>
            <img alt="logo" src={keplrIcon}/>
            {inProgress ? variables[props.lang].connecting + '...' : variables[props.lang].keplr}
        </Button>
    );
};

KeplrConnectButton.propTypes = {
    address: PropTypes.string.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchIBCChannel: PropTypes.func.isRequired,
    hideConnectDialog: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    selectedChain: PropTypes.string.isRequired,
    showMessage: PropTypes.func.isRequired,
    proposalTab: PropTypes.bool,
    stake: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.ibcTransfer.connection.address,
        lang: state.language,
        selectedChain: state.ibcTransfer.selectedChain.value,
    };
};

const actionsToProps = {
    showMessage,
    connectIBCAccount,
    fetchIBCBalance,
    fetchIBCChannel,
    hideConnectDialog,
};

export default connect(stateToProps, actionsToProps)(KeplrConnectButton);
