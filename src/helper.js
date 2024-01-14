import { REST_URL, RPC_URL } from './constants/url';
import { SigningStargateClient } from '@cosmjs/stargate';
import { config } from './config';
import { cosmos, InstallError } from '@cosmostation/extension-client';
import { getOfflineSigner } from '@cosmostation/cosmos-client';

const chainId = config.CHAIN_ID;
const chainName = config.CHAIN_NAME;
const coinDenom = config.COIN_DENOM;
const coinMinimalDenom = config.COIN_MINIMAL_DENOM;
const coinDecimals = config.COIN_DECIMALS;
const prefix = config.PREFIX;
const coinGeckoId = config.COINGECKO_ID;

const chainConfig = {
    chainId: chainId,
    chainName,
    rpc: RPC_URL,
    rest: REST_URL,
    stakeCurrency: {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
        coinGeckoId,
        coinImageUrl: config.COIN_IMAGE_URL,
    },
    bip44: {
        coinType: 118,
    },
    bech32Config: {
        bech32PrefixAccAddr: `${prefix}`,
        bech32PrefixAccPub: `${prefix}pub`,
        bech32PrefixValAddr: `${prefix}valoper`,
        bech32PrefixValPub: `${prefix}valoperpub`,
        bech32PrefixConsAddr: `${prefix}valcons`,
        bech32PrefixConsPub: `${prefix}valconspub`,
    },
    currencies: [
        {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
            coinGeckoId,
            coinImageUrl: config.COIN_IMAGE_URL,
        },
    ],
    feeCurrencies: [
        {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
            coinGeckoId,
            coinImageUrl: config.COIN_IMAGE_URL,
            gasPriceStep: {
                low: config.GAS_PRICE_STEP_LOW,
                average: config.GAS_PRICE_STEP_AVERAGE,
                high: config.GAS_PRICE_STEP_HIGH,
            },
        },
    ],
    coinType: config.COIN_TYPE,
    features: config.FEATURES,
    walletUrl: config.WALLET_URL,
    walletUrlForStaking: config.STAKING_URL,
    txExplorer: {
        name: 'Mintscan',
        txUrl: `${config.EXPLORER_URL}/txs/{txHash}`,
    },
};

export const initializeChain = (cb) => {
    (async () => {
        if (!window.getOfflineSignerOnlyAmino || !window.keplr) {
            const error = 'Download the Keplr Extension';
            cb(error);
        } else {
            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(chainConfig);
                } catch (error) {
                    const chainError = 'Failed to suggest the chain';
                    cb(chainError);
                }
            } else {
                const versionError = 'Please use the recent version of keplr extension';
                cb(versionError);
            }
        }

        if (window.keplr) {
            await window.keplr.enable(chainId);

            const offlineSigner = window.getOfflineSignerOnlyAmino(chainId);
            const accounts = await offlineSigner.getAccounts();
            cb(null, accounts);
        } else {
            return null;
        }
    })();
};

export const initializeCosmoStation = (cb) => {
    (async () => {
        try {
            const provider = await cosmos();
            const account = await provider.requestAccount(config.COSMOSTAION);
            cb(null, account);
        } catch (error) {
            if (error instanceof InstallError) {
                const error = 'Download the Cosmostation Extension';
                cb(error);
            } else if (error.code === 4001) {
                const error = 'user rejected request';
                cb(error);
            } else {
                cb(error.message);
            }
        }
    })();
};

export const initializeMetaMask = (cb) => {
    (async () => {
        if (!window.ethereum) {
            const error = 'Download the MetaMask Extension';
            cb(error);
        }

        if (window.ethereum) {
            const result = await window.ethereum.request({ method: 'wallet_getSnaps' });
            const installed = Object.keys(result).includes('npm:@cosmsnap/snap');

            // Install Snap
            if (!installed) {
                window.ethereum.request({
                    method: 'wallet_requestSnaps',
                    params: {
                        'npm:@cosmsnap/snap': {
                            version: '^0.1.0',
                        },
                    },
                }).then((result) => {
                    metamaskInitialize(cb);
                }).catch((error) => {
                    cb((error && error.message) || error);
                });
            }

            metamaskInitialize(cb);
        } else {
            return null;
        }
    })();
};

const metamaskInitialize = (cb) => {
    (async () => {
        try {
            const initialized = await window.ethereum.request({
                method: 'wallet_invokeSnap',
                params: {
                    snapId: 'npm:@cosmsnap/snap',
                    request: {
                        method: 'initialized',
                    },
                },
            });

            if (initialized && initialized.data && !initialized.data.initialized) {
                // Initialize the Snap with default chains
                window.ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: 'npm:@cosmsnap/snap',
                        request: {
                            method: 'initialize',
                        },
                    },
                }).then((result) => {
                    window.ethereum.request({
                        method: 'wallet_invokeSnap',
                        params: {
                            snapId: 'npm:@cosmsnap/snap',
                            request: {
                                method: 'getChainAddress',
                                params: {
                                    chain_id: chainId,
                                },
                            },
                        },
                    }).then((result) => {
                        if (result && result.data) {
                            cb(null, result && result.data);
                        }
                    }).catch((error) => {
                        cb((error && error.message) || error);
                    });
                }).catch((error) => {
                    cb((error && error.message) || error);
                });

                return;
            }

            window.ethereum.request({
                method: 'wallet_invokeSnap',
                params: {
                    snapId: 'npm:@cosmsnap/snap',
                    request: {
                        method: 'getChainAddress',
                        params: {
                            chain_id: chainId,
                        },
                    },
                },
            }).then((result) => {
                if (result && result.data) {
                    cb(null, result && result.data);
                }
            }).catch((error) => {
                cb((error && error.message) || error);
            });
        } catch (error) {
            cb((error && error.message) || error);
        }
    })();
};

export const signTxAndBroadcast = (tx, address, cb) => {
    (async () => {
        await window.keplr && window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
        const client = await SigningStargateClient.connectWithSigner(
            RPC_URL,
            offlineSigner,
        );
        client.signAndBroadcast(
            address,
            tx.msgs ? tx.msgs : [tx.msg],
            tx.fee,
            tx.memo,
        ).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            const message = 'success';
            if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                cb(null, message);
            } else {
                cb(error && error.message);
            }
        });
    })();
};

export const cosmoStationSign = (tx, address, cb) => {
    (async () => {
        const offlineSigner = await getOfflineSigner(chainId);
        const client = await SigningStargateClient.connectWithSigner(
            RPC_URL,
            offlineSigner,
        );

        client.signAndBroadcast(
            address,
            tx.msgs ? tx.msgs : [tx.msg],
            tx.fee,
            tx.memo,
        ).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            const message = 'success';
            if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                cb(null, message);
            } else {
                cb(error && error.message);
            }
        });
    })();
};

export const metaMaskSign = (tx, address, cb) => {
    (async () => {
        const msgs = tx.msgs ? tx.msgs : [tx.msg];
        const fees = tx.fee;
        if (fees && fees.amount && fees.amount.length) {
            const array = [];
            fees.amount.map((val) => {
                let obj = {};
                if (val && val.amount) {
                    obj = {
                        amount: String(Number(val.amount) * 100),
                        denom: config.COIN_MINIMAL_DENOM,
                    };
                }

                array.push(obj);
            });

            fees.amount = array;
        }

        window.ethereum.request({
            method: 'wallet_invokeSnap',
            params: {
                snapId: 'npm:@cosmsnap/snap',
                request: {
                    method: 'transact',
                    params: {
                        chain_id: chainId,
                        msgs: JSON.stringify(msgs),
                        fees: JSON.stringify(fees),
                    },
                },
            },
        }).then((result) => {
            if (result && result.data && result.data.code !== undefined && result.data.code !== 0) {
                cb(result.data.log || result.data.rawLog);
            } else if (result && !result.success) {
                const message = 'unsuccess';
                cb(message);
            } else {
                cb(null, result && result.data);
            }
        }).catch((error) => {
            const message = 'success';
            if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                cb(null, message);
            } else {
                cb(error && error.message);
            }
        });
    })();
};
