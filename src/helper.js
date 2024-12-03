import { REST_URL, RPC_URL } from './constants/url';
import { SigningStargateClient } from '@cosmjs/stargate';
import { config } from './config';
import { cosmos, InstallError } from '@cosmostation/extension-client';
import { getOfflineSigner } from '@cosmostation/cosmos-client';
import {
    BondMsgValue,
    WrapperTxMsgValue,
    UnbondMsgValue,
} from '@namada/types';

import { getSdk } from "@heliaxdev/namada-sdk/web";
import init from "@heliaxdev/namada-sdk/web-init";

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
            let accounts;
            if (offlineSigner.accounts) {
                accounts = await offlineSigner.accounts();
            } else {
                accounts = await namada.accounts();
            }
            cb(null, accounts);
        } else {
            return null;
        }
    })();
};

// export const sentTransaction = (tx, txs, address, type, cb) => {
//     (async () => {
//         const isExtensionInstalled = typeof window.namada === 'object';
//         if (!isExtensionInstalled || !window.namada) {
//             const error = 'Download the Namada Extension';
//             cb(error);
//         }

//         // if (window.namada) {
//         //     await initShared();
//         //
//         //     const transferMsgValue = new TransferMsgValue({
//         //         source: tx.source,
//         //         target: tx.target,
//         //         token: tx.token,
//         //         amount: tx.amount,
//         //         nativeToken: tx.nativeToken,
//         //     });
//         //
//         //     const txMessageValue = new TxMsgValue({
//         //         token: txs.token,
//         //         feeAmount: txs.feeAmount,
//         //         gasLimit: txs.gasLimit,
//         //         chainId: txs.chainId,
//         //     });
//         //
//         //     const sdk = new Sdk(config.RPC_URL);
//         //     const message = new Message();
//         //     const txEncode = message.encode(transferMsgValue);
//         //     // console.log('111', txEncode, tx, txs, address);
//         //     const txsEncode = message.encode(txMessageValue);
//         //     // console.log('55555', txEncode, message, txsEncode);
//         //     sdk.build_transfer(txEncode, txsEncode, address, address)
//         //         .then((result) => {
//         //             console.log('11111', result);
//         //             cb(null, result);
//         //         })
//         //         .catch((error) => {
//         //             console.log('4444', error);
//         //             const message = 'success';
//         //             if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
//         //                 cb(null, message);
//         //             } else {
//         //                 cb(error && error.message);
//         //             }
//         //         });
//         // } else {
//         //     return null;
//         // }

//         if (window.namada) {
//             const namada = window.namada;
//             const client = namada && namada.getSigner();

//             console.log('000', client, tx, txs, type);
//             await client.submitTransfer(tx, txs, type)
//                 .then(() => {
//                     console.log('Transaction was approved by user and submitted via the SDK');
//                     // console.log('11111', result);
//                     // cb(null, result);
//                 })
//                 .catch((error) => {
//                     console.error(`Transaction was rejected: ${error}`);
//                     // console.log('4444', error);
//                     // const message = 'success';
//                     // if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
//                     //     cb(null, message);
//                     // } else {
//                     //     cb(error && error.message);
//                     // }
//                 });
//         } else {
//             return null;
//         }
//     })();
// };

export const delegateTransaction = (Tx, txs, type, cb) => {
    (async () => {
        const isExtensionInstalled = typeof window.namada === 'object';
        if (!isExtensionInstalled || !window.namada) {
            const error = 'Download the Namada Extension';
            cb(error);
        }

        if (window.namada) {
            const namada = window.namada;
            const client = namada.getSigner();

            const { cryptoMemory } = await init();
            const sdk = getSdk(
              cryptoMemory,
              config.RPC_URL,
              config.MAPS_REST_URL,
              "",
              config.TOKEN_ADDRESS
            );

            const { rpc, tx } = sdk;

            // const checksums = await rpc.queryChecksums();
        
            const bondMsgValue = new BondMsgValue({
                source: Tx.source,
                validator: Tx.validator,
                amount: Tx.amount,
            });

            const wrapperProps = {
                token: txs.token,
                feeAmount: txs.feeAmount,
                gasLimit: txs.gasLimit,
                chainId: txs.chainId,
                publicKey: txs.publicKey,
                memo: "",
            };

            const newTxs = [];
            const revealPkTx = await tx.buildRevealPk(wrapperProps);
            newTxs.push(revealPkTx);
            const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
            const encoded = await tx.buildBond(wrapperTxValue, bondMsgValue);
            newTxs.push(encoded);

            const updateDate = tx.buildBatch(newTxs);

            const checksums = {
                "tx_become_validator.wasm": "a623483dfb1651c64f554bb4bf5814b327f060b2a43d5e9e3439efff221bc48f",
                "tx_bond.wasm": "30caf17e23725c23b0d679807a7711c302373aa24e5786ad342d26019716d64f",
                "tx_change_validator_commission.wasm": "5c252a4b1abfc66084f769bacfe07cb97ee54f88cd635489876e3200d6b075f7",
                "tx_change_validator_metadata.wasm": "8b2ee588f065b3830f48d4ade60ffd154c6bffc634b1f1fc22517005c626c6d3",
                "tx_claim_rewards.wasm": "b72b6b20862e63134691d2058e08487dc0fbf83463f3ab6c801b9074c1e92835",
                "tx_ibc.wasm": "4865b16a86eb4b37fc77fed4c1c45824fa4d59c5655b1ffbe614eec76685c74a",
                "tx_init_proposal.wasm": "76a4a0ab7c1c237557bf5d492287b7e196fcdf9560867f339661dc02b807a142",
                "tx_redelegate.wasm": "de0e8a80a1be4bfc184ae9af574b1d4dc6cd9c663328ac643e6bfd4ee12fe1b5",
                "tx_reveal_pk.wasm": "bf00e581f8dcfd50d62f1bf5ba9d3f8ede15487e2882539fcc355008fbf72450",
                "tx_transfer.wasm": "847de1a968118227b3c97b6f5f5ce358737208edcb580a3a381f0d2ad8833fb9",
                "tx_unbond.wasm": "af2f45838ce5fe6efbda0b9ce692c58a1ab61064296633a26031d6eb4d8bccdc",
                "tx_vote_proposal.wasm": "f43a6e0e6d36533d415298cc1a4c9525bc92a1597c115078548d8b7e948d3955",
                "tx_withdraw.wasm": "d3e8cdbf06112592aa5544751bc77dd9ce8c36fa603a387d83594738bb00bc04"
            };

            client.sign(updateDate, Tx.source, checksums).then((signedBondTxBytes) => {
                rpc.broadcastTx(signedBondTxBytes && signedBondTxBytes.length && signedBondTxBytes[0], wrapperProps).then((result) => {
                    if (result && result.code !== undefined && result.code !== 0 && result.code !== '0') {
                        cb(result.info || result.log || result.rawLog);
                    } else {
                        cb(null, result);
                    }
                }).catch((error) => {
                    console.error(`broadcast error: ${error}`);
                    const message = 'success';
                    if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                        cb(null, message);
                    } else {
                        cb(error && error.message);
                    }
                });
            }).catch((error) => {
                console.error(`Transaction was rejected: ${error}`);
                const message = 'success';
                if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                    cb(null, message);
                } else {
                    cb(error && error.message);
                }
            });
        } else {
            return null;
        }
    })();
};

export const unDelegateTransaction = (Tx, txs, type, cb) => {
    (async () => {
        const isExtensionInstalled = typeof window.namada === 'object';
        if (!isExtensionInstalled || !window.namada) {
            const error = 'Download the Namada Extension';
            cb(error);
        }

        if (window.namada) {
            const namada = window.namada;
            const client = namada.getSigner();

            const { cryptoMemory } = await init();
            const sdk = getSdk(
              cryptoMemory,
              config.RPC_URL,
              config.MAPS_REST_URL,
              "",
              config.TOKEN_ADDRESS
            );

            const { rpc, tx } = sdk;

            // const checksums = await rpc.queryChecksums();
        
            const bondMsgValue = new UnbondMsgValue({
                source: Tx.source,
                validator: Tx.validator,
                amount: Tx.amount,
            });

            const wrapperProps = {
                token: txs.token,
                feeAmount: txs.feeAmount,
                gasLimit: txs.gasLimit,
                chainId: txs.chainId,
                publicKey: txs.publicKey,
                memo: "",
            };

            const newTxs = [];
            const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
            const encoded = await tx.buildUnbond(wrapperTxValue, bondMsgValue);
            newTxs.push(encoded);

            const updateDate = tx.buildBatch(newTxs);

            const checksums = {
                "tx_become_validator.wasm": "a623483dfb1651c64f554bb4bf5814b327f060b2a43d5e9e3439efff221bc48f",
                "tx_bond.wasm": "30caf17e23725c23b0d679807a7711c302373aa24e5786ad342d26019716d64f",
                "tx_change_validator_commission.wasm": "5c252a4b1abfc66084f769bacfe07cb97ee54f88cd635489876e3200d6b075f7",
                "tx_change_validator_metadata.wasm": "8b2ee588f065b3830f48d4ade60ffd154c6bffc634b1f1fc22517005c626c6d3",
                "tx_claim_rewards.wasm": "b72b6b20862e63134691d2058e08487dc0fbf83463f3ab6c801b9074c1e92835",
                "tx_ibc.wasm": "4865b16a86eb4b37fc77fed4c1c45824fa4d59c5655b1ffbe614eec76685c74a",
                "tx_init_proposal.wasm": "76a4a0ab7c1c237557bf5d492287b7e196fcdf9560867f339661dc02b807a142",
                "tx_redelegate.wasm": "de0e8a80a1be4bfc184ae9af574b1d4dc6cd9c663328ac643e6bfd4ee12fe1b5",
                "tx_reveal_pk.wasm": "bf00e581f8dcfd50d62f1bf5ba9d3f8ede15487e2882539fcc355008fbf72450",
                "tx_transfer.wasm": "847de1a968118227b3c97b6f5f5ce358737208edcb580a3a381f0d2ad8833fb9",
                "tx_unbond.wasm": "af2f45838ce5fe6efbda0b9ce692c58a1ab61064296633a26031d6eb4d8bccdc",
                "tx_vote_proposal.wasm": "f43a6e0e6d36533d415298cc1a4c9525bc92a1597c115078548d8b7e948d3955",
                "tx_withdraw.wasm": "d3e8cdbf06112592aa5544751bc77dd9ce8c36fa603a387d83594738bb00bc04"
            };

            client.sign(updateDate, Tx.source, checksums).then((signedBondTxBytes) => {
                rpc.broadcastTx(signedBondTxBytes && signedBondTxBytes.length && signedBondTxBytes[0], wrapperProps).then((result) => {
                    if (result && result.code !== undefined && result.code !== 0 && result.code !== '0') {
                        cb(result.info || result.log || result.rawLog);
                    } else {
                        cb(null, result);
                    }
                }).catch((error) => {
                    console.error(`broadcast error: ${error}`);
                    const message = 'success';
                    if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                        cb(null, message);
                    } else {
                        cb(error && error.message);
                    }
                });
            }).catch((error) => {
                console.error(`Transaction was rejected: ${error}`);
                const message = 'success';
                if (error && error.message === 'Invalid string. Length must be a multiple of 4') {
                    cb(null, message);
                } else {
                    cb(error && error.message);
                }
            });
        } else {
            return null;
        }
    })();
};
