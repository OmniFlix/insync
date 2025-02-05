import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import variables from '../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from '../../components/WithRouter';
import cvIcon from '../../assets/cv.png';
import totalTokens from '../../assets/userDetails/totalTokens.png';
import ShieldDialog from './ShieldDialog';

class ShieldedAssets extends Component {
    render () {
        return (
            <>
                <NavBar home={true}/>
                <div className="shielded_content padding">
                    <div className="card">
                        <div className="left_content">
                            <h2>
                                {/* {variables[this.props.lang].welcome} */}
                                NAM Staking & Governance
                            </h2>
                            <p className="info">
                                {/* <span>developed by OmniFlix for Cosmic Validator</span>
                            <span>supported with a grant by Mandragora</span> */}
                                {/* {variables[this.props.lang].participate} */}
                                developed by <strong>OmniFlix Network</strong> in association with
                            </p>
                            <img alt="cv" src={cvIcon}/>
                        </div>
                        <div className="chip_info">
                            <p>{variables[this.props.lang]['shielded_available_tokens']}</p>
                            <div className="chip">
                                <img alt="available tokens" src={totalTokens}/>
                                <p>0</p>
                            </div>
                        </div>
                    </div>
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
