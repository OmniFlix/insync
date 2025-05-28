import * as PropTypes from 'prop-types';
import React from 'react';
import TextField from 'components/TextField';
import { connect } from 'react-redux';
import { setTokensTransferMemo } from 'actions/assets';

const MemoTextField = (props) => {
    return (
        <TextField
            className="text_field"
            id="amount-text-field"
            name="memo"
            placeholder="Required for centralized exchanges"
            type="text"
            value={props.value}
            onChange={props.onChange}/>
    );
};

MemoTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.array,
    value: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        value: state.assets.tokensTransferMemo.value,
    };
};

const actionsToProps = {
    onChange: setTokensTransferMemo,
};

export default connect(stateToProps, actionsToProps)(MemoTextField);
