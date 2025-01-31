import "dotenv/config";
import { Address, formatUnits, fromHex, Log, PublicClient, toHex } from "viem";
import { openLongAbiEvent } from "../abi/events";
import { hyperdriveReadAbi } from "../abi/hyperdriveRead";
import { AppDataSource } from "../dataSource";
import { PoolInfoAtBlock } from "../entity/PoolInfoAtBlock";
import { Trade } from "../entity/TradeEvent";
import { getDeploymentBlock } from "../helpers/etherescan";

type OpenLongLogs = Log<
    bigint,
    number,
    false,
    typeof openLongAbiEvent,
    false,
    undefined,
    "OpenLong"
>[];

type PoolInfosRaw = {
    shareReserves: bigint;
    shareAdjustment: bigint;
    zombieBaseProceeds: bigint;
    zombieShareReserves: bigint;
    bondReserves: bigint;
    vaultSharePrice: bigint;
    longsOutstanding: bigint;
    longAverageMaturityTime: bigint;
    shortsOutstanding: bigint;
    shortAverageMaturityTime: bigint;
    lpTotalSupply: bigint;
    lpSharePrice: bigint;
    withdrawalSharesReadyToWithdraw: bigint;
    withdrawalSharesProceeds: bigint;
    longExposure: bigint;
};

/**
 * Fetches OpenLong events from the Hyperdrive contract and saves them to the PostgreSQL database.
 * @param hyperdriveAddress The address of the Hyperdrive contract.
 */
export async function saveOpenLongEvents(
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

    console.log(`Fetching OpenLong events since block ${deploymentBlock}...`);

    const logs = await client.getLogs({
        address: hyperdriveAddress,
        event: openLongAbiEvent,
        fromBlock: deploymentBlock,
        toBlock: "latest",
    });

    if (!logs) {
        console.log("No OpenLong events found");
        return;
    }

    const { balances, poolInfosRaw } = await getBalancesAndPoolInfos(
        hyperdriveAddress,
        logs,
        client,
    );

    const { tradeEvents, poolInfos } = processOpenLongEvents(
        hyperdriveAddress,
        logs,
        balances,
        poolInfosRaw,
    );

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

    console.log("Done saving OpenLong events.");
}

async function getBalancesAndPoolInfos(
    hyperdriveAddress: Address,
    logs: OpenLongLogs,
    client: PublicClient,
): Promise<{
    balances: bigint[];
    poolInfosRaw: PoolInfosRaw[];
}> {
    console.log(`Found ${logs.length} OpenLong events`);

    const balancePromises = Promise.all(
        logs.map((log) => {
            const args = (log as any).args;
            const { trader, assetId } = args;
            // Get balanceOf at the event's block
            return client.readContract({
                address: hyperdriveAddress,
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

    return { balances, poolInfosRaw };
}

function processOpenLongEvents(
    hyperdriveAddress: Address,
    logs: OpenLongLogs,
    balances: bigint[],
    poolInfosRaw: PoolInfosRaw[],
) {
    const tradeEvents: Trade[] = [];
    const poolInfos: PoolInfoAtBlock[] = [];

    // populate tradeEvents and poolInfos
    logs.forEach((log, index) => {
        const args = (log as any).args;
        const { trader, assetId, amount, vaultSharePrice, asBase, bondAmount } =
            args;
        const balanceAtBlock = balances[index];
        const poolInfoRaw = poolInfosRaw[index];

        const maturityTimeHex = "0x".concat(
            toHex(assetId!).slice(-8),
        ) as `0x${string}`;
        const maturityTime = fromHex(maturityTimeHex, "number");
        console.log("maturityTime", maturityTime);
        const blockNumber = Number(log.blockNumber);
        const transactionHash = log.transactionHash;

        console.log(
            `Processing OpenLong event at block ${blockNumber} for trader ${trader}`,
        );

        const items = [
            { name: "trader", value: trader },
            { name: "assetId", value: assetId },
            { name: "maturityTime", value: maturityTime },
            { name: "amount", value: amount },
            { name: "vaultSharePrice", value: vaultSharePrice },
            { name: "bondAmount", value: bondAmount },
            { name: "balanceAtBlock", value: balanceAtBlock },
            { name: "asBase", value: asBase },
        ];

        // Save the event in PostgreSQL
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
        tradeEvent.transactionHash = transactionHash;
        tradeEvent.hyperdriveAddress = hyperdriveAddress;
        tradeEvent.trader = trader;
        tradeEvent.assetId = assetId.toString();
        tradeEvent.blockNumber = blockNumber;
        tradeEvent.maturityTime = maturityTime.toString();
        tradeEvent.amount = formatUnits(amount, 18);
        tradeEvent.vaultSharePrice = formatUnits(vaultSharePrice, 18);
        tradeEvent.asBase = asBase;
        tradeEvent.bondAmount = formatUnits(bondAmount, 18);
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

    return { tradeEvents, poolInfos };
}
