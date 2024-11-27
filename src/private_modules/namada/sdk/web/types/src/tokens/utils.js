import { registeredCoinTypes } from "slip44";
export const getSlip44Info = (symbol) => {
    const registeredCoinType = registeredCoinTypes.find(([, , someSymbol]) => someSymbol === symbol);
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
//# sourceMappingURL=utils.js.map