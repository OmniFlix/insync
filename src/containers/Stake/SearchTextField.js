import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { IconButton, InputAdornment } from '@material-ui/core';
import TextField from '../../components/TextField';
import Icon from '../../components/Icon';
import { setSearch } from '../../actions/stake';

const SearchTextField = (props) => {
    return (
        <TextField
            className="search_text_field"
            id="search-text-field"
            inputProps={{
                startAdornment: (
                    <div className="search_icons">
                        <InputAdornment position="start">
                            <Icon
                                className="search"
                                icon="search"/>
                        </InputAdornment>
                        <div className="line"/>
                    </div>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            className="text_field_icon">
                            <Icon
                                className="menu"
                                icon="menu"/>
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            name="search"
            placeholder="Search for validator"
            value={props.value}
            onChange={props.onChange}/>
    );
};

SearchTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.stake.search,
    };
};

const actionsToProps = {
    onChange: setSearch,
};

export default connect(stateToProps, actionsToProps)(SearchTextField);
