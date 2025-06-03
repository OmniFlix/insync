import { Dialog, Button } from '@material-ui/core';
import { hideTransparentTokensDepositDialog } from 'actions/assets';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import IBCTransferDialog from 'containers/IBCTransfer/IBCTransferDialog';
import closeIcon from '../../../assets/close_icon.png';
import variables from 'utils/variables';

class TransparentDepositDialog extends React.Component {
    render () {
        return (
            <Dialog
                aria-describedby="claim-dialog-description"
                aria-labelledby="claim-dialog-title"
                className="dialog tokens_deposit_dialog"
                open={this.props.open}
                onClose={this.props.handleClose}>
                <div className="ibc_content padding">
                    <div className="header_div">
                        <p>{variables[this.props.lang].deposit_asset}</p>
                        <Button onClick={this.props.handleClose}><img alt="closeIcon" src={closeIcon}/></Button>
                    </div>
                    <IBCTransferDialog depositData={this.props.value} from="transparent_deposit"/>
                </div>
            </Dialog>
        );
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
    value: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.assets.transparentTokensDepositDialog.open,
        value: state.assets.transparentTokensDepositDialog.value,

        ibcSwapType: state.ibcTransfer.ibcSwapType.value,
        subTabs: state.shieldedAssets.externalShieldingTabs.value,
        externalTransferSubTabs: state.shieldedAssets.externalTransferSubTabs.value,
    };
};

const actionToProps = {
    handleClose: hideTransparentTokensDepositDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(TransparentDepositDialog));
