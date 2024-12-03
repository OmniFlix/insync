import { AppBar, Tab } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { hideSideBar } from '../../actions/navBar';
import { hideProposalDialog } from '../../actions/proposals';
import withRouter from '../../components/WithRouter';

class Tabs extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: '',
        };
    }

    componentDidMount () {
        const route = this.props.router && this.props.router.location && this.props.router.location.pathname &&
            this.props.router.location.pathname.split('/') && this.props.router.location.pathname.split('/')[1];

        if (this.state.value !== route && (route === '' || route === 'stake' || route === 'proposals')) {
            this.setState({
                value: route,
            });
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if (pp.router && pp.router.location && this.props.router && this.props.router.location &&
            pp.router.location.pathname !== this.props.router.location.pathname) {
            const value = this.props.router.location.pathname.split('/')[1];

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
        if ((newValue === this.state.value) && (this.props.router &&
            this.props.router.params && !this.props.router.params.proposalID)) {
            return;
        }

        this.props.router.navigate('/' + newValue);
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
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
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
        open: state.proposals.dialog.open,
    };
};

const actionToProps = {
    handleClose: hideSideBar,
    hideProposalDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(Tabs));
