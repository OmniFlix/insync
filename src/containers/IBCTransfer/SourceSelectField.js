import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from '../../components/SelectField/WithChildren';
import { MenuItem } from '@material-ui/core';
import variables from '../../utils/variables';
import NamadaLogo from '../../assets/masp/namada_shielded.svg';
import { setFromNamadaSelectedAsset } from '../../actions/IBCTransfer';

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
            name="source"
            placeholder={variables[props.lang]['select_asset']}
            value={props.value}
            onChange={handleChange}>
            <MenuItem value="Namada">
                <img alt="NamadaLogo" src={NamadaLogo}/>
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
        value: state.ibcTransfer.fromNamadaSelectedAsset.value,
    };
};

const actionToProps = {
    onChange: setFromNamadaSelectedAsset,
};

export default connect(stateToProps, actionToProps)(SourceSelectField);
