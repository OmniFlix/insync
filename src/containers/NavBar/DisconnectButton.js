import React from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { disconnectSet } from '../../actions/accounts';
import withRouter from '../../components/WithRouter';

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

const actionsToProps = {
    disconnectSet,
};

export default withRouter(connect(stateToProps, actionsToProps)(DisconnectButton));
