import { WrapperTxMsgValue } from "./wrapperTx";
export declare class CommitmentMsgValue {
    txType: number;
    hash: string;
    txCodeId: string;
    memo?: string;
    data: Uint8Array;
}
export declare class TxDetailsMsgValue {
    wrapperTx: WrapperTxMsgValue;
    commitments: CommitmentMsgValue[];
}
