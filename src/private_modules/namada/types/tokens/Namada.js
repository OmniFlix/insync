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
export var Tokens = {
    // Map a few test addresses for now:
    NAM: __assign(__assign({}, getSlip44Info("NAM")), { url: "https://namada.net", address: nativeToken, symbol: "Naan", minDenom: "namnam", decimals: 6 }),
    DOT: __assign(__assign({}, getSlip44Info("DOT")), { address: "tnam1qyfl072lhaazfj05m7ydz8cr57zdygk375jxjfwx", coinGeckoId: "polkadot", minDenom: "", decimals: 0 }),
    ETH: __assign(__assign({}, getSlip44Info("ETH")), { address: "tnam1qxvnvm2t9xpceu8rup0n6espxyj2ke36yv4dw6q5", coinGeckoId: "ethereum", minDenom: "", decimals: 0 }),
    BTC: __assign(__assign({}, getSlip44Info("BTC")), { address: "tnam1qy8qgxlcteehlk70sn8wx2pdlavtayp38vvrnkhq", coinGeckoId: "bitcoin", minDenom: "", decimals: 0 }),
    // SCH doesn't have a slip44 entry. Some of these are dummy values.
    SCH: {
        coin: "Schnitzel",
        symbol: "SCH",
        address: "tnam1q9f5yynt5qfxe28ae78xxp7wcgj50fn4syetyrj6",
        minDenom: "",
        decimals: 0,
        path: 0,
        type: 0,
    },
    // APF doesn't have a slip44 entry. Some of these are dummy values.
    APF: {
        coin: "Apfel",
        symbol: "APF",
        address: "tnam1qyvfwdkz8zgs9n3qn9xhp8scyf8crrxwuq26r6gy",
        minDenom: "",
        decimals: 0,
        path: 0,
        type: 0,
    },
    // Kartoffel doesn't have a slip44 entry. Some of these are dummy values.
    // There is a slip44 entry for an unrelated token with the symbol KAR.
    KAR: {
        coin: "Kartoffel",
        symbol: "KAR",
        address: "tnam1qyx93z5ma43jjmvl0xhwz4rzn05t697f3vfv8yuj",
        minDenom: "",
        decimals: 0,
        path: 0,
        type: 0,
    },
};
