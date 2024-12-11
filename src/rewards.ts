import { Address, parseEther, zeroAddress } from "viem";
import { base } from "viem/chains";

interface RewardsResponse {
  userAddress: Address;
  rewards: Reward[];
}

export interface Reward {
  chainId: number;
  claimContract: Address;
  claimableAmount: string;
  rewardToken: Address;
  merkleProof: string[] | null;
  merkleProofLastUpdated: number;
}

export function getDummyRewardsResponse(account: Address) {
  const dummyRewardsResponse: RewardsResponse = {
    userAddress: account,
    rewards: [
      {
        // rewards for this user that they can claim
        chainId: base.id,
        claimContract: zeroAddress,
        claimableAmount: parseEther("100").toString(),
        rewardToken: "0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842",
        merkleProof: ["0xProof", "0xProof", "0xProof"],
        merkleProofLastUpdated: 123892327,
      },
      {
        // rewards are accumulating, but the merkle root hasn't been added
        // to the claimContract yet
        chainId: base.id,
        claimContract: zeroAddress,
        claimableAmount: parseEther("0").toString(),
        rewardToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913i",
        merkleProof: null,
        merkleProofLastUpdated: 123892327,
      },
    ],
  };

  return dummyRewardsResponse;
}
