import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from '../../components/TextField';
import { connect } from 'react-redux';
import { setIBCTransferAddress } from '../../actions/IBCTransfer';

const AddressTextField = (props) => {
    return (
        <TextField
            className="address_text_field"
            id="address-text-field"
            name="address"
            placeholder="Address"
            value={props.value}
            onChange={props.onChange}/>
    );
};

AddressTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.array,
    value: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        value: state.ibcTransfer.ibcTransferAddress.value,
    };
};

const actionsToProps = {
    onChange: setIBCTransferAddress,
};

export default connect(stateToProps, actionsToProps)(AddressTextField);
