import { Constructor } from "@dao-xyz/borsh";
import { Schema } from "../schema";
export interface IMessage<T extends Schema> {
    encode(value: T): Uint8Array;
    decode(buffer: Uint8Array, parser: Constructor<T>): T;
}
export declare class Message<T extends Schema> implements IMessage<T> {
    encode(value: T): Uint8Array;
    decode(buffer: Uint8Array, parser: Constructor<T>): T;
}
