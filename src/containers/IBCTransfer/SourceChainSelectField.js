import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../utils/variables';
import { chains } from 'chain-registry';
import { setSelectedChain } from '../../actions/IBCTransfer';

const SourceChainSelectField = (props) => {
    const handleChange = (value) => {
        if (props.value === value) {
            return;
        }

        props.onChange(value);
    };

    return (
        <SelectField
            className="select_field"
            id="source_select_field"
            name="source"
            placeholder={variables[props.lang]['select_asset']}
            value={props.value}
            onChange={handleChange}>
            {chains && chains.map((item, index) => {
                const image = item.images && item.images[0] && (item.images[0].svg || item.images[0].png);
                return (
                    <MenuItem key={index} value={item}>
                        <img alt="NamadaLogo" src={image} />
                        {item.pretty_name}
                    </MenuItem>
                );
            })}
        </SelectField>
    );
};

SourceChainSelectField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.ibcTransfer.selectedChain.value,
    };
};

const actionToProps = {
    onChange: setSelectedChain,
};

export default connect(stateToProps, actionToProps)(SourceChainSelectField);
