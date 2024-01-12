import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { initializeMetaMask } from '../../../helper';
import {
    fetchRewards,
    fetchVestingBalance,
    getBalance,
    getDelegations,
    getUnBondingDelegations,
    setAccountAddress,
    showSelectAccountDialog,
} from '../../../actions/accounts';
import { connect } from 'react-redux';
import { showMessage } from '../../../actions/snackbar';
import { encode } from 'js-base64';
import { getDelegatedValidatorsDetails } from '../../../actions/stake';
import MetaMaskIcon from '../../../assets/MetaMask.png';
import { hideConnectDialog } from '../../../actions/navBar';
import variables from '../../../utils/variables';

const MetaMaskConnectButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const initKeplr = () => {
        setInProgress(true);
        initializeMetaMask((error, addressList) => {
            setInProgress(false);
            if (error) {
                localStorage.removeItem('of_co_address');
                props.showMessage(error);

                return;
            }

            props.setAccountAddress(addressList && addressList.address && addressList.address.address);
            props.hideConnectDialog();
            if (!props.proposalTab && !props.stake) {
                props.getUnBondingDelegations(addressList && addressList.address && addressList.address.address);
                props.fetchRewards(addressList && addressList.address && addressList.address.address);
            }
            if (!props.proposalTab) {
                props.getDelegations(addressList && addressList.address && addressList.address.address);
            }
            props.getBalance(addressList && addressList.address && addressList.address.address);
            props.fetchVestingBalance(addressList && addressList.address && addressList.address.address);
            if (!props.proposalTab) {
                props.getDelegatedValidatorsDetails(addressList && addressList.address && addressList.address.address);
            }
            localStorage.setItem('of_co_address', encode(addressList && addressList.address && addressList.address.address));
            localStorage.setItem('of_co_wallet', 'metamask');
        });
    };

    return (
        <Button
            className="disconnect_button"
            disabled={inProgress}
            variant="contained"
            onClick={initKeplr}>
            <img alt="metamask" src={MetaMaskIcon}/>
            {inProgress ? variables[props.lang].connecting + '...' : variables[props.lang].metamask}
        </Button>
    );
};

MetaMaskConnectButton.propTypes = {
    fetchRewards: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    hideConnectDialog: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    proposalTab: PropTypes.bool,
    stake: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

const actionsToProps = {
    showMessage,
    setAccountAddress,
    showDialog: showSelectAccountDialog,
    getDelegations,
    getDelegatedValidatorsDetails,
    fetchVestingBalance,
    hideConnectDialog,
    getBalance,
    getUnBondingDelegations,
    fetchRewards,
};

export default connect(stateToProps, actionsToProps)(MetaMaskConnectButton);
