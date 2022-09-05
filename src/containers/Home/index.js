import React, { Component } from 'react';
import './index.css';
import NavBar from '../NavBar';
import variables from '../../utils/variables';
import * as PropTypes from 'prop-types';
import TokenDetails from './TokenDetails';
import DelegateDialog from '../Stake/DelegateDialog';
import SuccessDialog from '../Stake/DelegateDialog/SuccessDialog';
import UnSuccessDialog from '../Stake/DelegateDialog/UnSuccessDialog';
import ClaimDialog from './ClaimDialog';
import Table from '../Stake/Table';
import { Button } from '@material-ui/core';
import Cards from '../Proposals/Cards';
import ProposalDialog from '../Proposals/ProposalDialog';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PendingDialog from '../Stake/DelegateDialog/PendingDialog';

class Home extends Component {
    constructor (props) {
        super(props);

        this.state = {
            active: 1,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    componentDidMount () {
        if ((this.props.address !== '') && (this.state.active !== 2)) {
            this.setState({
                active: 2,
            });
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.address !== this.props.address) &&
            (this.props.address !== '') && (this.state.active !== 2)) {
            this.setState({
                active: 2,
            });
        }
        if ((pp.address !== this.props.address) &&
            (this.props.address === '') && (this.state.active !== 1)) {
            this.setState({
                active: 1,
            });
        }
    }

    handleChange (value) {
        if (this.state.active === value) {
            return;
        }

        this.setState({
            active: value,
        });
    }

    handleRedirect (value) {
        this.props.history.push(value);
    }

    render () {
        const { active } = this.state;
        const filteredProposals = this.props.proposals && this.props.proposals.filter((item) => item.status === 2);

        return (
            <>
                <NavBar home={true}/>
                <div className="home padding">
                    <div className="card">
                        <div className="left_content">
                            <h2>{variables[this.props.lang].welcome}</h2>
                            <p className="info">{variables[this.props.lang].participate}</p>
                        </div>
                        <TokenDetails lang={this.props.lang}/>
                    </div>
                </div>
                <div className="stake">
                    <div className="stake_content padding">
                        <div className="heading">
                            <div className="tabs">
                                <p className={active === 2 ? 'active' : ''} onClick={() => this.handleChange(2)}>
                                    {variables[this.props.lang]['staked_validators']}
                                    {this.props.delegatedValidatorList &&
                                    this.props.delegatedValidatorList.length
                                        ? ' (' + this.props.delegatedValidatorList.length + ')'
                                        : null}
                                </p>
                                <span/>
                                <p className={active === 1 ? 'active' : ''} onClick={() => this.handleChange(1)}>
                                    {variables[this.props.lang]['active_validators']}
                                    {this.props.validatorList &&
                                    this.props.validatorList.length
                                        ? ' (' + this.props.validatorList.length + ')'
                                        : null}
                                </p>
                                <span/>
                                <p className={active === 3 ? 'active' : ''} onClick={() => this.handleChange(3)}>
                                    {variables[this.props.lang]['inactive_validators']}
                                    {this.props.inActiveValidators &&
                                    this.props.inActiveValidators.length
                                        ? ' (' + this.props.inActiveValidators.length + ')'
                                        : null}
                                </p>
                            </div>
                            <Button className="view_all" onClick={() => this.handleRedirect('/stake')}>
                                {variables[this.props.lang]['view_all']}
                            </Button>
                        </div>
                        <Table active={active} home={true}/>
                    </div>
                </div>
                <div className="proposals">
                    {!this.props.open
                        ? <div className="proposals_content padding">
                            <div className="heading">
                                <div className="tabs">
                                    <p className="active">
                                        {variables[this.props.lang]['top_active_proposals']}
                                    </p>
                                </div>
                                <Button className="view_all" onClick={() => this.handleRedirect('/proposals')}>
                                    {variables[this.props.lang]['view_all']}
                                </Button>
                            </div>
                            {this.props.proposalsInProgress || this.props.voteDetailsInProgress
                                ? <div className="cards_content">Loading...</div>
                                : filteredProposals && filteredProposals.length
                                    ? <Cards home={true} proposals={filteredProposals}/>
                                    : <div className="cards_content">{variables[this.props.lang]['no_data_found']}</div>}
                        </div>
                        : <ProposalDialog/>}
                </div>
                <DelegateDialog/>
                <SuccessDialog/>
                <UnSuccessDialog/>
                <PendingDialog/>
                <ClaimDialog/>
            </>
        );
    }
}

Home.propTypes = {
    delegatedValidatorList: PropTypes.array.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    inActiveValidators: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    proposals: PropTypes.array.isRequired,
    validatorList: PropTypes.array.isRequired,
    voteDetailsInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
    proposalsInProgress: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        open: state.proposals.dialog.open,
        proposals: state.proposals._.list,
        proposalsInProgress: state.proposals._.inProgress,
        voteDetailsInProgress: state.proposals.voteDetails.inProgress,
        delegatedValidatorList: state.stake.delegatedValidators.list,
        inActiveValidators: state.stake.inActiveValidators.list,
        validatorList: state.stake.validators.list,
    };
};

export default withRouter(connect(stateToProps)(Home));
