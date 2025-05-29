import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { initializeNamadaChain } from '../../../helper';
import {
    fetchRewards,
    fetchVestingBalance,
    getBalance,
    getShieldedBalance,
    getDelegations,
    getUnBondingDelegations,
    setAccountAddress, setAccountDetails,
    showSelectAccountDialog,
    fetchTokensList,
    fetchBalanceList,
    shieldedBalanceFetchSuccess,
} from '../../../actions/accounts';
import { connect } from 'react-redux';
import { showMessage } from '../../../actions/snackbar';
import { encode } from 'js-base64';
import { getDelegatedValidatorsDetails } from '../../../actions/stake';
import { ReactComponent as NamadaLogo } from '../../../assets/namadaLogo.svg';
import { hideConnectDialog } from '../../../actions/navBar';
import variables from '../../../utils/variables';
// import { config } from 'process';

const KeplrConnectButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const initKeplr = () => {
        setInProgress(true);
        initializeNamadaChain((error, addressList, shieldedAddress, disposableSigner) => {
            // const shieldedDetails = shieldedAddress && shieldedAddress.find((item) => item.type === 'shielded-keys');
            // console.log('raw shielded details ', shieldedDetails);
            setInProgress(false);
            if (error) {
                localStorage.removeItem('of_co_address');
                props.showMessage(error);

                return;
            }

            const index = shieldedAddress.findIndex((val) => addressList && addressList.address === val.address);
            props.setAccountAddress(addressList && addressList.address, shieldedAddress && shieldedAddress.length && shieldedAddress[index + 1].address, shieldedAddress && shieldedAddress.length && shieldedAddress[index + 1]);
            props.setAccountDetails(addressList, disposableSigner);
            props.hideConnectDialog();
            // if (!props.proposalTab && !props.stake) {
            //     props.getUnBondingDelegations(addressList && addressList.address);
            //     props.fetchRewards(addressList && addressList.address);
            // }
            if (!props.proposalTab) {
                props.getDelegations(addressList && addressList.address);
            }
            props.getBalance(addressList && addressList.address);
            props.fetchTokensList();
            props.fetchBalanceList(addressList && addressList.address);
            // console.log('testing shielded details ', shieldedAddress[1]);
            // const address1 = `${addressList?.address ?? ""}`;
            // const address2 = `${shieldedAddress?.[1]?.address ?? ""}`;
            if (shieldedAddress && shieldedAddress.length && shieldedAddress[1]) {
                props.getShieldedBalance(shieldedAddress[1]?.viewingKey, shieldedAddress[1]?.timestamp, addressList?.address, shieldedAddress[1]?.address);
            }
            // props.fetchVestingBalance(addressList && addressList.address);
            // if (!props.proposalTab) {
            //     props.getDelegatedValidatorsDetails(addressList && addressList.address);
            // }
            localStorage.setItem('of_co_address', encode(addressList && addressList.address));
            localStorage.setItem('of_co_wallet', 'namada');
        });
    };

    return (
        <Button
            className="keplr_button"
            disabled={inProgress}
            variant="contained"
            onClick={initKeplr}>
            <NamadaLogo/>
            {inProgress ? variables[props.lang].connecting + '...' : variables[props.lang].namada}
        </Button>
    );
};

KeplrConnectButton.propTypes = {
    fetchBalanceList: PropTypes.func.isRequired,
    fetchRewards: PropTypes.func.isRequired,
    fetchTokensList: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getShieldedBalance: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    hideConnectDialog: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
    setAccountDetails: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    shieldedBalanceFetchSuccess: PropTypes.func.isRequired,
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
    getShieldedBalance,
    getUnBondingDelegations,
    fetchRewards,
    setAccountDetails,
    fetchTokensList,
    fetchBalanceList,
    shieldedBalanceFetchSuccess,
};

export default connect(stateToProps, actionsToProps)(KeplrConnectButton);
