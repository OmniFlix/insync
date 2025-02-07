import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import variables from '../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from '../../components/WithRouter';

class IBCTransfer extends Component {
    render () {
        return (
            <>
                <NavBar home={true}/>
                <div className="ibc_content padding"></div>
            </>
        );
    }
}

IBCTransfer.propTypes = {
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

export default withRouter(connect(stateToProps)(IBCTransfer));
