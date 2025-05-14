import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import variables from 'utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setExternalShieldingSubTabs } from 'actions/shieldedAssets';

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
        <Paper className={classes.root}>
        <Tabs
            value={props.value}
            className="shielding_tabs"
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            <Tab className="tab" value='ibc_shielding' label={variables[props.lang].ibc_shielding}/>
            <Tab className="tab" value='ibc_unshielding' label={variables[props.lang].ibc_unshielding}/>
        </Tabs>
        </Paper>
    );
}

ExternalShieldingTabs.propTypes = {
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
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
