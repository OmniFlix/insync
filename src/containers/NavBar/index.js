import React, { Component } from 'react';
import logo from '../../assets/OmniFlix.svg';
import './index.css';
import DisconnectButton from './DisconnectButton';
import Tabs from './Tabs';
import ExpansionButton from './ExpansionButton';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import { hideSideBar } from '../../actions/navBar';
import Icon from '../../components/Icon';
import { initializeChain } from '../../helper';
import { decode, encode } from 'js-base64';
import { config } from '../../config';
import { showMessage } from '../../actions/snackbar';
import {
    fetchRewards,
    fetchVestingBalance,
    getBalance,
    getDelegations,
    getUnBondingDelegations,
    setAccountAddress,
    showSelectAccountDialog,
} from '../../actions/accounts';
import { fetchValidatorImage, getDelegatedValidatorsDetails, getValidators } from '../../actions/stake';
import { withRouter } from 'react-router-dom';
import ConnectButton from './ConnectButton';
import CopyButton from '../../components/CopyButton/TextButton';
import variables from '../../utils/variables';
import { fetchProposalDetails, fetchProposalTally, fetchVoteDetails, getProposals } from '../../actions/proposals';

class NavBar extends Component {
    constructor (props) {
        super(props);

        this.initKeplr = this.initKeplr.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
        this.handleChain = this.handleChain.bind(this);
        this.getValidatorImage = this.getValidatorImage.bind(this);
        this.getProposalDetails = this.getProposalDetails.bind(this);
    }

    componentDidMount () {
        if (localStorage.getItem('of_co_address')) {
            this.initKeplr();
        }
        if (!this.props.stake && this.props.proposalTab) {
            this.props.getProposals((result) => {
                if (result && result.length) {
                    const array = [];
                    result.map((val) => {
                        const filter = this.props.proposalDetails && Object.keys(this.props.proposalDetails).length &&
                            Object.keys(this.props.proposalDetails).find((key) => key === val.id);
                        if (!filter) {
                            if (this.props.home && val.status !== 2) {
                                return null;
                            }

                            array.push(val.id);
                        }
                        if (val.status === 2) {
                            this.props.fetchProposalTally(val.id);
                        }

                        return null;
                    });
                    this.getProposalDetails(array);
                }
            });
        }
        if (this.props.address) {
            this.handleFetch(this.props.address);
        }

        if (!this.props.validatorList.length && !this.props.validatorListInProgress && !this.props.proposalTab) {
            this.props.getValidators((data) => {
                if (!this.props.stake) {
                    this.props.getProposals((result) => {
                        if (result && result.length) {
                            const array = [];
                            result.map((val) => {
                                const filter = this.props.proposalDetails && Object.keys(this.props.proposalDetails).length &&
                                    Object.keys(this.props.proposalDetails).find((key) => key === val.id);
                                if (!filter) {
                                    if (this.props.home && val.status !== 2) {
                                        return null;
                                    }

                                    array.push(val.id);
                                }
                                if (val.status === 2) {
                                    this.props.fetchProposalTally(val.id);
                                }

                                return null;
                            });
                            this.getProposalDetails(array);
                        }
                    });
                }

                if (data && data.length && this.props.validatorImages && this.props.validatorImages.length === 0) {
                    const array = data.filter((val) => val && val.description && val.description.identity);
                    this.getValidatorImage(0, array);
                }
            });
        }
        window.addEventListener('keplr_keystorechange', () => {
            if (localStorage.getItem('of_co_address') || this.props.address !== '') {
                this.handleChain();
            }
        });
    }

    componentDidUpdate (pp, ps, ss) {
        if ((!pp.proposals.length && (pp.proposals !== this.props.proposals) &&
            this.props.proposals && this.props.proposals.length) ||
            ((pp.address !== this.props.address) && (pp.address === ''))) {
            this.props.proposals.map((val) => {
                const votedOption = this.props.voteDetails && this.props.voteDetails.length && val && val.id &&
                    this.props.voteDetails.filter((vote) => vote.proposal_id === val.id)[0];

                if (val.status === 2 && !votedOption && this.props.address) {
                    this.props.fetchVoteDetails(val.id, this.props.address);
                }

                return null;
            });
        }

        if ((pp.address !== this.props.address) && pp.address !== '' && !this.props.stake) {
            this.props.getProposals((result) => {
                if (result && result.length) {
                    const array = [];
                    result.map((val) => {
                        const filter = this.props.proposalDetails && Object.keys(this.props.proposalDetails).length &&
                            Object.keys(this.props.proposalDetails).find((key) => key === val.id);
                        if (!filter) {
                            if (this.props.home && val.status !== 2) {
                                return null;
                            }

                            array.push(val.id);
                        }
                        if (val.status === 2) {
                            this.props.fetchProposalTally(val.id);
                            this.props.fetchVoteDetails(val.id, this.props.address);
                        }

                        return null;
                    });
                    this.getProposalDetails(array);
                }
            });
        }
    }

    componentWillUnmount () {
        window.removeEventListener('keplr_keystorechange', this.handleChain);
    }

    getValidatorImage (index, data) {
        const array = [];
        for (let i = 0; i < 3; i++) {
            if (data[index + i]) {
                const value = data[index + i];
                if (value && value.description && value.description.identity) {
                    array.push(this.props.fetchValidatorImage(value.description.identity));
                }
            } else {
                break;
            }
        }

        Promise.all(array).then(() => {
            if (index + 3 < data.length - 1) {
                this.getValidatorImage(index + 3, data);
            }
        });
    }

    getProposalDetails (data) {
        if (data && data.length && data[0]) {
            this.props.fetchProposalDetails(data[0], (res) => {
                if (data[1]) {
                    data.splice(0, 1);
                    this.getProposalDetails(data);
                }
            });
        }
    }

    handleFetch (address) {
        if (!this.props.proposalTab && !this.props.stake) {
            this.props.getUnBondingDelegations(address);
            this.props.fetchRewards(address);
        }
        if (!this.props.proposalTab) {
            this.props.getDelegations(address);
        }
        this.props.getBalance(address, (res) => {
            this.props.fetchVestingBalance(address);
            if (!this.props.proposalTab) {
                this.props.getDelegatedValidatorsDetails(address);
            }
        });
    }

    initKeplr () {
        window.onload = () => this.handleChain();
    }

    handleChain () {
        initializeChain((error, addressList) => {
            if (error) {
                this.props.showMessage(error);
                localStorage.removeItem('of_co_address');

                return;
            }

            const previousAddress = localStorage.getItem('of_co_address') &&
                decode(localStorage.getItem('of_co_address'));
            this.props.setAccountAddress(addressList[0] && addressList[0].address);
            this.handleFetch(addressList[0] && addressList[0].address);
            if (addressList[0] && previousAddress !== addressList[0].address) {
                localStorage.setItem('of_co_address', encode(addressList[0] && addressList[0].address));
            }
        });
    }

    render () {
        return (
            <div className={ClassNames('nav_bar padding', localStorage.getItem('of_co_address') || this.props.address
                ? '' : 'disconnected_nav')}>
                <img alt="OmniFlix" src={logo}/>
                <ExpansionButton/>
                <div className={ClassNames('right_content', this.props.show ? 'show' : '')}>
                    <div className="back_button" onClick={this.props.handleClose}>
                        <Icon className="cross" icon="cross"/>
                    </div>
                    <Tabs/>
                    {(localStorage.getItem('of_co_address') || this.props.address) &&
                    <div className="select_fields">
                        <p className="token_name">{config.NETWORK_NAME}</p>
                        <span className="divider"/>
                        <div className="hash_text" title={this.props.address}>
                            <p className="name">{this.props.address}</p>
                            {this.props.address &&
                            this.props.address.slice(this.props.address.length - 6, this.props.address.length)}
                        </div>
                        <CopyButton data={this.props.address}>
                            {variables[this.props.lang].copy}
                        </CopyButton>
                    </div>}
                    {localStorage.getItem('of_co_address') || this.props.address
                        ? <DisconnectButton/>
                        : <ConnectButton proposalTab={this.props.proposalTab} stake={this.props.stake}/>}
                </div>
            </div>
        );
    }
}

NavBar.propTypes = {
    fetchProposalDetails: PropTypes.func.isRequired,
    fetchProposalTally: PropTypes.func.isRequired,
    fetchRewards: PropTypes.func.isRequired,
    fetchValidatorImage: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    fetchVoteDetails: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getProposals: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    getValidators: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    proposalDetails: PropTypes.object.isRequired,
    proposals: PropTypes.array.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    validatorImages: PropTypes.array.isRequired,
    validatorList: PropTypes.array.isRequired,
    validatorListInProgress: PropTypes.bool.isRequired,
    voteDetails: PropTypes.array.isRequired,
    voteDetailsInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string,
    home: PropTypes.bool,
    proposalTab: PropTypes.bool,
    proposalsInProgress: PropTypes.bool,
    stake: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        validatorList: state.stake.validators.list,
        validatorListInProgress: state.stake.validators.inProgress,
        validatorImages: state.stake.validators.images,
        lang: state.language,
        show: state.navBar.show,
        proposals: state.proposals._.list,
        proposalDetails: state.proposals.proposalDetails.value,
        proposalsInProgress: state.proposals._.inProgress,
        voteDetails: state.proposals.voteDetails.value,
        voteDetailsInProgress: state.proposals.voteDetails.inProgress,
    };
};

const actionToProps = {
    handleClose: hideSideBar,
    showMessage,
    setAccountAddress,
    getDelegations,
    getDelegatedValidatorsDetails,
    getBalance,
    showDialog: showSelectAccountDialog,
    getUnBondingDelegations,
    getValidators,
    fetchRewards,
    fetchValidatorImage,
    fetchVestingBalance,
    getProposals,
    fetchVoteDetails,
    fetchProposalTally,
    fetchProposalDetails,
};

export default withRouter(connect(stateToProps, actionToProps)(NavBar));
