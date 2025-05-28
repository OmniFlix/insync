import { Button, Dialog } from "@material-ui/core";
import { hideTransparentTokensTransferDialog } from "actions/assets";
import React from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import { Close } from "@material-ui/icons";
import AmountTextField from "./AmountTextField";
import MemoTextField from "./MemoTextField";
import AddressTextField from "./AddressTextField";
import './index.css';
import { feeList } from "dummy/ibcList";
import { formatCount } from "utils/numberFormats";

class TransparentTransferDialog extends React.Component {
   render () {
    const image = this.props.value && this.props.value.logo_URIs && (this.props.value.logo_URIs.svg || this.props.value.logo_URIs.png);
    let amount = this.props.value && this.props.value.balance && this.props.value.balance.minDenomAmount;
    if (this.props.value && this.props.value.config && this.props.value.config.COIN_DECIMALS) {
        amount = amount ? (amount / 10 ** this.props.value.config.COIN_DECIMALS) : 0;
    }

    const fromSelectedConfig = this.props.value && this.props.value.config && this.props.value.config.CHAIN_NAME ? this.props.value.config : null;
    const fee = feeList && feeList[fromSelectedConfig?.COIN_DENOM]
        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_transfer_dialog">
                <div className="ibc_content ibc_transfer_dialog">
                    <div className="header">
                        <h2>Transfer Asset</h2>
                        <Button
                            className="close_button"
                            onClick={this.props.handleClose}
                            variant="outlined">
                                <Close className="icon" />
                            </Button>
                    </div>
                    <div className="section1">
                        <div className="row1">
                            <div className="text">Asset</div>
                            <div className="available">
                                <span>Available</span>
                                <p>{amount}{' '}{this.props.value?.symbol}</p>
                            </div>
                        </div>
                        <div className="row2">
                            <div className="left_section">
                                {image && <img alt={this.props.value?.name} src={image} style={{ width: '18px', height: '18px', marginRight: '8px' }} />}
                                {this.props.value?.symbol || this.props.value?.display}
                            </div>
                            <div className="right_section">
                                <AmountTextField />
                            </div>
                        </div>
                    </div>
                    <div className="section3">
                        <div className="row1">
                            Enter recipient address
                        </div>
                        <div className="row2">
                            <AddressTextField />
                        </div>
                    </div>
                    <div className="section4">
                        <div className="row1">
                            Memo
                        </div>
                        <div className="row2">
                            <MemoTextField />
                        </div>
                    </div>
                    {fee && fee.fee 
                    ? <div className="section5">
                            <div className="left_section">
                                <span>Fee</span>
                                {formatCount(fee.fee * fee.gas)}{' '} {fromSelectedConfig.COIN_DENOM}
                            </div>
                            {/* <div className="right_section">
                                <span>Fee options</span>
                            </div> */}
                    </div> : null}
                    <div className="actions">
                        <Button>
                            Transfer
                        </Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}

TransparentTransferDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    ibcTransferType: PropTypes.string.isRequired,
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
    value: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.assets.transparentTokensTransferDialog.open,
        value: state.assets.transparentTokensTransferDialog.value,
        ibcTransferType: state.ibcTransfer.ibcTransferType.value,
    };
};

const actionToProps = {
    handleClose: hideTransparentTokensTransferDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(TransparentTransferDialog));