import { TokenInfo } from "./types";
export type CosmosMinDenom = "uatom" | "uosmo";
export declare const CosmosSymbols: readonly ["ATOM", "OSMO"];
export type CosmosTokenType = (typeof CosmosSymbols)[number];
type CosmosTokens = Record<CosmosTokenType, TokenInfo>;
export declare const tokenByMinDenom: (minDenom: CosmosMinDenom) => string;
export declare const minDenomByToken: (token: CosmosTokenType) => string;
export declare const CosmosTokens: CosmosTokens;
export {};
