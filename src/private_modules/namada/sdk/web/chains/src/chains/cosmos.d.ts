import { BridgeType } from "../../../types/src";
declare const cosmos: {
    id: "cosmos";
    alias: string;
    bech32Prefix: string;
    bip44: {
        coinType: number;
    };
    bridgeType: BridgeType.IBC[];
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
export default cosmos;
