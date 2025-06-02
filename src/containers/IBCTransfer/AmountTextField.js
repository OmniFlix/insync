import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from '../../components/TextField';
import { connect } from 'react-redux';
import { setIBCTransferAmount } from '../../actions/IBCTransfer';

const AmountTextField = (props) => {
    let amount;
    if (props.from === 'from_namada_deposit') {
        const fromNamadaSelectedConfig = props.fromNamadaSelectedAsset?.config;
        amount = props.fromNamadaSelectedAsset?.balance?.minDenomAmount && Number(props.fromNamadaSelectedAsset?.balance?.minDenomAmount) / 10 ** fromNamadaSelectedConfig.COIN_DECIMALS;
    } else if(props.from === 'namada_deposit') {
        props.ibcBalance && props.ibcBalance.length && props.ibcBalance.map((val) => {
            if (val) {
                amount = val && val.amount;
            }
    
            return null;
        });
        amount = amount && amount / 10 ** (props.selectedChain && props.selectedChain.config && props.selectedChain.config.COIN_DECIMALS);
        if (amount > 0.5) {
            amount = amount - 0.05;
        }
    } else if (props.from === 'withdraw_shielded') {
        amount = props.amount;
    } else {
        amount = props.data && props.data.balance && props.data.balance.minDenomAmount;
        if (props.data && props.data.config && props.data.config.COIN_DECIMALS) {
            amount = amount ? (amount / 10 ** props.data.config.COIN_DECIMALS) : 0;
        }
    }
   
    const handleChange = (input) => {
        const value = input === '' ? '' : parseFloat(input);
        const isValid = value <= amount;
        props.onChange(value, isValid);
    }

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
    from: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.array,
    fromNamadaSelectedAsset: PropTypes.object,
    ibcBalance: PropTypes.object,
    selectedChain: PropTypes.object,
    value: PropTypes.number,
    valid: PropTypes.bool,
    amount: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        value: state.ibcTransfer.ibcTransferAmount.value,
        valid: state.ibcTransfer.ibcTransferAmount.valid,

        fromNamadaSelectedAsset: state.ibcTransfer.fromNamadaSelectedAsset.result,
        ibcBalance: state.ibcTransfer.balance.value,
        selectedChain: state.ibcTransfer.selectedChain.value,
    };
};

const actionsToProps = {
    onChange: setIBCTransferAmount,
};

export default connect(stateToProps, actionsToProps)(AmountTextField);
