import axios from "axios";
import {
    GAS_ESTIMATION_FETCH_ERROR,
    GAS_ESTIMATION_FETCH_IN_PROGRESS,
    GAS_ESTIMATION_FETCH_SUCCESS,
    GAS_PRICE_FETCH_ERROR,
    GAS_PRICE_FETCH_IN_PROGRESS,
    GAS_PRICE_FETCH_SUCCESS,
} from "constants/gasPrice";
import { urlFetchGasEstimation, urlFetchGasPrice } from "constants/url";

const fetchGasPriceInProgress = () => {
    return {
        type: GAS_PRICE_FETCH_IN_PROGRESS,
    };
};

const fetchGasPriceSuccess = (value) => {
    return {
        type: GAS_PRICE_FETCH_SUCCESS,
        value,
    };
};

const fetchGasPriceError = (message) => {
    return {
        type: GAS_PRICE_FETCH_ERROR,
        message,
    };
};

export const fetchGasPrice = () => (dispatch) => {
    dispatch(fetchGasPriceInProgress());
    const url = urlFetchGasPrice();
    axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchGasPriceSuccess(res.data));
        })
        .catch((error) => {
            dispatch(fetchGasPriceError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchGasEstimationInProgress = () => {
    return {
        type: GAS_ESTIMATION_FETCH_IN_PROGRESS,
    };
};

const fetchGasEstimationSuccess = (value) => {
    return {
        type: GAS_ESTIMATION_FETCH_SUCCESS,
        value,
    };
};

const fetchGasEstimationError = (message) => {
    return {
        type: GAS_ESTIMATION_FETCH_ERROR,
        message,
    };
};

export const fetchGasEstimation = (transactionTypes) => (dispatch) => {
    dispatch(fetchGasEstimationInProgress());
    const url = urlFetchGasEstimation(transactionTypes);
    axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchGasEstimationSuccess(res.data));
        })
        .catch((error) => {
            dispatch(fetchGasEstimationError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};
