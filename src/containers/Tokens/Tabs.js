import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import variables from 'utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAssetsTabs } from 'actions/assets';
import classNames from 'classnames';
import withRouter from 'components/WithRouter';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const AssetTabs = (props) => {
    const classes = useStyles();

    const handleChange = (newValue) => {
        props.onChange(newValue);
        if (newValue === 'shielded') {
            props.router.navigate('/shieldedTokens');
        } else {
            props.router.navigate('/tokens');
        }
    };

    return (
        <div className="tokens_section_tabs">
            <div>
                <Button className={props.value === 'transparent' ? 'active tab' : 'tab'} onClick={() => handleChange('transparent')}>
                    {variables[props.lang].transparent}
                </Button>
                <span />
                <Button className={props.value === 'shielded' ? 'active tab' : 'tab'} onClick={() => handleChange('shielded')}>
                    {variables[props.lang].shielded}
                </Button>
            </div>

        </div>
    );
};

AssetTabs.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    router: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }).isRequired,
        navigate: PropTypes.func.isRequired,
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }).isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.assets.assetsTab.value,
    };
};

const actionToProps = {
    onChange: setAssetsTabs,
};

export default withRouter(connect(stateToProps, actionToProps)(AssetTabs));
