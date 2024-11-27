import { ChainKey } from "./chain";
export type Bip44Path = {
    account: number;
    change: number;
    index: number;
};
export type Zip32Path = {
    account: number;
    index?: number;
};
export type Path = {
    account: number;
    change?: number;
    index?: number;
};
export declare enum AccountType {
    Mnemonic = "mnemonic",
    PrivateKey = "private-key",
    ShieldedKeys = "shielded-keys",
    Ledger = "ledger"
}
export type DerivedAccount = {
    id: string;
    address: string;
    owner?: string;
    publicKey?: string;
    alias: string;
    parentId?: string;
    path: Path;
    type: AccountType;
};
export type Account = Pick<DerivedAccount, "address" | "alias" | "type" | "publicKey" | "owner"> & {
    chainId: string;
    chainKey: ChainKey;
    isShielded: boolean;
    viewingKey?: string;
};
