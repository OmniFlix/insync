"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extensions = exports.BridgeType = void 0;
var BridgeType;
(function (BridgeType) {
    BridgeType["IBC"] = "ibc";
    BridgeType["Ethereum"] = "ethereum-bridge";
})(BridgeType || (exports.BridgeType = BridgeType = {}));
// Define constant with extension properties
exports.Extensions = {
    namada: {
        alias: "Namada",
        id: "namada",
        // TODO: Update to most recent release
        url: "https://namada.me",
    },
    keplr: {
        alias: "Keplr",
        id: "keplr",
        url: "https://www.keplr.app/",
    },
    metamask: {
        alias: "Metamask",
        id: "metamask",
        url: "https://metamask.io/",
    },
};
//# sourceMappingURL=chain.js.map