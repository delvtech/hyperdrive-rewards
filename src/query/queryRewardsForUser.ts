import "dotenv/config";
import { FixedNumber } from "ethers";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { getHyperdriveConfig } from "src/appConfig/getHyperdriveConfig";
import { HyperdriveConfig } from "src/appConfig/types";
import { PoolInfoAtBlockInterface } from "src/entity/PoolInfoAtBlock";
import {
    getAssetType,
    getMaturityTime,
    isRewardsAssetType,
} from "src/helpers/assets";
import { getHyperdriveBalance } from "src/helpers/balance";
import { getBlockTimestamp } from "src/helpers/block";
import { AppDataSource as dataSource } from "src/server/dataSource";
import { Reward } from "src/server/routers/rewards";
import {
    Address,
    PublicClient,
    createPublicClient,
    http,
    parseEther,
    parseUnits,
} from "viem";
import { mainnet } from "viem/chains";

interface UserSumForEpoch {
    hyperdriveAddress: Address;
    LP: bigint;
    Short: bigint;
    epoch: bigint;
    startBlock: bigint;
    endBlock: bigint;
    tokenAddress: Address;
}

interface PoolSum {
    hyperdriveAddress: Address;
    tokenAddress: Address;
    LP: bigint;
    Short: bigint;
    epoch: bigint;
    startBlock: bigint;
    endBlock: bigint;
    rewardAmount: bigint;
}

type SumTotalsForPools = Record<
    Address,
    {
        totalLP: bigint;
        totalShort: bigint;
        poolLP: bigint;
        poolShort: bigint;
    }
>;
export async function queryRewardsForUser(
    userAddress: Address,
    hyperdriveAddress: Address | null = null,
    startBlock: bigint | null = null,
    endBlock: bigint | null = null,
): Promise<{ rewards: Reward[]; sumTotalsForPools: SumTotalsForPools }> {
    // NOTE: If try to use initializationBlock for startBlock and latest for endBlock,
    //       and just add to the total sum, then earlier users will get more rewards than they should.
    //       for example: We claim 100 tokens at block 10 to the merkle contract and give everyone their total percentage.
    //                    Then we claim 100 tokens again, so the total amount is 200 at block 20.
    //                    If user1 had 10 shorts from block 1 - 10 and user2 had 10 shorts from block 11 -20, then they
    //                    should both get 100 tokens at block 20.  However, user1 is going to get rewarded the full 100
    //                    tokens from the first epoch, and then be awarded 50% of the 100 tokens from the second epoch
    //                    if we don't separate the epochs, so user1 eats some of user2's lunch.  So really we need to look
    //                    at each epoch separately.
    // TODO: add a table for claimedRewards for each pool.  Should have token, poolAddress, amount, blockNumber, type (token or points)

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    // Get all the trades for the user.
    const allUserTrades = await getTradesForEachAssetInEachPool(userAddress);

    const poolConfigs = allUserTrades.map(({ hyperdriveAddress }) =>
        getHyperdriveConfig(hyperdriveAddress),
    );

    // Now we neet to get the all the periods that rewards were claimed
    // for a pool.  We'll figure out the user's share of rewards for
    // each epoch period.
    const rewardsByPool = await queryRewardsEpochsForPools(poolConfigs, client);

    // // Get the unique hyperdrive addresses the user has traded with.
    // const hyperdriveAddresses = new Set<Address>();
    // allUserTrades.forEach(({ hyperdriveAddress }) => {
    //     hyperdriveAddresses.add(hyperdriveAddress);
    // });

    // Go pool by pool and get all the trades for the user.
    const userSumsForAllEpochsAndPools: Promise<{
        hyperdriveAddress: Address;
        userSumsForAllEpochs: Promise<UserSumForEpoch>[];
    }>[] = allUserTrades.map(async ({ hyperdriveAddress, tradesForAsset }) => {
        // First get the metadata for the pool.
        const poolConfig = getHyperdriveConfig(hyperdriveAddress);

        // TODO: use this to not duplicate reward info for a user in an
        // epoch if we already have it.
        const userTotalsForEpochs = await queryRewardsEpochsForUser(
            [poolConfig],
            userAddress,
            client,
        );

        // Now grab the epochs for the pool we're looking at.
        const poolRewardsForEachEpoch = rewardsByPool[hyperdriveAddress];

        const userSumsForAllEpochs = poolRewardsForEachEpoch.map(
            async ({ startBlock, endBlock, epoch, tokenAddress, amount }) => {
                const epochDuration = endBlock - startBlock;

                // Start keeping track of user's sum for the epoch.
                const userSumForEpoch: UserSumForEpoch = {
                    LP: 0n,
                    Short: 0n,
                    hyperdriveAddress,
                    epoch,
                    tokenAddress,
                    startBlock,
                    endBlock,
                };

                const rewardsTrades = tradesForAsset.filter(({ assetId }) =>
                    isRewardsAssetType(getAssetType(assetId)),
                );

                // Now loop over the actual trades for the epoch, summing
                // the LP and Short totals.
                const tradePromises = rewardsTrades.map(
                    async ({ assetId, trades }) => {
                        const assetType = getAssetType(assetId);
                        const maturityTime = getMaturityTime(assetId);

                        const startBalancePromise = getHyperdriveBalance(
                            client,
                            hyperdriveAddress,
                            startBlock,
                            assetId,
                            userAddress,
                        );
                        const endBalancePromise = getHyperdriveBalance(
                            client,
                            hyperdriveAddress,
                            endBlock,
                            assetId,
                            userAddress,
                        );
                        const startBlockTimePromise = getBlockTimestamp(
                            client,
                            startBlock,
                        );
                        const endBlockTimePromise = getBlockTimestamp(
                            client,
                            endBlock,
                        );

                        const [
                            startBalance,
                            endBalance,
                            startBlockTime,
                            endBlockTime,
                        ] = await Promise.all([
                            startBalancePromise,
                            endBalancePromise,
                            startBlockTimePromise,
                            endBlockTimePromise,
                        ]);

                        const epochTrades = trades
                            .filter(({ blockNumber }) => {
                                return (
                                    blockNumber >= startBlock &&
                                    blockNumber <= endBlock
                                );
                            })
                            .map(
                                ({
                                    balanceAtBlock,
                                    blockNumber,
                                    blockTime,
                                }) => {
                                    return {
                                        balanceAtBlock,
                                        blockNumber,
                                        blockTime,
                                    };
                                },
                            );

                        // LP is the easy case because there is no maturity date.
                        if (assetType === "LP") {
                            // If there are no trades in the epoch, then we can just return the balance at the startBlock * epochDuration
                            if (epochTrades.length == 0) {
                                if (startBalance !== endBalance) {
                                    // The balances should match if there are no events in the epoch.
                                    throw new Error(
                                        "fetchRewardsForUser: LP balances don't match for epoch",
                                    );
                                }
                                userSumForEpoch.LP +=
                                    startBalance * epochDuration;
                            } else {
                                const startBlockTrade = {
                                    blockNumber: Number(startBlock),
                                    balanceAtBlock: startBalance.toString(),
                                };
                                const endBlockTrade = {
                                    blockNumber: Number(endBlock),
                                    balanceAtBlock: endBalance.toString(),
                                };
                                const paddedEpochTrades = [
                                    startBlockTrade,
                                    ...epochTrades,
                                    endBlockTrade,
                                ];
                                for (
                                    let i = 0;
                                    i < paddedEpochTrades.length - 1;
                                    i++
                                ) {
                                    const start = paddedEpochTrades[i];
                                    const end = paddedEpochTrades[i + 1];
                                    const balance = BigInt(
                                        start.balanceAtBlock,
                                    );
                                    const duration = BigInt(
                                        end.blockNumber - start.blockNumber,
                                    );
                                    userSumForEpoch.LP += balance * duration;
                                }
                            }
                        }

                        // LP is the easy case because there is no maturity date.
                        if (assetType === "Short") {
                            // If there are no trades in the epoch, then we can just return the balance at the startBlock * epochDuration
                            if (epochTrades.length == 0) {
                                if (startBalance !== endBalance) {
                                    // The balances should match if there are no events in the epoch.
                                    throw new Error(
                                        "fetchRewardsForUser: LP balances don't match for epoch",
                                    );
                                }
                                userSumForEpoch.Short +=
                                    startBalance * epochDuration;
                            } else {
                                const startBlockTrade = {
                                    blockNumber: Number(startBlock),
                                    blockTime: Number(startBlockTime),
                                    balanceAtBlock: startBalance.toString(),
                                };
                                const endBlockTrade = {
                                    blockNumber: Number(endBlock),
                                    blockTime: Number(endBlockTime),
                                    balanceAtBlock: endBalance.toString(),
                                };

                                const paddedEpochTrades = [
                                    startBlockTrade,
                                    ...epochTrades,
                                    endBlockTrade,
                                ];
                                for (
                                    let i = 0;
                                    i < paddedEpochTrades.length - 1;
                                    i++
                                ) {
                                    const start = paddedEpochTrades[i];
                                    const end = paddedEpochTrades[i + 1];
                                    // Don't count mature shorts for rewards, LPs get those.
                                    if (start.blockTime >= maturityTime) {
                                        console.log(
                                            "token mature",
                                            maturityTime,
                                            assetId,
                                        );
                                        break;
                                    }
                                    const balance = BigInt(
                                        start.balanceAtBlock,
                                    );
                                    const duration = BigInt(
                                        end.blockNumber - start.blockNumber,
                                    );
                                    userSumForEpoch.Short += balance * duration;
                                }
                            }
                        }

                        if (assetType !== "LP" && assetType !== "Short") {
                            console.log(
                                "Unknown asset type",
                                assetType,
                                hyperdriveAddress,
                            );
                        }
                    },
                ); // rewardsTrades
                // Once all the trades has resolved for a perticular epoch,
                // we return the result.
                await Promise.all(tradePromises);
                return userSumForEpoch;
            },
        ); // poolRewardsForEachEpoch
        // Once all the epochs have finished for a particular pool, we returrn the result.
        // await Promise.all(userSumsForAllEpochs);
        return { hyperdriveAddress, userSumsForAllEpochs };
    }); // userTrades

    // Wait for all the pools to finish.
    let userSumPromises = await Promise.all(userSumsForAllEpochsAndPools);
    const userSumsForAllEpochs = await Promise.all(
        userSumPromises.map(({ userSumsForAllEpochs }) => {
            return Promise.all(userSumsForAllEpochs);
        }),
    );
    const userSums = userSumPromises.map(({ hyperdriveAddress }, index) => {
        return {
            hyperdriveAddress,
            userSumsForAllEpochs: userSumsForAllEpochs[index],
        };
    });

    // Now that we have the user's sum for each epoch in each pool, we need to
    // get the total sum for each pool.  Then we can figure out each user's
    // share of the rewards.

    // First we get the poolInfos, grouped by pool address.
    const poolAddressesUserHasTradedOn = allUserTrades.map(
        ({ hyperdriveAddress }) => hyperdriveAddress,
    );
    let poolInfosByHyperdriveAddress: {
        hyperdriveAddress: Address;
        poolInfos: PoolInfoAtBlockInterface[];
    }[] = await dataSource.query(
        `
        SELECT
        "hyperdriveAddress",
        json_agg(pool_info_at_block ORDER BY "blockNumber" ASC) AS "poolInfos"
        FROM
        pool_info_at_block
        GROUP BY
        "hyperdriveAddress";
        `,
    );
    poolInfosByHyperdriveAddress = poolInfosByHyperdriveAddress.filter(
        ({ hyperdriveAddress }) =>
            poolAddressesUserHasTradedOn.includes(hyperdriveAddress),
    );

    // Now we'll go address by address and get the total sum for each epoch.
    const poolSumsPromises = poolInfosByHyperdriveAddress.map(
        // Loop over pools.
        async ({ hyperdriveAddress, poolInfos }) => {
            const rewardsByEpoch = rewardsByPool[hyperdriveAddress];

            // Go epoch by epoch
            const poolSumsByEpoch = rewardsByEpoch.map(
                async ({
                    epoch,
                    startBlock,
                    endBlock,
                    tokenAddress,
                    amount,
                }) => {
                    const startPoolInfo = await client.readContract({
                        address: hyperdriveAddress,
                        abi: hyperdriveReadAbi,
                        functionName: "getPoolInfo",
                        blockNumber: startBlock,
                    });

                    const endPoolInfo = await client.readContract({
                        address: hyperdriveAddress,
                        abi: hyperdriveReadAbi,
                        functionName: "getPoolInfo",
                        blockNumber: startBlock,
                    });

                    const poolInfosInEpoch = poolInfos.filter(
                        ({ blockNumber }) =>
                            blockNumber > startBlock && blockNumber < endBlock,
                    );
                    const paddedPoolInfos = [
                        { ...startPoolInfo, blockNumber: startBlock },
                        ...poolInfosInEpoch,
                        { ...endPoolInfo, blockNumber: endBlock },
                    ];
                    const poolSum: PoolSum = {
                        hyperdriveAddress,
                        tokenAddress,
                        LP: 0n,
                        Short: 0n,
                        epoch,
                        startBlock,
                        endBlock,
                        rewardAmount: BigInt(amount),
                    };
                    for (let i = 1; i < paddedPoolInfos.length; i++) {
                        const { shareReserves, shortsOutstanding } =
                            paddedPoolInfos[i - 1];
                        const duration =
                            BigInt(paddedPoolInfos[i].blockNumber) -
                            BigInt(paddedPoolInfos[i - 1].blockNumber);
                        poolSum.LP +=
                            (BigInt(shareReserves) +
                                -BigInt(shortsOutstanding)) *
                            duration;
                        poolSum.Short += BigInt(shortsOutstanding) * duration;
                    }
                    return poolSum;
                },
            ); // poolSumsByEpoch
            await Promise.all(poolSumsByEpoch);
            return {
                hyperdriveAddress,
                poolSumsByEpoch,
            };
        },
    );

    // Wait for promises and get the pool sums grouped by pool address.
    const poolSums = await Promise.all(poolSumsPromises);
    const allPoolSumsByEpoch = await Promise.all(
        poolSums.map(({ poolSumsByEpoch }) => {
            return Promise.all(poolSumsByEpoch);
        }),
    );
    const poolSumsByAddress: Record<Address, PoolSum[]> = {};
    poolSums.forEach(({ hyperdriveAddress }, index) => {
        poolSumsByAddress[hyperdriveAddress] = allPoolSumsByEpoch[index];
    });

    // Start saving rewards by token address.
    const rewardsByTokenAddress: Record<Address, bigint> = {};

    // DEBUG
    const sumTotalsForPools: Record<
        Address,
        {
            totalLP: bigint;
            totalShort: bigint;
            poolLP: bigint;
            poolShort: bigint;
        }
    > = {};

    userSums.forEach(({ userSumsForAllEpochs, hyperdriveAddress }) => {
        const { decimals } = getHyperdriveConfig(hyperdriveAddress);
        sumTotalsForPools[hyperdriveAddress] = {
            totalLP: 0n,
            totalShort: 0n,
            poolLP: 0n,
            poolShort: 0n,
        };

        userSumsForAllEpochs.forEach(({ LP, Short }, index) => {
            const poolSumForEpoch = poolSumsByAddress[hyperdriveAddress].find(
                ({ epoch }) => epoch === userSumsForAllEpochs[index].epoch,
            )!;
            const { rewardAmount: rewardAmountBigInt, tokenAddress } =
                poolSumForEpoch;
            const rewardAmount = FixedNumber.fromValue(rewardAmountBigInt, 18);

            // DEBUG
            sumTotalsForPools[hyperdriveAddress].poolLP = BigInt(
                poolSumForEpoch.LP,
            );
            sumTotalsForPools[hyperdriveAddress].poolShort = BigInt(
                poolSumForEpoch.Short,
            );
            sumTotalsForPools[hyperdriveAddress].totalLP += BigInt(LP);
            sumTotalsForPools[hyperdriveAddress].totalShort += BigInt(Short);

            const poolLP = FixedNumber.fromValue(
                BigInt(poolSumForEpoch.LP),
                18,
            );
            const poolShort = FixedNumber.fromValue(
                BigInt(poolSumForEpoch.Short),
                18,
            );

            const totalPool = poolLP.add(poolShort);
            const poolLpRewards = poolLP.div(totalPool).mul(rewardAmount);
            const poolShortRewards = poolShort.div(totalPool).mul(rewardAmount);

            const userLP = FixedNumber.fromValue(BigInt(LP), 18);
            const userShort = FixedNumber.fromValue(BigInt(Short), 18);
            const userLPRewards = userLP.div(poolLP).mul(poolLpRewards);
            // If there are no shorts in the pool, return zero here.
            const userShortRewards = poolShort.isZero()
                ? FixedNumber.fromValue(0, 18)
                : userShort.div(poolShort).mul(poolShortRewards);

            const claimableAmount = parseEther(
                userLPRewards.add(userShortRewards).toString(),
            );

            const previousValue = rewardsByTokenAddress[tokenAddress];
            if (!previousValue) {
                rewardsByTokenAddress[tokenAddress] = BigInt(claimableAmount);
            } else {
                rewardsByTokenAddress[tokenAddress] += BigInt(claimableAmount);
            }
        });
    });

    const rewards: Reward[] = Object.entries(rewardsByTokenAddress).map(
        ([rewardTokenAddress, claimableAmount]) => {
            return {
                chainId: mainnet.id,
                claimContractAddress: process.env.REWARDS_CONTRACT as Address,
                claimableAmount: claimableAmount.toString(),
                pendingAmount: "0",
                rewardTokenAddress: rewardTokenAddress as Address,
                merkleProof: null,
                merkleProofLastUpdated: 0,
            };
        },
    );

    return { rewards, sumTotalsForPools };
}

interface TradesForEachAssetInEachPool {
    hyperdriveAddress: Address;
    tradesForAsset: {
        assetId: string;
        trades: {
            blockTime: number;
            blockNumber: number;
            balanceAtBlock: string;
        }[];
    }[];
}

async function getTradesForEachAssetInEachPool(
    traderAddress: string,
): Promise<TradesForEachAssetInEachPool[]> {
    const result = (await dataSource.query(
        `
  WITH asset_trades AS (
    SELECT
      "trades"."hyperdriveAddress",
      "trades"."assetId",
      json_agg("trades" ORDER BY "trades"."blockNumber") AS trades

    FROM "trades"
    WHERE "trades"."trader" = $1
    GROUP BY "trades"."hyperdriveAddress", "trades"."assetId"
  )
  SELECT
    "hyperdriveAddress",
    json_agg(
      json_build_object(
        'assetId', "assetId",
        'trades', "trades"
      )
    ) AS "tradesForAsset"
  FROM asset_trades
  GROUP BY "hyperdriveAddress";
`,
        [traderAddress],
    )) as TradesForEachAssetInEachPool[];
    return result;
    return result.filter(
        ({ hyperdriveAddress }) =>
            hyperdriveAddress !== "0xd41225855A5c5Ba1C672CcF4d72D1822a5686d30",
    );
}

interface PoolReward {
    hyperdriveAddress: Address;
    tokenAddress: Address;
    amount: string;
    epoch: bigint;
    startBlock: bigint;
    endBlock: bigint;
}

// Returns a dictionary of PoolReward[] keyed by hyperdrive address.
async function queryRewardsEpochsForPools(
    hyperdrivePools: HyperdriveConfig[],
    client: PublicClient,
): Promise<Record<string, PoolReward[]>> {
    const endBlock = await client.getBlockNumber();

    const query = `
            SELECT
                "hyperdriveAddress",
                json_agg(
                    "pool_reward" ORDER BY "startBlock" ASC
                ) AS "rewards"
            FROM
                "pool_reward"
            WHERE
                "hyperdriveAddress" IN ($1)
            GROUP BY
                "hyperdriveAddress";
        `;

    const result = await dataSource.query(query, [
        hyperdrivePools.map(({ address }) => address),
    ]);

    const poolRewards: Record<Address, PoolReward[]> = {};

    // result.forEach((row: any) => {
    //     poolRewards[row.hyperdriveAddress] = row.rewards.map((reward: any) => ({
    //         epoch: reward.epoch,
    //         hyperdriveAddress: reward.hyperdriveAddress,
    //         tokenAddress: reward.tokenAddress,
    //         amount: reward.amount,
    //         startBlock: reward.startBlock,
    //         endBlock: reward.endBlock,
    //     }));
    // });

    hyperdrivePools.forEach((pool) => {
        const { decimals } = getHyperdriveConfig(pool.address);
        poolRewards[pool.address] = [
            {
                epoch: 0n,
                hyperdriveAddress: pool.address,
                tokenAddress: process.env.REWARDS_TOKEN as Address,
                amount: parseUnits("100", 18).toString(),
                startBlock: pool.initializationBlock,
                // endBlock,
                endBlock: 21810000n,
            },
        ];
    });

    return poolRewards;
}

interface UserRewardEpoch {
    rewards: UserEpochRewardInfo[];
}

interface UserEpochRewardInfo {
    hyperdriveAddress: Address;
    startBlock: bigint;
    endBlock: bigint;
    epoch: bigint;
    tokenAddress: Address;
    amount: string;
}

async function queryRewardsEpochsForUser(
    hyperdrivePools: HyperdriveConfig[],
    userAddress: Address,
    client: PublicClient,
): Promise<UserRewardEpoch[]> {
    const startBlock = hyperdrivePools[0].initializationBlock;
    const endBlock = await client.getBlockNumber();

    return [
        {
            rewards: [
                {
                    hyperdriveAddress: hyperdrivePools[0].address,
                    tokenAddress: "0x58d97b57bb95320f9a05dc918aef65434969c2b2",
                    amount: parseEther("100").toString(),
                    startBlock,
                    endBlock,
                    epoch: 0n,
                },
            ],
        },
    ];
}

// Hyperdrive Pool
// [ epoch 0 ] - [ epoch 1 ] - [ epoch 2 ] - [ epoch 3 ] - Pending amount
// calculate the total LP and short for each epoch

// User
// [ epoch 0 ] - [ epoch 1 ] - [ epoch 2 ] - [ epoch 3 ] - Pending amount
// calculate the total user LP and short for each epoch in each hyperdrive pool
// compare to the total LP and short for each epoch in each hyperdrive pool
// apply the reward amount per token per epoch per hyperdrive pool and also the pending amount

// An epoch is reward and pool specific.

// i.e.
// Hypderdrive Address 0xUSD/MORPHO which collects Miles and Morpho rewards
// block 0 --------- block 1000 --------- block 2000 --------- block 3000
// epoch for Morpho might be:
// [---------------------][--------------------]
// but the epoch for Well might be:
//  [---------------------][---------------------]
// So they can overlap, even if we try to collect at the same time, they might be off by a couple blocks
