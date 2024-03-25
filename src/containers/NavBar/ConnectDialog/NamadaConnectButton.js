import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { initializeNamadaChain } from '../../../helper';
import {
    fetchRewards,
    fetchVestingBalance,
    getBalance,
    getDelegations,
    getUnBondingDelegations,
    setAccountAddress, setAccountDetails,
    showSelectAccountDialog,
} from '../../../actions/accounts';
import { connect } from 'react-redux';
import { showMessage } from '../../../actions/snackbar';
import { encode } from 'js-base64';
import { getDelegatedValidatorsDetails } from '../../../actions/stake';
import { ReactComponent as NamadaLogo } from '../../../assets/namadaLogo.svg';
import { hideConnectDialog } from '../../../actions/navBar';
import variables from '../../../utils/variables';

const KeplrConnectButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const initKeplr = () => {
        setInProgress(true);
        initializeNamadaChain((error, addressList) => {
            setInProgress(false);
            if (error) {
                localStorage.removeItem('of_co_address');
                props.showMessage(error);

                return;
            }

            props.setAccountAddress(addressList[0] && addressList[0].address);
            props.setAccountDetails(addressList[0]);
            props.hideConnectDialog();
            // if (!props.proposalTab && !props.stake) {
            //     props.getUnBondingDelegations(addressList[0] && addressList[0].address);
            //     props.fetchRewards(addressList[0] && addressList[0].address);
            // }
            if (!props.proposalTab) {
                props.getDelegations(addressList[0] && addressList[0].address);
            }
            props.getBalance(addressList[0] && addressList[0].address);
            // props.fetchVestingBalance(addressList[0] && addressList[0].address);
            // if (!props.proposalTab) {
            //     props.getDelegatedValidatorsDetails(addressList[0] && addressList[0].address);
            // }
            localStorage.setItem('of_co_address', encode(addressList[0] && addressList[0].address));
            localStorage.setItem('of_co_wallet', 'namada');
        });
    };

    return (
        <Button
            className="disconnect_button"
            disabled={inProgress}
            variant="contained"
            onClick={initKeplr}>
            <NamadaLogo/>
            {inProgress ? variables[props.lang].connecting + '...' : variables[props.lang].namada}
        </Button>
    );
};

KeplrConnectButton.propTypes = {
    fetchRewards: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    hideConnectDialog: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
    setAccountDetails: PropTypes.func.isRequired,
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
    setAccountDetails,
};

export default connect(stateToProps, actionsToProps)(KeplrConnectButton);
