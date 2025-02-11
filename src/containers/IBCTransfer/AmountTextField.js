import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from '../../components/TextField';
import { connect } from 'react-redux';
import { setIBCTransferAmount } from '../../actions/IBCTransfer';

const AmountTextField = (props) => {
    return (
        <TextField
            className="amount_text_field"
            id="amount-text-field"
            name="amount"
            placeholder="Amount"
            type="number"
            value={props.value}
            onChange={props.onChange}/>
    );
};

AmountTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.array,
    value: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        value: state.ibcTransfer.ibcTransferAmount.value,
    };
};

const actionsToProps = {
    onChange: setIBCTransferAmount,
};

export default connect(stateToProps, actionsToProps)(AmountTextField);
