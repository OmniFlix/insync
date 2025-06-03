import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from '../../components/WithRouter';
import ShieldDialog from './ShieldDialog';
import SuccessDialog from 'containers/Stake/DelegateDialog/SuccessDialog';
import UnSuccessDialog from 'containers/Stake/DelegateDialog/UnSuccessDialog';
import PendingDialog from 'containers/Stake/DelegateDialog/PendingDialog';
import ShieldingTabs from './Tabs';
import ShieldedToTransparent from './ShieldDialog/ShieldedToTransparent';
import variables from '../../utils/variables';

class ShieldedAssets extends Component {
    render () {
        return (
            <>
                <NavBar home={true}/>
                <ShieldingTabs/>
                {this.props.subTabs === 'transparent_to_shielding' && <div className="shielded_content">
                    <div className="shield_tranfer">
                        <p>{variables[this.props.lang].nam_trans_to_nam_shield}</p>
                        <ShieldDialog/>
                    </div>
                </div>}
                {this.props.subTabs === 'shielded_to_transparent' && <div className="shielded_content">
                    <div className="shield_tranfer">
                        <p>{variables[this.props.lang].nam_shield_to_nam_trans}</p>
                        <ShieldedToTransparent/>
                    </div>
                </div>}
                {/* {this.props.subTabs === 'shielded_to_transparent' && <div style={{ margin: '150px 0' }}>Coming Soon...</div>} */}
                <SuccessDialog shielded={true}/>
                <UnSuccessDialog/>
                <PendingDialog/>
            </>
        );
    }
}

ShieldedAssets.propTypes = {
    lang: PropTypes.string.isRequired,
    subTabs: PropTypes.string.isRequired,
    router: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        subTabs: state.shieldedAssets.subTabs.value,
    };
};

export default withRouter(connect(stateToProps)(ShieldedAssets));
