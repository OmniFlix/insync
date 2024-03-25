import BigNumber from "bignumber.js";
import { SubmitBondProps } from "../types";
export declare class SubmitBondMsgValue {
    source: string;
    validator: string;
    amount: BigNumber;
    nativeToken: string;
    constructor(data: SubmitBondProps);
}
