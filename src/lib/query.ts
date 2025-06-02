import { Sdk } from "@namada/sdk/dist/web/sdk/src";
import {
  Account,
  TxMsgValue,
  TxProps,
  WrapperTxProps,
} from "@harish551/namada-types";
import { ChainSettings, GasConfig } from "types";

export type TransactionPair<T> = {
  encodedTxData: EncodedTxData<T>;
  signedTxs: Uint8Array[];
};

export type EncodedTxData<T> = {
  type: string;
  txs: TxProps[] &
    {
      innerTxHashes: string[];
    }[];
  wrapperTxProps: WrapperTxProps;
  meta?: {
    props: T[];
  };
};

export type TransactionNotification = {
  success?: { title: string; text: string };
  error?: { title: string; text: string };
};

export type PreparedTransaction<T> = {
  encodedTx: WrapperTxProps;
  signedTx: Uint8Array;
  meta: T;
};

export const revealPublicKeyType = "revealPublicKey";

const getTxProps = (
  account: Account,
  gasConfig: GasConfig,
  chain: ChainSettings,
  memo?: string
): WrapperTxProps => {
  return {
    token: gasConfig.gasToken,
    feeAmount: gasConfig.gasPriceInMinDenom,
    gasLimit: gasConfig.gasLimit,
    chainId: chain.chainId,
    publicKey: account.publicKey!,
    memo,
  };
};

/**
 * Builds an batch  transactions based on the provided query properties.
 * Each transaction is built through the provided transaction function `txFn`.
 * @param {T[]} queryProps - An array of properties used to build transactions.
 * @param {(WrapperTxProps, T) => Promise<TxMsgValue>} txFn - Function to build each transaction.
 */
export const buildTx = async <T>(
  sdk: Sdk,
  account: Account,
  gasConfig: GasConfig,
  chain: ChainSettings,
  queryProps: T[],
  txFn: (wrapperTxProps: WrapperTxProps, props: T) => Promise<TxMsgValue>,
  memo?: string,
): Promise<EncodedTxData<T>> => {
  const wrapperTxProps = getTxProps(account, gasConfig, chain, memo);

  const encodedTxs = await Promise.all(
    queryProps.map((props) => txFn.apply(sdk.tx, [wrapperTxProps, props]))
  );

  return {
    type: "batch",
    txs: encodedTxs.map((tx) => ({
      ...tx,
      innerTxHashes: [], // You may want to populate this appropriately
    })),
    wrapperTxProps,
    meta: {
      props: queryProps,
    },
  };
};
