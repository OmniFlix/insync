import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import variables from 'utils/variables';
import withRouter from 'components/WithRouter';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Tab } from '@material-ui/core';
import ClassNames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  popover: {
    // pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
}));

const ShieldedTab = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    props.handleChange('shielding', value);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
        <Tab
            className={'tab ' + (props.value === 'shielding' ? 'active_tab' : '')}
            label={<div className='tab_label'>
                {variables[props.lang].shielding}
                <ExpandMoreIcon className="expand_icon"/>
            </div>}
            value="shielding"
            aria-describedby={id}
            onClick={handlePopoverOpen}/>
        <Popover
            id={id}
            className={ClassNames(classes.popover, 'tab_popover')}
            classes={{
            paper: classes.paper,
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
            }}
            onClose={handlePopoverClose}
        >
            <Typography>
                <Tab
                    className="popover_tab"
                    onClick={() => handleSelect('internalShielding')}
                    label={variables[props.lang].internal_shielding}/>
            </Typography>
            <Typography>
                <Tab
                    className="popover_tab"
                    onClick={() => handleSelect('externalShielding')}
                    label={variables[props.lang].external_shielding}/>
            </Typography>
        </Popover>
    </div>
  );
}

ShieldedTab.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
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
    };
};

export default withRouter(connect(stateToProps)(ShieldedTab));
