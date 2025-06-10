import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { setTokensTransferAmount } from 'actions/assets';
import TextField from 'components/TextField';

const AmountTextField = (props) => {
    let amount = props.transferValue && props.transferValue.balance && props.transferValue.balance.minDenomAmount;
    if (props.transferValue && props.transferValue.config && props.transferValue.config.COIN_DECIMALS) {
        amount = amount ? (amount / 10 ** props.transferValue.config.COIN_DECIMALS) : 0;
    }

    if (props.from === 'shielded') {
        amount = props.amount;
    }

    const handleChange = (input) => {
        const value = input === '' ? '' : parseFloat(input);
        const isValid = value <= amount;
        props.onChange(value, isValid);
    };

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
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    amount: PropTypes.any,
    balance: PropTypes.array,
    from: PropTypes.string,
    transferValue: PropTypes.object,
    valid: PropTypes.bool,
    value: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        value: state.assets.tokensTransferAmount.value,
        valid: state.assets.tokensTransferAmount.valid,
        transferValue: state.assets.transparentTokensTransferDialog.value,
    };
};

const actionsToProps = {
    onChange: setTokensTransferAmount,
};

export default connect(stateToProps, actionsToProps)(AmountTextField);
