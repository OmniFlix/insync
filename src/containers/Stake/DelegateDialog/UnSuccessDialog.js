import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, DialogContent } from '@material-ui/core';
import './index.css';
import variables from '../../../utils/variables';
import { hideDelegateFailedDialog } from '../../../actions/stake';
import failed from '../../../assets/stake/failed.svg';

const UnSuccessDialog = (props) => {
    return (
        <Dialog
            aria-describedby="delegate-dialog-description"
            aria-labelledby="delegate-dialog-title"
            className="dialog delegate_dialog result"
            open={props.open}
            onClose={props.handleClose}>
            <DialogContent className="content">
                <div className="heading">
                    <img alt="failed" src={failed}/>
                    {<h1>{variables[props.lang]['transaction_failed']}</h1>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

UnSuccessDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.stake.failedDialog,
    };
};

const actionToProps = {
    handleClose: hideDelegateFailedDialog,
};

export default connect(stateToProps, actionToProps)(UnSuccessDialog);
