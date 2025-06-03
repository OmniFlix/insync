import { Dialog, Button } from "@material-ui/core";
import { hideTransparentTokensConvertDialog } from "actions/assets";
import React from "react";
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'components/WithRouter';
import ShieldDialog from "containers/ShieldedAssets/ShieldDialog";
import closeIcon from '../../../assets/close_icon.png';
import variables from "utils/variables";

class TransparentConvertDialog extends React.Component {
   render () {
        return (
            <Dialog open={this.props.open}
            onClose={this.props.handleClose}
            aria-describedby="claim-dialog-description"
            aria-labelledby="claim-dialog-title"
            className="dialog tokens_convert_dialog">
                 <div className="ibc_content shield_tranfer">
                        <div className="header_div">
                            <p>{variables[this.props.lang].nam_trans_to_nam_shield}</p>
                            <Button onClick={this.props.handleClose}><img alt="closeIcon" src={closeIcon}/></Button>
                        </div>
                        <ShieldDialog/>
                    </div>
            </Dialog>
        )
    }
}

TransparentConvertDialog.propTypes = {
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
    value: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.assets.transparentTokensConvertDialog.open,
        value: state.assets.transparentTokensConvertDialog.value,
    };
};

const actionToProps = {
    handleClose: hideTransparentTokensConvertDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(TransparentConvertDialog));