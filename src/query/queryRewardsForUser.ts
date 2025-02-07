import "dotenv/config";
import { FixedNumber } from "ethers";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { mainnetAppConfig } from "src/appConfig/mainnet";
import { HyperdriveConfig } from "src/appConfig/types";
import { PoolInfoAtBlockInterface } from "src/entity/PoolInfoAtBlock";
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
} from "viem";
import { mainnet } from "viem/chains";
import {
    getAssetType,
    getMaturityTime,
    isRewardsAssetType,
} from "../helpers/assets";

export async function queryRewardsForUser(
    userAddress: Address,
): Promise<Reward[]> {
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
    // TODO: get totalLP portion for epoch. This can be obtained by summing the time weighted average of (shareReserves - shortsOutstanding) / share_reserves at each trade event during the epoch.
    // TODO: get totalShort portion for epoch.  This can be obtained by summing the time weighted average of the shortsOutstanding / shareReserves at each trade event.  Lp portion is the remaining percent for that time period.
    // NOTE: totalLP portion + totalShort portion == 100%

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    const userTrades = await getNestedTradesByTrader(userAddress);

    const promises = userTrades.map(
        async ({ hyperdriveAddress, tradesForAsset }) => {
            // Start keeping track of the sums.
            const userSums = {
                LP: 0n,
                Short: 0n,
                hyperdriveAddress,
            };

            // First get the metadata for the pool.
            const poolConfig = mainnetAppConfig.hyperdrives.find(
                ({ address }) => address === hyperdriveAddress,
            ) as HyperdriveConfig;

            if (!poolConfig) {
                throw new Error("fetchRewardsEpoch: Invalid hyperdriveAddress");
            }

            const { startBlock, endBlock } = await fetchRewardsEpoch(
                poolConfig,
                client,
            );
            const epochDuration = endBlock - startBlock;

            const rewardsTrades = tradesForAsset.filter(({ assetId }) =>
                isRewardsAssetType(getAssetType(assetId)),
            );
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
                        .map(({ balanceAtBlock, blockNumber, blockTime }) => {
                            return { balanceAtBlock, blockNumber, blockTime };
                        });

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
                            userSums.LP += startBalance * epochDuration;
                        } else {
                            const startBlockTrade = {
                                blockNumber: Number(startBlock),
                                balanceAtBlock: startBalance.toString(),
                                blockTime: Number(startBlockTime),
                            };
                            const endBlockTrade = {
                                blockNumber: Number(endBlock),
                                balanceAtBlock: endBalance.toString(),
                                blockTime: Number(endBlockTime),
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
                                const balance = BigInt(start.balanceAtBlock);
                                const duration = BigInt(
                                    end.blockNumber - start.blockNumber,
                                );
                                userSums.LP += balance * duration;
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
                            userSums.Short += startBalance * epochDuration;
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
                                const balance = BigInt(start.balanceAtBlock);
                                const duration = BigInt(
                                    end.blockNumber - start.blockNumber,
                                );
                                userSums.Short += balance * duration;
                            }
                        }
                    }
                },
            );
            await Promise.all(tradePromises);
            return {
                LP: userSums.LP.toString(),
                Short: userSums.Short.toString(),
                hyperdriveAddress,
            };
        },
    );
    const userSums = await Promise.all(promises);

    const poolInfosByHyperdriveAddress: {
        hyperdriveAddress: Address;
        poolInfos: PoolInfoAtBlockInterface[];
    }[] = await dataSource.query(`
        SELECT
        "hyperdriveAddress",
        json_agg(pool_info_at_block ORDER BY "blockNumber" ASC) AS "poolInfos"
        FROM
        pool_info_at_block
        GROUP BY
        "hyperdriveAddress";
        `);

    const poolSums: Record<Address, { LP: bigint; Short: bigint }> = {};
    const poolSumsPromises = poolInfosByHyperdriveAddress.map(
        async ({ hyperdriveAddress, poolInfos }) => {
            const poolConfig = mainnetAppConfig.hyperdrives.find(
                ({ address }) => address === hyperdriveAddress,
            )! as HyperdriveConfig;

            const { startBlock, endBlock } = await fetchRewardsEpoch(
                poolConfig,
                client,
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

            const poolInfosInEpoch = poolInfos.filter(
                ({ blockNumber }) =>
                    blockNumber > startBlock && blockNumber < endBlock,
            );
            const paddedPoolInfos = [
                { ...startPoolInfo, blockNumber: startBlock },
                ...poolInfosInEpoch,
                { ...endPoolInfo, blockNumber: endBlock },
            ];
            const poolSum: {
                hyperdriveAddress: Address;
                LP: bigint;
                Short: bigint;
            } = {
                hyperdriveAddress,
                LP: 0n,
                Short: 0n,
            };
            for (let i = 1; i < paddedPoolInfos.length; i++) {
                const { shareReserves, shortsOutstanding } =
                    paddedPoolInfos[i - 1];
                const duration =
                    BigInt(paddedPoolInfos[i].blockNumber) -
                    BigInt(paddedPoolInfos[i - 1].blockNumber);
                poolSum.LP +=
                    (BigInt(shareReserves) - BigInt(shortsOutstanding)) *
                    duration;
                poolSum.Short += BigInt(shortsOutstanding) * duration;
            }
            poolSums[hyperdriveAddress] = poolSum;
        },
    );
    await Promise.all(poolSumsPromises);

    const rewardsByTokenAddress: Record<Address, bigint> = {};
    userSums.forEach(({ LP, Short, hyperdriveAddress }) => {
        // TODO: get rewardAmount from database.
        const rewardAmount = FixedNumber.fromValue(parseEther("100"), 18);
        const rewardTokenAddress = process.env.REWARDS_TOKEN as Address;

        const poolSum = poolSums[hyperdriveAddress];
        const poolLP = FixedNumber.fromValue(BigInt(poolSum.LP), 18);
        const poolShort = FixedNumber.fromValue(BigInt(poolSum.Short), 18);
        const totalPool = poolLP.add(poolShort);
        const poolLpRewards = poolLP.div(totalPool).mul(rewardAmount);
        const poolShortRewards = poolShort.div(totalPool).mul(rewardAmount);

        const userLP = FixedNumber.fromValue(BigInt(LP), 18);
        const userShort = FixedNumber.fromValue(BigInt(Short), 18);
        const userLPRewards = userLP.div(poolLP).mul(poolLpRewards);
        const userShortRewards = poolSum.Short!!
            ? userShort.div(poolShort).mul(poolShortRewards)
            : FixedNumber.fromValue(0, 18);

        const claimableAmount = parseEther(
            userLPRewards.add(userShortRewards).toString(),
        );

        const previousValue = rewardsByTokenAddress[rewardTokenAddress];
        if (!previousValue) {
            rewardsByTokenAddress[rewardTokenAddress] = BigInt(claimableAmount);
        } else {
            rewardsByTokenAddress[rewardTokenAddress] +=
                BigInt(claimableAmount);
        }
    });

    const rewards: Reward[] = Object.entries(rewardsByTokenAddress).map(
        ([rewardTokenAddress, claimableAmount]) => {
            return {
                chainId: mainnet.id,
                claimContractAddress: process.env.REWARDS_CONTRACT as Address,
                claimableAmount: FixedNumber.fromValue(
                    claimableAmount,
                    18,
                ).toString(),
                pendingAmount: "0",
                rewardTokenAddress: rewardTokenAddress as Address,
                merkleProof: null,
                merkleProofLastUpdated: 0,
            };
        },
    );

    return rewards;
}

interface NestedTrades {
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
async function getNestedTradesByTrader(
    traderAddress: string,
): Promise<NestedTrades[]> {
    const result = await dataSource.query(
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
    );
    return result;
}

// TOOD: we'll start recording epochs somewhere and then we'll retrieve the last one.
async function fetchRewardsEpoch(
    hyperdrivePool: HyperdriveConfig,
    client: PublicClient,
): Promise<{ startBlock: bigint; endBlock: bigint }> {
    const startBlock = hyperdrivePool.initializationBlock;
    const endBlock = await client.getBlockNumber();

    return { startBlock, endBlock };
}
