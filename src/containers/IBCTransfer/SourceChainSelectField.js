import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../utils/variables';
import { chains } from 'chain-registry';
import { connectIBCAccount, fetchIBCBalance, fetchIBCChannel, setSelectedChain } from '../../actions/IBCTransfer';
import { IBCList } from 'dummy/ibcList';
import CircularProgress from 'components/CircularProgress';

const SourceChainSelectField = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        initKeplr(value);
    };

    const initKeplr = (value) => {
        const config = {
            RPC_URL: value && value.config && value.config.RPC_URL,
            REST_URL: value && value.config && value.config.REST_URL,
            CHAIN_ID: value && value.config && value.config.CHAIN_ID,
            CHAIN_NAME: value && value.config && value.config.CHAIN_NAME,
            COIN_DENOM: value && value.config && value.config.COIN_DENOM,
            COIN_MINIMAL_DENOM: value && value.config && value.config.COIN_MINIMAL_DENOM,
            COIN_DECIMALS: value && value.config && value.config.COIN_DECIMALS,
            PREFIX: value && value.config && value.config.PREFIX,
        };

        setInProgress(true);
        props.connectIBCAccount(config, (address) => {
            setInProgress(false);
            props.fetchIBCBalance(config.REST_URL, address[0].address);
            props.fetchIBCChannel(value.channel_link);
            props.onChange(value);
        });
    };

    return (
        <SelectField
            className="select_field"
            id="source_select_field"
            name="source"
            placeholder={variables[props.lang]['select_asset']}
            value={props.value}
            onChange={handleChange}>
            {inProgress ? <CircularProgress className="full_screen"/> : null}
            {IBCList && IBCList.map((item, index) => {
                const filterData = chains.find((val) => val?.chain_name === item.value);
                const image = filterData && filterData.images && filterData.images[0] && (filterData.images[0].svg || filterData.images[0].png);
                return (
                    <MenuItem key={index} value={item}>
                        <img alt="NamadaLogo" src={image} />
                        {item.name}
                    </MenuItem>
                );
            })}
        </SelectField>
    );
};

SourceChainSelectField.propTypes = {
    connectIBCAccount: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchIBCChannel: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.ibcTransfer.selectedChain.value,
    };
};

const actionToProps = {
    onChange: setSelectedChain,
    connectIBCAccount,
    fetchIBCBalance,
    fetchIBCChannel,
};

export default connect(stateToProps, actionToProps)(SourceChainSelectField);
