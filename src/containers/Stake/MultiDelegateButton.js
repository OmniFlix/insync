import React from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { showDelegateDialog } from '../../actions/stake';
import { showMessage } from '../../actions/snackbar';

const MultiDelegateButton = (props) => {
    const handleClick = () => {
        if (!props.address) {
            props.showMessage(variables[props.lang]['connect_account']);
            return;
        }

        props.handleOpen('Multi-Delegate', props.valAddress);
    };

    return (
        <Button
            className="multi_delegate_button"
            variant="outlined"
            onClick={handleClick}>
            {variables[props.lang].multi_delegate}
        </Button>
    );
};

MultiDelegateButton.propTypes = {
    handleOpen: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    showMessage: PropTypes.func.isRequired,
    address: PropTypes.string,
    valAddress: PropTypes.string,
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

export default connect(stateToProps, actionToProps)(MultiDelegateButton);
