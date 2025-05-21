import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import variables from 'utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setShieldingSubTabs } from 'actions/shieldedAssets';
import classNames from 'classnames';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const ShieldingTabs = (props) => {
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        props.setShieldingSubTabs(newValue);
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
                <Tab className="tab" label={variables[props.lang].transparent_to_shielding} value="transparent_to_shielding"/>
                <Tab className="tab" label={variables[props.lang].shielded_to_transparent} value="shielded_to_transparent"/>
            </Tabs>
        </Paper>
    );
};

ShieldingTabs.propTypes = {
    lang: PropTypes.string.isRequired,
    setShieldingSubTabs: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.shieldedAssets.subTabs.value,
    };
};

const actionToProps = {
    setShieldingSubTabs,
};

export default connect(stateToProps, actionToProps)(ShieldingTabs);
