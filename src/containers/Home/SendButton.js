import React from 'react';
import { Button } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { showClaimRewardsDialog } from '../../actions/stake';
import { showMessage } from '../../actions/snackbar';
import { sentTransaction } from '../../helper';
import { config } from '../../config';
import BigNumber from 'bignumber.js';

const SendButton = (props) => {
    const handleClick = () => {
        if (!props.address) {
            props.showMessage(variables[props.lang]['connect_account']);
            return;
        }

        const tx = {
            source: props.address,
            target: 'tnam1qqrhwfj678xq07nfwmmxkvjgzzdr9ywamqqjn88x',
            token: config.TOKEN_ADDRESS,
            amount: new BigNumber(1),
            nativeToken: 'NAAN',
        };

        const txs = {
            token: config.TOKEN_ADDRESS,
            feeAmount: new BigNumber(0.000100),
            gasLimit: new BigNumber(30000),
            chainId: config.CHAIN_ID,
        };

        sentTransaction(tx, txs, props.address, props.details && props.details.type, (error, result) => {
            console.log('aaaa', result, error);
        });
    };

    return (
        <Button
            className="outline_button"
            disabled={props.disable}
            variant="outlined"
            onClick={handleClick}>
            {variables[props.lang].send}
        </Button>
    );
};

SendButton.propTypes = {
    details: PropTypes.object.isRequired,
    disable: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    showMessage: PropTypes.func.isRequired,
    address: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        details: state.accounts.address.details,
        lang: state.language,
    };
};

const actionToProps = {
    handleOpen: showClaimRewardsDialog,
    showMessage,
};

export default connect(stateToProps, actionToProps)(SendButton);
