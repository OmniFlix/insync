import { Dialog, Button } from "@material-ui/core";
import { hideShieldedTokensDepositDialog } from "actions/assets";
import React from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import IBCTransferDialog from "containers/IBCTransfer/IBCTransferDialog";
import closeIcon from '../../../assets/close_icon.png';

class ShieldedDepositDialog extends React.Component {
   render () {
        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_deposit_dialog">
               <div className="ibc_content padding">
                    <div className="header_div">
                        <p>Deposit {' '}  {this.props.value?.symbol || this.props.value?.name || this.props.value?.display} {' to Namada'}</p>
                        <Button onClick={this.props.handleClose}><img alt="closeIcon" src={closeIcon}/></Button>
                    </div>
                    <IBCTransferDialog from='shielded_deposit' depositData={this.props.value}/>
                </div>
            </Dialog>
        )
    }
}

ShieldedDepositDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
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
        open: state.assets.shieldedTokensDepositDialog.open,
        value: state.assets.shieldedTokensDepositDialog.value,
    };
};

const actionToProps = {
    handleClose: hideShieldedTokensDepositDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(ShieldedDepositDialog));