import { TokenInfo } from "./types";
export declare const Symbols: readonly ["NAM", "BTC", "DOT", "ETH", "SCH", "APF", "KAR"];
export type TokenType = (typeof Symbols)[number];
export declare const Tokens: Record<TokenType, TokenInfo>;
