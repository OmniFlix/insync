import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from '../../components/WithRouter';
import IBCTransferDialog from './IBCTransferDialog';
import SuccessDialog from '../../containers/Stake/DelegateDialog/SuccessDialog';
import ExternalShieldingTabs from './ExternalShieldingTabs';

class IBCTransfer extends Component {
    render () {
        const route = this.props.router && this.props.router.location && this.props.router.location.pathname &&
            this.props.router.location.pathname.split('/') && this.props.router.location.pathname.split('/')[1];

        return (
            <>
                <NavBar home={true}/>
                {route === 'externalShielding' && <ExternalShieldingTabs/>}
                {route === 'externalTransfer' && <ExternalShieldingTabs/>}
                {(this.props.subTabs === 'ibc_shielding' || this.props.subTabs === 'ibc_chain_to_namada_transparent_transfer') && <div className="ibc_content padding">
                    {this.props.ibcSwapType === 'to_namada'
                        ? <p>IBC Transfer to Namada</p>
                        : <>
                            <p>Withdraw assets from Namada via IBC</p>
                            <span>To withdraw shielded assets please unshield them to your transparent account</span>
                        </>}
                    <IBCTransferDialog/>
                    <SuccessDialog/>
                </div>}
                {(this.props.subTabs === 'ibc_unshielding' || this.props.subTabs === 'namada_to_ibc_chain_transparent_transfer') && <div style={{margin: '150px 0'}}>Coming Soon...</div>}
            </>
        );
    }
}

IBCTransfer.propTypes = {
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
        subTabs: state.shieldedAssets.externalShieldingSubTabs.value,
    };
};

export default withRouter(connect(stateToProps)(IBCTransfer));
