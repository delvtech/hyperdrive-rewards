import { Leaf } from "src/merkle/Leaf";
import { queryAllPoolsRewardsForAllEpochs } from "src/query/queryRewardsForUserNew";
import { Address } from "viem";

export async function generateMerkleLeafs(): Promise<Leaf[]> {
    // call queryAlPoolsRewardsForAllEpochs
    // has rewards for all users in every epoch for every pool.
    const rewardsForAllPoolsEpochs = await queryAllPoolsRewardsForAllEpochs();
    console.log("rewardsForAllPoolsEpochs", rewardsForAllPoolsEpochs);

    // Make an object keyed by user and reward token and sum up the claimableAmounts.
    const leafsByUserByRewardToken: Record<Address, Record<Address, Leaf>> = {};
    const filteredRewardsForAllPoolsEpochs = rewardsForAllPoolsEpochs.filter(
        ({ rewards }) => rewards.length,
    );

    filteredRewardsForAllPoolsEpochs.forEach(
        ({ rewards: rewardsForAllEpochs }) => {
            rewardsForAllEpochs.forEach(
                ({ rewards: rewardsPerEpoch, rewardTokenAddress }) => {
                    rewardsPerEpoch.forEach(
                        ({ claimableAmount, userAddress }) => {
                            if (!leafsByUserByRewardToken[rewardTokenAddress]) {
                                leafsByUserByRewardToken[rewardTokenAddress] =
                                    {};
                            }

                            if (
                                !leafsByUserByRewardToken[rewardTokenAddress]?.[
                                    userAddress
                                ]
                            ) {
                                leafsByUserByRewardToken[userAddress] = {};
                                leafsByUserByRewardToken[userAddress][
                                    rewardTokenAddress
                                ] = {
                                    claimable: claimableAmount,
                                    token: rewardTokenAddress,
                                    user: userAddress,
                                };
                            } else {
                                leafsByUserByRewardToken[rewardTokenAddress][
                                    userAddress
                                ].claimable += claimableAmount;
                            }
                        },
                    );
                },
            );
        },
    );

    const flattenedLeafs: Leaf[] = [];

    for (const userAddress in leafsByUserByRewardToken) {
        for (const rewardTokenAddress in leafsByUserByRewardToken[
            userAddress as Address
        ]) {
            const leaf =
                leafsByUserByRewardToken[userAddress as Address][
                    rewardTokenAddress as Address
                ];
            flattenedLeafs.push(leaf);
        }
    }

    return flattenedLeafs;
}
