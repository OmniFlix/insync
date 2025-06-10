import * as Comlink from "comlink";
import {
  Worker as ShieldedSyncWorkerApi,
} from "./ShieldedSyncWorker";
import { SdkEvents } from '@namada/sdk/web';

let runningShieldedSync;

export const workerShieldedSync = async ({
  rpcUrl,
  maspIndexerUrl,
  token,
  viewingKeys,
  chainId,
  onProgress,
}) => {
    if (runningShieldedSync) {
        await runningShieldedSync;
    }

    const executeSync = async () => {
        const worker = new Worker(new URL('./ShieldedSyncWorker.js', import.meta.url), { type: 'module' });
        worker.onmessage = ({ data }) => {
            if (!onProgress) {
                return;
            }
            if (
                data.type === SdkEvents.ProgressBarIncremented &&
                data.name === 'namada_sdk::progress_bar::fetched'
            ) {
                if (onProgress) {
                const { current, total } = data;
                const perc =
                    total === 0 ? 0 : Math.max(0, Math.min(1, current / total));
                onProgress(perc);
                }
            }
            if (
                data.type === SdkEvents.ProgressBarFinished &&
                data.name === 'namada_sdk::progress_bar::fetched'
            ) {
                onProgress(1);
            }
        };
        try {
            const workerLink = Comlink.wrap(worker);
            await workerLink.init({
                type: "init",
                payload: { rpcUrl, maspIndexerUrl, token },
            });
            await workerLink.sync({
                type: "sync",
                payload: { vks: viewingKeys, chainId },
            });
        } finally {
        worker.terminate();
        }
    };

    runningShieldedSync = executeSync();
    return runningShieldedSync;
};
