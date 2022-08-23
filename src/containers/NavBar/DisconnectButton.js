import React from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { withRouter } from 'react-router';
import { disconnectSet } from '../../actions/accounts';

const DisconnectButton = (props) => {
    const handleClick = () => {
        localStorage.removeItem('of_co_address');
        localStorage.removeItem('of_co_wallet');
        props.disconnectSet();
    };

    return (
        <Button
            className="disconnect_button"
            variant="contained"
            onClick={handleClick}>
            {variables[props.lang].disconnect}
        </Button>
    );
};

DisconnectButton.propTypes = {
    disconnectSet: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

const actionsToProps = {
    disconnectSet,
};

export default withRouter(connect(stateToProps, actionsToProps)(DisconnectButton));
