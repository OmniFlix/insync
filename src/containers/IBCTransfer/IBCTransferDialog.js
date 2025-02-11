import React from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './index.css';
import { connect } from 'react-redux';
import AmountTextField from './AmountTextField';
import { setIBCSwapType, setIBCTransferAmount, setIBCTransferType } from '../../actions/IBCTransfer';
import { config } from '../../config';
import TransferIcon from '../../assets/transfer.svg';
import AssetSelectField from './AssetSelectField';
import NamadaLogo from '../../assets/masp/namada_logo.svg';
import NamadaShieldedLogo from '../../assets/masp/namada_shielded.svg';
import AddressTextField from './AddressTextField';
import SourceChainSelectField from './SourceChainSelectField';
import SourceSelectField from './SourceSelectField';

const IBCTransferDialog = (props) => {
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
        <div className="transfer_dialog">
            {props.ibcSwapType === 'to_namada'
                ? <>
                    <div className="transfer_source">
                        <div className="header">
                            <SourceChainSelectField/>
                            <div className="address">
                                <span>{props.address}</span>
                                {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                            </div>
                        </div>
                        <div className="border"></div>
                        <div className="select_section">
                            <AssetSelectField/>
                            <AmountTextField/>
                        </div>
                        <div className="tokens_secion">
                            <p>Available: {balance || 0} NAM</p>
                            <Button onClick={() => props.setIBCTransferAmount(balance)}>Max</Button>
                        </div>
                    </div>
                    <div className="arrow" onClick={() => props.setIBCSwapType('from_namada')}>
                        <img alt="TransferIcon" src={TransferIcon}/>
                    </div>
                    <div className="transfer_destination">
                        <div className="transfer_type">
                            <Button
                                className={props.ibcTransferType === 'shielded' ? 'active_tab' : ''}
                                onClick={() => props.setIBCTransferType('shielded')}>
                                Shielded
                            </Button>
                            <Button
                                className={props.ibcTransferType === 'transparent' ? 'active_tab' : ''}
                                onClick={() => props.setIBCTransferType('transparent')}>
                                Transparent
                            </Button>
                        </div>
                        {props.ibcTransferType === 'shielded'
                            ? <div>
                                <p>
                                    <img alt="NamadaShieldedLogo" src={NamadaShieldedLogo}/>
                                    Namada Shielded
                                </p>
                                <div className="address">
                                    <span>{props.shieldedAddress}</span>
                                    {props.shieldedAddress && props.shieldedAddress.slice(props.shieldedAddress.length - 6, props.shieldedAddress.length)}
                                </div>
                            </div>
                            : <div>
                                <p>
                                    <img alt="NamadaLogo" src={NamadaLogo}/>
                                    Namada Transparent
                                </p>
                                <div className="address">
                                    <span>{props.address}</span>
                                    {props.address && props.address.slice(props.address.length - 6, props.address.length)}
                                </div>
                            </div>}
                    </div>
                </>
                : <>
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
                            <Button onClick={() => props.setIBCTransferAmount(balance)}>Max</Button>
                        </div>
                    </div>
                    <div className="arrow from_namada_transfer" onClick={() => props.setIBCSwapType('to_namada')}>
                        <img alt="TransferIcon" src={TransferIcon}/>
                    </div>
                    <div className="transfer_destination from_namada">
                        <SourceChainSelectField/>
                        <AddressTextField/>
                    </div>
                </>}
            <Button>
                Submit
            </Button>
        </div>
    );
};

IBCTransferDialog.propTypes = {
    balance: PropTypes.array.isRequired,
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    setIBCSwapType: PropTypes.func.isRequired,
    setIBCTransferAmount: PropTypes.func.isRequired,
    setIBCTransferType: PropTypes.func.isRequired,
    address: PropTypes.string,
    ibcTransferType: PropTypes.string,
    shieldedAddress: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        balance: state.accounts.balance.result,
        lang: state.language,
        address: state.accounts.address.value,
        amount: state.stake.tokens,
        shieldedAddress: state.accounts.address.shieldedDetails,
        ibcTransferType: state.ibcTransfer.ibcTransferType.value,
        ibcSwapType: state.ibcTransfer.ibcSwapType.value,
    };
};

const actionToProps = {
    setIBCTransferAmount,
    setIBCTransferType,
    setIBCSwapType,
};

export default connect(stateToProps, actionToProps)(IBCTransferDialog);
