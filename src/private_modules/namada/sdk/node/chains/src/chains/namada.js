"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types/src");
const types_2 = require("../types");
const DEFAULT_ALIAS = "Namada";
const DEFAULT_CHAIN_ID = "public-testnet-15.0dacadb8d663";
const DEFAULT_RPC = "https://proxy.heliax.click/public-testnet-15.0dacadb8d663";
const DEFAULT_BECH32_PREFIX = "tnam";
const { NAMADA_INTERFACE_PROXY: isProxied, NAMADA_INTERFACE_NAMADA_ALIAS: alias = DEFAULT_ALIAS, NAMADA_INTERFACE_NAMADA_CHAIN_ID: chainId = DEFAULT_CHAIN_ID, NAMADA_INTERFACE_NAMADA_URL: rpc = DEFAULT_RPC, NAMADA_INTERFACE_NAMADA_BECH32_PREFIX: bech32Prefix = DEFAULT_BECH32_PREFIX, } = process.env;
const namada = {
    id: "namada",
    alias,
    bech32Prefix,
    bip44: {
        // See Namada coin type at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        coinType: 877,
    },
    bridgeType: [types_1.BridgeType.IBC, types_1.BridgeType.Ethereum],
    rpc: isProxied ? types_2.ProxyMappings["namada"] : rpc,
    chainId,
    currency: {
        token: "Nam",
        symbol: "NAM",
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
    },
    extension: types_1.Extensions["namada"],
    ibc: {
        portId: "transfer",
    },
};
exports.default = namada;
//# sourceMappingURL=namada.js.map