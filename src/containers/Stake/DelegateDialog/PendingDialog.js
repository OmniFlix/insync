import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, DialogContent } from '@material-ui/core';
import './index.css';
import variables from '../../../utils/variables';
import { hideDelegateProcessingDialog } from '../../../actions/stake';
import processing from '../../../assets/stake/processing.svg';

const PendingDialog = (props) => {
    return (
        <Dialog
            aria-describedby="delegate-dialog-description"
            aria-labelledby="delegate-dialog-title"
            className="dialog delegate_dialog result pending"
            open={props.open}
            onClose={props.handleClose}>
            <DialogContent className="content">
                <div className="heading">
                    <img alt="processing" src={processing}/>
                    {<h1>{variables[props.lang]['transaction_processing']}</h1>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

PendingDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.stake.processingDialog,
    };
};

const actionToProps = {
    handleClose: hideDelegateProcessingDialog,
};

export default connect(stateToProps, actionToProps)(PendingDialog);
