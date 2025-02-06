import React from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import { setAmount } from '../../../actions/shieldedAssets';
import { config } from '../../../config';
import DownArrowIcon from '../../../assets/masp/downArrow.svg';
import SourceSelectField from './SourceSelectField';
import NamadaLogo from '../../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../../assets/masp/namada_shielded.svg';

const ShieldDialog = (props) => {
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

    return (
        <div className="shield_dialog">
            <div className="transfer_source">
                <div className="header">
                    <p>
                        <img alt="NamadaLogo" src={NamadaLogo}/>
                        Namada Transparent
                    </p>
                    <div className="address">
                        <span>{props.address}</span>
                        {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                    </div>
                </div>
                <div className="border"></div>
                <div className="select_section">
                    <SourceSelectField/>
                    <AmountTextField/>
                </div>
                <div className="tokens_secion">
                    <p>Available: {balance || 0} NAM</p>
                    <Button onClick={() => props.setAmount(balance)}>Max</Button>
                </div>
            </div>
            <div className="arrow">
                <img alt="Arrow" src={DownArrowIcon}/>
            </div>
            <div className="transfer_destination">
                <div>
                    <p>
                        <img alt="NamadaShieldedLogo" src={NamadaShieldedLogo}/>
                        Namada Shielded
                    </p>
                    <div className="address">
                        <span>{props.shieldedAddress}</span>
                        {props.shieldedAddress && props.shieldedAddress.slice(props.shieldedAddress.length - 6, props.shieldedAddress.length)}
                    </div>
                </div>
                {/* <p>Transaction fee: 0.025385 NAM</p> */}
            </div>
            <Button>
                Submit
            </Button>
        </div>
    );
};

ShieldDialog.propTypes = {
    balance: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setAmount: PropTypes.func.isRequired,
    address: PropTypes.string,
    shieldedAddress: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        address: state.accounts.address.value,
        amount: state.stake.tokens,
        shieldedAddress: state.accounts.address.shieldedDetails,
    };
};

const actionToProps = {
    setAmount,
};

export default connect(stateToProps, actionToProps)(ShieldDialog);
