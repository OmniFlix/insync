import { BridgeType } from "../../../types/src";
declare const ethereum: {
    id: "ethereum";
    alias: string;
    bech32Prefix: string;
    bip44: {
        coinType: number;
    };
    bridgeType: BridgeType.Ethereum[];
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
export default ethereum;
