import { Dialog } from "@material-ui/core";
import { hideTransparentTokensDepositDialog } from "actions/assets";
import React from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import SuccessDialog from 'containers/Stake/DelegateDialog/SuccessDialog';
// import NamadaToIBCTransparentTransfer from "containers/IBCTransfer/NamadaToIBCTransparentTransfer";
import IBCTransferDialog from "containers/IBCTransfer/IBCTransferDialog";

class TransparentDepositDialog extends React.Component {
   render () {
    // const route = this.props.router && this.props.router.location && this.props.router.location.pathname &&
    // this.props.router.location.pathname.split('/') && this.props.router.location.pathname.split('/')[1];
        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_deposit_dialog">
                <div className="ibc_content padding">
                    <p>IBC Transfer to Namada</p>
                    <IBCTransferDialog/>
                </div>
                    {/* <div className="ibc_content padding">
                        <>
                            <p>Withdraw assets from Namada via IBC</p>
                        </>
                        <NamadaToIBCTransparentTransfer/>
                    </div> */}
                    {/* {((this.props.subTabs === 'ibc_unshielding' && route === 'externalShielding')) &&
                    <div style={{margin: '150px 0'}}>Coming Soon...</div>} */}
                    <SuccessDialog/>
            </Dialog>
        )
    }
}

TransparentDepositDialog.propTypes = {
    externalTransferSubTabs: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    ibcSwapType: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
    subTabs: PropTypes.string.isRequired,
    router: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }).isRequired,
        navigate: PropTypes.func.isRequired,
        params: PropTypes.shape({
            proposalID: PropTypes.string,
        }).isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.assets.transparentTokensDepositDialog.open,

        ibcSwapType: state.ibcTransfer.ibcSwapType.value,
        subTabs: state.shieldedAssets.externalShieldingTabs.value,
        externalTransferSubTabs: state.shieldedAssets.externalTransferSubTabs.value,
    };
};

const actionToProps = {
    handleClose: hideTransparentTokensDepositDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(TransparentDepositDialog));