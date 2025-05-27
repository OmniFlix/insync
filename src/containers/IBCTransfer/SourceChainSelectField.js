import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../utils/variables';
import { chains } from 'chain-registry';
import { connectIBCAccount, fetchIBCBalance, fetchIBCChannel, setSelectedChain } from '../../actions/IBCTransfer';
import { ibcList } from 'dummy/ibcList';
import CircularProgress from 'components/CircularProgress';

const SourceChainSelectField = (props) => {
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (props.from === 'transparent_deposit' && props.data?.coingecko_id) {
            const matchedItem = ibcList.find(item => item.value === props.data?.coingecko_id);
            console.log('asdkjagsdads', matchedItem)

            if (matchedItem) {
                // props.onChange(matchedItem);
                initKeplr(matchedItem);
                return;
            }
        } else if (props.from === 'shielded_deposit' && props.data) {
            const matchedItem = ibcList.find(item => item.value === props.data?.coingecko_id);

            if (matchedItem) {
                // props.onChange(matchedItem);
                initKeplr(matchedItem);
                return;
            }
        } 
        // Fallback to default (first item)
            props.onChange(ibcList && ibcList[0]);
    }, [props.from, props.data]);

    const handleChange = (value) => {
        console.log('asdkgajsdkads', value, props.value)
        if (props.value === value) {
            return;
        }

        initKeplr(value);
    };

    const initKeplr = (value) => {
        console.log('asdjagskdasd', value)
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
            {ibcList && ibcList.map((item, index) => {
                let image;
                const filterData = chains.find((val) => val.chain_name === item.value);
                if (filterData) {
                    image = filterData && filterData.images && filterData.images[0] && (filterData.images[0].svg || filterData.images[0].png);
                } else {
                    image = item.image_URL;
                }
                return (
                    <MenuItem key={index} value={item}>
                        <img alt="chain_logo" src={image} />
                        {item.name}
                    </MenuItem>
                );
            })}
        </SelectField>
    );
};

SourceChainSelectField.propTypes = {
    connectIBCAccount: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchIBCChannel: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    from: PropTypes.string,
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
