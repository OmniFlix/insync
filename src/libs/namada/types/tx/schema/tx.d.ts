import BigNumber from "bignumber.js";
import { TxProps } from "../types";
export declare class TxMsgValue {
    token: string;
    feeAmount: BigNumber;
    gasLimit: BigNumber;
    chainId: string;
    publicKey?: string;
    disposableSigningKey?: boolean;
    feeUnshield?: string;
    memo?: string;
    constructor(data: TxProps);
}
