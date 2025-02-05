import {
    HyperdriveConfig,
    mainnetAppConfig,
} from "@delvtech/hyperdrive-appconfig/dist/index.cjs";
import "dotenv/config";
import { FixedNumber } from "ethers";
import {
    Address,
    PublicClient,
    createPublicClient,
    http,
    parseEther,
} from "viem";
import { mainnet } from "viem/chains";
import { ONE } from "../constants";
import { AppDataSource as dataSource } from "../dataSource";
import { PoolInfoAtBlock } from "../entity/PoolInfoAtBlock";
import { Trade } from "../entity/Trade";
import {
    getAssetType,
    getMaturityTime,
    isRewardsAssetType,
} from "../helpers/assets";
import { getHyperdriveBalance } from "../helpers/balance";
import { getBlockTimestamp } from "../helpers/block";
import { Reward } from "../rewards";

interface RawQueryResult {
    p_blockNumber: string; // bigint in DB
    p_shareReserves: string; // numeric parsed as bigint with 18 decimals
    p_lpTotalSupply: string; // numeric parsed as bigint with 18 decimals
    p_vaultSharePrice: string; // numeric parsed as bigint with 18 decimals
    p_shortsOutstanding: string; // numeric parsed as bigint with 18 decimals
    p_lpSharePrice: string; // numeric parsed as bigint with 18 decimals
    t_hyperdriveAddress: string; // character varying in DB
    t_type: string; // character varying in DB
    t_balanceAtBlock: string; // numeric parsed as bigint with 18 decimals
    t_trader: string; // character varying in DB
}
interface QueryResult {
    blockNumber: string; // bigint in DB
    shareReserves: bigint; // numeric parsed as bigint with 18 decimals
    lpTotalSupply: bigint; // numeric parsed as bigint with 18 decimals
    vaultSharePrice: bigint; // numeric parsed as bigint with 18 decimals
    shortsOutstanding: bigint; // numeric parsed as bigint with 18 decimals
    lpSharePrice: bigint; // numeric parsed as bigint with 18 decimals
    hyperdriveAddress: string; // character varying in DB
    tokenType: string; // character varying in DB
    balanceAtBlock: bigint; // numeric parsed as bigint with 18 decimals
    trader: string; // character varying in DB
}

export async function fetchRewardsForUser(address: string) {
    // TODO: get startBlock and endBlock for the range?  We need to get the range to add balances at those times.
    //       startBlock should be the time before last rewards were claimed. (previous epoch's end).
    //       endBlock is last time rewards were claimed (crrent epoch's end)
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

    // TODO: get reward amount for epoch.
    // TODO: get totalLP portion for epoch. This can be obtained by summing the time weighted average of (shareReserves - shortsOutstanding) / share_reserves at each trade event during the epoch.
    // TODO: get totalShort portion for epoch.  This can be obtained by summing the time weighted average of the shortsOutstanding / shareReserves at each trade event.  Lp portion is the remaining percent for that time period.
    // NOTE: totalLP portion + totalShort portion == 100%

    // Get all the hyperdrive addresses where the user has traded.
    const uniqueHyperdriveAddresses: { hyperdriveAddress: Address }[] =
        await dataSource
            .getRepository(Trade)
            .createQueryBuilder("trades")
            .select("DISTINCT trades.hyperdriveAddress", "hyperdriveAddress")
            .where("trades.trader = :trader", {
                trader: address,
            })
            .getRawMany();

    // Combine the trades with the pool info at each block.
    const promises = uniqueHyperdriveAddresses.map(({ hyperdriveAddress }) => {
        return dataSource
            .getRepository(PoolInfoAtBlock)
            .createQueryBuilder("p")
            .innerJoinAndMapMany(
                "p.trades",
                Trade,
                "t",
                "p.blockNumber = t.blockNumber AND t.trader = :trader AND t.hyperdriveAddress = :hyperdriveAddress",
            )
            .where("p.hyperdriveAddress = :hyperdriveAddress", {
                hyperdriveAddress,
            })
            .setParameter("trader", address)
            .setParameter("hyperdriveAddress", hyperdriveAddress)
            .orderBy("p.blockNumber", "ASC")
            .select([
                "p.blockNumber",
                "p.shareReserves",
                "p.lpTotalSupply",
                "p.vaultSharePrice",
                "p.shortsOutstanding",
                "p.lpSharePrice",
                "t.hyperdriveAddress",
                "t.type",
                "t.balanceAtBlock",
                "t.trader",
            ])
            .getRawMany();
    });
    const rawResults: RawQueryResult[][] = (await Promise.all(
        promises,
    )) as unknown as RawQueryResult[][];
    const queryResults: QueryResult[][] = rawResults.map((poolResults) =>
        poolResults.map((result) => {
            const {
                p_blockNumber,
                p_shareReserves,
                p_lpTotalSupply,
                p_vaultSharePrice,
                p_shortsOutstanding,
                p_lpSharePrice,
                t_balanceAtBlock,
                t_type,
                t_trader,
                t_hyperdriveAddress,
            } = result;
            const parsedResult: QueryResult = {
                blockNumber: p_blockNumber,
                shareReserves: BigInt(p_shareReserves),
                lpTotalSupply: BigInt(p_lpTotalSupply),
                vaultSharePrice: BigInt(p_vaultSharePrice),
                shortsOutstanding: BigInt(p_shortsOutstanding),
                lpSharePrice: BigInt(p_lpSharePrice),
                hyperdriveAddress: t_hyperdriveAddress,
                tokenType: t_type.toLowerCase().includes("Short")
                    ? "Short"
                    : "LP",
                balanceAtBlock: parseEther(t_balanceAtBlock ?? "0"),
                trader: t_trader,
            };
            return parsedResult;
        }),
    );

    console.log("queryResults", queryResults[0]);

    const resultsByPoolForLP = uniqueHyperdriveAddresses.map(
        ({ hyperdriveAddress }, index) => {
            return {
                hyperdriveAddress,
                results: queryResults[index].filter(
                    (result) => result.tokenType === "LP",
                ),
            };
        },
    );

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    console.log("rpcUrl", rpcUrl);

    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    // Ok, for one user we need to go through each hyperdrive address, and then each token,
    //   get the balance at start/end,
    //   then grab sorted balances from the trade events,
    //   then sum up the time-weighted balances.

    // TODO: start a new loop where we go through each hyperdrive address, then each token, get the startBlock and endBlock,
    // and then get the token balance at startBlock and endBlock.

    // TODO: get LP balance at startBlock and add a result.
    // TODO: get LP balance at endBlock and add a result.
    // TODO: get PoolInfo at startBlock from DB, if not there hit chain and store in DB.
    // TODO: get PoolInfo at endBlock from DB, if not there hit chain and store in DB.
    const percentLPByPool = resultsByPoolForLP.map(
        ({ hyperdriveAddress, results }) => {
            console.log("hyperdriveAddress", hyperdriveAddress);
            console.log("results", results);
            console.log();
            const startBlock = FixedNumber.fromValue(
                BigInt(results[0].blockNumber) * ONE,
                18,
            );
            const endBlock = FixedNumber.fromValue(
                BigInt(results[results.length - 1].blockNumber) * ONE,
                18,
            );
            let previousResult: QueryResult = results[0];
            results.shift();
            const percents = results.map((result) => {
                const { blockNumber } = result;
                const totalLpPortion = FixedNumber.fromValue(
                    previousResult.shareReserves -
                        previousResult.shortsOutstanding,
                    18,
                );
                let timeWeightedPercent = FixedNumber.fromValue(0, 18);
                const startBlock = FixedNumber.fromValue(
                    BigInt(previousResult.blockNumber) * ONE,
                    18,
                );
                const endBlock = FixedNumber.fromValue(
                    BigInt(blockNumber) * ONE,
                    18,
                );
                const time = endBlock.sub(startBlock);
                timeWeightedPercent = time
                    .mul(
                        FixedNumber.fromValue(
                            previousResult.balanceAtBlock,
                            18,
                        ),
                    )
                    .div(totalLpPortion);
                previousResult = result;
                return { hyperdriveAddress, timeWeightedPercent };
            });

            const summedPercents = percents.reduce(
                (acc, percent) => {
                    return acc.add(percent.timeWeightedPercent);
                },
                FixedNumber.fromValue(0, 18),
            );

            const percentLP = endBlock.gt(startBlock)
                ? summedPercents.div(endBlock.sub(startBlock))
                : FixedNumber.fromValue(0, 18);

            return { hyperdriveAddress, percentLP };
        },
    );
    console.log("percentLPByPool", percentLPByPool);

    const resultsByPoolForShorts = uniqueHyperdriveAddresses.map(
        ({ hyperdriveAddress }, index) => {
            return {
                hyperdriveAddress,
                results: queryResults[index].filter(
                    (result) => result.tokenType === "Short",
                ),
            };
        },
    );
    console.log("resultsByPoolForShorts", resultsByPoolForShorts);

    // TODO: get all short tokens user has ever owned from DB.
    // TODO  at startBlock, get balance of all shorts owned by user. try to do this from the DB, else hit chain, store in shortBalances table if necessary.
    // TODO: at each trade, get balance of all shorts owned by user.  try to do this from the DB, else hit chain, store in shortBalances table if necessary.
    // TODO: at endBlock, get balance of all shorts owned by user. try to do this from the DB, else hit chain, store in shortBalances table if necessary.
    // TODO: sum time-weighted percent of total balance of shorts owned by user.
    const percentShortByPool = resultsByPoolForShorts.map(
        ({ hyperdriveAddress, results }) => {
            if (!results.length) {
                return {
                    hyperdriveAddress,
                    percentShort: FixedNumber.fromValue(0, 18),
                };
            }
            console.log("hyperdriveAddress", hyperdriveAddress);
            console.log("results", results);
            console.log();
            const startBlock = FixedNumber.fromValue(
                BigInt(results[0].blockNumber) * ONE,
                18,
            );
            const endBlock = FixedNumber.fromValue(
                BigInt(results[results.length - 1].blockNumber) * ONE,
                18,
            );

            let previousResult: QueryResult = results[0];
            results.shift();
            const percents = results.map((result) => {
                const { blockNumber } = result;
                const totalShortPortion = FixedNumber.fromValue(
                    previousResult.shortsOutstanding,
                    18,
                );
                let timeWeightedPercent = FixedNumber.fromValue(0, 18);
                if (
                    previousResult.tokenType === "SHORT" &&
                    previousResult.balanceAtBlock > 0
                ) {
                    const startBlock = FixedNumber.fromValue(
                        BigInt(previousResult.blockNumber) * ONE,
                        18,
                    );
                    const endBlock = FixedNumber.fromValue(
                        BigInt(blockNumber) * ONE,
                        18,
                    );
                    const time = endBlock.sub(startBlock);
                    timeWeightedPercent = time
                        .mul(
                            FixedNumber.fromValue(
                                previousResult.balanceAtBlock,
                                18,
                            ),
                        )
                        .div(totalShortPortion);
                }
                previousResult = result;
                return { hyperdriveAddress, timeWeightedPercent };
            });

            const summedPercents = percents.reduce(
                (acc, percent) => {
                    return acc.add(percent.timeWeightedPercent);
                },
                FixedNumber.fromValue(0, 18),
            );

            const percentShort = endBlock.gt(startBlock)
                ? summedPercents.div(endBlock.sub(startBlock)).toString()
                : FixedNumber.fromValue(0, 18).toString();

            return { hyperdriveAddress, percentShort };
        },
    );
    console.log("percentShortByPool", percentShortByPool);

    return { address, percentLPByPool, percentShortByPool };
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

export async function fetchRewardsForUserNew(userAddress: Address): Reward[] {
    // TODO: get startBlock and endBlock for the range?  We need to get the range to add balances at those times.
    //       startBlock should be the time before last rewards were claimed. (previous epoch's end).
    //       endBlock is last time rewards were claimed (crrent epoch's end)
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

    // TODO: get reward amount for epoch.
    // TODO: get totalLP portion for epoch. This can be obtained by summing the time weighted average of (shareReserves - shortsOutstanding) / share_reserves at each trade event during the epoch.
    // TODO: get totalShort portion for epoch.  This can be obtained by summing the time weighted average of the shortsOutstanding / shareReserves at each trade event.  Lp portion is the remaining percent for that time period.
    // NOTE: totalLP portion + totalShort portion == 100%

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    const userTrades = await getNestedTradesByTrader(userAddress);
    console.log("userTrades", userTrades);

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
            );

            if (!poolConfig) {
                throw new Error("fetchRewardsEpoch: Invalid hyperdriveAddress");
            }

            const { startBlock, endBlock } = await fetchRewardsEpoch(
                poolConfig,
                client,
            );
            const epochDuration = endBlock - startBlock;

            for (const { assetId, trades } of tradesForAsset.filter(
                ({ assetId }) => isRewardsAssetType(getAssetType(assetId)),
            )) {
                const assetType = getAssetType(assetId);
                const maturityTime = getMaturityTime(assetId);

                const startBalance = await getHyperdriveBalance(
                    client,
                    hyperdriveAddress,
                    startBlock,
                    assetId,
                    userAddress,
                );
                const endBalance = await getHyperdriveBalance(
                    client,
                    hyperdriveAddress,
                    endBlock,
                    assetId,
                    userAddress,
                );
                const startBlockTime = await getBlockTimestamp(
                    client,
                    startBlock,
                );
                const endBlockTime = await getBlockTimestamp(client, endBlock);
                const epochTrades = trades
                    .filter(({ blockNumber }) => {
                        return (
                            blockNumber >= startBlock && blockNumber <= endBlock
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
                        for (let i = 0; i < paddedEpochTrades.length - 1; i++) {
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
                        for (let i = 0; i < paddedEpochTrades.length - 1; i++) {
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
            }
            return {
                LP: userSums.LP.toString(),
                Short: userSums.LP.toString(),
                hyperdriveAddress,
            };
        },
    );
    const userSums = await Promise.all(promises);
    console.log("userSums", userSums);

    const uniqueHyperdriveAddresses: Address[] = (
        await dataSource
            .getRepository(Trade)
            .createQueryBuilder("trades")
            .select("DISTINCT trades.hyperdriveAddress", "hyperdriveAddress")
            .getRawMany()
    ).map(({ hyperdriveAddress }) => hyperdriveAddress);

    // const asdf = uniqueHyperdriveAddresses.map(async ({ hyperdrveAddress }) => {
    //     const poolConfig = mainnetAppConfig.hyperdrives.find(
    //         ({ address }) => address === hyperdriveAddress,
    //     );

    //     const { startBlock, endBlock } = await fetchRewardsEpoch(
    //         poolConfig,
    //         client,
    //     );
    // });
    // const poolInfos: { poolInfo: Address }[] = await dataSource
    //     .getRepository(PoolInfoAtBlock)
    //     .createQueryBuilder("pool_info_at_block")
    //     .getMany();

    const rewards: Reward[] = userSums.map(
        ({ LP, Short, hyperdriveAddress }) => {
            return {
                chainId: mainnet.id,
                claimContract: process.env.REWARDS_CONTRACT as Address,
                claimableAmount: (BigInt(LP) + BigInt(Short)).toString(),
                rewardToken: process.env.REWARD_TOKEN as Address,
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
    console.log("result", JSON.stringify(result, null, 2));
    return result;
}
