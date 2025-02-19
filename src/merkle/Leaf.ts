import { Address } from "viem";

export interface Leaf {
    claimable: bigint;
    user: Address;
    token: Address;
}
