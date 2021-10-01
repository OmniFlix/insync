import React from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import { showDelegateDialog } from '../../../actions/stake';
import { showMessage } from '../../../actions/snackbar';

const StakeTokensButton = (props) => {
    const handleClick = () => {
        if (!props.address) {
            props.showMessage(variables[props.lang]['connect_account']);
            return;
        }

        props.handleOpen('Stake');
    };

    return (
        <Button
            className="outline_button"
            variant="outlined"
            onClick={handleClick}>
            {variables[props.lang]['stake_tokens']}
        </Button>
    );
};

StakeTokensButton.propTypes = {
    handleOpen: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    showMessage: PropTypes.func.isRequired,
    address: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
    };
};

const actionToProps = {
    handleOpen: showDelegateDialog,
    showMessage,
};

export default connect(stateToProps, actionToProps)(StakeTokensButton);
