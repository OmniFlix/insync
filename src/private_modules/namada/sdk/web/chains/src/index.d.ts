export declare const chains: {
    cosmos: {
        id: "cosmos";
        alias: string;
        bech32Prefix: string;
        bip44: {
            coinType: number;
        };
        bridgeType: import("../../types/src").BridgeType.IBC[];
        rpc: string;
        chainId: string;
        currency: {
            token: string;
            symbol: string;
            gasPriceStep: {
                low: number;
                average: number;
                high: number;
            };
        };
        extension: {
            alias: string;
            id: "keplr";
            url: string;
        };
        ibc: {
            portId: string;
        };
    };
    namada: {
        id: "namada";
        alias: string;
        bech32Prefix: string;
        bip44: {
            coinType: number;
        };
        bridgeType: import("../../types/src").BridgeType[];
        rpc: string;
        chainId: string;
        currency: {
            token: string;
            symbol: string;
            gasPriceStep: {
                low: number;
                average: number;
                high: number;
            };
        };
        extension: {
            alias: string;
            id: "namada";
            url: string;
        };
        ibc: {
            portId: string;
        };
    };
    ethereum: {
        id: "ethereum";
        alias: string;
        bech32Prefix: string;
        bip44: {
            coinType: number;
        };
        bridgeType: import("../../types/src").BridgeType.Ethereum[];
        rpc: string;
        chainId: string;
        currency: {
            token: string;
            symbol: string;
            gasPriceStep: {
                low: number;
                average: number;
                high: number;
            };
        };
        extension: {
            alias: string;
            id: "metamask";
            url: string;
        };
    };
};
export * from "./types";
