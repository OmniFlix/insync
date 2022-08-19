import { AppBar, Tab } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { withRouter } from 'react-router';
import { hideSideBar } from '../../actions/navBar';
import { hideProposalDialog } from '../../actions/proposals';

class Tabs extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: '',
        };
    }

    componentDidMount () {
        const route = this.props.location.pathname && this.props.location.pathname.split('/') &&
            this.props.location.pathname.split('/')[1];

        if (this.state.value !== route && (route === '' || route === 'stake' || route === 'proposals')) {
            this.setState({
                value: route,
            });
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if (pp.location.pathname !== this.props.location.pathname) {
            const value = this.props.location.pathname.split('/')[1];

            if (value !== this.state.value && (value === '' || value === 'stake' || value === 'proposals')) {
                this.setState({
                    value: value,
                });
            }
        }
    }

    handleChange (newValue) {
        this.props.handleClose();
        if (this.props.open) {
            this.props.hideProposalDialog();
        }
        if ((newValue === this.state.value) && (this.props.match &&
            this.props.match.params && !this.props.match.params.proposalID)) {
            return;
        }

        this.props.history.push('/' + newValue);
        this.setState({
            value: newValue,
        });
    }

    render () {
        const a11yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            };
        };

        return (
            <AppBar className="horizontal_tabs" position="static">
                <div className="tabs_content">
                    <Tab
                        className={'tab ' + (this.state.value === '' ? 'active_tab' : '')}
                        label={variables[this.props.lang].dashboard}
                        value=""
                        onClick={() => this.handleChange('')}
                        {...a11yProps(0)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'stake' ? 'active_tab' : '')}
                        label={variables[this.props.lang].stake}
                        value="stake"
                        onClick={() => this.handleChange('stake')}
                        {...a11yProps(1)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'proposals' ? 'active_tab' : '')}
                        label={variables[this.props.lang].proposals}
                        value="proposals"
                        onClick={() => this.handleChange('proposals')}
                        {...a11yProps(1)} />
                </div>
            </AppBar>
        );
    }
}

Tabs.propTypes = {
    handleClose: PropTypes.func.isRequired,
    hideProposalDialog: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }),
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.proposals.dialog.open,
    };
};

const actionToProps = {
    handleClose: hideSideBar,
    hideProposalDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(Tabs));
