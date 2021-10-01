import React from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import { showDelegateDialog } from '../../../actions/stake';
import { showMessage } from '../../../actions/snackbar';

const ReDelegateButton = (props) => {
    const handleClick = () => {
        if (!props.address) {
            props.showMessage(variables[props.lang]['connect_account']);
            return;
        }

        props.handleOpen('Redelegate', props.valAddress);
    };

    return (
        <Button
            className="outline_button re_delegate"
            variant="outlined"
            onClick={handleClick}>
            {variables[props.lang]['re_delegate']}
        </Button>
    );
};

ReDelegateButton.propTypes = {
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

export default connect(stateToProps, actionToProps)(ReDelegateButton);
