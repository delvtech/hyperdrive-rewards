import "dotenv/config";
import { initializeAbiEvent } from "src/abi/events";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { HyperdriveConfig } from "src/appConfig/types";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { Trade } from "src/entity/Trade";
import { assetIdBigIntToHex, LP_ASSET_ID } from "src/helpers/assets";
import { getHyperdriveBalance } from "src/helpers/balance";
import { getBlockTimestamp } from "src/helpers/block";
import { AppDataSource } from "src/server/dataSource";
import { PublicClient } from "viem";

/**
 * Fetches and processes "Initialize" events from the Hyperdrive smart
 * contract starting from the deployment block to the latest block.
 * Retrieves balance and pool info at each event's block, and stores the
 * data in the PostgreSQL database.
 *
 * @param hyperdrive - Hyperdrive contract to fetch events from.
 * @param client - The PublicClient instance to interact with the blockchain.
 */
export async function saveInitializeEvents(
    hyperdrive: HyperdriveConfig,
    client: PublicClient,
) {
    const { address, initializationBlock } = hyperdrive;

    const logs = await client.getLogs({
        address,
        event: initializeAbiEvent,
        fromBlock: BigInt(initializationBlock - 1n),
        toBlock: BigInt(initializationBlock + 1n),
    });

    const balancePromises = Promise.all(
        logs.map((log) => {
            const args = log.args;
            const { provider } = args;
            // Get balanceOf at the event's block
            return getHyperdriveBalance(
                client,
                address,
                log.blockNumber,
                LP_ASSET_ID,
                provider!,
            );
        }),
    );

    const poolInfoPromises = Promise.all(
        logs.map((log) => {
            // Get pool info at the event's block
            return client.readContract({
                address: address,
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

    const [balances, poolInfosRaw, blockTimestamps] = await Promise.all([
        balancePromises,
        poolInfoPromises,
        blockTimestampPromises,
    ]);

    const tradeEvents: Trade[] = [];
    const poolInfos: PoolInfoAtBlock[] = [];

    // populate tradeEvents and poolInfos
    logs.forEach((log, index) => {
        const { args, eventName } = log;
        const { provider, amount, vaultSharePrice, asBase } = args;
        const balanceAtBlock = balances[index];
        const blockTime = Number(blockTimestamps[index]);
        const poolInfoRaw = poolInfosRaw[index];

        const blockNumber = Number(log.blockNumber);
        const transactionHash = log.transactionHash;

        const items = [
            { name: "trader", value: provider },
            { name: "assetId", value: "0" },
            { name: "maturityTime", value: "0" },
            { name: "amount", value: amount },
            { name: "vaultSharePrice", value: vaultSharePrice },
            { name: "baseProceeds", value: "0" },
            { name: "bondAmount", value: "0" },
            { name: "balanceAtBlock", value: balanceAtBlock },
            { name: "asBase", value: asBase },
        ];

        if (
            !amount ||
            !vaultSharePrice ||
            balanceAtBlock === null ||
            asBase === undefined
        ) {
            items.forEach((item) => console.log(`${item.name}: ${item.value}`));
            return;
        }
        const tradeEvent = new Trade();
        tradeEvent.type = eventName;
        tradeEvent.hyperdriveAddress = address;
        tradeEvent.transactionHash = transactionHash;
        tradeEvent.trader = provider!;
        tradeEvent.assetId = assetIdBigIntToHex(0n);
        tradeEvent.blockNumber = blockNumber;
        tradeEvent.blockTime = blockTime;
        tradeEvent.maturityTime = "0";
        tradeEvent.amount = amount.toString();
        tradeEvent.vaultSharePrice = vaultSharePrice.toString();
        tradeEvent.asBase = asBase;
        tradeEvent.bondAmount = "0";
        tradeEvent.balanceAtBlock = balanceAtBlock.toString();
        tradeEvent.baseProceeds = "0";

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

        tradeEvents.push(tradeEvent);
        poolInfos.push(poolInfoAtBlock);
    });

    await AppDataSource.createQueryBuilder()
        .insert()
        .into(Trade)
        .values(tradeEvents)
        .orIgnore() // This will ignore duplicate transaction hashes
        .execute();

    await AppDataSource.createQueryBuilder()
        .insert()
        .into(PoolInfoAtBlock)
        .values(poolInfos)
        .orIgnore()
        .execute();

    console.log(`Done saving Initialize events for ${hyperdrive.name}`);
}
