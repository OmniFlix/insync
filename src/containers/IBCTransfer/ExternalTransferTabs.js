import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import variables from 'utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setExternalTransferSubTabs } from 'actions/shieldedAssets';
import withRouter from '../../components/WithRouter';
import classNames from 'classnames';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const ExternalTransferTabs = (props) => {
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        props.onChange(newValue);
        if (newValue === 'namada_to_ibc_chain_transparent_transfer') {
            props.router.navigate('/externalTransfer/withdraw');
        } else {
            props.router.navigate('/externalTransfer');
        }
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
                <Tab className="tab" label={variables[props.lang].ibc_chain_to_namada_transparent_transfer} value="ibc_chain_to_namada_transparent_transfer"/>
                <Tab className="tab" label={variables[props.lang].namada_to_ibc_chain_transparent_transfer} value="namada_to_ibc_chain_transparent_transfer"/>
            </Tabs>
        </Paper>
    );
};

ExternalTransferTabs.propTypes = {
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
        value: state.shieldedAssets.externalTransferSubTabs.value,
    };
};

const actionToProps = {
    onChange: setExternalTransferSubTabs,
};

export default withRouter(connect(stateToProps, actionToProps)(ExternalTransferTabs));
