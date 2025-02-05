import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../../utils/variables';
import { setSelectedSource } from '../../../actions/shieldedAssets';

const SourceSelectField = (props) => {
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
            // items={props.validatorList}
            name="source"
            placeholder={variables[props.lang]['select_asset']}
            value={props.value}
            onChange={handleChange}>
            <MenuItem>
                Namada
            </MenuItem>
        </SelectField>
    );
};

SourceSelectField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.shieldedAssets.selectedAsset.value,
    };
};

const actionToProps = {
    onChange: setSelectedSource,
};

export default connect(stateToProps, actionToProps)(SourceSelectField);
