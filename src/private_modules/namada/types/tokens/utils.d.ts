import { TokenInfo } from "./types";
type Slip44Info = Pick<TokenInfo, "type" | "path" | "symbol" | "coin">;
export declare const getSlip44Info: (symbol: string) => Slip44Info;
export {};
