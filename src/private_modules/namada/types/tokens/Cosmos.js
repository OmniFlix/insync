var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getSlip44Info } from "./utils";
// Tokens in Cosmos ecosystem
export var CosmosSymbols = ["ATOM", "OSMO"];
var isCosmosToken = function (str) {
    return CosmosSymbols.includes(str);
};
// Min denoms in Cosmos ecosystem
var cosmosMinDenoms = ["uatom", "uosmo"];
var isCosmosMinDenom = function (str) {
    return cosmosMinDenoms.includes(str);
};
// TODO: As Cosmos tokens are added to our TokenType, map corresponding denom
// from Keplr config. See:
// https://github.com/chainapsis/keplr-wallet/blob/master/packages/extension/src/config.ts
// for all values in Keplr
export var CosmosTokens = {
    ATOM: __assign(__assign({}, getSlip44Info("ATOM")), { address: "", coinGeckoId: "cosmos", minDenom: "uatom", decimals: 6 }),
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
export var tokenByMinDenom = function (minDenom) {
    if (!isCosmosMinDenom(minDenom)) {
        return undefined;
    }
    for (var _i = 0, CosmosSymbols_1 = CosmosSymbols; _i < CosmosSymbols_1.length; _i++) {
        var token = CosmosSymbols_1[_i];
        if (CosmosTokens[token].minDenom === minDenom) {
            return token;
        }
    }
    throw new Error("".concat(minDenom, " is a cosmos min denom but is not in CosmosTokens"));
};
export var minDenomByToken = function (token) {
    return isCosmosToken(token) ? CosmosTokens[token].minDenom : undefined;
};
