import { getSdk, SdkEvents } from '@namada/sdk/web';
import init from '@namada/sdk/web-init';
import * as Comlink from "comlink";

export class Worker {
  sdk;

  async init(m) {
    const { cryptoMemory } = await init();
    this.sdk = newSdk(cryptoMemory, m.payload);

    // TODO: this can be reduced to one event listener
    addEventListener(SdkEvents.ProgressBarStarted, (e) => {
      const event = e;
      const payload = JSON.parse(event.detail);
      postMessage({ ...payload, type: SdkEvents.ProgressBarStarted });
    });

    addEventListener(SdkEvents.ProgressBarIncremented, (e) => {
      const event = e;
      const payload = JSON.parse(event.detail);
      postMessage({ ...payload, type: SdkEvents.ProgressBarIncremented });
    });

    addEventListener(SdkEvents.ProgressBarFinished, (e) => {
      const event = e;
      const payload = JSON.parse(event.detail);
      postMessage({ ...payload, type: SdkEvents.ProgressBarFinished });
    });

    return { type: "init-done", payload: null };
  }

  async sync(m) {
    if (!this.sdk) {
      throw new Error("SDK is not initialized");
    }

    await shieldedSync(this.sdk, m.payload);
    return { type: "sync-done", payload: null };
  }
}

function newSdk(
  cryptoMemory,
  payload
) {
  const { rpcUrl, token, maspIndexerUrl } = payload;
  return getSdk(cryptoMemory, rpcUrl, maspIndexerUrl, "", token);
}

async function shieldedSync(sdk, payload) {
  await sdk.rpc.shieldedSync(payload.vks, payload.chainId);
}

Comlink.expose(new Worker());
