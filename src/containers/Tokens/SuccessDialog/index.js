import React from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import { Dialog, Button } from "@material-ui/core";
import { hideTokensTransactionSuccessDialog } from "actions/IBCTransfer";
import Lottie from 'lottie-react';
import backgroundAnimation from 'assets/abstract_waves_circles.json';
import successGif from 'assets/success.gif';
import xlogo from 'assets/x.png';
import Close from "@material-ui/icons/Close";
import './index.css';

const SuccessDialog = (props) => {
    const handleClick = () => {
        const pageUrl = encodeURIComponent('https://namada.OmniFlix.co');
        const newShareText = encodeURIComponent(
            `I care about my privacy & just shielded ${props.value?.tokenName} via Namada!\n\nI walk the talk!\n\nDo you? Take action 👇\n`,
        );

        const targetUrl = `https://twitter.com/intent/tweet?text=${newShareText}&url=${pageUrl}`;
        window.open(targetUrl, '_blank');
    };

    return (
        <Dialog open={props.open}
        onClose={props.handleClose}
        aria-describedby="success-dialog-description"
        aria-labelledby="success-dialog-title"
        className="dialog tokens_success_dialog">
            <div className="dialog_animation">
                <Lottie animationData={backgroundAnimation} className="background" loop={true}/>
                <img unoptimized alt={'success'} className="success_gif" src={successGif}/>
                <Button className="close_button" onClick={props.handleClose}>
                    <Close />
                </Button>
            </div>
            <div className="dialog_content">
                <h2>{props.value?.text || 'OSMO Deposited Successfully'}</h2>
                <p>{props.value?.content || 'Your deposit was completed and funds are available'}</p>
                {props.value?.shielded
                    ? <Button onClick={handleClick}>
                        Share on
                        <img unoptimized alt={'x'} className="x_logo" src={xlogo}/>
                    </Button>
                    : <Button onClick={props.handleClose}>
                        Done
                    </Button>}
            </div>
        </Dialog>
    )
}

SuccessDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    router: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }).isRequired,
        navigate: PropTypes.func.isRequired,
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }).isRequired,
    }),
    value: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.ibcTransfer.tokensTransactionSuccessDialog.open,
        value: state.ibcTransfer.tokensTransactionSuccessDialog.value,
    };
};

const actionToProps = {
    handleClose: hideTokensTransactionSuccessDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(SuccessDialog));