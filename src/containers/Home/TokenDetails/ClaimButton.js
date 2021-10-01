import React from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import { showClaimRewardsDialog } from '../../../actions/stake';
import { showMessage } from '../../../actions/snackbar';

const ClaimButton = (props) => {
    const handleClick = () => {
        if (!props.address) {
            props.showMessage(variables[props.lang]['connect_account']);
            return;
        }

        props.handleOpen();
    };

    return (
        <Button
            className="outline_button"
            disabled={props.disable}
            variant="outlined"
            onClick={handleClick}>
            {variables[props.lang].claim}
        </Button>
    );
};

ClaimButton.propTypes = {
    disable: PropTypes.bool.isRequired,
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
    handleOpen: showClaimRewardsDialog,
    showMessage,
};

export default connect(stateToProps, actionToProps)(ClaimButton);
