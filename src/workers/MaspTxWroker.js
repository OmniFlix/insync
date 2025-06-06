import { registerBNTransferHandler } from "./utils";
import init from '@namada/sdk/web-init';
import { getSdk, Sdk } from "@namada/sdk/web";
import {
  IbcTransferMsgValue,
  ShieldedTransferMsgValue,
  ShieldingTransferMsgValue,
  TxResponseMsgValue,
  UnshieldingTransferMsgValue,
} from "@harish551/namada-types";
import BigNumber from "bignumber.js";
import * as Comlink from "comlink";
import { buildTx, EncodedTxData } from "../lib/query";
// import { namadaAsset, toDisplayAmount } from "utils";
import {
  Broadcast,
  BroadcastDone,
  GenerateIbcShieldingMemo,
  GenerateIbcShieldingMemoDone,
  IbcTransfer,
  IbcTransferDone,
  Init,
  InitDone,
  Shield,
  ShieldDone,
  ShieldedRewards,
  ShieldedRewardsDone,
  ShieldedRewardsPerToken,
  ShieldedRewardsPerTokenDone,
  ShieldedTransfer,
  ShieldedTransferDone,
  Unshield,
  UnshieldDone,
} from "./MaspTxMessages";

export class Worker {
  sdk;

  async init(m) {
    const { cryptoMemory } = await init();
    this.sdk = newSdk(cryptoMemory, m.payload);
    return { type: "init-done", payload: null };
  }

  async shield(m) {
    if (!this.sdk) {
      throw new Error("SDK is not initialized");
    }
    return {
      type: "shield-done",
      payload: await shield(this.sdk, m.payload),
    };
  }

  async unshield(m) {
    if (!this.sdk) {
      throw new Error("SDK is not initialized");
    }
    return {
      type: "unshield-done",
      payload: await unshield(this.sdk, m.payload),
    };
  }

  async shieldedTransfer(m) {
    if (!this.sdk) {
      throw new Error("SDK is not initialized");
    }
    return {
      type: "shielded-transfer-done",
      payload: await shieldedTransfer(this.sdk, m.payload),
    };
  }

  async generateIbcShieldingMemo(
    m
  ) {
    if (!this.sdk) {
      throw new Error("SDK is not initialized");
    }
    return {
      type: "generate-ibc-shielding-memo-done",
      payload: await generateIbcShieldingMemo(this.sdk, m.payload),
    };
  }

  async ibcTransfer(m) {
    if (!this.sdk) {
      throw new Error("SDK is not initialized");
    }

    return {
      type: "ibc-transfer-done",
      payload: await ibcTransfer(this.sdk, m.payload),
    };
  }

//   async shieldedRewards(m: ShieldedRewards): Promise<ShieldedRewardsDone> {
//     if (!this.sdk) {
//       throw new Error("SDK is not initialized");
//     }

//     return {
//       type: "shielded-rewards-done",
//       payload: await shieldedRewards(this.sdk, m.payload),
//     };
//   }

//   async shieldedRewardsPerToken(
//     m: ShieldedRewardsPerToken
//   ): Promise<ShieldedRewardsPerTokenDone> {
//     if (!this.sdk) {
//       throw new Error("SDK is not initialized");
//     }

//     return {
//       type: "shielded-rewards-per-token-done",
//       payload: await shieldedRewardsPerToken(this.sdk, m.payload),
//     };
//   }

//   async broadcast(m: Broadcast): Promise<BroadcastDone> {
//     if (!this.sdk) {
//       throw new Error("SDK is not initialized");
//     }

//     const res = await broadcast(this.sdk, m.payload);

//     return { type: "broadcast-done", payload: res };
//   }
}

async function ibcTransfer(
  sdk,
  payload
) {
  const { account, gasConfig, chain, props } = payload;

  try {
    await sdk.masp.loadMaspParams('', chain);
  } catch (err) {
    console.error('❌ MASP load error:', err);
    if (err?.message?.includes('IDBDatabase')) {
      // Attempt to clear and reload
      indexedDB.deleteDatabase('Namada::SDK'); // replace with real name
      // Optional: show retry button or auto-reload
    }
  }
  const chainId = { chainId: chain };
  const encodedTxData = await buildTx(
    sdk,
    account,
    gasConfig,
    chainId,
    props,
    sdk.tx.buildIbcTransfer,
    undefined,
    false
  );

  return encodedTxData && encodedTxData.txs && encodedTxData.txs.length && encodedTxData.txs[0];
}

async function shield(
  sdk,
  payload
) {
  const {
    publicKeyRevealed,
    account,
    gasConfig,
    chain,
    props: shieldingProps,
    memo,
  } = payload;

  try {
    await sdk.masp.loadMaspParams('', chain);
  } catch (err) {
    console.error('❌ MASP load error:', err);
    if (err?.message?.includes('IDBDatabase')) {
      // Attempt to clear and reload
      indexedDB.deleteDatabase('Namada::SDK'); // replace with real name
      // Optional: show retry button or auto-reload
    }
  }
  const chainId = { chainId: chain };
  const encodedTxData = await buildTx(
    sdk,
    account,
    gasConfig,
    chainId,
    shieldingProps,
    sdk.tx.buildShieldingTransfer,
    memo,
    !publicKeyRevealed
  );

  return encodedTxData && encodedTxData.txs && encodedTxData.txs.length && encodedTxData.txs[0];
}

async function unshield(
  sdk,
  payload
) {
  const { account, gasConfig, chain, props } = payload;

  try {
    await sdk.masp.loadMaspParams('', chain);
  } catch (err) {
    console.error('❌ MASP load error:', err);
    if (err?.message?.includes('IDBDatabase')) {
      // Attempt to clear and reload
      indexedDB.deleteDatabase('Namada::SDK'); // replace with real name
      // Optional: show retry button or auto-reload
    }
  }
  const chainId = { chainId: chain };
  const encodedTxData = await buildTx(
    sdk,
    account,
    gasConfig,
    chainId,
    props,
    sdk.tx.buildUnshieldingTransfer,
    undefined,
    false
  );

  return encodedTxData && encodedTxData.txs && encodedTxData.txs.length && encodedTxData.txs[0];
}

async function shieldedTransfer(
  sdk,
  payload
) {
  const { account, gasConfig, chain, props } = payload;

  try {
    await sdk.masp.loadMaspParams('', chain);
  } catch (err) {
    console.error('❌ MASP load error:', err);
    if (err?.message?.includes('IDBDatabase')) {
      // Attempt to clear and reload
      indexedDB.deleteDatabase('Namada::SDK'); // replace with real name
      // Optional: show retry button or auto-reload
    }
  }
  const chainId = { chainId: chain };
  const encodedTxData = await buildTx(
    sdk,
    account,
    gasConfig,
    chainId,
    props,
    sdk.tx.buildShieldedTransfer,
    undefined,
    false
  );

  return encodedTxData && encodedTxData.txs && encodedTxData.txs.length && encodedTxData.txs[0];
}

async function generateIbcShieldingMemo(
  sdk,
  payload
) {
  const { target, token, amount, destinationChannelId, chainId } = payload;

  try {
    await sdk.masp.loadMaspParams('', chainId);
  } catch (err) {
    console.error('❌ MASP load error:', err);
    if (err?.message?.includes('IDBDatabase')) {
      // Attempt to clear and reload
      indexedDB.deleteDatabase('Namada::SDK'); // replace with real name
      // Optional: show retry button or auto-reload
    }
  }

  const memo = await sdk.tx.generateIbcShieldingMemo(
    target,
    token,
    amount,
    destinationChannelId
  );

  return memo;
}

function newSdk(
  cryptoMemory,
  payload
) {
  const { rpcUrl, token, maspIndexerUrl } = payload;
  return getSdk(cryptoMemory, rpcUrl, maspIndexerUrl, "", token);
}

export const registerTransferHandlers = () => {
  registerBNTransferHandler("shield-done");
  registerBNTransferHandler("shield");
  registerBNTransferHandler("shielded-transfer-done");
  registerBNTransferHandler("shielded-transfer");
  registerBNTransferHandler("unshield-done");
  registerBNTransferHandler("ibc-transfer");
  registerBNTransferHandler("ibc-transfer-done");
  registerBNTransferHandler("unshield");
  registerBNTransferHandler(
    "generate-ibc-shielding-memo"
  );
//   registerBNTransferHandler<ShieldedRewardsPerToken>(
//     "shielded-rewards-per-token"
//   );
//   registerBNTransferHandler<ShieldedRewardsPerTokenDone>(
//     "shielded-rewards-per-token-done"
//   );
//   registerBNTransferHandler<ShieldedRewards>("shielded-rewards");
//   registerBNTransferHandler<ShieldedRewardsDone>("shielded-rewards-done");
//   registerBNTransferHandler<Broadcast>("broadcast");
};

registerTransferHandlers();
Comlink.expose(new Worker());
