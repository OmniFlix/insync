import React from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import variables from '../../../utils/variables';
import totalTokens from '../../../assets/userDetails/totalTokens.png';
import stakedTokens from '../../../assets/userDetails/stakedTokens.png';
// import unStake from '../../../assets/userDetails/unstake.png';
// import rewardsIcon from '../../../assets/userDetails/rewards.svg';
import { connect } from 'react-redux';
import StakeTokensButton from './StakeTokensButton';
import UnDelegateButton from './UnDelegateButton';
// import ReDelegateButton from './ReDelegateButton';
// import ClaimButton from './ClaimButton';
// import Compound from './Compound';
import { config } from '../../../config';
// import { gas } from '../../../defaultGasValues';

const TokenDetails = (props) => {
    const staked = props.delegations && props.delegations.reduce((accumulator, currentValue) => {
        if (currentValue && currentValue.length && currentValue[2]) {
            return accumulator + Number(currentValue[2]);
        }
    }, 0);
    let balance = null;
    props.balance && props.balance.length && props.balance.map((val) => {
        if (val && val.length) {
            val.map((value) => {
                if (value === config.TOKEN_ADDRESS) {
                    balance = val[1];
                }
            });
        }

        return null;
    });

    const available = balance;
    let unStaked = 0;
    props.unBondingDelegations && props.unBondingDelegations.length &&
    props.unBondingDelegations.map((delegation) => {
        delegation.entries && delegation.entries.length &&
        delegation.entries.map((entry) => {
            unStaked = unStaked + Number(entry.balance);

            return null;
        });
        return null;
    });

    // const gasValue = (gas.claim_reward + gas.delegate) * config.GAS_PRICE_STEP_AVERAGE;
    /* let rewards = props.rewards && props.rewards.total && props.rewards.total.length &&
        props.rewards.total.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
    rewards = rewards && rewards.amount ? rewards.amount / 10 ** config.COIN_DECIMALS : 0; */
    // let tokens = props.rewards && props.rewards.total && props.rewards.total.length &&
    //     props.rewards.total.find((val) => val.amount > gasValue);
    // tokens = tokens && tokens.amount ? tokens.amount / 10 ** config.COIN_DECIMALS : 0;

    return (
        <div className="token_details">
            <div className="chip_info">
                <p>{variables[props.lang]['available_tokens']}</p>
                <div className="chip">
                    <img alt="available tokens" src={totalTokens}/>
                    <p>{available}</p>
                </div>
                <StakeTokensButton/>
            </div>
            <div className="chip_info">
                <p>{variables[props.lang]['staked_tokens']}</p>
                <div className="chip">
                    <img alt="total tokens" src={stakedTokens}/>
                    <p>{staked}</p>
                </div>
                <div className="buttons_div">
                    <UnDelegateButton/>
                    {/* <span/> */}
                    {/* <ReDelegateButton/> */}
                </div>
            </div>
            {/* <div className="chip_info"> */}
            {/*     <p>{variables[props.lang].rewards}</p> */}
            {/*     <div className="chip"> */}
            {/*         <img alt="total tokens" src={rewardsIcon}/> */}
            {/*         <p>{rewards > 0 ? rewards.toFixed(4) : 0}</p> */}
            {/*     </div> */}
            {/*     <div className="buttons_div"> */}
            {/*         <ClaimButton disable={rewards <= 0}/> */}
            {/*         /!* <span/> *!/ */}
            {/*         /!* <Compound disable={tokens <= 0}/> *!/ */}
            {/*     </div> */}
            {/* </div> */}
            {/* <div className="chip_info"> */}
            {/*     <p>{variables[props.lang]['un_staked_tokens']}</p> */}
            {/*     <div className="chip"> */}
            {/*         <img alt="unstaked tokens" src={unStake}/> */}
            {/*         <p>{unStaked}</p> */}
            {/*     </div> */}
            {/* </div> */}
        </div>
    );
};

TokenDetails.propTypes = {
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    delegations: PropTypes.array.isRequired,
    delegationsInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    rewards: PropTypes.shape({
        rewards: PropTypes.array,
        total: PropTypes.array,
    }).isRequired,
    rewardsInProgress: PropTypes.bool.isRequired,
    unBondingDelegationsInProgress: PropTypes.bool.isRequired,
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
