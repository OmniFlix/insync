import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../utils/variables';
import { assets } from 'chain-registry';
import { setSelectedAsset } from '../../actions/IBCTransfer';

const AssetSelectField = (props) => {
    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    const filteredAssets = props.selectedChain && assets && assets.find((item) => item && item.chain_name === props.selectedChain.chain_name);

    return (
        <SelectField
            className="select_field"
            id="source_select_field"
            name="source"
            placeholder={variables[props.lang]['select_asset']}
            value={props.value}
            onChange={handleChange}>
            {filteredAssets && filteredAssets.assets && filteredAssets.assets.map((item, index) => {
                const image = item.images && item.images[0] && (item.images[0].svg || item.images[0].png);
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

AssetSelectField.propTypes = {
    lang: PropTypes.string.isRequired,
    selectedChain: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.ibcTransfer.selectedAsset.value,
        selectedChain: state.ibcTransfer.selectedChain.value,
    };
};

const actionToProps = {
    onChange: setSelectedAsset,
};

export default connect(stateToProps, actionToProps)(AssetSelectField);
