import * as fs from "fs";
import { Address } from "viem";

export interface MerkleReward {
    user: Address;
    chainId: number;
    claimContract: Address;
    claimableAmount: string;
    rewardToken: Address;
    proof: string[];
    merkleProofLastUpdated: 1739889469;
}

export interface MerkleData {
    rewards: MerkleReward[];
}
export function getMerkleData() {
    const merkleData: MerkleData = JSON.parse(
        fs.readFileSync("data/ethereum_test_out.json", "utf-8"),
    );
    return merkleData;
}
