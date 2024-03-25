import BigNumber from "bignumber.js";
import { BinaryWriter, BinaryReader } from "@dao-xyz/borsh";
export declare const BigNumberSerializer: {
    serialize: (value: BigNumber, writer: BinaryWriter) => void;
    deserialize: (reader: BinaryReader) => BigNumber;
};
