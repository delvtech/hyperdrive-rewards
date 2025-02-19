import "dotenv/config";
import { FixedNumber, ZeroAddress } from "ethers";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { getHyperdriveConfig } from "src/appConfig/getHyperdriveConfig";
import { HyperdriveConfig } from "src/appConfig/types";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { PoolReward } from "src/entity/PoolReward";
import { Trade, TradeInterface } from "src/entity/Trade";
import { UserReward, UserRewardInterface } from "src/entity/UserReward";
import {
    getAssetType,
    getMaturityTime,
    isRewardsAssetType,
} from "src/helpers/assets";
import { getHyperdriveBalance } from "src/helpers/balance";
import { getBlockTimestamp } from "src/helpers/block";
import { ONE } from "src/helpers/constants";
import { getRewardTokenForPool } from "src/pools/all";
import { AppDataSource as dataSource } from "src/server/dataSource";
import { Address, createPublicClient, http, parseEther } from "viem";
import { mainnet } from "viem/chains";

interface UserSumForEpoch {
    userAddress: Address;
    hyperdriveAddress: Address;
    LP: bigint;
    Short: bigint;
    epoch: bigint;
    startBlock: bigint;
    endBlock: bigint;
    tokenAddress: Address;
}

interface TradesGroupedByAssetId {
    assetId: string;
    trades: {
        blockTime: number;
        blockNumber: number;
        balanceAtBlock: string;
    }[];
}

export async function getSumsForUser(
    userAddress: Address,
    hyperdrivePool: HyperdriveConfig,
    tokenAddress: Address,
    epoch: bigint,
    startBlock: bigint,
    endBlock: bigint,
    tradesGroupedByAssetId: TradesGroupedByAssetId[],
): Promise<UserSumForEpoch> {
    const { address: hyperdriveAddress } = hyperdrivePool;
    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    // Filter out longs and withdrawal shares since we only reward LPs and shorts.
    const rewardsTrades = tradesGroupedByAssetId.filter(({ assetId }) =>
        isRewardsAssetType(getAssetType(assetId)),
    );

    // Start keeping track of user's sum for the epoch.
    const userSumForEpoch: UserSumForEpoch = {
        LP: 0n,
        Short: 0n,
        userAddress,
        hyperdriveAddress,
        epoch,
        tokenAddress,
        startBlock,
        endBlock,
    };

    // Go trade by trade and start added time-weighted balances.
    const promises: Promise<void>[] = rewardsTrades.map(
        async ({ assetId, trades }) => {
            const assetType = getAssetType(assetId);
            const maturityTime = getMaturityTime(assetId);
            const epochDuration = endBlock - startBlock;

            // First, filter the trades so that they are within the epoch.
            const tradesWithinEpoch = trades.filter(({ blockNumber }) => {
                return blockNumber >= startBlock && blockNumber <= endBlock;
            });

            // Get the balances and block times at the epoch edges.
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
            const startBlockTimePromise = getBlockTimestamp(client, startBlock);
            const endBlockTimePromise = getBlockTimestamp(client, endBlock);
            const [startBalance, endBalance, startBlockTime, endBlockTime] =
                await Promise.all([
                    startBalancePromise,
                    endBalancePromise,
                    startBlockTimePromise,
                    endBlockTimePromise,
                ]);

            // Add to the LP time-weighted balance.
            // LP is the easy case because there is no maturity date.
            if (assetType === "LP") {
                // If there are no trades in the epoch, then we can just
                // return the balance at the startBlock * epochDuration
                if (tradesWithinEpoch.length == 0) {
                    // The balances should match if there are no events
                    // in the epoch.
                    if (startBalance !== endBalance) {
                        throw new Error(
                            "fetchRewardsForUser: LP balances don't match for epoch",
                        );
                    }
                    userSumForEpoch.LP += startBalance * epochDuration;
                    // Otherwise, we'll iterate over the trades and add
                    // up the time-weighted balances.
                } else {
                    // Because we are time-weighting, we need to know
                    // balances at the exact start and end of the epoch.
                    const startBlockTrade = {
                        blockNumber: startBlock,
                        balanceAtBlock: startBalance.toString(),
                    };
                    const endBlockTrade = {
                        blockNumber: endBlock,
                        balanceAtBlock: endBalance.toString(),
                    };
                    const paddedEpochTrades = [
                        startBlockTrade,
                        ...tradesWithinEpoch,
                        endBlockTrade,
                    ];
                    // Iterate over the trades and add up the time-weighted
                    // balances. Note that we don't iterate over the
                    // endBlockTrade.
                    for (let i = 0; i < paddedEpochTrades.length - 1; i++) {
                        const start = paddedEpochTrades[i];
                        const end = paddedEpochTrades[i + 1];
                        const balance = BigInt(start.balanceAtBlock);
                        const duration =
                            BigInt(end.blockNumber) - BigInt(start.blockNumber);
                        userSumForEpoch.LP += balance * duration;
                    }
                }
            }

            // Add to the short time-weighted balance.
            if (assetType === "Short") {
                // If there are no trades in the epoch, then we can just return the balance at the startBlock * epochDuration
                if (tradesWithinEpoch.length == 0) {
                    if (startBalance !== endBalance) {
                        // The balances should match if there are no events in the epoch.
                        throw new Error(
                            "fetchRewardsForUser: LP balances don't match for epoch",
                        );
                    }
                    userSumForEpoch.Short += startBalance * epochDuration;
                } else {
                    const startBlockTrade = {
                        blockNumber: startBlock,
                        blockTime: startBlockTime,
                        balanceAtBlock: startBalance.toString(),
                    };
                    const endBlockTrade = {
                        blockNumber: endBlock,
                        blockTime: endBlockTime,
                        balanceAtBlock: endBalance.toString(),
                    };

                    const paddedEpochTrades = [
                        startBlockTrade,
                        ...tradesWithinEpoch,
                        endBlockTrade,
                    ];

                    for (let i = 0; i < paddedEpochTrades.length - 1; i++) {
                        const start = paddedEpochTrades[i];
                        const end = paddedEpochTrades[i + 1];
                        const duration =
                            BigInt(end.blockNumber) - BigInt(start.blockNumber);
                        // Pro-rate if we pass the maturity time between the
                        // trade blocks:
                        // pratedBalace = balance * duration * (maturity - start)
                        //                                   / (end - start))
                        if (
                            end.blockTime > maturityTime &&
                            start.blockTime < maturityTime
                        ) {
                            // scale up and covnert to fixed point to do precise
                            // math.
                            const endBlockTime = FixedNumber.fromValue(
                                (ONE * BigInt(end.blockTime)).toString(),
                                18,
                            );
                            const startBlockTime = FixedNumber.fromValue(
                                (ONE * BigInt(start.blockTime)).toString(),
                                18,
                            );
                            const maturityTimeFN = FixedNumber.fromValue(
                                (ONE * maturityTime).toString(),
                                18,
                            );
                            const durationFN = FixedNumber.fromValue(
                                (ONE * duration).toString(),
                                18,
                            );

                            // (maturity - start) / (start - end)
                            const proratedTime = maturityTimeFN
                                .sub(startBlockTime)
                                .div(endBlockTime.sub(startBlockTime));

                            // duration * proration
                            const proratedDuration =
                                durationFN.mul(proratedTime);

                            // balance * proratedDuration
                            const proratedBalance = proratedDuration.mul(
                                FixedNumber.fromValue(start.balanceAtBlock, 18),
                            );

                            // Add to the short sum.
                            userSumForEpoch.Short += BigInt(
                                proratedBalance.toString(),
                            );
                        }
                        // Don't count mature shorts, LPs get those.
                        else if (start.blockTime >= maturityTime) {
                            console.log("token mature", maturityTime, assetId);
                            break;
                        }
                        // If we aren't mature yet, apply the balance to the
                        // whole duration.
                        else {
                            const balance = BigInt(start.balanceAtBlock);
                            userSumForEpoch.Short += balance * duration;
                        }
                    }
                }
            }

            if (assetType !== "LP" && assetType !== "Short") {
                console.log("Unknown asset type", assetType, hyperdriveAddress);
            }
            // Once all the trades has resolved for a perticular epoch,
            // we return the result.
            return;
        },
    );

    // Wait for all the pools to finish.
    await Promise.all(promises);
    return userSumForEpoch;
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

export async function querySumsForPool(
    hyperdrivePool: HyperdriveConfig,
    tokenAddress: Address,
    rewardAmount: bigint,
    epoch: bigint,
    startBlock: bigint,
    endBlock: bigint,
): Promise<PoolSum> {
    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });
    const { address: hyperdriveAddress } = hyperdrivePool;

    const poolInfos = await dataSource
        .getRepository(PoolInfoAtBlock)
        .createQueryBuilder("pool_info_at_block")
        .where("pool_info_at_block.hyperdriveAddress = :hyperdriveAddress", {
            hyperdriveAddress,
        })
        .orderBy("pool_info_at_block.blockNumber")
        .getMany();

    const poolInfosInEpoch = poolInfos.filter(
        ({ blockNumber }) => blockNumber > startBlock && blockNumber < endBlock,
    );
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
        rewardAmount,
    };

    for (let i = 1; i < paddedPoolInfos.length; i++) {
        const { shareReserves, shortsOutstanding } = paddedPoolInfos[i - 1];
        const duration =
            BigInt(paddedPoolInfos[i].blockNumber) -
            BigInt(paddedPoolInfos[i - 1].blockNumber);
        poolSum.LP +=
            (BigInt(shareReserves) + -BigInt(shortsOutstanding)) * duration;
        poolSum.Short += BigInt(shortsOutstanding) * duration;
    }

    return poolSum;
}

export function getRewardsForUserNew(
    userSum: UserSumForEpoch,
    totalUserSum: UserSumForEpoch,
    poolSum: PoolSum,
    amount: bigint,
): { claimableAmount: bigint; userAddress: Address } {
    const { userAddress } = userSum;
    // Convert values to fixed point for precise math.
    const poolLP = FixedNumber.fromValue(poolSum.LP, 18);
    const poolShort = FixedNumber.fromValue(poolSum.Short, 18);
    const rewardAmount = FixedNumber.fromValue(amount, 18);

    // Get the total LP and short rewards.
    const totalPool = poolLP.add(poolShort);

    // Get the user's LP rewards.
    const poolLpRewards = poolLP.div(totalPool).mul(rewardAmount);
    const userLP = FixedNumber.fromValue(userSum.LP, 18);
    const totalUserLP = FixedNumber.fromValue(totalUserSum.LP, 18);
    const userLPRewards = userLP.div(totalUserLP).mul(poolLpRewards);

    const poolShortRewards = poolShort.div(totalPool).mul(rewardAmount);
    const userShort = FixedNumber.fromValue(userSum.Short, 18);
    const totalUserShort = FixedNumber.fromValue(totalUserSum.Short, 18);
    // If there are no shorts in the pool, return zero here.
    const userShortRewards = poolShort.isZero()
        ? FixedNumber.fromValue(0, 18)
        : userShort.div(totalUserShort).mul(poolShortRewards);

    const claimableAmount = parseEther(
        userLPRewards.add(userShortRewards).toString(),
    );

    return { claimableAmount, userAddress };
}

export async function queryUserPoolRewardsForEpoch(
    hyperdriveAddress: Address,
    rewardTokenAddress: Address,
    epoch: number,
    amount: bigint,
    startBlock: number,
    endBlock: number,
): Promise<{ claimableAmount: bigint; userAddress: Address }[]> {
    // get all users traded in the pool.
    const repository = await dataSource.getRepository(Trade);
    const users: { trader: Address }[] = await repository
        .createQueryBuilder("trades")
        .select("DISTINCT trader", "trader")
        .where("trades.hyperdriveAddress = :hyperdriveAddress", {
            hyperdriveAddress,
        })
        .getRawMany();

    // get epochRewards for each user.
    const userEpochRewards: UserRewardInterface[] = await dataSource
        .getRepository(UserReward)
        .createQueryBuilder("user_reward")
        .where("user_reward.epoch = :epoch", { epoch })
        .andWhere("user_reward.rewardTokenAddress = :rewardTokenAddress", {
            rewardTokenAddress,
        })
        .getRawMany();

    // group by user for faster search.
    const epochRewardsByUser: Record<Address, UserReward> = {};

    // if all users have results, then just use those.
    const done = users.every(({ trader }) => epochRewardsByUser[trader]);
    if (done) {
        return userEpochRewards.map(({ userAddress, amount }) => {
            return { claimableAmount: BigInt(amount), userAddress };
        });
    }

    // otherwise
    // call sum functions to get userSum, totalSum, poolSum
    const totalUserSum: UserSumForEpoch = {
        LP: 0n,
        Short: 0n,
        userAddress: ZeroAddress as Address,
        hyperdriveAddress: ZeroAddress as Address,
        epoch: BigInt(epoch),
        startBlock: BigInt(startBlock),
        endBlock: BigInt(endBlock),
        tokenAddress: rewardTokenAddress,
    };

    const userSums = await Promise.all(
        users.map(async ({ trader }) => {
            const tradesGroupedByAssetId: {
                assetId: string;
                trades: TradeInterface[];
            }[] = await dataSource.getRepository(Trade).query(
                `
                SELECT
                    "assetId",
                    json_agg("trades" ORDER BY "blockNumber" ASC) AS trades
                FROM
                    "trades"
                WHERE
                    "hyperdriveAddress" = $1
                    AND "trader" = $2
                GROUP BY
                    "assetId";
                `,
                [hyperdriveAddress, trader],
            );

            const userSum = await getSumsForUser(
                trader,
                getHyperdriveConfig(hyperdriveAddress),
                rewardTokenAddress,
                BigInt(epoch),
                BigInt(startBlock),
                BigInt(endBlock),
                tradesGroupedByAssetId,
            );

            totalUserSum.LP += userSum.LP;
            totalUserSum.Short += userSum.Short;

            return userSum;
        }),
    );

    const poolSum = await querySumsForPool(
        getHyperdriveConfig(hyperdriveAddress),
        rewardTokenAddress,
        amount,
        BigInt(epoch),
        BigInt(startBlock),
        BigInt(endBlock),
    );

    // Get the claimableAmount for the epoch for each user.
    const rewards = userSums.map((userSum) =>
        getRewardsForUserNew(userSum, totalUserSum, poolSum, amount),
    );
    let userTotal = 0n;
    rewards.forEach((reward) => {
        userTotal += reward.claimableAmount;
    });

    // Log the results in the database.
    const userRewards: UserReward[] = [];
    rewards.forEach(({ userAddress, claimableAmount }) => {
        // Don't try to insert if we already have a result.
        // if (epochRewardsByUser[userAddress]) {
        //     return;
        // }

        const userReward = new UserReward();
        userReward.epoch = epoch;
        userReward.hyperdriveAddress = hyperdriveAddress;
        userReward.rewardTokenAddress = rewardTokenAddress;
        userReward.userAddress = userAddress;
        userReward.amount = claimableAmount.toString();
        userReward.startBlock = startBlock;
        userReward.endBlock = endBlock;
        userRewards.push(userReward);
    });

    await dataSource
        .createQueryBuilder()
        .insert()
        .into(UserReward)
        .values(userRewards)
        .orIgnore() // This will ignore duplicates
        .execute();

    // Return claimableAmounts for each user
    return rewards;
}

interface PoolRewardsForAllEpochs {
    amount: bigint;
    userAmount: bigint;
    difference: bigint;
    hyperdriveAddress: Address;
    epoch: number;
    startBlock: number;
    endBlock: number;
    rewardTokenAddress: `0x${string}`;
    rewards: { claimableAmount: bigint; userAddress: Address }[];
}

export async function queryPoolRewardsForAllEpochs(
    hyperdriveAddress: Address,
    rewardTokenAddress: Address,
): Promise<PoolRewardsForAllEpochs[]> {
    // get epochs for pool
    const poolRewards = await queryPoolRewardsByPoolAndToken(
        hyperdriveAddress,
        rewardTokenAddress,
    );

    // get epoch rewards for all users
    const poolRewardsForAllEpochs: PoolRewardsForAllEpochs[] =
        await Promise.all(
            poolRewards.map(
                async ({
                    epoch,
                    startBlock,
                    endBlock,
                    rewardTokenAddress,
                    amount,
                }) => {
                    const rewards = await queryUserPoolRewardsForEpoch(
                        hyperdriveAddress,
                        rewardTokenAddress,
                        epoch,
                        BigInt(amount),
                        startBlock,
                        endBlock,
                    );

                    let userAmount = 0n;
                    rewards.forEach(
                        ({ claimableAmount }) =>
                            (userAmount += claimableAmount),
                    );

                    return {
                        amount: BigInt(amount),
                        userAmount,
                        difference: BigInt(amount) - userAmount,
                        hyperdriveAddress,
                        epoch,
                        startBlock,
                        endBlock,
                        rewardTokenAddress,
                        rewards,
                    };
                },
            ),
        );

    return poolRewardsForAllEpochs;
}

export async function queryAllPoolsRewardsForAllEpochs(): Promise<
    { hyperdriveAddress: Address; rewards: PoolRewardsForAllEpochs[] }[]
> {
    // get all pools
    const pools: { hyperdriveAddress: Address }[] = await dataSource
        .getRepository(PoolInfoAtBlock)
        .createQueryBuilder("pool_info_at_block")
        .select('DISTINCT "hyperdriveAddress"', "hyperdriveAddress")
        .getRawMany();
    console.log("pools", pools);

    // get reward token for each pool
    const poolsWithTokens = pools.map(({ hyperdriveAddress }) => {
        return {
            hyperdriveAddress,
            rewardTokenAddress: getRewardTokenForPool(hyperdriveAddress),
        };
    });

    // loop queryPoolRewardsForAllEpochs
    const promises = poolsWithTokens.map(
        async ({ hyperdriveAddress, rewardTokenAddress }) => {
            const rewards = await queryPoolRewardsForAllEpochs(
                hyperdriveAddress,
                rewardTokenAddress,
            );
            return {
                hyperdriveAddress,
                rewards,
            };
        },
    );

    // wait for results
    const results = await Promise.all(promises);

    return results;
}

export async function queryPoolRewardsByPoolAndToken(
    hyperdriveAddress: Address,
    rewardTokenAddress: Address,
): Promise<PoolReward[]> {
    const repository = await dataSource.getRepository(PoolReward);
    const poolRewards: PoolReward[] = await repository
        .createQueryBuilder("pool_reward")
        .where("pool_reward.hyperdriveAddress = :hyperdriveAddress", {
            hyperdriveAddress,
        })
        .andWhere("pool_reward.rewardTokenAddress = :rewardTokenAddress", {
            rewardTokenAddress,
        })
        .orderBy("pool_reward.epoch", "ASC")
        .getMany();

    return poolRewards;
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
