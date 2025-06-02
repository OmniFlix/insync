import * as Comlink from "comlink";
import {
  registerTransferHandlers as maspTxRegisterTransferHandlers,
  Worker as MaspTxWorkerApi,
} from "./MaspTxWroker";

export const workerBuildTxPair = async ({
  rpcUrl,
  token,
  buildTxFn,
}) => {
    maspTxRegisterTransferHandlers();
    const worker = new Worker(new URL('./MaspTxWroker.js', import.meta.url), { type: 'module' });
    const workerLink = Comlink.wrap(worker);
    await workerLink.init({
        type: "init",
        payload: { rpcUrl, token, maspIndexerUrl: "" },
    });
    const encodedTxData = await buildTxFn(workerLink);
    worker.terminate();
    return encodedTxData;
};
