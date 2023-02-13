import { REST_URL, RPC_URL } from './constants/url';
import { defaultRegistryTypes, SigningStargateClient } from '@cosmjs/stargate';
import { config } from './config';
import { encodePubkey, makeSignDoc, Registry } from '@cosmjs/proto-signing';
import { encodeSecp256k1Pubkey } from '@cosmjs/amino/build/encoding';
import { AuthInfo, TxBody, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { convertToCamelCase } from './utils/strings';
import { MsgDelegate, MsgUndelegate, MsgBeginRedelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import Axios from 'axios';
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
    },
    bip44: {
        coinType: config.COIN_TYPE,
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
        if (!window.getOfflineSigner || !window.keplr) {
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

            const offlineSigner = window.getOfflineSigner(chainId);
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
            cb(error && error.message);
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
            cb(error && error.message);
        });
    })();
};

export const protoBufSigning = (tx, address, cb) => {
    (async () => {
        await window.keplr && window.keplr.enable(config.CHAIN_ID);
        const offlineSigner = window.getOfflineSigner && window.getOfflineSigner(config.CHAIN_ID);
        // const customRegistry = [
        //     '/liquidstaking.staking.v1beta1.MsgRedeemTokensforShares',
        //     MsgWithdrawDelegatorReward,
        // ];

        // const myRegistry = new Registry([...defaultRegistryTypes, customRegistry]);
        const myRegistry = new Registry([...defaultRegistryTypes]);

        try {
            const client = await SigningStargateClient.connectWithSigner(
                config.RPC_URL,
                offlineSigner,
                { registry: myRegistry },
            );

            let account = {};
            try {
                account = await client.getAccount(address);
            } catch (e) {
                account.accountNumber = 0;
                account.sequence = 0;
            }
            const accounts = await offlineSigner.getAccounts();

            let pubkey = accounts && accounts.length && accounts[0] &&
                accounts[0].pubkey && encodeSecp256k1Pubkey(accounts[0].pubkey);
            pubkey = accounts && accounts.length && accounts[0] &&
                accounts[0].pubkey && pubkey && pubkey.value &&
                encodePubkey(pubkey);

            let authInfo = {
                signerInfos: [{
                    publicKey: pubkey,
                    modeInfo: {
                        single: {
                            mode: 1,
                        },
                    },
                    sequence: account && account.sequence,
                }],
                fee: { ...tx.fee },
            };
            authInfo = AuthInfo.encode(AuthInfo.fromPartial(authInfo)).finish();

            let msgValue = tx.msgs ? tx.msgs && tx.msgs[0] && tx.msgs[0].value : tx.msg && tx.msg.value;
            msgValue = msgValue && convertToCamelCase(msgValue);
            const typeUrl = tx.msgs ? tx.msgs && tx.msgs[0] && tx.msgs[0].typeUrl : tx.msg && tx.msg.typeUrl;

            if (typeUrl === '/liquidstaking.staking.v1beta1.MsgDelegate') {
                msgValue = MsgDelegate.encode(MsgDelegate.fromPartial(msgValue)).finish();
            } else if (typeUrl === '/liquidstaking.staking.v1beta1.MsgUndelegate') {
                msgValue = MsgUndelegate.encode(MsgUndelegate.fromPartial(msgValue)).finish();
            } else if (typeUrl === '/liquidstaking.staking.v1beta1.MsgBeginRedelegate') {
                msgValue = MsgBeginRedelegate.encode(MsgBeginRedelegate.fromPartial(msgValue)).finish();
            } else if (typeUrl === '/liquidstaking.staking.v1beta1.MsgExemptDelegation') {
                msgValue = MsgWithdrawDelegatorReward.encode(MsgWithdrawDelegatorReward.fromPartial(msgValue)).finish();
            } else if (typeUrl === '/cosmos.gov.v1beta1.MsgVote') {
                msgValue = MsgVote.encode(MsgVote.fromPartial(msgValue)).finish();
            }

            let bodyBytes = {
                messages: [{
                    typeUrl: typeUrl,
                    value: msgValue,
                }],
                memo: tx.memo,
            };

            bodyBytes = TxBody.encode(TxBody.fromPartial(bodyBytes)).finish();

            const signDoc = makeSignDoc(
                bodyBytes,
                authInfo,
                config.CHAIN_ID,
                account && account.accountNumber,
            );

            offlineSigner.signDirect(address, signDoc).then((result) => {
                const txRaw = TxRaw.fromPartial({
                    bodyBytes: result.signed.bodyBytes,
                    authInfoBytes: result.signed.authInfoBytes,
                    signatures: [fromBase64(result.signature.signature)],
                });
                const txBytes = TxRaw.encode(txRaw).finish();
                if (result && result.code !== undefined && result.code !== 0) {
                    cb(result.log || result.rawLog);
                } else {
                    cb(null, toBase64(txBytes));
                }
            }).catch((error) => {
                cb(error && error.message);
            });
        } catch (e) {
            cb(e && e.message);
        }
    })();
};

export const txSignAndBroadCast = (data, cb) => {
    const url = config.REST_URL + '/cosmos/tx/v1beta1/txs';
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            if (res.data && res.data.tx_response && (res.data.tx_response.code !== undefined) && (res.data.tx_response.code !== 0)) {
                cb(res.data.tx_response.log || res.data.tx_response.raw_log);
            } else {
                cb(null, res.data && res.data.tx_response);
            }
        })
        .catch((error) => {
            cb(error && error.message);
        });
};
