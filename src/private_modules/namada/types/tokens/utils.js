import { registeredCoinTypes } from "slip44";
export var getSlip44Info = function (symbol) {
    var registeredCoinType = registeredCoinTypes.find(function (_a) {
        var someSymbol = _a[2];
        return someSymbol === symbol;
    });
    if (!registeredCoinType) {
        throw new Error("no registered coin type found for ".concat(symbol));
    }
    var coinType = registeredCoinType[0], derivationPathComponent = registeredCoinType[1], name = registeredCoinType[3];
    return {
        type: coinType,
        path: derivationPathComponent,
        symbol: symbol,
        coin: name,
    };
};
