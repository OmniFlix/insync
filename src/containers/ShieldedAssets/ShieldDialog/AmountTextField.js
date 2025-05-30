import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from '../../../components/TextField';
import { connect } from 'react-redux';
import { setAmount } from '../../../actions/shieldedAssets';

const AmountTextField = (props) => {
    const fromNamadaSelectedConfig = props.selectedAsset?.config;
    const namadaBalance = props.selectedAsset?.balance?.minDenomAmount && Number(props.selectedAsset?.balance?.minDenomAmount) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    
    const handleChange = (input) => {
        const value = parseFloat(input) || 0;
        const isValid = value <= namadaBalance;
        props.onChange(value, isValid);
    }

    return (
        <TextField
            className={props.valid ? 'amount_text_field' : 'invalid_address amount_text_field'}
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
    balance: PropTypes.array,
    value: PropTypes.number,
    valid: PropTypes.bool,
    selectedAsset: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        value: state.shieldedAssets.amount.value, 
        valid: state.shieldedAssets.amount.valid,
        selectedAsset: state.shieldedAssets.selectedAsset.result,
    };
};

const actionsToProps = {
    onChange: setAmount,
};

export default connect(stateToProps, actionsToProps)(AmountTextField);
