import { Dialog } from "@material-ui/core";
import { hideTransparentTokensWithdrawDialog } from "actions/assets";
import React from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';

class TransparentWithdrawDialog extends React.Component {
   render () {
        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_withdraw_dialog">
                <div className="ibc_content padding">

                </div>
            </Dialog>
        )
    }
}

TransparentWithdrawDialog.propTypes = {
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
        open: state.assets.transparentTokensWithdrawDialog.open,
    };
};

const actionToProps = {
    handleClose: hideTransparentTokensWithdrawDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(TransparentWithdrawDialog));