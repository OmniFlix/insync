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

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const AssetTabs = (props) => {
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        props.onChange(newValue);
        if (newValue === 'shielded') {
            props.router.navigate('/tokensShielded');
        } else {
            props.router.navigate('/tokens');
        }
    };

    return (
        <Paper className={classNames(classes.root, 'sub_tabs_section assets_tab')}>
            <Tabs
                centered
                className="shielding_tabs"
                indicatorColor="primary"
                textColor="primary"
                value={props.value}
                onChange={handleChange}
            >
                <Tab className="tab" label={variables[props.lang].transparent} value="transparent"/>
                <Tab className="tab" label={variables[props.lang].shielded} value="shielded"/>
            </Tabs>
        </Paper>
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
