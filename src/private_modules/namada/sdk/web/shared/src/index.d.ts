import { Proposal, Proposals } from "./borsh-schemas";
import { Query as RustQuery } from "./shared/shared";
export * from "./shared/shared";
export * from "./types";
export declare class Query extends RustQuery {
    query_balance: (owner: string, tokens: any[]) => Promise<any>;
    query_epoch: () => Promise<bigint>;
    query_all_validator_addresses: () => Promise<any>;
    query_my_validators: (owner_addresses: any[]) => Promise<any>;
    query_total_bonds: (address: string) => Promise<any>;
    delegators_votes: (proposal_id: bigint) => Promise<any>;
    get_total_delegations: (addresses: any[], epoch?: bigint | undefined) => Promise<any>;
}
export * from "./types";
export { Proposal, Proposals };
