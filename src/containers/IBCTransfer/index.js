import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from '../../components/WithRouter';
import IBCTransferDialog from './IBCTransferDialog';
import SuccessDialog from '../../containers/Stake/DelegateDialog/SuccessDialog';
import ExternalShieldingTabs from './ExternalShieldingTabs';
import ExternalTransferTabs from './ExternalTransferTabs';
import NamadaToIBCTransparentTransfer from './NamadaToIBCTransparentTransfer';
import IBCUnShielding from './IBCUnShielding';

class IBCTransfer extends Component {
    render () {
        const route = this.props.router && this.props.router.location && this.props.router.location.pathname &&
            this.props.router.location.pathname.split('/') && this.props.router.location.pathname.split('/')[1];

        return (
            <>
                <NavBar home={true}/>
                {route === 'externalShielding' && <ExternalShieldingTabs/>}
                {route === 'externalTransfer' && <ExternalTransferTabs/>}
                {((this.props.subTabs === 'ibc_shielding' && route === 'externalShielding') || (this.props.externalTransferSubTabs === 'ibc_chain_to_namada_transparent_transfer' && route === 'externalTransfer')) && <div className="ibc_content padding">
                    {this.props.ibcSwapType === 'to_namada'
                        ? <p>IBC Transfer to Namada</p>
                        : <>
                            <p>Withdraw assets from Namada via IBC</p>
                            <span>To withdraw shielded assets please unshield them to your transparent account</span>
                        </>}
                    <IBCTransferDialog/>
                </div>}
                {(this.props.externalTransferSubTabs === 'namada_to_ibc_chain_transparent_transfer' && route === 'externalTransfer') &&
                <div className="ibc_content padding">
                    <>
                        <p>Withdraw assets from Namada via IBC</p>
                        {/* <span>To withdraw shielded assets please unshield them to your transparent account</span> */}
                    </>
                    <NamadaToIBCTransparentTransfer/>
                </div>}
                {((this.props.subTabs === 'ibc_unshielding' && route === 'externalShielding')) &&
                <div className="ibc_content padding">
                    <>
                        <p>Withdraw shielded assets from Namada via IBC</p>
                    </>
                    <IBCUnShielding/>
                </div>}
                {/* {((this.props.subTabs === 'ibc_unshielding' && route === 'externalShielding')) &&
                <div style={{margin: '150px 0'}}>Coming Soon...</div>} */}
                <SuccessDialog/>
            </>
        );
    }
}

IBCTransfer.propTypes = {
    externalTransferSubTabs: PropTypes.string.isRequired,
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    subTabs: PropTypes.string.isRequired,
    router: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }).isRequired,
        navigate: PropTypes.func.isRequired,
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }).isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        ibcSwapType: state.ibcTransfer.ibcSwapType.value,
        subTabs: state.shieldedAssets.externalShieldingTabs.value,
        externalTransferSubTabs: state.shieldedAssets.externalTransferSubTabs.value,
    };
};

export default withRouter(connect(stateToProps)(IBCTransfer));
