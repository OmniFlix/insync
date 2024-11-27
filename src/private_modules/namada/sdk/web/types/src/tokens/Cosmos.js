import { getSlip44Info } from "./utils";
// Tokens in Cosmos ecosystem
export const CosmosSymbols = ["ATOM", "OSMO"];
const isCosmosToken = (str) => CosmosSymbols.includes(str);
// Min denoms in Cosmos ecosystem
const cosmosMinDenoms = ["uatom", "uosmo"];
const isCosmosMinDenom = (str) => cosmosMinDenoms.includes(str);
// TODO: As Cosmos tokens are added to our TokenType, map corresponding denom
// from Keplr config. See:
// https://github.com/chainapsis/keplr-wallet/blob/master/packages/extension/src/config.ts
// for all values in Keplr
export const CosmosTokens = {
    ATOM: Object.assign(Object.assign({}, getSlip44Info("ATOM")), { address: "", coinGeckoId: "cosmos", minDenom: "uatom", decimals: 6 }),
    // NOTE: Osmosis does not have a SLIP-044 entry:
    OSMO: {
        symbol: "OSMO",
        type: 0,
        path: 0,
        coin: "Osmo",
        url: "https://osmosis.zone/",
        address: "",
        coinGeckoId: "osmosis",
        minDenom: "uosmo",
        decimals: 6,
    },
};
export const tokenByMinDenom = (minDenom) => {
    if (!isCosmosMinDenom(minDenom)) {
        return undefined;
    }
    for (const token of CosmosSymbols) {
        if (CosmosTokens[token].minDenom === minDenom) {
            return token;
        }
    }
    throw new Error(`${minDenom} is a cosmos min denom but is not in CosmosTokens`);
};
export const minDenomByToken = (token) => isCosmosToken(token) ? CosmosTokens[token].minDenom : undefined;
//# sourceMappingURL=Cosmos.js.map