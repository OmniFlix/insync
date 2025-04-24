import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from '../../components/WithRouter';
import IBCTransferDialog from './IBCTransferDialog';
import KeplrConnectButton from 'containers/NavBar/ConnectDialog/KeplrConnectButton';

class IBCTransfer extends Component {
    render () {
        return (
            <>
                <NavBar home={true}/>
                <div className="ibc_content padding">
                    <div className="header">
                        {this.props.ibcSwapType === 'to_namada'
                            ? <p>IBC Transfer to Namada</p>
                            : <>
                                <p>Withdraw assets from Namada via IBC</p>
                                <span>To withdraw shielded assets please unshield them to your transparent account</span>
                            </>}
                        <KeplrConnectButton/>
                    </div>
                    <IBCTransferDialog/>
                </div>
            </>
        );
    }
}

IBCTransfer.propTypes = {
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    router: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        ibcSwapType: state.ibcTransfer.ibcSwapType.value,
    };
};

export default withRouter(connect(stateToProps)(IBCTransfer));
