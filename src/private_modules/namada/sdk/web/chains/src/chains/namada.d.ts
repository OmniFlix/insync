import { BridgeType } from "../../../types/src";
declare const namada: {
    id: "namada";
    alias: string;
    bech32Prefix: string;
    bip44: {
        coinType: number;
    };
    bridgeType: BridgeType[];
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
export default namada;
