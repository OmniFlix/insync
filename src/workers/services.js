import * as Comlink from "comlink";
import {
  registerTransferHandlers as maspTxRegisterTransferHandlers,
  Worker as MaspTxWorkerApi,
} from "./MaspTxWroker";
import { config } from "../config";

export const createMaspWorker = async ({ rpcUrl, token, maspIndexerUrl = "" }) => {
    const worker = new Worker(new URL('./MaspTxWroker.js', import.meta.url), { type: 'module' });
    const workerLink = Comlink.wrap(worker);
    await workerLink.init({
        type: "init",
        payload: { rpcUrl, token, maspIndexerUrl },
    });
    return { worker, workerLink };
};

export const workerBuildTxPair = async ({
  rpcUrl,
  token,
  buildTxFn,
}) => {
    maspTxRegisterTransferHandlers();
    const { worker, workerLink } = await createMaspWorker({ rpcUrl, token });
    const encodedTxData = await buildTxFn(workerLink);
    worker.terminate();
    return encodedTxData;
};

export const fetchShieldedRewards = async (
  viewingKey,
  chainId,
  rpcUrl,
) => {
  maspTxRegisterTransferHandlers();
  const { worker, workerLink } = await createMaspWorker({
      rpcUrl,
      token: config.TOKEN_ADDRESS,
  });

  const { payload: rewards } = await workerLink.shieldedRewards({
    type: "shielded-rewards",
    payload: {
      viewingKey: viewingKey,
      chainId,
    },
  });
  worker.terminate();

  return rewards;
};
