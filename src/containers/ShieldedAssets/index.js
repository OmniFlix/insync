import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import variables from '../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from '../../components/WithRouter';
import ShieldDialog from './ShieldDialog';

class ShieldedAssets extends Component {
    render () {
        return (
            <>
                <NavBar home={true}/>
                <div className="shielded_content padding">
                    <div className="shield_tranfer">
                        <p>Namada Transparent to Namada Shielded</p>
                        <ShieldDialog/>
                    </div>
                </div>
            </>
        );
    }
}

ShieldedAssets.propTypes = {
    lang: PropTypes.string.isRequired,
    router: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default withRouter(connect(stateToProps)(ShieldedAssets));
