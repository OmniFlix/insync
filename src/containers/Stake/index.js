import React, { useState } from 'react';
import NavBar from '../NavBar';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import './index.css';
import Table from './Table';
import DelegateDialog from './DelegateDialog';
import SuccessDialog from './DelegateDialog/SuccessDialog';
import UnSuccessDialog from './DelegateDialog/UnSuccessDialog';
import PendingDialog from './DelegateDialog/PendingDialog';

const Stake = (props) => {
    const [active, setActive] = useState(1);

    const handleChange = (value) => {
        if (active === value) {
            return;
        }

        setActive(value);
    };

    return (
        <div className="stake">
            <NavBar stake={true}/>
            <div className="stake_content padding">
                <div className="heading">
                    <div className="tabs">
                        <p className={active === 1 ? 'active' : ''} onClick={() => handleChange(1)}>
                            {variables[props.lang]['active_validators']}
                            {props.validatorList &&
                            props.validatorList.length
                                ? ' (' + props.validatorList.length + ')'
                                : null}
                        </p>
                        <span/>
                        <p className={active === 3 ? 'active' : ''} onClick={() => handleChange(3)}>
                            {variables[props.lang]['inactive_validators']}
                            {props.inActiveValidators &&
                            props.inActiveValidators.length
                                ? ' (' + props.inActiveValidators.length + ')'
                                : null}
                        </p>
                        <span/>
                        <p className={active === 2 ? 'active' : ''} onClick={() => handleChange(2)}>
                            {variables[props.lang]['staked_validators']}
                            {props.delegatedValidatorList &&
                            props.delegatedValidatorList.length
                                ? ' (' + props.delegatedValidatorList.length + ')'
                                : null}
                        </p>
                    </div>
                </div>
                <Table active={active}/>
            </div>
            <DelegateDialog/>
            <SuccessDialog/>
            <UnSuccessDialog/>
            <PendingDialog/>
        </div>
    );
};

Stake.propTypes = {
    delegatedValidatorList: PropTypes.array.isRequired,
    inActiveValidators: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    validatorList: PropTypes.array.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        delegatedValidatorList: state.stake.delegatedValidators.list,
        inActiveValidators: state.stake.inActiveValidators.list,
        validatorList: state.stake.validators.list,
    };
};

export default connect(stateToProps)(Stake);
