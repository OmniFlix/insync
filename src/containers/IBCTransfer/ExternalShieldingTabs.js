import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import variables from 'utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setExternalShieldingSubTabs } from 'actions/shieldedAssets';
import classNames from 'classnames';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const ExternalShieldingTabs = (props) => {
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        props.onChange(newValue);
    };

    return (
        <Paper className={classNames(classes.root, 'sub_tabs_section')}>
            <Tabs
                centered
                className="shielding_tabs"
                indicatorColor="primary"
                textColor="primary"
                value={props.value}
                onChange={handleChange}
            >
                <Tab className="tab" label={variables[props.lang].ibc_shielding} value="ibc_shielding"/>
                <Tab className="tab" label={variables[props.lang].ibc_unshielding} value="ibc_unshielding"/>
            </Tabs>
        </Paper>
    );
};

ExternalShieldingTabs.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.shieldedAssets.externalShieldingTabs.value,
    };
};

const actionToProps = {
    onChange: setExternalShieldingSubTabs,
};

export default connect(stateToProps, actionToProps)(ExternalShieldingTabs);
