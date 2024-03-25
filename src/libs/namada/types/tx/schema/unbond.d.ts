import BigNumber from "bignumber.js";
import { SubmitUnbondProps } from "../types";
export declare class SubmitUnbondMsgValue {
    source: string;
    validator: string;
    amount: BigNumber;
    constructor(data: SubmitUnbondProps);
}
