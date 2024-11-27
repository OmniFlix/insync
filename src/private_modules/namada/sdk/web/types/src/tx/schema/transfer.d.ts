import BigNumber from "bignumber.js";
import { ShieldedTransferDataProps, ShieldedTransferProps, ShieldingTransferDataProps, ShieldingTransferProps, TransparentTransferDataProps, TransparentTransferProps, UnshieldingTransferDataProps, UnshieldingTransferProps } from "../types";
/**
 * Transparent Transfer schemas
 */
export declare class TransparentTransferDataMsgValue {
    source: string;
    target: string;
    token: string;
    amount: BigNumber;
    constructor(data: TransparentTransferDataProps);
}
export declare class TransparentTransferMsgValue {
    data: TransparentTransferDataMsgValue[];
    constructor({ data }: TransparentTransferProps);
}
/**
 * Shielded Transfer schemas
 */
export declare class ShieldedTransferDataMsgValue {
    source: string;
    target: string;
    token: string;
    amount: BigNumber;
    constructor(data: ShieldedTransferDataProps);
}
export declare class ShieldedTransferMsgValue {
    data: ShieldedTransferDataMsgValue[];
    gasSpendingKey?: string;
    constructor({ data, gasSpendingKey }: ShieldedTransferProps);
}
/**
 * Shielding Transfer schemas
 */
export declare class ShieldingTransferDataMsgValue {
    source: string;
    token: string;
    amount: BigNumber;
    constructor(data: ShieldingTransferDataProps);
}
export declare class ShieldingTransferMsgValue {
    target: string;
    data: ShieldingTransferDataMsgValue[];
    constructor({ data, target }: ShieldingTransferProps);
}
/**
 * Unshielding Transfer schemas
 */
export declare class UnshieldingTransferDataMsgValue {
    target: string;
    token: string;
    amount: BigNumber;
    constructor(data: UnshieldingTransferDataProps);
}
export declare class UnshieldingTransferMsgValue {
    source: string;
    data: UnshieldingTransferDataMsgValue[];
    gasSpendingKey?: string[];
    constructor({ source, data, gasSpendingKey }: UnshieldingTransferProps);
}
/**
 * General Transfer schema used for displaying details
 */
export declare class TransferDataMsgValue {
    owner: string;
    token: string;
    amount: BigNumber;
}
export declare class TransferMsgValue {
    sources: TransferDataMsgValue[];
    targets: TransferDataMsgValue[];
    shieldedSectionHash?: Uint8Array;
}
