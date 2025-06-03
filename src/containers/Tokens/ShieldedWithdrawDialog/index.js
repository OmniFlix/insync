import { Dialog, Button } from "@material-ui/core";
import { hideShieldedTokensWithdrawDialog } from "actions/assets";
import React from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import IBCUnShielding from "containers/IBCTransfer/IBCUnShielding";
import closeIcon from '../../../assets/close_icon.png';
import variables from "utils/variables";

class ShieldedWithdrawDialog extends React.Component {
   render () {
        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_withdraw_dialog">
                <div className="ibc_content padding">
                    <div className="header_div">
                        <p>{variables[this.props.lang].deposit} {' '} {this.props.value?.symbol || this.props.value?.name || this.props.value?.display} {' from Namada'}</p>
                        <Button onClick={this.props.handleClose}><img alt="closeIcon" src={closeIcon}/></Button>
                    </div>
                    <IBCUnShielding/>
                </div>
            </Dialog>
        )
    }
}

ShieldedWithdrawDialog.propTypes = {
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
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.assets.shieldedTokensWithdrawDialog.open,
    };
};

const actionToProps = {
    handleClose: hideShieldedTokensWithdrawDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(ShieldedWithdrawDialog));