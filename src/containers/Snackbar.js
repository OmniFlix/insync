import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { hideSnackbar } from '../actions/snackbar';
import Snackbar from '../components/Snackbar';
import { withRouter } from 'react-router';

class SnackbarMessage extends Component {
    componentDidUpdate (pp, ps, ss) {
        if (pp.message !== this.props.message) {
            switch (this.props.message) {
            case 'Token is expired':
            case 'Error occurred while verifying the JWT token.':
            case 'User Id and token combination does not exist.':
                this.props.onClose();

                localStorage.removeItem('of_co_address');
                this.props.history.push('/');

                break;
            default:
                break;
            }
        }
    }

    render () {
        return (
            <Snackbar
                message={this.props.message}
                open={this.props.open}
                onClose={this.props.onClose}/>
        );
    }
}

SnackbarMessage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        open: state.snackbar.open,
        message: state.snackbar.message,
    };
};

const actionsToProps = {
    onClose: hideSnackbar,
};

export default withRouter(connect(stateToProps, actionsToProps)(SnackbarMessage));
