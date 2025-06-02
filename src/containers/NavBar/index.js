import React, { Component } from 'react';
import logo from '../../assets/logo.svg';
import './index.css';
import DisconnectButton from './DisconnectButton';
import Tabs from './Tabs';
import ExpansionButton from './ExpansionButton';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import { hideSideBar, showConnectDialog } from '../../actions/navBar';
import Icon from '../../components/Icon';
import { initializeChain, initializeCosmoStation, initializeNamadaChain } from '../../helper';
import { decode, encode } from 'js-base64';
import { config, DEFAULT_PAGE } from '../../config';
import { showMessage } from '../../actions/snackbar';
import {
    fetchBalanceList,
    fetchRevealedPubKey,
    fetchRewards,
    fetchTokensList,
    fetchVestingBalance,
    getBalance,
    getDelegations,
    getShieldedBalance,
    getUnBondingDelegations,
    setAccountAddress,
    setAccountDetails,
    shieldedBalanceFetchSuccess,
    showSelectAccountDialog,
} from '../../actions/accounts';
import {
    fetchAPR,
    fetchGenesisValidators,
    fetchUnBondingValidators,
    fetchValidatorImage,
    fetchValidatorImageSuccess,
    getDelegatedValidatorsDetails,
    getInActiveValidators,
    getValidators,
} from '../../actions/stake';
import CopyButton from '../../components/CopyButton/TextButton';
import variables from '../../utils/variables';
import { fetchProposalDetails, fetchProposalTally, fetchVoteDetails, getProposals } from '../../actions/proposals';
import { Button } from '@material-ui/core';
import ConnectDialog from './ConnectDialog';
import withRouter from '../../components/WithRouter';
import ShieldedSyncPercentage from 'containers/ShieldedSyncPercentage';
import ProfilePopover from './ProfilePopover';
// import { init as initShared } from '@namada/shared/dist/init-inline';
// import { init as initShared } from '../../private_modules/namada/shared/init-inline';

class NavBar extends Component {
    constructor (props) {
        super(props);

        this.state = {
            cosmostationEvent: null,
            profileAnchorEl: null,
        };

        this.initKeplr = this.initKeplr.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
        this.handleFetchValidators = this.handleFetchValidators.bind(this);
        this.handleChain = this.handleChain.bind(this);
        this.handleNamada = this.handleNamada.bind(this);
        this.getValidatorImage = this.getValidatorImage.bind(this);
        this.getProposalDetails = this.getProposalDetails.bind(this);
        this.handleCosmoStation = this.handleCosmoStation.bind(this);
        this.handleProfilePopoverOpen = this.handleProfilePopoverOpen.bind(this);
        this.handleProfilePopoverClose = this.handleProfilePopoverClose.bind(this);
    }

    componentDidMount () {
        // (async () => {
        //     await initShared();
        // })();
        if (localStorage.getItem('of_co_address') && (localStorage.getItem('of_co_wallet') === 'cosmostation')) {
            setTimeout(() => {
                this.handleCosmoStation(true);
            }, 600);
        } else if (localStorage.getItem('of_co_address') && (localStorage.getItem('of_co_wallet') === 'namada')) {
            setTimeout(() => {
                this.handleNamada(true);
            }, 600);
        } else if (localStorage.getItem('of_co_address')) {
            setTimeout(() => {
                this.initKeplr();
            }, 600);
        }

        if (this.props.proposals && !this.props.proposals.length &&
            !this.props.proposalsInProgress && !this.props.stake &&
            this.props.router && this.props.router.params && !this.props.router.params.proposalID) {
            this.props.getProposals((result) => {
                if (result && result.length) {
                    // const array = [];
                    // result.map((val) => {
                    //     const filter = this.props.proposalDetails && Object.keys(this.props.proposalDetails).length &&
                    //         Object.keys(this.props.proposalDetails).find((key) => key === val.proposal_id);
                    //     if (!filter) {
                    //         if (this.props.home && (val.status !== 'PROPOSAL_STATUS_VOTING_PERIOD')) {
                    //             return null;
                    //         }

                    //         array.push(val.proposal_id);
                    //     }
                    //     if (val.status === 2 || val.status === 'PROPOSAL_STATUS_VOTING_PERIOD') {
                    //         this.props.fetchProposalTally(val.id);
                    //     }

                    //     return null;
                    // });
                    // this.getProposalDetails(array && array.reverse());
                }
            });
        } else if (this.props.proposals && !this.props.proposalsInProgress && !this.props.stake &&
            this.props.proposalDetails && Object.keys(this.props.proposalDetails).length === 1 &&
            this.props.router && this.props.router.params && !this.props.router.params.proposalID) {
            const array = [];
            this.props.proposals.map((val) => {
                const filter = this.props.proposalDetails && Object.keys(this.props.proposalDetails).length &&
                    Object.keys(this.props.proposalDetails).find((key) => key === val.proposal_id);
                if (!filter) {
                    if (this.props.home && (val.status !== 'PROPOSAL_STATUS_VOTING_PERIOD')) {
                        return null;
                    }

                    array.push(val.proposal_id);
                }
                if (val.status === 2 || val.status === 'PROPOSAL_STATUS_VOTING_PERIOD') {
                    this.props.fetchProposalTally(val.id);
                }

                return null;
            });
            this.getProposalDetails(array && array.reverse());
        }

        if (this.props.address) {
            this.handleFetch(this.props.address);
        }

        if (this.props.validatorList && !this.props.validatorList.length && !this.props.validatorListInProgress && !this.props.proposalTab) {
            // this.props.fetchGenesisValidators();
            this.handleFetchValidators(DEFAULT_PAGE, 0);
        }

        // if (!this.props.actualAPR && !this.props.aprInProgress) {
        //     this.props.fetchAPR();
        // }

        // if (this.props.inActiveValidatorsList && !this.props.inActiveValidatorsList.length && !this.props.inActiveValidatorsInProgress && !this.props.proposalTab) {
        //     this.props.getInActiveValidators((data) => {
        //         // if (data && data.length) {
        //         //     const array = data.filter((val) => val && val.description && val.description.identity);
        //         //     this.getValidatorImage(0, array);
        //         // }
        //     });
        // }

        if (localStorage.getItem('of_co_wallet') === 'keplr') {
            window.addEventListener('keplr_keystorechange', () => {
                if (localStorage.getItem('of_co_address') || this.props.address !== '') {
                    this.handleChain();
                }
            });
        }

        if (localStorage.getItem('of_co_wallet') === 'cosmostation') {
            window.onload = () => {
                if (window.cosmostation && window.cosmostation.cosmos) {
                    const cosmostationEvent = window.cosmostation.cosmos.on('accountChanged', () => {
                        if (localStorage.getItem('of_co_address') || this.props.address !== '') {
                            this.handleCosmoStation();
                        }
                    });

                    this.setState({
                        cosmostationEvent: cosmostationEvent,
                    });
                }
            };
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.address !== this.props.address) && (pp.address === '') && (this.props.address !== '')) {
            this.props.getDelegatedValidatorsDetails(this.props.address);
            this.props.fetchUnBondingValidators(this.props.address);
            this.props.fetchRewards(this.props.address);
        }
        if ((pp.proposals && !pp.proposals.length && (pp.proposals !== this.props.proposals) &&
                this.props.proposals && this.props.proposals.length) ||
            ((pp.address !== this.props.address) && (pp.address === '') && (this.props.address !== ''))) {
            this.props.proposals && this.props.proposals.length &&
            this.props.proposals.map((val) => {
                const votedOption = this.props.voteDetails && this.props.voteDetails.length && val && val.proposal_id &&
                    this.props.voteDetails.filter((vote) => vote.proposal_id === val.proposal_id)[0];

                if ((val.status === 2 || val.status === 'voting') &&
                    !votedOption && this.props.address) {
                    this.props.fetchVoteDetails(val.id, this.props.address);
                }

                return null;
            });
        }

        if ((pp.address !== this.props.address) && (pp.address !== '') &&
            (this.props.address !== '') && !this.props.stake) {
            this.props.getProposals((result) => {
                if (result && result.length) {
                    const array = [];
                    result.map((val) => {
                        const filter = this.props.proposalDetails && Object.keys(this.props.proposalDetails).length &&
                            Object.keys(this.props.proposalDetails).find((key) => key === val.proposal_id);
                        if (!filter) {
                            if (this.props.home && (val.status !== 'PROPOSAL_STATUS_VOTING_PERIOD')) {
                                return null;
                            }

                            array.push(val.proposal_id);
                        }
                        if (val.status === 2 || val.status === 'voting') {
                            this.props.fetchProposalTally(val.id);
                            this.props.fetchVoteDetails(val.id, this.props.address);
                        }

                        return null;
                    });
                    // this.getProposalDetails(array && array.reverse());
                }
            });
        }

        if ((pp.address !== this.props.address) && (pp.address !== '') && (this.props.address !== '')) {
            this.props.getBalance(this.props.address, (result) => {
                if (result) {
                    this.props.getDelegations(this.props.address);
                }
            });
            this.props.fetchTokensList();
            this.props.fetchBalanceList(this.props.address);
            this.props.fetchRevealedPubKey(this.props.address);
            // this.props.fetchVestingBalance(this.props.address);
            this.props.fetchRewards(this.props.address);
            this.props.getUnBondingDelegations(this.props.address);
            this.props.getDelegatedValidatorsDetails(this.props.address);
            this.props.fetchUnBondingValidators(this.props.address);
        }
    }

    componentWillUnmount () {
        window.removeEventListener('keplr_keystorechange', this.handleChain);
        if (this.state.cosmostationEvent) {
            window && window.cosmostation && window.cosmostation.cosmos &&
            window.cosmostation.cosmos.off(this.state.cosmostationEvent);
        }
    }

    handleFetchValidators (page, oldCount) {
        this.props.getValidators(page, (data, total, pageCount, count) => {
            // const newCount = Number(count) + Number(oldCount);
            // if (newCount && total > newCount) {
            //     this.handleFetchValidators(page + 1, newCount);
            // }
            // if (data && data.length && this.props.validatorImages && this.props.validatorImages.length === 0) {
            //     const array = data.filter((val) => val && val.description && val.description.identity);
            //     this.getValidatorImage(0, array);
            // }
        });
    }

    getValidatorImage (index, data) {
        const array = [];
        for (let i = 0; i < 3; i++) {
            if (data[index + i]) {
                const value = data[index + i];
                let list = sessionStorage.getItem(`${config.PREFIX}_images`) || '{}';
                list = JSON.parse(list);
                if (value && value.description && value.description.identity && !list[value.description.identity]) {
                    array.push(this.props.fetchValidatorImage(value.description.identity));
                } else if (value && value.description && value.description.identity && list[value.description.identity]) {
                    this.props.fetchValidatorImageSuccess({
                        ...list[value.description.identity],
                        _id: value.description.identity,
                    });
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

    handleFetch (address, shieldedAddress) {
        if (this.props.balance && !this.props.balance.length &&
            !this.props.balanceInProgress) {
            this.props.getBalance(address, (result) => {
                if (result) {
                    if (this.props.delegations && !this.props.delegations.length &&
                        !this.props.delegationsInProgress && !this.props.proposalTab) {
                        this.props.getDelegations(address);
                    }
                }
            });
            if (shieldedAddress && shieldedAddress.length) {
                const index = shieldedAddress.findIndex((val) => val.address === address);
                if (shieldedAddress[index + 1]) {
                    this.props.getShieldedBalance(shieldedAddress[index + 1]?.viewingKey, shieldedAddress[index + 1]?.timestamp, address, shieldedAddress[index + 1]?.address);
                }
            }
            this.props.fetchTokensList();
            this.props.fetchBalanceList(address);
        } else if (this.props.delegations && !this.props.delegations.length &&
            !this.props.delegationsInProgress && !this.props.proposalTab) {
            this.props.getDelegations(address);
        }
        // if (this.props.vestingBalance && !this.props.vestingBalance.value &&
        //     !this.props.vestingBalanceInProgress) {
        //     this.props.fetchVestingBalance(address);
        // }

        if (!this.props.proposalTab && !this.props.stake) {
            this.props.fetchRewards(address);
        }
        this.props.fetchRevealedPubKey(address);
        // if (this.props.unBondingDelegations && !this.props.unBondingDelegations.length &&
        //     !this.props.unBondingDelegationsInProgress && !this.props.proposalTab && !this.props.stake) {
        //     this.props.getUnBondingDelegations(address);
        // }
        if (this.props.delegatedValidatorList && !this.props.delegatedValidatorList.length &&
            !this.props.delegatedValidatorListInProgress && !this.props.proposalTab) {
            this.props.getDelegatedValidatorsDetails(address);
        }
        if (this.props.unBondingValidatorsList && !this.props.unBondingValidatorsList.length &&
            !this.props.unBondingValidatorsListInProgress && !this.props.proposalTab) {
            this.props.fetchUnBondingValidators(address);
        }
    }

    initKeplr () {
        this.handleChain(true);
    }

    handleChain (fetch) {
        initializeChain((error, addressList) => {
            if (addressList === undefined || !addressList) {
                window.onload = () => this.handleChain(true);
                return;
            }

            if (error) {
                this.props.showMessage(error);
                localStorage.removeItem('of_co_address');

                return;
            }

            const previousAddress = localStorage.getItem('of_co_address') &&
                decode(localStorage.getItem('of_co_address'));
            this.props.setAccountAddress(addressList && addressList.address);
            if (fetch) {
                this.handleFetch(addressList && addressList.address);
            }
            if (addressList && previousAddress !== addressList.address) {
                localStorage.setItem('of_co_address', encode(addressList && addressList.address));
            }
        });
    }

    handleNamada (fetch) {
        initializeNamadaChain((error, addressList, shieldedAddress, disposableSigner) => {
            if (addressList === undefined || !addressList) {
                window.onload = () => this.handleNamada(true);
                return;
            }

            if (error) {
                this.props.showMessage(error);
                localStorage.removeItem('of_co_address');

                return;
            }

            const previousAddress = localStorage.getItem('of_co_address') &&
                decode(localStorage.getItem('of_co_address'));
            const index = shieldedAddress.findIndex((val) => addressList && addressList.address === val.address);
            this.props.setAccountAddress(addressList && addressList.address, shieldedAddress && shieldedAddress.length && shieldedAddress[index + 1]?.address, shieldedAddress && shieldedAddress.length && shieldedAddress[index + 1]);
            this.props.setAccountDetails(addressList, disposableSigner);
            if (fetch) {
                this.handleFetch(addressList && addressList.address, shieldedAddress);
            }
            if (addressList && previousAddress !== addressList.address) {
                localStorage.setItem('of_co_address', encode(addressList && addressList.address));
            }
        });
    }

    handleCosmoStation (fetch) {
        initializeCosmoStation((error, account) => {
            if (error) {
                this.props.showMessage(error);
                localStorage.removeItem('of_co_address');

                return;
            }

            const previousAddress = localStorage.getItem('of_co_address') &&
                decode(localStorage.getItem('of_co_address'));
            this.props.setAccountAddress(account && account.address);
            if (fetch) {
                this.handleFetch(account && account.address);
            }
            if (account && previousAddress !== account.address) {
                localStorage.setItem('of_co_address', encode(account && account.address));
                localStorage.setItem('of_co_wallet', 'cosmostation');
            }
        });
    }

    handleProfilePopoverOpen = (event) => {
        this.setState({
            profileAnchorEl: event.currentTarget,
        });
    };

    handleProfilePopoverClose = () => {
        this.setState({
            profileAnchorEl: null,
        });
    };

    render () {
        const { profileAnchorEl } = this.state;
        const profileOpen = Boolean(profileAnchorEl);
        let balance = null;
            this.props.balance && this.props.balance.length && this.props.balance.map((val) => {
                if (val && val.length) {
                    val.map((value) => {
                        if (value === config.TOKEN_ADDRESS) {
                            balance = val[1];
                        }
                    });
                }
        
                return null;
            });
        const available = balance && balance / 10 ** config.COIN_DECIMALS;
        return (
            <>
                <div className={ClassNames('nav_bar padding', localStorage.getItem('of_co_address') || this.props.address
                    ? '' : 'disconnected_nav')}>
                    <img
                        alt="OmniFlix"
                        src={logo}
                        style={{ cursor: 'pointer' }}
                        onClick={() => window.open('https://namada.omniflix.co', '_self')}/>
                    <ExpansionButton/>
                    <div className={ClassNames('right_content', this.props.show ? 'show' : '')}>
                        <div className="back_button" onClick={this.props.handleClose}>
                            <Icon className="cross" icon="cross"/>
                        </div>
                        <Tabs/>
                        {localStorage.getItem('of_co_address') || this.props.address
                            ? (<div 
                                onMouseEnter={this.handleProfilePopoverOpen}
                                onMouseLeave={this.handleProfilePopoverClose}
                                className="profile_button"
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                <div>{available}{' '}{config.COIN_DENOM}</div>
                                {profileOpen && (
                                    <ProfilePopover
                                        anchorEl={profileAnchorEl}
                                        open={profileOpen}
                                        onClose={this.handleProfilePopoverClose}
                                    />
                                )}
                                <ProfilePopover
                                        anchorEl={profileAnchorEl}
                                        open={profileOpen}
                                        onClose={this.handleProfilePopoverClose}
                                    />
                            </div>)
                            : <Button
                                className="connect_button"
                                onClick={() => this.props.showConnectDialog(this.props.proposalTab, this.props.stake)}>
                                Connect
                            </Button>}
                    </div>
                    <ConnectDialog/>
                </div>
                {/* <ShieldedSyncPercentage/> */}
            </>
        );
    }
}

NavBar.propTypes = {
    aprInProgress: PropTypes.bool.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    delegatedValidatorListInProgress: PropTypes.bool.isRequired,
    delegationsInProgress: PropTypes.bool.isRequired,
    fetchAPR: PropTypes.func.isRequired,
    fetchGenesisValidators: PropTypes.func.isRequired,
    fetchProposalDetails: PropTypes.func.isRequired,
    fetchProposalTally: PropTypes.func.isRequired,
    fetchRevealedPubKey: PropTypes.func.isRequired,
    fetchRewards: PropTypes.func.isRequired,
    fetchValidatorImage: PropTypes.func.isRequired,
    fetchValidatorImageSuccess: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    fetchVoteDetails: PropTypes.func.isRequired,
    fetchTokensList: PropTypes.func.isRequired,
    fetchBalanceList: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getInActiveValidators: PropTypes.func.isRequired,
    getProposals: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    getValidators: PropTypes.func.isRequired,
    getShieldedBalance: PropTypes.func.isRequired,
    fetchUnBondingValidators: PropTypes.func.isRequired,
    shieldedBalanceFetchSuccess: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    inActiveValidatorsInProgress: PropTypes.bool.isRequired,
    inActiveValidatorsList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    proposalDetails: PropTypes.object.isRequired,
    proposals: PropTypes.array.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
    setAccountDetails: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    unBondingDelegationsInProgress: PropTypes.bool.isRequired,
    validatorImages: PropTypes.array.isRequired,
    validatorList: PropTypes.array.isRequired,
    unBondingValidatorsList: PropTypes.array.isRequired,
    unBondingValidatorsListInProgress: PropTypes.bool.isRequired,
    validatorListInProgress: PropTypes.bool.isRequired,
    vestingBalance: PropTypes.object.isRequired,
    vestingBalanceInProgress: PropTypes.bool.isRequired,
    voteDetails: PropTypes.array.isRequired,
    voteDetailsInProgress: PropTypes.bool.isRequired,
    actualAPR: PropTypes.number,
    address: PropTypes.string,
    balance: PropTypes.array,
    delegatedValidatorList: PropTypes.array,
    delegations: PropTypes.arrayOf(
        PropTypes.shape({
            validator_address: PropTypes.string,
            balance: PropTypes.shape({
                amount: PropTypes.any,
                denom: PropTypes.string,
            }),
        }),
    ),
    home: PropTypes.bool,
    proposalTab: PropTypes.bool,
    proposalsInProgress: PropTypes.bool,
    router: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }).isRequired,
    }),
    stake: PropTypes.bool,
    unBondingDelegations: PropTypes.arrayOf(
        PropTypes.shape({
            entries: PropTypes.arrayOf(
                PropTypes.shape({
                    balance: PropTypes.string,
                }),
            ),
        }),
    ),
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        aprInProgress: state.stake.apr.inProgress,
        actualAPR: state.stake.apr.actualAPR,
        balance: state.accounts.balance.result,
        balanceInProgress: state.accounts.balance.inProgress,
        delegations: state.accounts.delegations.result,
        delegationsInProgress: state.accounts.delegations.inProgress,
        delegatedValidatorList: state.stake.delegatedValidators.list,
        unBondingValidatorsList: state.stake.unBondingValidators.list,
        unBondingValidatorsListInProgress: state.stake.unBondingValidators.inProgress,
        delegatedValidatorListInProgress: state.stake.delegatedValidators.inProgress,
        lang: state.language,
        show: state.navBar.show,
        proposals: state.proposals._.list,
        proposalDetails: state.proposals.proposalDetails.value,
        proposalsInProgress: state.proposals._.inProgress,
        unBondingDelegations: state.accounts.unBondingDelegations.result,
        unBondingDelegationsInProgress: state.accounts.unBondingDelegations.inProgress,
        validatorImages: state.stake.validators.images,
        validatorList: state.stake.validators.list,
        validatorListInProgress: state.stake.validators.inProgress,
        vestingBalance: state.accounts.vestingBalance.result,
        vestingBalanceInProgress: state.accounts.vestingBalance.inProgress,
        voteDetails: state.proposals.voteDetails.value,
        voteDetailsInProgress: state.proposals.voteDetails.inProgress,
        inActiveValidatorsList: state.stake.inActiveValidators.list,
        inActiveValidatorsInProgress: state.stake.inActiveValidators.inProgress,
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
    fetchAPR,
    fetchRewards,
    fetchValidatorImage,
    fetchValidatorImageSuccess,
    fetchVestingBalance,
    fetchGenesisValidators,
    getProposals,
    fetchVoteDetails,
    fetchProposalTally,
    fetchProposalDetails,
    fetchRevealedPubKey,
    getInActiveValidators,
    showConnectDialog,
    setAccountDetails,
    fetchTokensList,
    fetchBalanceList,
    getShieldedBalance,
    fetchUnBondingValidators,
    shieldedBalanceFetchSuccess,
};

export default withRouter(connect(stateToProps, actionToProps)(NavBar));
