"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlip44Info = void 0;
const slip44_1 = require("slip44");
const getSlip44Info = (symbol) => {
    const registeredCoinType = slip44_1.registeredCoinTypes.find(([, , someSymbol]) => someSymbol === symbol);
    if (!registeredCoinType) {
        throw new Error(`no registered coin type found for ${symbol}`);
    }
    const [coinType, derivationPathComponent, , name] = registeredCoinType;
    return {
        type: coinType,
        path: derivationPathComponent,
        symbol,
        coin: name,
    };
};
exports.getSlip44Info = getSlip44Info;
//# sourceMappingURL=utils.js.map