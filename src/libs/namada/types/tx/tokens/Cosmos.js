import { registeredCoinTypes } from "slip44";
// Tokens in Cosmos ecosystem
export var CosmosSymbols = ["ATOM", "OSMO"];
var CosmosTokenDenoms = [
    ["uatom", "ATOM"],
    ["uosmo", "OSMO"],
];
var tokenDenomLookup = function (param) {
    return CosmosTokenDenoms.find(function (tokenDenom) {
        return tokenDenom.includes(param);
    });
};
export var tokenByMinDenom = function (minDenom) {
    var tokenDenom = tokenDenomLookup(minDenom);
    return tokenDenom ? tokenDenom[1] : "";
};
export var minDenomByToken = function (token) {
    var tokenDenom = tokenDenomLookup(token);
    return tokenDenom ? tokenDenom[0] : "";
};
var supportedCoinTypes = registeredCoinTypes.filter(function (_a) {
    var symbol = _a[2];
    return CosmosSymbols.includes("".concat(symbol));
});
export var CosmosTokens = supportedCoinTypes.reduce(function (tokens, coinType) {
    var type = coinType[0], path = coinType[1], _a = coinType[2], symbol = _a === void 0 ? "" : _a, coin = coinType[3], _b = coinType[4], url = _b === void 0 ? "" : _b;
    tokens["".concat(symbol)] = {
        address: "",
        type: type,
        path: path,
        symbol: symbol,
        coin: coin,
        url: url,
    };
    return tokens;
}, {});
CosmosTokens["ATOM"].coinGeckoId = "cosmos";
// NOTE: Osmosis does not have a SLIP-044 entry:
CosmosTokens["OSMO"] = {
    symbol: "OSMO",
    type: 0,
    path: 0,
    coin: "Osmo",
    url: "https://osmosis.zone/",
    address: "",
    coinGeckoId: "osmosis",
};
