import { REST_URL, RPC_URL } from './constants/url';
import { SigningStargateClient } from '@cosmjs/stargate';
import { config, osmosisChainConfig, osmosischainConfig } from './config';
import { cosmos, InstallError } from '@cosmostation/extension-client';
import { getOfflineSigner } from '@cosmostation/cosmos-client';
import {
    BondMsgValue,
    WrapperTxMsgValue,
    UnbondMsgValue,
    RedelegateMsgValue,
    ClaimRewardsMsgValue,
    VoteProposalMsgValue,
    ShieldingTransferMsgValue,
} from '@namada/types';

import { getSdk } from '@namada/sdk/web';
import init from '@namada/sdk/web-init';

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

const kchainConfig = {
    chainId: osmosisChainConfig.CHAIN_ID,
    chainName,
    rpc: osmosisChainConfig.RPC_URL,
    rest: osmosisChainConfig.REST_URL,
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
                low: osmosisChainConfig.GAS_PRICE_STEP_LOW,
                average: config.GAS_PRICE_STEP_AVERAGE,
                high: config.GAS_PRICE_STEP_HIGH,
            },
        },
    ],
    coinType: config.COIN_TYPE,
    features: config.FEATURES,
    walletUrlForStaking: config.STAKING_URL,
};

const KeplrSuccess = (value) => {
    return {
        type: KEPLR_SUCCESS,
        value,
    };
};

export const initializeChain = (cb) => (dispatch) => {
    console.log('keplr main connect is called');
    console.log('window', window.keplr);
    (async () => {
        console.log('started keplr connect');
        if (!window.getOfflineSignerOnlyAmino || !window.keplr) {
            console.log('step 1')
            const error = 'Download the Keplr Extension';
            cb(error);
        } else {
            console.log('step 2')
            if (window.keplr.experimentalSuggestChain) {
                try {
                    console.log('step 3')
                    await window.keplr.experimentalSuggestChain(kchainConfig);
                } catch (error) {
                    console.log('step 4')
                    const chainError = 'Failed to suggest the chain';
                    console.log('chainError', chainError);
                    cb(chainError);
                }
            } else {
                console.log('step 5')
                const versionError = 'Please use the recent version of keplr extension';
                cb(versionError);
            }
        }

        if (window.keplr) {
            console.log('step 6')
            await window.keplr.enable(osmosisChainConfig.CHAIN_ID);

            const offlineSigner = window.getOfflineSignerOnlyAmino(osmosisChainConfig.CHAIN_ID);
            const accounts = await offlineSigner.getAccounts();
            dispatch(KeplrSuccess(accounts[0].address));
            dispatch()
            cb(null, accounts);
        } else {
            console.log('step 7')
            return null;
        }
    })();
};

// export const initializeChain = (kchainConfig, cb) => (dispatch) => {
//     dispatch(connectKeplrAccountInProgress());
//     let newConfig = config;
//     // if (networkConfig) {
//     //     newConfig = networkConfig;
//     // }

//     (async () => {
//         if (!window.getOfflineSigner || !window.keplr) {
//             const error = 'Please install keplr extension';
//             if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
//                 // Take the user to a different screen here.
//                 window.open('keplrwallet://wcV1');
//             } else if (/Android/i.test(navigator.userAgent)) {
//                 window.open('intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;');
//             } else {
//                 window.open(walletExtensions.KEPLR);
//             }
//             dispatch(connectKeplrAccountError(error));
//         } else {
//             if (window.keplr.experimentalSuggestChain) {
//                 try {
//                     await window.keplr && window.keplr.experimentalSuggestChain(kchainConfig || chainConfig);
//                 } catch (error) {
//                     const chainError = 'Failed to suggest the chain';
//                     // dispatch(connectKeplrAccountError(chainError));
//                 }
//             } else {
//                 const versionError = 'Please use the recent version of keplr extension';
//                 dispatch(connectKeplrAccountError(versionError));
//             }
//         }

//         if (window.keplr) {
//             window.keplr.enable(newConfig.CHAIN_ID)
//                 .then(async () => {
//                     const offlineSigner = window.getOfflineSigner(newConfig.CHAIN_ID);
//                     const accounts = await offlineSigner.getAccounts();
//                     localStorage.setItem('stream_swap_address', accounts && accounts.length &&
//                         accounts[0] && accounts[0].address);
//                     dispatch(connectKeplrAccountSuccess(accounts));
//                     cb(accounts);
//                 }).catch((error) => {
//                     dispatch(connectKeplrAccountError(error.toString()));
//                 });
//             window.keplr && window.keplr.getKey(newConfig.CHAIN_ID)
//                 .then((res) => {
//                     dispatch(setKeplrAccountKeys(res));
//                 }).catch(() => {

//                 });
//         } else {
//             return null;
//         }
//     })();
// };

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
            let accountsList;
            if (offlineSigner.accounts) {
                accounts = await offlineSigner.defaultAccount();
                accountsList = await offlineSigner.accounts();
            } else {
                accounts = await namada.defaultAccount();
                accountsList = await namada.accounts();
            }
            cb(null, accounts, accountsList);
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

export const delegateTransaction = (Tx, txs, revealPublicKey, type, cb) => {
    (async () => {
        console.log('delegation is called from helper js');
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
                '',
                config.TOKEN_ADDRESS,
            );

            const { rpc, tx } = sdk;

            const checksums = await rpc.queryChecksums();
            if (checksums && Object.keys(checksums).length) {
                Object.keys(checksums).map((key) => {
                    if (key && checksums[key]) {
                        checksums[key] = checksums[key].toLowerCase();
                    }
                });
            }

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
                memo: '',
            };

            const newTxs = [];
            if (revealPublicKey && !revealPublicKey.publicKey) {
                const revealPkTx = await tx.buildRevealPk(wrapperProps);
                newTxs.push(revealPkTx);
            }
            const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
            const encoded = await tx.buildBond(wrapperTxValue, bondMsgValue);
            newTxs.push(encoded);

            // const updateDate = tx.buildBatch(newTxs);
            let updateDate;
            if (type === 'ledger') {
                updateDate = newTxs;
            } else {
                updateDate = tx.buildBatch(newTxs);
            }

            // const checksums = {
            //     "tx_become_validator.wasm": "c6629064a1c3bde8503212cfa5e9b954169a7f162ad411b63a71db782fe909d7",
            //     "tx_bond.wasm": "490cf419bdbffe616c6aa6c72d38064e350ee65fb04d92472ccf285aec6844b6",
            //     "tx_change_validator_commission.wasm": "b745bc2b87bf8acd07e2f3409c77eee06c9b5206d2a77a2f23bb8e593c70cbfe",
            //     "tx_change_validator_metadata.wasm": "1b5a323c140b54700f280cde8b9aac1c12555f9c119e936432ddfa8f194d23ac",
            //     "tx_claim_rewards.wasm": "b6a1f7e069360650d2c6a1bdd2e5f4e18bb748d35dad02c31c027673fa042d8c",
            //     "tx_ibc.wasm": "cecb1f1b75cd649915423c5e68be20c5232f94ab57a11a908dc66751bbdc4f72",
            //     "tx_init_proposal.wasm": "33ee28597cf0f6a11dfe6e23e9aedf2eb04dabb44069cbe317768f4d982d80be",
            //     "tx_redelegate.wasm": "7d5ad1877643f7d9b32a511ef93a11e8503426baee0f5986d29e3f63a2355d58",
            //     "tx_reveal_pk.wasm": "f1fc74460bd9bbd17140c88dfc0543440f066ffb84849c35c2bb0e331e51cf1c",
            //     "tx_transfer.wasm": "6d753db0390e7cec16729fc405bfe41384c93bd79f42b8b8be41b22edbbf1b7c",
            //     "tx_unbond.wasm": "36e774350b865752c9d309d518223abf0a60374bae15a1f73dfe4721b5887048",
            //     "tx_vote_proposal.wasm": "faad78023b9391596981ac9a536070a3d7d469d5c6e20c2855b2cfca63c38f59",
            //     "tx_withdraw.wasm": "8a9df03a1a8f5e9e606e14a97fdfb2097dba062da1b3b2158bbfa7deabeeadfb"
            // };

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
                '',
                config.TOKEN_ADDRESS,
            );

            const { rpc, tx } = sdk;

            const checksums = await rpc.queryChecksums();
            if (checksums && Object.keys(checksums).length) {
                Object.keys(checksums).map((key) => {
                    if (key && checksums[key]) {
                        checksums[key] = checksums[key].toLowerCase();
                    }
                });
            }

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
                memo: '',
            };

            const newTxs = [];
            const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
            const encoded = await tx.buildUnbond(wrapperTxValue, bondMsgValue);
            newTxs.push(encoded);

            let updateDate;
            if (type === 'ledger') {
                updateDate = newTxs;
            } else {
                updateDate = tx.buildBatch(newTxs);
            }

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

export const reDelegateTransaction = (Tx, txs, type, cb) => {
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
                '',
                config.TOKEN_ADDRESS,
            );

            const { rpc, tx } = sdk;

            const checksums = await rpc.queryChecksums();
            if (checksums && Object.keys(checksums).length) {
                Object.keys(checksums).map((key) => {
                    if (key && checksums[key]) {
                        checksums[key] = checksums[key].toLowerCase();
                    }
                });
            }

            const bondMsgValue = new RedelegateMsgValue({
                owner: Tx.source,
                sourceValidator: Tx.validator,
                destinationValidator: Tx.toValidator,
                amount: Tx.amount,
            });

            const wrapperProps = {
                token: txs.token,
                feeAmount: txs.feeAmount,
                gasLimit: txs.gasLimit,
                chainId: txs.chainId,
                publicKey: txs.publicKey,
                memo: '',
            };

            const newTxs = [];
            const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
            const encoded = await tx.buildRedelegate(wrapperTxValue, bondMsgValue);
            newTxs.push(encoded);

            let updateDate;
            if (type === 'ledger') {
                updateDate = newTxs;
            } else {
                updateDate = tx.buildBatch(newTxs);
            }

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

export const claimTransaction = (Tx, txs, type, cb) => {
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
                '',
                config.TOKEN_ADDRESS,
            );

            const { rpc, tx } = sdk;

            const checksums = await rpc.queryChecksums();
            if (checksums && Object.keys(checksums).length) {
                Object.keys(checksums).map((key) => {
                    if (key && checksums[key]) {
                        checksums[key] = checksums[key].toLowerCase();
                    }
                });
            }

            const wrapperProps = {
                token: txs.token,
                feeAmount: txs.feeAmount,
                gasLimit: txs.gasLimit,
                chainId: txs.chainId,
                publicKey: txs.publicKey,
                memo: '',
            };

            const newTxs = [];
            const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
            let address;
            if (Tx && Tx.length) {
                for (let i = 0; i < Tx.length; i++) {
                    const newTx = Tx[i];
                    const bondMsgValue = new ClaimRewardsMsgValue({
                        source: newTx.source,
                        validator: newTx.validator,
                    });
                    const encoded = await tx.buildClaimRewards(wrapperTxValue, bondMsgValue);
                    newTxs.push(encoded);
                    address = newTx.source;
                }
            } else {
                const bondMsgValue = new ClaimRewardsMsgValue({
                    source: Tx.source,
                    validator: Tx.validator,
                });
                const encoded = await tx.buildClaimRewards(wrapperTxValue, bondMsgValue);
                newTxs.push(encoded);
                address = Tx.source;
            }

            let updateDate;
            if (type === 'ledger') {
                updateDate = newTxs;
            } else {
                updateDate = tx.buildBatch(newTxs);
            }

            client.sign(updateDate, address, checksums).then((signedBondTxBytes) => {
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

export const voteTransaction = (Tx, txs, type, cb) => {
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
                '',
                config.TOKEN_ADDRESS,
            );

            const { rpc, tx } = sdk;

            const checksums = await rpc.queryChecksums();
            if (checksums && Object.keys(checksums).length) {
                Object.keys(checksums).map((key) => {
                    if (key && checksums[key]) {
                        checksums[key] = checksums[key].toLowerCase();
                    }
                });
            }

            const bondMsgValue = new VoteProposalMsgValue({
                signer: Tx.voter,
                proposalId: Tx.proposalId,
                vote: Tx.option,
            });

            const wrapperProps = {
                token: txs.token,
                feeAmount: txs.feeAmount,
                gasLimit: txs.gasLimit,
                chainId: txs.chainId,
                publicKey: txs.publicKey,
                memo: '',
            };

            const newTxs = [];
            const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
            const encoded = await tx.buildVoteProposal(wrapperTxValue, bondMsgValue);
            newTxs.push(encoded);

            let updateDate;
            if (type === 'ledger') {
                updateDate = newTxs;
            } else {
                updateDate = tx.buildBatch(newTxs);
            }

            client.sign(updateDate, Tx.voter, checksums).then((signedBondTxBytes) => {
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

const paramsUrl = '/params/';

const fetchMaspParams = async (sdk, chainId) => {
    const { masp } = sdk;

    return masp.hasMaspParams().then(async (hasMaspParams) => {
        console.log('hasMaspParams', hasMaspParams);
        if (hasMaspParams) {
            await masp.loadMaspParams('', chainId).catch((e) => Promise.reject(e));
            return true;
        }
        return masp
            .fetchAndStoreMaspParams(paramsUrl)
            .then(() => masp.loadMaspParams('', chainId).then(() => true))
            .catch((e) => {
                throw new Error(e);
            });
    });
};

export const maspTransaction = async (address, Tx, txs, revealPublicKey, type, cb) => {
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
            '',
            config.TOKEN_ADDRESS,
        );

        const { rpc, tx } = sdk;

        const masp = await fetchMaspParams(sdk, chainId);
        const checksums = await rpc.queryChecksums();
        if (checksums && Object.keys(checksums).length) {
            Object.keys(checksums).map((key) => {
                if (key && checksums[key]) {
                    checksums[key] = checksums[key].toLowerCase();
                }
            });
        }

        const shieldingTransfer = new ShieldingTransferMsgValue({
            target: Tx.target,
            data: Tx.data,
        });

        const wrapperProps = {
            token: txs.token,
            feeAmount: txs.feeAmount,
            gasLimit: txs.gasLimit,
            chainId: txs.chainId,
            publicKey: txs.publicKey,
            memo: '',
        };

        const newTxs = [];
        if (revealPublicKey && !revealPublicKey.publicKey) {
            const revealPkTx = await tx.buildRevealPk(wrapperProps);
            newTxs.push(revealPkTx);
        }
        const wrapperTxValue = new WrapperTxMsgValue(wrapperProps);
        console.log(await tx.buildShieldingTransfer.toString());
        const encoded = await tx.buildShieldingTransfer(wrapperTxValue, shieldingTransfer);
        newTxs.push(encoded);

        let updateDate;
        if (type === 'ledger') {
            updateDate = newTxs;
        } else {
            updateDate = tx.buildBatch(newTxs);
        }

        client.sign(updateDate, address, checksums).then((signedBondTxBytes) => {
            rpc.broadcastTx(signedBondTxBytes && signedBondTxBytes.length && signedBondTxBytes[0], wrapperProps).then((result) => {
                if (result && result.code !== undefined && result.code !== 0 && result.code !== '0') {
                    cb(result.info || result.log || result.rawLog);
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
        }).catch((error) => {
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
};
