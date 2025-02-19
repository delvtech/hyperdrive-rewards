import "dotenv/config";
import { createCheckpointAbiEvent } from "src/abi/events";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { HyperdriveConfig } from "src/appConfig/types";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { Trade } from "src/entity/Trade";
import { getBlockTimestamp } from "src/helpers/block";
import { AppDataSource } from "src/server/dataSource";
import { PublicClient } from "viem";

/**
 * Fetches and processes "CreateCheckpoint" events from the Hyperdrive smart
 * contract starting from the deployment block to the latest block. Retrieves
 * pool info at each event's block, and stores the data in the PostgreSQL
 * database.  We save pool infos at these blocks because checkpoints can alter
 * the market state which can affect market state like share reserves and shorts
 * outstanding.
 * @param hyperdriveAddress - The address of the Hyperdrive contract to fetch
 *                            events from.
 * @param client - The PublicClient instance to interact with the blockchain.
 */
export async function saveCheckpoints(
    hyperdrive: HyperdriveConfig,
    client: PublicClient,
) {
    const { address, initializationBlock } = hyperdrive;

    const logs = await client.getLogs({
        address,
        event: createCheckpointAbiEvent,
        fromBlock: BigInt(initializationBlock),
        toBlock: "latest",
    });

    if (!logs) {
        console.log("No OpenShort events found");
        return;
    }

    const poolInfoPromises = Promise.all(
        logs.map((log) => {
            // Get pool info at the event's block
            return client.readContract({
                address,
                abi: hyperdriveReadAbi,
                functionName: "getPoolInfo",
                blockNumber: log.blockNumber,
            });
        }),
    );

    const blockTimestampPromises = Promise.all(
        logs.map((log) => {
            return getBlockTimestamp(client, log.blockNumber);
        }),
    );

    const [poolInfosRaw, blockTimestamps] = await Promise.all([
        poolInfoPromises,
        blockTimestampPromises,
    ]);

    const tradeEvents: Trade[] = [];
    const poolInfos: PoolInfoAtBlock[] = [];

    // populate poolInfos
    logs.forEach((log, index) => {
        const { args, eventName } = log;
        const { maturedLongs, maturedShorts } = args;
        const poolInfoRaw = poolInfosRaw[index];

        const blockNumber = Number(log.blockNumber);

        // We only need to store poolInfos at checkpoints where there matured
        // longs or shorts that were redeemed because they affect the market
        // state.
        if (!maturedLongs && !maturedShorts) {
            return;
        }

        // Save pool info into the database separately, using BigInt
        const poolInfoAtBlock = new PoolInfoAtBlock();
        poolInfoAtBlock.blockNumber = blockNumber;
        poolInfoAtBlock.hyperdriveAddress = address;
        poolInfoAtBlock.shareReserves = poolInfoRaw.shareReserves.toString();
        poolInfoAtBlock.shareAdjustment =
            poolInfoRaw.shareAdjustment.toString();
        poolInfoAtBlock.zombieBaseProceeds =
            poolInfoRaw.zombieBaseProceeds.toString() || "0";
        poolInfoAtBlock.zombieShareReserves =
            poolInfoRaw.zombieShareReserves.toString();
        poolInfoAtBlock.bondReserves = poolInfoRaw.bondReserves.toString();
        poolInfoAtBlock.lpTotalSupply = poolInfoRaw.lpTotalSupply.toString();
        poolInfoAtBlock.vaultSharePrice =
            poolInfoRaw.vaultSharePrice.toString();
        poolInfoAtBlock.longsOutstanding =
            poolInfoRaw.longsOutstanding.toString();
        poolInfoAtBlock.longAverageMaturityTime =
            poolInfoRaw.longAverageMaturityTime.toString();
        poolInfoAtBlock.shortsOutstanding =
            poolInfoRaw.shortsOutstanding.toString();
        poolInfoAtBlock.shortAverageMaturityTime =
            poolInfoRaw.shortAverageMaturityTime.toString();
        poolInfoAtBlock.withdrawalSharesReadyToWithdraw =
            poolInfoRaw.withdrawalSharesReadyToWithdraw.toString();
        poolInfoAtBlock.withdrawalSharesProceeds =
            poolInfoRaw.withdrawalSharesProceeds.toString();
        poolInfoAtBlock.lpSharePrice = poolInfoRaw.lpSharePrice.toString();
        poolInfoAtBlock.longExposure = poolInfoRaw.longExposure.toString();

        poolInfos.push(poolInfoAtBlock);
    });

    await AppDataSource.createQueryBuilder()
        .insert()
        .into(PoolInfoAtBlock)
        .values(poolInfos)
        .orIgnore()
        .execute();

    console.log(
        `Done saving PoolInfos for Checkpoint events for ${hyperdrive.name}`,
    );
}
