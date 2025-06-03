import {
  ChainKey,
  ExtensionKey,
} from "@harish551/namada-types";
import BigNumber from "bignumber.js";

export type Address = string;

export type BaseDenom = string;

export type GasLimit = BigNumber;

export type GasPrice = BigNumber;

// For Namada chain, it should be the address. For Ibc, it should be the base denom
export type GasToken = Address | BaseDenom;

export type ChainSettings = {
  id: ChainKey;
  bench32Prefix: string;
  nativeTokenAddress: Address;
  rpcUrl: string;
  chainId: string;
  extensionId: ExtensionKey;
  checksums: Record<string, string>;
};

export type GasConfig = {
  gasLimit: GasLimit;
  gasPriceInMinDenom: GasPrice;
  gasToken: GasToken;
};
