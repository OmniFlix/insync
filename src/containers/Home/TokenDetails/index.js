import React from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import variables from '../../../utils/variables';
import totalTokens from '../../../assets/userDetails/totalTokens.png';
import stakedTokens from '../../../assets/userDetails/stakedTokens.png';
import unStake from '../../../assets/userDetails/unstake.png';
import rewardsIcon from '../../../assets/userDetails/rewards.svg';
import { connect } from 'react-redux';
import StakeTokensButton from './StakeTokensButton';
import UnDelegateButton from './UnDelegateButton';
import ReDelegateButton from './ReDelegateButton';
import ClaimButton from './ClaimButton';
import { config } from '../../../config';

const TokenDetails = (props) => {
    const staked = props.delegations.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue.balance.amount);
    }, 0);
    const balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
    const available = (balance && balance.amount && Number(balance.amount));
    let unStaked = 0;
    props.unBondingDelegations.map((delegation) => {
        delegation.entries && delegation.entries.length &&
        delegation.entries.map((entry) => {
            unStaked = unStaked + Number(entry.balance);

            return null;
        });
        return null;
    });

    let rewards = props.rewards && props.rewards.total && props.rewards.total.length &&
        props.rewards.total.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
    rewards = rewards && rewards.amount ? rewards.amount / 10 ** config.COIN_DECIMALS : 0;

    return (
        <div className="token_details">
            <div className="chip_info">
                <p>{variables[props.lang]['available_tokens']}</p>
                <div className="chip">
                    <img alt="available tokens" src={totalTokens}/>
                    <p>{available / (10 ** config.COIN_DECIMALS)}</p>
                </div>
                <StakeTokensButton/>
            </div>
            <div className="chip_info">
                <p>{variables[props.lang]['staked_tokens']}</p>
                <div className="chip">
                    <img alt="total tokens" src={stakedTokens}/>
                    <p>{staked / (10 ** config.COIN_DECIMALS)}</p>
                </div>
                <div className="buttons_div">
                    <UnDelegateButton/>
                    <span/>
                    <ReDelegateButton/>
                </div>
            </div>
            <div className="chip_info">
                <p>{variables[props.lang].rewards}</p>
                <div className="chip">
                    <img alt="total tokens" src={rewardsIcon}/>
                    <p>{rewards > 0 ? rewards.toFixed(4) : 0}</p>
                </div>
                <div className="buttons_div">
                    <ClaimButton disable={rewards <= 0}/>
                </div>
            </div>
            <div className="chip_info">
                <p>{variables[props.lang]['un_staked_tokens']}</p>
                <div className="chip">
                    <img alt="unstaked tokens" src={unStake}/>
                    <p>{unStaked / (10 ** config.COIN_DECIMALS)}</p>
                </div>
            </div>
        </div>
    );
};

TokenDetails.propTypes = {
    balanceInProgress: PropTypes.bool.isRequired,
    delegationsInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    rewards: PropTypes.shape({
        rewards: PropTypes.array,
        total: PropTypes.array,
    }).isRequired,
    rewardsInProgress: PropTypes.bool.isRequired,
    unBondingDelegationsInProgress: PropTypes.bool.isRequired,
    balance: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.any,
            denom: PropTypes.string,
        }),
    ),
    delegations: PropTypes.arrayOf(
        PropTypes.shape({
            validator_address: PropTypes.string,
            balance: PropTypes.shape({
                amount: PropTypes.any,
                denom: PropTypes.string,
            }),
        }),
    ),
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
        delegations: state.accounts.delegations.result,
        delegationsInProgress: state.accounts.delegations.inProgress,
        balance: state.accounts.balance.result,
        balanceInProgress: state.accounts.balance.inProgress,
        unBondingDelegations: state.accounts.unBondingDelegations.result,
        unBondingDelegationsInProgress: state.accounts.unBondingDelegations.inProgress,
        rewards: state.accounts.rewards.result,
        rewardsInProgress: state.accounts.rewards.inProgress,
    };
};

export default connect(stateToProps, null)(TokenDetails);
