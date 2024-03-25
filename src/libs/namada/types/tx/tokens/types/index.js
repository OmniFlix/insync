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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { registeredCoinTypes } from "slip44";
var _a = process.env.NAMADA_INTERFACE_NAMADA_TOKEN, nativeToken = _a === void 0 ? "tnam1q8ctk7tr337f85dw69q0rsrggasxjjf5jq2s2wph" : _a;
// Declare symbols for tokens we support:
// TODO: This will need to be refactored for mainnet!
export var Symbols = [
    "NAM",
    "BTC",
    "DOT",
    "ETH",
    "SCH",
    "APF",
    "KAR",
];
var supportedCoinTypes = __spreadArray([], registeredCoinTypes.filter(function (_a) {
    var symbol = _a[2];
    return Symbols.indexOf("".concat(symbol)) > -1;
}), true);
export var Tokens = supportedCoinTypes.reduce(function (tokens, coinType) {
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
// Map a few test addresses for now:
Tokens["NAM"] = __assign(__assign({}, Tokens["NAM"]), { url: "https://namada.net", address: nativeToken, symbol: "Naan" });
Tokens["DOT"] = __assign(__assign({}, Tokens["DOT"]), { address: "tnam1qyfl072lhaazfj05m7ydz8cr57zdygk375jxjfwx", coinGeckoId: "polkadot" });
Tokens["ETH"] = __assign(__assign({}, Tokens["ETH"]), { address: "tnam1qxvnvm2t9xpceu8rup0n6espxyj2ke36yv4dw6q5", coinGeckoId: "ethereum" });
Tokens["BTC"] = __assign(__assign({}, Tokens["BTC"]), { address: "tnam1qy8qgxlcteehlk70sn8wx2pdlavtayp38vvrnkhq", coinGeckoId: "bitcoin" });
Tokens["SCH"] = __assign(__assign({}, Tokens["SCH"]), { coin: "Schnitzel", symbol: "SCH", address: "tnam1q9f5yynt5qfxe28ae78xxp7wcgj50fn4syetyrj6" });
Tokens["APF"] = __assign(__assign({}, Tokens["APF"]), { coin: "Apfel", symbol: "APF", address: "tnam1qyvfwdkz8zgs9n3qn9xhp8scyf8crrxwuq26r6gy" });
Tokens["KAR"] = __assign(__assign({}, Tokens["KAR"]), { coin: "Kartoffel", symbol: "KAR", address: "tnam1qyx93z5ma43jjmvl0xhwz4rzn05t697f3vfv8yuj" });
