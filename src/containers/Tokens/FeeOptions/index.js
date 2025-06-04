import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideFeeOptionsPopover, setFeeOptionPopoverValue, showFeeOptionsPopover } from 'actions/assets';
import { Button, Popover } from '@material-ui/core';
import ArrowDownIcon from '../../../assets/chevron-down.png';
import './index.css';

const FeeOptions = (props) => {
  const handleClick = (value) => {
    props.setFeeOptionPopoverValue(value);
    props.hideFeeOptionsPopover();
  }

  const open = Boolean(props.anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div className='fee_options_section'>
        <div className='fee_options_div'>
            <span>Fee Options</span>
            <Button onClick={(e) => props.showFeeOptionsPopover(e.currentTarget)}>
                {props.feeOption}
                <img alt="down" src={ArrowDownIcon} />
            </Button>
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={props.anchorEl}
          onClose={props.hideFeeOptionsPopover}
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
    hideFeeOptionsPopover: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setFeeOptionPopoverValue: PropTypes.func.isRequired,
    showFeeOptionsPopover: PropTypes.func.isRequired,
    anchorEl: PropTypes.any,
    feeOption: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        anchorEl: state.assets.feeOptionsPopover.anchorEl,
        feeOption: state.assets.feeOptionPopoverValue.value,
    };
};

const actionToProps = {
    hideFeeOptionsPopover,
    setFeeOptionPopoverValue,
    showFeeOptionsPopover,
};

export default connect(stateToProps, actionToProps)(FeeOptions);
