import { TokenInfo } from "./types";
export declare const CosmosSymbols: readonly ["ATOM", "OSMO"];
export type CosmosTokenType = (typeof CosmosSymbols)[number];
declare const cosmosMinDenoms: readonly ["uatom", "uosmo"];
export type CosmosMinDenom = (typeof cosmosMinDenoms)[number];
export declare const CosmosTokens: Record<CosmosTokenType, TokenInfo<CosmosMinDenom>>;
export declare const tokenByMinDenom: (minDenom: string) => CosmosTokenType | undefined;
export declare const minDenomByToken: (token: string) => CosmosMinDenom | undefined;
export {};
