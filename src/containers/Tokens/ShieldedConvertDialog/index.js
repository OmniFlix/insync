import { Dialog, Button } from '@material-ui/core';
import { hideShieldedTokensConvertDialog } from 'actions/assets';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import ShieldedToTransparent from 'containers/ShieldedAssets/ShieldDialog/ShieldedToTransparent';
import closeIcon from '../../../assets/close_icon.png';
import variables from 'utils/variables';

class ShieldedConvertDialog extends React.Component {
    render () {
        return (
            <Dialog
                aria-describedby="claim-dialog-description"
                aria-labelledby="claim-dialog-title"
                className="dialog tokens_convert_dialog"
                open={this.props.open}
                onClose={this.props.handleClose}>
                <div className="ibc_content shield_tranfer">
                    <div className="header_div">
                        <p>{variables[this.props.lang].nam_shield_to_nam_trans}</p>
                        <Button onClick={this.props.handleClose}><img alt="closeIcon" src={closeIcon}/></Button>
                    </div>
                    <ShieldedToTransparent/>
                </div>
            </Dialog>
        );
    }
}

ShieldedConvertDialog.propTypes = {
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
        open: state.assets.shieldedTokensConvertDialog.open,
    };
};

const actionToProps = {
    handleClose: hideShieldedTokensConvertDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(ShieldedConvertDialog));
