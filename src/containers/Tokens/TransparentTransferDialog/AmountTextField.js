import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { setTokensTransferAmount } from 'actions/assets';
import TextField from 'components/TextField';

const AmountTextField = (props) => {
    return (
        <TextField
            className="text_field"
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
        value: state.assets.tokensTransferAmount.value,
    };
};

const actionsToProps = {
    onChange: setTokensTransferAmount,
};

export default connect(stateToProps, actionsToProps)(AmountTextField);
