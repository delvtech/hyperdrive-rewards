import "dotenv/config";
import { removeLiquidityAbiEvent } from "src/abi/events";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { HyperdriveConfig } from "src/appConfig/types";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { Trade } from "src/entity/Trade";
import { assetIdBigIntToHex } from "src/helpers/assets";
import { getBlockTimestamp } from "src/helpers/block";
import { AppDataSource } from "src/server/dataSource";
import { PublicClient } from "viem";

export async function saveRemoveLiquidityEvents(
    hyperdrive: HyperdriveConfig,
    client: PublicClient,
) {
    const { address, initializationBlock } = hyperdrive;

    const logs = await client.getLogs({
        address,
        event: removeLiquidityAbiEvent,
        fromBlock: BigInt(initializationBlock),
        toBlock: "latest",
    });

    if (!logs) {
        console.log("No OpenLong events found");
        return;
    }

    const balancePromises = Promise.all(
        logs.map((log) => {
            const args = log.args;
            const { provider } = args;
            // Get balanceOf at the event's block
            return client.readContract({
                address: address,
                abi: hyperdriveReadAbi,
                functionName: "balanceOf",
                blockNumber: log.blockNumber,
                args: [0n!, provider!],
            });
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

    console.log(`Done saving RemoveLiquidity events for ${hyperdrive.name}`);
}
