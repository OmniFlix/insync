import BigNumber from "bignumber.js";
import { IbcTransferProps } from "../types";
export declare class IbcTransferMsgValue {
    source: string;
    receiver: string;
    token: string;
    amountInBaseDenom: BigNumber;
    portId: string;
    channelId: string;
    timeoutHeight?: bigint;
    timeoutSecOffset?: bigint;
    memo?: string;
    shieldingData?: Uint8Array;
    constructor(data: IbcTransferProps);
}
