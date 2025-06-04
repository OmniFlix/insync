import { config } from "../config";
import { formatCount } from "./numberFormats";

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

    return formatCount(max);
}
