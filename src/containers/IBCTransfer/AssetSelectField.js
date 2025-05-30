import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../utils/variables';
import { setSelectedAsset } from '../../actions/IBCTransfer';

const AssetSelectField = (props) => {
    useEffect(() => {
        if (props.selectedChain && props.selectedChain.assets && props.selectedChain.assets.length) {
            props.onChange(props.selectedChain.assets[0]);
        }
    }, [props.selectedChain]);

    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    const assets = props.selectedChain && props.selectedChain.assets;

    return (
        <SelectField
            className="select_field"
            id="source_select_field"
            name="source"
            placeholder={variables[props.lang]['select_asset']}
            value={props.value}
            onChange={handleChange}>
            {assets && assets.map((asset, index) => {
                console.log('asdkjgaksd', asset)
                const image = asset.logo_URIs && (asset.logo_URIs.svg || asset.logo_URIs.png);
                return (
                    <MenuItem key={index} value={asset}>
                        {image && <img alt={asset.name} src={image} style={{ width: '24px', height: '24px', marginRight: '8px' }} />}
                        {asset.symbol || asset.display}
                    </MenuItem>
                );
            })}
        </SelectField>
    );
};

AssetSelectField.propTypes = {
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedChain: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
