import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from 'components/TextField';
import { connect } from 'react-redux';
import { setTokensTransferAddress } from 'actions/assets';

const AddressTextField = (props) => {
    const handleChange = (value) => {
        if (value) {
            let valid = false;
            if(props.ibcTransferType === 'transparent') {
                valid = value && (value.indexOf('tnam') > -1);
            } else if(props.ibcTransferType === 'shielded') {
                valid = value && (value.indexOf('znam') > -1);
            }
            
            props.onChange(value, valid);
        } else {
            props.onChange(value, true);
        }
        // props.onChange(value, true);
    };

    return (
        <TextField
            className={props.valid ? 'text_field' : 'invalid_address text_field'}
            error={!props.valid}
            id="amount-text-field"
            name="address"
            placeholder={props.ibcTransferType === 'transparent' ? "e.g. tnamomabc...xyz9k" : props.ibcTransferType === 'shielded' ? "e.g. znamomabc...xyz9k" : "e.g. denomabc...xyz9k"}
            type="text"
            value={props.value}
            onChange={handleChange}/>
    );
};

AddressTextField.propTypes = {
    ibcTransferType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.array,
    value: PropTypes.number,
    valid: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.assets.tokensTransferAddress.value, 
        valid: state.assets.tokensTransferAddress.valid,
        ibcTransferType: state.ibcTransfer.ibcTransferType.value,
    };
};

const actionsToProps = {
    onChange: setTokensTransferAddress,
};

export default connect(stateToProps, actionsToProps)(AddressTextField);
