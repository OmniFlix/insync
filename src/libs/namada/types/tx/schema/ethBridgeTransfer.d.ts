import BigNumber from "bignumber.js";
import { BridgeTransferProps } from "../types";
export declare class EthBridgeTransferMsgValue {
    nut: boolean;
    asset: string;
    recipient: string;
    sender: string;
    amount: BigNumber;
    feeAmount: BigNumber;
    feePayer?: string;
    feeToken: string;
    constructor(data: BridgeTransferProps);
}
