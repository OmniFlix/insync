import BigNumber from "bignumber.js";
import { IbcTransferProps } from "../types";
export declare class IbcTransferMsgValue {
    source: string;
    receiver: string;
    token: string;
    amount: BigNumber;
    portId: string;
    channelId: string;
    timeoutHeight?: bigint;
    timeoutSecOffset?: bigint;
    constructor(data: IbcTransferProps);
}
