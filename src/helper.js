import { REST_URL, RPC_URL } from './constants/url';
import { SigningStargateClient } from '@cosmjs/stargate';
import { config } from './config';
import { cosmos, InstallError } from '@cosmostation/extension-client';
import { getOfflineSigner } from '@cosmostation/cosmos-client';
import { Sdk, Query } from './libs/namada/shared';
import { init as initShared } from './libs/namada/shared/init-inline';
import { AccountType, TransferProps, TxProps, Message, TransferMsgValue, TxMsgValue} from "./libs/namada/types";
import {
     SubmitBondMsgValue,
} from '@namada/types';
import BigNumber from 'bignumber.js';

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
        },
    ],
    feeCurrencies: [
        {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
            coinGeckoId,
            gasPriceStep: {
                low: config.GAS_PRICE_STEP_LOW,
                average: config.GAS_PRICE_STEP_AVERAGE,
                high: config.GAS_PRICE_STEP_HIGH,
            },
        },
    ],
    coinType: config.COIN_TYPE,
    features: config.FEATURES,
    walletUrlForStaking: config.STAKING_URL,
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

// Namada
export const initializeNamadaChain = (cb) => {
    (async () => {
        const isExtensionInstalled = typeof window.namada === 'object';
        if (!isExtensionInstalled || !window.namada) {
            const error = 'Download the Namada Extension';
            cb(error);
        }

        if (window.namada) {
            const namada = window.namada;
            await namada.connect(chainId);

            const offlineSigner = namada.getSigner(chainId);
            const accounts = await offlineSigner.accounts();
            cb(null, accounts);
        } else {
            return null;
        }
    })();
};

export const sentTransaction = async (tx, txs, type, address, cb) => {
        const isExtensionInstalled = typeof window.namada === 'object';
        if (!isExtensionInstalled || !window.namada) {
            const error = 'Download the Namada Extension';
            cb(error);
        }
/*
        if (window.namada) {
            await initShared();
            console.log("TX", tx)
        
             const sdk = new Sdk(config.RPC_URL, tx.token);

             const transferMsgValue = new TransferMsgValue({
                source: tx.source,
                target: tx.target,
                token: tx.token,
                amount: tx.amount,
                nativeToken: tx.nativeToken,
            });
            
            const txMessageValue = new TxMsgValue({
                token: txs.token,
                feeAmount: txs.feeAmount,
                gasLimit: txs.gasLimit,
                chainId: txs.chainId,
            });
        
            console.log("Tx Msg value", txMessageValue);
             const message = new Message();
             const txEncode = message.encode(transferMsgValue);
             console.log('Encoded TX', txEncode, address);
             const txsEncode = message.encode(txMessageValue);
             // console.log('55555', txEncode, message, txsEncode);
             sdk.build_transfer(txEncode, txsEncode, address, address)
                 .then((result) => {
                     console.log('Built Message', result);
                     cb(null, result);
                 })
                 .catch((error) => {
                     console.log('Built Error', error);
                     const message = 'success';
                     if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                         cb(null, message);
                     } else {
                         cb(error && error.message);
                     }
                 });
         } else {
             return null;
         } */

       if (window.namada) {
            const namada = window.namada;
            const client = namada && namada.getSigner();

            console.log('000', client, tx, txs, type);
            await client.submitTransfer(tx, txs, type)
                .then(() => {
                    console.log('Transaction was approved by user and submitted via the SDK');
                    // console.log('11111', result);
                    // cb(null, result);
                })
                .catch((error) => {
                    console.error(`Transaction was rejected: ${error}`);
                    // console.log('4444', error);
                    // const message = 'success';
                    // if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                    //     cb(null, message);
                    // } else {
                    //     cb(error && error.message);
                    // }
                });
        }
        else {
            return null;
        } 
};

export const delegateTransaction = async (tx, txs, type, cb) => {
    (async () => {
        const isExtensionInstalled = typeof window.namada === 'object';
        if (!isExtensionInstalled || !window.namada) {
            const error = 'Download the Namada Extension';
            cb(error);
        }

        if (window.namada) {
             // await initShared();
        
             const sdk = new Sdk(config.RPC_URL, txs.token);
             console.log('1', sdk);

             const querier = new Query(config.RPC_URL)
             const epoch = await querier.query_epoch()
             console.log("Epoch", epoch)
             const delegations = await querier.query_my_validators(["tnam1qp4m542w5cqagh3ryt6j38xvyf7u6r6vtu0uzvrn"])
             console.log('delegations', delegations);
        }

       //      const bondMsgValue = new SubmitBondMsgValue({
        //         source: tx.source,
         //        validator: tx.validator,
          //       amount: tx.amount,
          //       nativeToken: tx.nativeToken,
          //   });
        //
        //     // const params = ApprovalsService.getParamsBond(
        //     //     new Uint8Array([]),
        //     //     txs,
        //     // );
        //
        //     // const bond = sdk.encode(bondMsgValue);
        //     // console.log('3333', bondMsgValue, bond);
        //     sdk.build_bond(bondMsgValue, new Uint8Array([]))
        //         .then((result) => {
        //             console.log('11111', result);
        //             cb(null, result);
        //         })
        //         .catch((error) => {
        //             console.log('4444', error);
        //             const message = 'success';
        //             if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
        //                 cb(null, message);
        //             } else {
        //                 cb(error && error.message);
        //             }
        //         });
        // } else {
        //     return null;
        // }

        if (window.namada) {
            const namada = window.namada;
            const client = namada.getSigner();

            console.log('000', client, tx, txs, type);
            client.submitBond(tx, txs, type).then((result) => {
                console.log('Transaction was approved by user and submitted via the SDK');
                // console.log('11111', result);
                // cb(null, result);
            }).catch((error) => {
                console.error(`Transaction was rejected: ${error}`);
                // console.log('4444', error);
                // const message = 'success';
                // if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                //     cb(null, message);
                // } else {
                //     cb(error && error.message);
                // }
            });
        } else {
            return null;
        }
    })();
};
