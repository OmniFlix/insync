export type TokenInfo = {
    symbol: string;
    type: number;
    path: number;
    coin: string;
    url: string;
    address: string;
    nativeAddress?: string;
    isNut?: boolean;
    coinGeckoId?: string;
};
export declare const Symbols: readonly ["NAM", "BTC", "DOT", "ETH", "SCH", "APF", "KAR"];
export type TokenType = (typeof Symbols)[number];
type Tokens = Record<TokenType, TokenInfo>;
export declare const Tokens: Tokens;
export type TokenBalance = {
    token: TokenType;
    amount: string;
};
export {};
