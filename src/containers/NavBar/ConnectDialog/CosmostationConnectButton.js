import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { encode } from 'js-base64';
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
import { cosmos, InstallError } from '@cosmostation/extension-client';
import logo from '../../../assets/cosmostation.svg';

const CosmostationConnectButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const login = async () => {
        try {
            console.log('asdjkgajshdgjahsd');
            const provider = await cosmos();

            const account = await provider.requestAccount('omniflix');
            console.log('111111111')
            props.setAccountAddress(account.address);
            console.log('11111121231', account.address);
            // if (!props.proposalTab && !props.stake) {
            //     props.getUnBondingDelegations(account.address);
            //     props.fetchRewards(account.address);
            // }
            // if (!props.proposalTab) {
            //     props.getDelegations(account.address);
            // }
            // props.getBalance(account.address);
            // props.fetchVestingBalance(account.address);
            // if (!props.proposalTab) {
            //     props.getDelegatedValidatorsDetails(account.address);
            // }
            // localStorage.setItem('of_co_address', encode(account.address));
            // props.handleClose();
        } catch (e) {
            if (e instanceof InstallError) {
                console.log('not installed');
            }

            if (e.code === 4001) {
                console.log('user rejected request');
            }
        }
    };

    return (
        <Button
            className="disconnect_button"
            variant="contained"
            onClick={login}>
            <img alt="logo" src={logo}/>
            Connect with Cosmostation
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
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    proposalTab: PropTypes.bool,
    stake: PropTypes.bool,
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
};

export default withRouter(connect(null, actionsToProps)(CosmostationConnectButton));
