import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import './index.css';
import variables from '../../../utils/variables';
import { hideDelegateSuccessDialog } from '../../../actions/stake';
import success from '../../../assets/stake/success.svg';
import { config } from '../../../config';
import { withRouter } from 'react-router-dom';

const SuccessDialog = (props) => {
    const handleRedirect = () => {
        if (config.EXPLORER_URL) {
            const link = `${config.EXPLORER_URL}/transactions/${props.hash}`;
            window.open(link, '_blank');
        }
    };

    const handleClose = () => {
        if (props.match && props.match.params && props.match.params.proposalID) {
            props.history.push('/proposals');
        }

        props.handleClose();
    };

    const validatorDetails = props.validatorList && props.validatorList.length &&
        props.validatorList.find((val) => val.operator_address === props.validator);
    const toValidatorDetails = props.validatorList && props.validatorList.length &&
        props.validatorList.find((val) => val.operator_address === props.toValidator);

    return (
        <Dialog
            aria-describedby="delegate-dialog-description"
            aria-labelledby="delegate-dialog-title"
            className="dialog delegate_dialog result"
            open={props.open}
            onClose={handleClose}>
            <DialogContent className="content">
                <div className="heading">
                    <img alt="success" src={success}/>
                    {props.name
                        ? <h1>{props.name + 'd Successfully'}</h1>
                        : props.match && props.match.params && props.match.params.proposalID
                            ? <h1>{variables[props.lang].vote_success}</h1>
                            : props.claimValidator && props.claimValidator !== 'none'
                                ? <h1>{variables[props.lang].claimed_success}</h1>
                                : <h1>{variables[props.lang].success}</h1>}
                </div>
                {props.match && props.match.params && props.match.params.proposalID && props.hash
                    ? <div className="row">
                        <p>{variables[props.lang]['transaction_hash']}</p>
                        <div
                            className="hash_text link" title={props.hash}
                            onClick={handleRedirect}>
                            <p className="name">{props.hash}</p>
                            {props.hash &&
                                props.hash.slice(props.hash.length - 6, props.hash.length)}
                        </div>
                    </div>
                    : !props.name
                        ? props.claimValidator && props.claimValidator !== 'none'
                            ? <>
                                <div className="row">
                                    <p>{variables[props.lang]['transaction_hash']}</p>
                                    <div
                                        className="hash_text link" title={props.hash}
                                        onClick={handleRedirect}>
                                        <p className="name">{props.hash}</p>
                                        {props.hash &&
                                            props.hash.slice(props.hash.length - 6, props.hash.length)}
                                    </div>
                                </div>
                                <div className="row">
                                    <p>{variables[props.lang].tokens}</p>
                                    <p>{props.tokens
                                        ? Number(props.tokens).toFixed(4) + ' ' + config.COIN_DENOM
                                        : null}</p>
                                </div>
                            </> : null
                        : <>
                            <div className="row">
                                <p>{variables[props.lang]['transaction_hash']}</p>
                                <div
                                    className="hash_text link" title={props.hash}
                                    onClick={handleRedirect}>
                                    <p className="name">{props.hash}</p>
                                    {props.hash &&
                                        props.hash.slice(props.hash.length - 6, props.hash.length)}
                                </div>
                            </div>
                            <div className="row">
                                <p>{variables[props.lang]['delegator_address']}</p>
                                <div className="hash_text" title={props.address}>
                                    <p className="name">{props.address}</p>
                                    {props.address &&
                                        props.address.slice(props.address.length - 6, props.address.length)}
                                </div>
                            </div>
                            {props.name === 'Redelegate'
                                ? <>
                                    <div className="row">
                                        <p>From {variables[props.lang]['validator_address']}</p>
                                        <div className="validator">
                                            <div className="hash_text" title={props.validator}>
                                                <p className="name">{props.validator}</p>
                                                {props.validator &&
                                                    props.validator.slice(props.validator.length - 6, props.validator.length)}
                                            </div>
                                            <p>{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
                                                ? `(${validatorDetails.description.moniker})`
                                                : null}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p>To {variables[props.lang]['validator_address']}</p>
                                        <div className="validator">
                                            <div className="hash_text" title={props.toValidator}>
                                                <p className="name">{props.toValidator}</p>
                                                {props.toValidator &&
                                                    props.toValidator.slice(props.toValidator.length - 6, props.toValidator.length)}
                                            </div>
                                            <p>{toValidatorDetails && toValidatorDetails.description && toValidatorDetails.description.moniker
                                                ? `(${toValidatorDetails.description.moniker})`
                                                : null}</p>
                                        </div>
                                    </div>
                                </>
                                : <div className="row">
                                    <p>{variables[props.lang]['validator_address']}</p>
                                    <div className="validator">
                                        <div className="hash_text" title={props.validator}>
                                            <p className="name">{props.validator}</p>
                                            {props.validator &&
                                                props.validator.slice(props.validator.length - 6, props.validator.length)}
                                        </div>
                                        <p>{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
                                            ? `(${validatorDetails.description.moniker})`
                                            : null}</p>
                                    </div>
                                </div>}
                            <div className="row">
                                <p>{variables[props.lang].tokens}</p>
                                <p>{props.tokens
                                    ? Number(props.tokens).toFixed(4) + ' ' + config.COIN_DENOM
                                    : null}</p>
                            </div>
                        </>}
            </DialogContent>
            <DialogActions className="footer">
                <Button variant="contained" onClick={handleClose}>
                    {variables[props.lang].done}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

SuccessDialog.propTypes = {
    claimValidator: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    hash: PropTypes.string.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    toValidator: PropTypes.string.isRequired,
    validator: PropTypes.string.isRequired,
    address: PropTypes.string,
    match: PropTypes.shape({
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }),
    }),
    tokens: PropTypes.any,
    validatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        tokens: state.stake.tokens,
        lang: state.language,
        open: state.stake.successDialog.open,
        hash: state.stake.successDialog.hash,
        name: state.stake.delegateDialog.name,
        validator: state.stake.validator.value,
        toValidator: state.stake.toValidator.value,
        validatorList: state.stake.validators.list,
        claimValidator: state.stake.claimDialog.validator,
    };
};

const actionToProps = {
    handleClose: hideDelegateSuccessDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(SuccessDialog));
