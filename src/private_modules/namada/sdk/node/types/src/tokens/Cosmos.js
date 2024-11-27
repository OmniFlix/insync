"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minDenomByToken = exports.tokenByMinDenom = exports.CosmosTokens = exports.CosmosSymbols = void 0;
const utils_1 = require("./utils");
// Tokens in Cosmos ecosystem
exports.CosmosSymbols = ["ATOM", "OSMO"];
const isCosmosToken = (str) => exports.CosmosSymbols.includes(str);
// Min denoms in Cosmos ecosystem
const cosmosMinDenoms = ["uatom", "uosmo"];
const isCosmosMinDenom = (str) => cosmosMinDenoms.includes(str);
// TODO: As Cosmos tokens are added to our TokenType, map corresponding denom
// from Keplr config. See:
// https://github.com/chainapsis/keplr-wallet/blob/master/packages/extension/src/config.ts
// for all values in Keplr
exports.CosmosTokens = {
    ATOM: Object.assign(Object.assign({}, (0, utils_1.getSlip44Info)("ATOM")), { address: "", coinGeckoId: "cosmos", minDenom: "uatom", decimals: 6 }),
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
const tokenByMinDenom = (minDenom) => {
    if (!isCosmosMinDenom(minDenom)) {
        return undefined;
    }
    for (const token of exports.CosmosSymbols) {
        if (exports.CosmosTokens[token].minDenom === minDenom) {
            return token;
        }
    }
    throw new Error(`${minDenom} is a cosmos min denom but is not in CosmosTokens`);
};
exports.tokenByMinDenom = tokenByMinDenom;
const minDenomByToken = (token) => isCosmosToken(token) ? exports.CosmosTokens[token].minDenom : undefined;
exports.minDenomByToken = minDenomByToken;
//# sourceMappingURL=Cosmos.js.map