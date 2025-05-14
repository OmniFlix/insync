import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import variables from 'utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setShieldingSubTabs } from 'actions/shieldedAssets';

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
        <Paper className={classes.root}>
        <Tabs
            value={props.value}
            className="shielding_tabs"
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            <Tab className="tab" value='transparent_to_shielding' label={variables[props.lang].transparent_to_shielding}/>
            <Tab className="tab" value='shielded_to_transparent' label={variables[props.lang].shielded_to_transparent}/>
        </Tabs>
        </Paper>
    );
}

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
