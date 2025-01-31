import "dotenv/config";
import { Address, formatUnits, PublicClient } from "viem";
import { closeShortAbiEvent } from "../abi/events";
import { hyperdriveReadAbi } from "../abi/hyperdriveRead";
import { AppDataSource } from "../dataSource";
import { PoolInfoAtBlock } from "../entity/PoolInfoAtBlock";
import { Trade } from "../entity/TradeEvent";
import { getDeploymentBlock } from "../helpers/etherescan";

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

    console.log(`Fetching CloseShort events since block ${deploymentBlock}...`);

    const logs = await client.getLogs({
        address: hyperdriveAddress,
        event: closeShortAbiEvent,
        fromBlock: BigInt(deploymentBlock),
        toBlock: "latest",
    });

    console.log(`Found ${logs.length} CloseShort events`);

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

    const tradeEvents: Trade[] = [];
    const poolInfos: PoolInfoAtBlock[] = [];

    // populate tradeEvents and poolInfos
    logs.forEach((log, index) => {
        const args = log.args;
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
        const transactionHash = log.transactionHash;

        console.log(
            `Processing CloseShort event at block ${blockNumber} for trader ${trader}`,
        );

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
        tradeEvent.hyperdriveAddress = hyperdriveAddress;
        tradeEvent.transactionHash = transactionHash;
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

    console.log("Done saving CloseShort events.");
}
