import "dotenv/config";
import { Address, formatUnits, PublicClient } from "viem";
import { removeLiquidityAbiEvent } from "../abi/events";
import { hyperdriveReadAbi } from "../abi/hyperdriveRead";
import { AppDataSource } from "../dataSource";
import { PoolInfoAtBlock } from "../entity/PoolInfoAtBlock";
import { Trade } from "../entity/TradeEvent";
import { getDeploymentBlock } from "../helpers/etherescan";

async function saveRemoveLiquidityEvents(
    hyperdriveAddress: Address,
    client: PublicClient,
) {
    // Get the block number when the contract was deployed
    const deploymentBlock = await getDeploymentBlock(hyperdriveAddress);
    console.log("deploymentBlock", deploymentBlock);

    if (!deploymentBlock) {
        console.log("No deployment block found");
        return;
    }

    console.log(
        `Fetching AddLiquidity events since block ${deploymentBlock}...`,
    );

    const logs = await client.getLogs({
        address: hyperdriveAddress,
        event: removeLiquidityAbiEvent,
        fromBlock: BigInt(deploymentBlock),
        toBlock: "latest",
    });

    console.log(`Found ${logs.length} RemoveLiquidityevents`);

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
                address: hyperdriveAddress,
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
                address: hyperdriveAddress,
                abi: hyperdriveReadAbi,
                functionName: "getPoolInfo",
                blockNumber: log.blockNumber,
            });
        }),
    );

    const [balances, poolInfosRaw] = await Promise.all([
        balancePromises,
        poolInfoPromises,
    ]);

    const tradeEvents: Trade[] = [];
    const poolInfos: PoolInfoAtBlock[] = [];

    // populate tradeEvents and poolInfos
    logs.forEach((log, index) => {
        const args = log.args;
        const { provider, amount, vaultSharePrice, asBase } = args;
        const balanceAtBlock = balances[index];
        const poolInfoRaw = poolInfosRaw[index];

        const blockNumber = Number(log.blockNumber);
        const transactionHash = log.transactionHash;

        console.log(
            `Processing RemoveLiquidity event at block ${blockNumber} for trader ${provider}`,
        );

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
        tradeEvent.hyperdriveAddress = hyperdriveAddress;
        tradeEvent.transactionHash = transactionHash;
        tradeEvent.trader = provider!;
        tradeEvent.assetId = "0";
        tradeEvent.blockNumber = blockNumber;
        tradeEvent.maturityTime = "0";
        tradeEvent.amount = formatUnits(amount, 18);
        tradeEvent.vaultSharePrice = formatUnits(vaultSharePrice, 18);
        tradeEvent.asBase = asBase;
        tradeEvent.bondAmount = "0";
        tradeEvent.balanceAtBlock = formatUnits(balanceAtBlock, 18);
        tradeEvent.baseProceeds = "0";

        // Save pool info into the database separately, using BigInt
        const poolInfoAtBlock = new PoolInfoAtBlock();
        poolInfoAtBlock.blockNumber = blockNumber;
        poolInfoAtBlock.hyperdriveAddress = hyperdriveAddress;
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

    console.log("Done saving RemoveLiquidity events.");
}
