import { config } from "../config";
import { formatCount, truncateTo4Decimals } from "./numberFormats";

export const feeCalculationDisplay = (gasEstimate, gasPrice, token) => {
    const precision = Math.max(
            0,
            Math.min(1, gasEstimate.totalEstimates / 1000)
          );
    const avg = Math.ceil(gasEstimate.avg * 1.25 - precision * 0.25);
    let gasItem = gasPrice.find((val) => val?.token === token);
    gasItem = gasItem?.minDenomAmount / (10 ** config.COIN_DECIMALS);

    return formatCount(avg * gasItem, 4);
}

export const feeCalculation = (gasEstimate) => {
    const precision = Math.max(
            0,
            Math.min(1, gasEstimate.totalEstimates / 1000)
          );
    const avg = Math.ceil(gasEstimate.avg * 1.25 - precision * 0.25);

    return avg;
}

export const feeCalculationMax = (gasEstimate, gasPrice, token, balance) => {
    const precision = Math.max(
            0,
            Math.min(1, gasEstimate.totalEstimates / 1000)
          );
    const avg = Math.ceil(gasEstimate.avg * 1.25 - precision * 0.25);
    let gasItem = gasPrice.find((val) => val?.token === token);
    gasItem = gasItem?.minDenomAmount / (10 ** config.COIN_DECIMALS);
    const max = balance - (avg * gasItem);

    if (Number(max) > 0) {
      return truncateTo4Decimals(max);
    } else {
      return 0;
    }
}

export const feeCoverageOptions = (gasEstimate, gasPrice, token) => {
    const precision = Math.max(
            0,
            Math.min(1, gasEstimate.totalEstimates / 1000)
          );
    const avg = Math.ceil(gasEstimate.avg * 1.25 - precision * 0.25);
    let array = [];
    const tokenDenom = token?.balance?.tokenAddress || token?.tokenAddress;
    gasPrice.map((val) => {
      const object = { ...val, };
      const gasItem = val?.minDenomAmount / (10 ** config.COIN_DECIMALS);
      object.fee = formatCount(avg * gasItem, 4);
      object.gasEstimation = avg * val?.minDenomAmount;
      if (val?.token === tokenDenom) {
        array.splice(0, 0, object);
      } else {
        array.push(object);
      }
    });

    return array;
}

export const balanceCalculation = (balanceList, token, transactionAmount, feeOption) => {
  let amount = transactionAmount;
  let validBalance = true;
  let shielded = false;
  if (feeOption?.fees?.token === token) {
    amount = Number(amount) + Number(feeOption?.fees?.fee);
    amount = amount * (10 ** config.COIN_DECIMALS);
    balanceList.map((balance) => {
      if (balance && balance.length) {
        shielded = true;
        if (balance[0] === token) {
          if (Number(balance[1]) > amount || Number(balance[1]) === amount) {
            validBalance = true;
          } else {
            validBalance = false;
          }
        }
      }

      if (balance && balance?.tokenAddress === token) {
        if (Number(balance?.minDenomAmount) > amount || Number(balance?.minDenomAmount) === amount) {
          validBalance = true;
        } else {
          validBalance = false;
        }
      }
    })
  } else {
    let feeAmount = feeOption?.fees?.fee;
    amount = amount * (10 ** config.COIN_DECIMALS);
    feeAmount = feeAmount * (10 ** config.COIN_DECIMALS);
    balanceList.map((balance) => {
      if (balance && balance.length) {
        shielded = true;
        if (balance[0] === token) {
          if (Number(balance[1]) > amount || Number(balance[1]) === amount) {
            validBalance = validBalance && true;
          } else {
            validBalance = false;
          }
        } else if (balance[0] === feeOption?.fees?.token) {
          if (Number(balance[1]) > feeAmount || Number(balance[1]) === feeAmount) {
            validBalance = validBalance && true;
          } else {
            validBalance = false;
          }
        }
      }

      if (balance && balance?.tokenAddress === token) {
        if (Number(balance?.minDenomAmount) > amount || Number(balance?.minDenomAmount) === amount) {
          validBalance = validBalance && true;
        } else {
          validBalance = false;
        }
      } else if (balance && balance?.tokenAddress === feeOption?.fees?.token) {
          if (Number(balance?.minDenomAmount) > feeAmount || Number(balance?.minDenomAmount) === feeAmount) {
            validBalance = validBalance && true;
          } else {
            validBalance = false;
          }
        }
    })
  }

  if (shielded && validBalance) {
    const find = balanceList.find((val) => val[0] === feeOption?.fees?.token);

    if (!find) {
      validBalance = false;
    }
  }

  return validBalance;
}
