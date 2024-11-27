"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types/src");
const types_2 = require("../types");
const DEFAULT_ALIAS = "Goerli Testnet";
const DEFAULT_CHAIN_ID = "0x5";
const DEFAULT_RPC = "https://eth-goerli.g.alchemy.com/v2/";
const { NAMADA_INTERFACE_PROXY: isProxied, NAMADA_INTERFACE_ETH_ALIAS: alias = DEFAULT_ALIAS, NAMADA_INTERFACE_ETH_CHAIN_ID: chainId = DEFAULT_CHAIN_ID, NAMADA_INTERFACE_ETH_URL: rpc = DEFAULT_RPC, } = process.env;
const ethereum = {
    id: "ethereum",
    alias,
    bech32Prefix: "eth",
    bip44: {
        coinType: 1,
    },
    bridgeType: [types_1.BridgeType.Ethereum],
    rpc: isProxied ? types_2.ProxyMappings["ethereum"] : rpc,
    chainId,
    currency: {
        token: "Ethereum",
        symbol: "ETH",
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
    },
    extension: types_1.Extensions["metamask"],
};
exports.default = ethereum;
//# sourceMappingURL=ethereum.js.map