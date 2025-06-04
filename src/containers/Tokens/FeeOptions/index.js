import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideFeeOptionsPopover, setFeeOptionPopoverValue } from 'actions/assets';
import { Popover } from '@material-ui/core';
import './index.css';

const FeeOptions = (props) => {
  const handleClick = (value) => {
    props.setFeeOptionPopoverValue(value);
    props.hideFeeOptionsPopover();
  }

    const open = Boolean(props.anchorEl);
    const id = open ? 'simple-popover' : undefined;

  return (
    <div className='fee_options_section'>
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
  );
}


FeeOptions.propTypes = {
    hideFeeOptionsPopover: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setFeeOptionPopoverValue: PropTypes.func.isRequired,
    anchorEl: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        anchorEl: state.assets.feeOptionsPopover.anchorEl,
    };
};

const actionToProps = {
    hideFeeOptionsPopover,
    setFeeOptionPopoverValue,
};

export default connect(stateToProps, actionToProps)(FeeOptions);
