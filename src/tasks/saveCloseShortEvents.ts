import "dotenv/config";
import { closeShortAbiEvent } from "src/abi/events";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { HyperdriveConfig } from "src/appConfig/types";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { Trade } from "src/entity/Trade";
import { assetIdBigIntToHex } from "src/helpers/assets";
import { getBlockTimestamp } from "src/helpers/block";
import { AppDataSource } from "src/server/dataSource";
import { PublicClient } from "viem";

/**
 * Fetches and processes "CloseShort" events from the Hyperdrive smart contract
 * starting from the deployment block to the latest block. Retrieves balance
 * and pool info at each event's block, and stores the data in the PostgreSQL
 * database.
 *
 * @param hyperdriveAddress - The address of the Hyperdrive contract to fetch
 *                            events from.
 * @param client - The PublicClient instance to interact with the blockchain.
 */

export async function saveCloseShortEvents(
    hyperdrive: HyperdriveConfig,
    client: PublicClient,
) {
    const { address, initializationBlock } = hyperdrive;

    const logs = await client.getLogs({
        address,
        event: closeShortAbiEvent,
        fromBlock: BigInt(initializationBlock),
        toBlock: "latest",
    });

    if (!logs) {
        console.log("No CloseShort events found");
        return;
    }

    const balancePromises = Promise.all(
        logs.map((log) => {
            const args = log.args;
            const { trader, assetId } = args;
            // Get balanceOf at the event's block
            return client.readContract({
                address,
                abi: hyperdriveReadAbi,
                functionName: "balanceOf",
                blockNumber: log.blockNumber,
                args: [assetId!, trader!],
            });
        }),
    );

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
        const {
            trader,
            assetId,
            amount,
            vaultSharePrice,
            asBase,
            bondAmount,
            maturityTime,
        } = args;
        const balanceAtBlock = balances[index];
        const poolInfoRaw = poolInfosRaw[index];

        const blockNumber = Number(log.blockNumber);
        const blockTime = Number(blockTimestamps[index]);
        const transactionHash = log.transactionHash;

        const items = [
            { name: "trader", value: trader },
            { name: "assetId", value: assetId },
            { name: "maturityTime", value: maturityTime },
            { name: "amount", value: amount },
            { name: "vaultSharePrice", value: vaultSharePrice },
            { name: "baseProceeds", value: "0" },
            { name: "bondAmount", value: bondAmount },
            { name: "balanceAtBlock", value: balanceAtBlock },
            { name: "asBase", value: asBase },
        ];

        if (
            !trader ||
            !assetId ||
            !maturityTime ||
            !amount ||
            !vaultSharePrice ||
            bondAmount === undefined ||
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
        tradeEvent.trader = trader;
        tradeEvent.assetId = assetIdBigIntToHex(assetId);
        tradeEvent.blockNumber = blockNumber;
        tradeEvent.blockTime = blockTime;
        tradeEvent.maturityTime = maturityTime.toString();
        tradeEvent.amount = amount.toString();
        tradeEvent.vaultSharePrice = vaultSharePrice.toString();
        tradeEvent.asBase = asBase;
        tradeEvent.bondAmount = bondAmount.toString();
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

    console.log(`Done saving CloseShort events for ${hyperdrive.name}`);
}
