import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setFeeOptionPopoverValue } from 'actions/assets';
import { Button, Popover } from '@material-ui/core';
import ArrowDownIcon from '../../../assets/chevron-down.png';
import './index.css';
import { feeCoverageOptions } from 'utils/feeCalculation';
import { namadaAssets } from 'dummy/ibcList';
import NamadaLogo from '../../../assets/masp/namada_logo.svg';
import { makeStyles } from '@material-ui/core/styles';
import variables from '../../../utils/variables';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgb(0 0 0 / 50%)',
  },
}));

const FeeOptions = (props) => {
  const classes = useStyles();
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
  const options = feeCoverageOptions(props.gasEstimation, props.gasPrice, props.tokenDetails);
 let newNamadaAssets = [{
      name: 'Transparent Namada',
      symbol: 'NAM',
      logo_URIs: {
          svg: NamadaLogo,
      },
  }, ...namadaAssets];

  if (props.from && props.from === 'shielded') {
    newNamadaAssets = namadaAssets;
  }

  let enrichedAssets = (newNamadaAssets || []).map((asset) => {
      // Step 1: Safely find matching token
      let matchingToken;
      if (!asset.base) {
        matchingToken = (props.tokensList || []).find(token =>
        !token.trace);
      } else {
        matchingToken = (props.tokensList || []).find(token =>
        token.trace?.includes(`/${asset.base}`)
        );
      }
  
      // Step 2: Safely find matching Fee
      const matchingFee = matchingToken
      ? (options || []).find(b => b.token === matchingToken.address)
      : null;

      // Step 3: Safely find matching balance
      const matchingBalance = matchingToken
      ? (props.balanceList || []).find(b => b.tokenAddress === matchingToken.address)
      : null;
      
      let balanceAmount = Number(matchingBalance?.minDenomAmount || 0);
      if (props.from && props.from === 'shielded') {
        const matchingBalance = matchingToken
        ? (props.shieldedBalance || []).find(([address]) => address === matchingToken.address)
        : null;
        balanceAmount = Number((matchingBalance?.length && matchingBalance[1]) || 0);
      }
      const feeAmount = Number(matchingFee?.gasEstimation || 0);
      return {
          ...asset,
          fees: matchingFee || null,
          balance: balanceAmount > feeAmount ? matchingBalance : null,
      };
  }).filter((item) => item.fees && item.balance);

  useEffect(() => {
    if (enrichedAssets && enrichedAssets.length && props.tokenDetails && props.tokenDetails.symbol && (!props.feeOption) && !props.inProgress) {
      const find = enrichedAssets.find((val) => val.symbol ===  props.tokenDetails.symbol);
      if (find?.fees?.fee && Number(find?.fees?.fee)) {
        props.setFeeOptionPopoverValue(find);
      }
    }
  }, [enrichedAssets, props.tokenDetails, options]);

  return (
    <>
      <div className='fee_options_section'>
        <div className='fee_options_div'>
            <span>Fee Options:</span>
            {props.inProgress ? 'Calculating...'
              : !enrichedAssets.length ? variables[props.lang]['insufficient_balance']
              : <Button onClick={handleOpen}>
                  {props.feeOption && props.feeOption.symbol}
                  <img alt="down" src={ArrowDownIcon} />
              </Button>}
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{ paper: classes.root}}
          className={'fee_options_popover'}>
          <div className='fee_options'>
            {enrichedAssets && enrichedAssets.length
              ? enrichedAssets.map((val, index) => {
                return (
                  <div key={index} onClick={() => handleClick(val)}>
                      <p>{val?.symbol}</p>
                      <span>{val?.fees?.fee}</span>
                  </div>
                )
              }) : null}
          </div>
        </Popover>
      </div>
    </>
  );
}

FeeOptions.propTypes = {
    balanceList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    setFeeOptionPopoverValue: PropTypes.func.isRequired,
    gasPrice: PropTypes.array.isRequired,
    gasEstimation: PropTypes.object.isRequired,
    tokenDetails: PropTypes.object.isRequired,
    inProgress: PropTypes.bool.isRequired,
    tokensList: PropTypes.array.isRequired,
    shieldedBalance: PropTypes.array.isRequired,
    feeOption: PropTypes.string,
    from: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        balanceList: state.accounts.balanceList.result,
        shieldedBalance: state.accounts.shieldedBalance.result,
        lang: state.language,
        feeOption: state.assets.feeOptionPopoverValue.value,
        gasEstimation: state.gasPrice.gasEstimation.value,
        tokenDetails: state.gasPrice.gasEstimation.tokenDetails,
        inProgress: state.gasPrice.gasEstimation.inProgress,
        gasPrice: state.gasPrice.gasPrice.value,
        tokensList: state.accounts.tokensList.result,
    };
};

const actionToProps = {
    setFeeOptionPopoverValue,
};

export default connect(stateToProps, actionToProps)(FeeOptions);
