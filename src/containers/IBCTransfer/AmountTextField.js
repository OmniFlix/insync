import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from '../../components/TextField';
import { connect } from 'react-redux';
import { setIBCTransferAmount } from '../../actions/IBCTransfer';

const AmountTextField = (props) => {
    let amount = props.data && props.data.balance && props.data.balance.minDenomAmount;
    if (props.data && props.data.config && props.data.config.COIN_DECIMALS) {
        amount = amount ? (amount / 10 ** props.data.config.COIN_DECIMALS) : 0;
    }
    const handleChange = (input) => {
        const value = parseFloat(input) || 0;
        const isValid = value <= amount;
        props.onChange(value, isValid);
    }

    console.log('asdkgasdkads', props.data)
    return (
        <TextField
            className={props.valid ? 'text_field' : 'invalid_address text_field'}
            error={!props.valid}
            id="amount-text-field"
            name="amount"
            placeholder="Amount"
            type="number"
            value={props.value}
            onChange={handleChange}/>
    );
};

AmountTextField.propTypes = {
    data: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.array,
    value: PropTypes.number,
    valid: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        value: state.ibcTransfer.ibcTransferAmount.value,
        valid: state.ibcTransfer.ibcTransferAmount.valid,
    };
};

const actionsToProps = {
    onChange: setIBCTransferAmount,
};

export default connect(stateToProps, actionsToProps)(AmountTextField);
