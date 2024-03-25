import BigNumber from "bignumber.js";
import { TransferProps } from "../types";
export declare class TransferMsgValue {
    source: string;
    target: string;
    token: string;
    amount: BigNumber;
    nativeToken: string;
    constructor(data: TransferProps);
}
