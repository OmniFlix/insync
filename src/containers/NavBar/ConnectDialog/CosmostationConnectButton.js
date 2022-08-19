import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    fetchRewards,
    fetchVestingBalance,
    getBalance,
    getDelegations,
    getUnBondingDelegations,
    setAccountAddress,
} from '../../../actions/accounts';
import { getDelegatedValidatorsDetails } from '../../../actions/stake';
import { showMessage } from '../../../actions/snackbar';
import logo from '../../../assets/cosmostation.svg';
import { encode } from 'js-base64';
import { hideConnectDialog } from '../../../actions/navBar';
import { initializeCosmoStation } from '../../../helper';
import variables from '../../../utils/variables';

const CosmostationConnectButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const login = () => {
        setInProgress(true);
        initializeCosmoStation((error, account) => {
            setInProgress(false);
            if (error) {
                localStorage.removeItem('of_co_address');
                props.showMessage(error);

                return;
            }

            props.setAccountAddress(account.address);
            props.hideConnectDialog();
            if (!props.proposalTab && !props.stake) {
                props.getUnBondingDelegations(account.address);
                props.fetchRewards(account.address);
            }
            if (!props.proposalTab) {
                props.getDelegations(account.address);
            }
            props.getBalance(account.address);
            props.fetchVestingBalance(account.address);
            if (!props.proposalTab) {
                props.getDelegatedValidatorsDetails(account.address);
            }
            localStorage.setItem('of_co_address', encode(account.address));
            localStorage.setItem('of_co_wallet', 'cosmostation');
        });
    };

    return (
        <Button
            className="disconnect_button"
            variant="contained"
            onClick={login}>
            <img alt="logo" src={logo}/>
            {inProgress ? variables[props.lang].connecting + '...' : variables[props.lang].cosmostation}
        </Button>
    );
};

CosmostationConnectButton.propTypes = {
    fetchRewards: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    hideConnectDialog: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
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
    setAccountAddress,
    showMessage,
    getDelegations,
    getDelegatedValidatorsDetails,
    fetchVestingBalance,
    getBalance,
    getUnBondingDelegations,
    fetchRewards,
    hideConnectDialog,
};

export default withRouter(connect(stateToProps, actionsToProps)(CosmostationConnectButton));
