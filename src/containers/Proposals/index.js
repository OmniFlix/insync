import React, { useState } from 'react';
import NavBar from '../NavBar';
import variables from '../../utils/variables';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.css';
import Cards from './Cards';
import { fetchProposalTally, fetchVoteDetails, getProposals } from '../../actions/proposals';
import UnSuccessDialog from '../Stake/DelegateDialog/UnSuccessDialog';
import PendingDialog from '../Stake/DelegateDialog/PendingDialog';
import SuccessDialog from '../Stake/DelegateDialog/SuccessDialog';

const Proposals = (props) => {
    const [active, setActive] = useState(1);
    const [filter, setFilter] = useState(null);

    const handleChange = (value) => {
        if (active === value) {
            return;
        }

        setActive(value);
        setFilter(value === null ? 2
            : value === 2 ? 3
                : value === 3 ? 2
                    : value === 4 ? 4 : null);
    };
    const filteredProposals = filter ? props.proposals.filter((item) => item.status === filter) : props.proposals;

    return (
        <div className="proposals">
            <NavBar proposalTab={true}/>
            <div className="proposals_content padding">
                <div className="heading">
                    <div className="tabs">
                        <p className={active === 1 ? 'active' : ''} onClick={() => handleChange(1)}>
                            {variables[props.lang].all}
                        </p>
                        <span/>
                        <p className={active === 2 ? 'active' : ''} onClick={() => handleChange(2)}>
                            {variables[props.lang].active}
                        </p>
                        <span/>
                        <p className={active === 3 ? 'active' : ''} onClick={() => handleChange(3)}>
                            {variables[props.lang].pending}
                        </p>
                        <span/>
                        <p className={active === 4 ? 'active' : ''} onClick={() => handleChange(4)}>
                            {variables[props.lang].closed}
                        </p>
                    </div>
                </div>
                {props.proposalsInProgress || props.voteDetailsInProgress
                    ? <div className="cards_content">Loading...</div>
                    : filteredProposals && filteredProposals.length
                        ? <Cards proposals={filteredProposals}/>
                        : <div className="cards_content">No data found</div>}
            </div>
            <UnSuccessDialog/>
            <PendingDialog/>
            <SuccessDialog/>
        </div>
    );
};

Proposals.propTypes = {
    fetchProposalTally: PropTypes.func.isRequired,
    fetchVoteDetails: PropTypes.func.isRequired,
    getProposals: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    proposals: PropTypes.array.isRequired,
    voteDetails: PropTypes.array.isRequired,
    voteDetailsInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
    proposalsInProgress: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        proposals: state.proposals._.list,
        proposalsInProgress: state.proposals._.inProgress,
        lang: state.language,
        voteDetails: state.proposals.voteDetails.value,
        voteDetailsInProgress: state.proposals.voteDetails.inProgress,
    };
};

const actionsToProps = {
    getProposals,
    fetchVoteDetails,
    fetchProposalTally,
};

export default withRouter(connect(stateToProps, actionsToProps)(Proposals));
