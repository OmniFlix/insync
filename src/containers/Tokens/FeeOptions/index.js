import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setFeeOptionPopoverValue } from 'actions/assets';
import { Button, Popover } from '@material-ui/core';
import ArrowDownIcon from '../../../assets/chevron-down.png';
import './index.css';

const FeeOptions = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (value) => {
    props.setFeeOptionPopoverValue(value);
    handleClose();
  }

  const handleOpen= (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div className='fee_options_section'>
        <div className='fee_options_div'>
            <span>Fee Options</span>
            <Button onClick={handleOpen}>
                {props.feeOption}
                <img alt="down" src={ArrowDownIcon} />
            </Button>
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className='fee_options_popover'>
          <div className='fee_options'>
            <div onClick={() => handleClick('OSMO')}>
                <p>OSMO</p>
                <span>0.078</span>
            </div>
            <div onClick={() => handleClick('ATOM')}>
                <p>ATOM</p>
                <span>0.078</span>
            </div>
          </div>
        </Popover>
      </div>
    </>
  );
}

FeeOptions.propTypes = {
    lang: PropTypes.string.isRequired,
    setFeeOptionPopoverValue: PropTypes.func.isRequired,
    feeOption: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        feeOption: state.assets.feeOptionPopoverValue.value,
    };
};

const actionToProps = {
    setFeeOptionPopoverValue,
};

export default connect(stateToProps, actionToProps)(FeeOptions);
