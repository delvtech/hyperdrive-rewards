import { HyperdriveConfig } from "@delvtech/hyperdrive-appconfig/dist/index.cjs";
import "dotenv/config";
import { ZeroAddress } from "ethers";
import { formatUnits, PublicClient, toHex } from "viem";
import { transferSingleAbiEvent } from "../abi/events";
import { hyperdriveReadAbi } from "../abi/hyperdriveRead";
import { AppDataSource } from "../dataSource";
import { PoolInfoAtBlock } from "../entity/PoolInfoAtBlock";
import { Trade } from "../entity/Trade";
import {
    assetIdBigIntToHex,
    getAssetType,
    getMaturityTime,
    isRewardsAssetType,
} from "../helpers/assets";
import { getHyperdriveBalance } from "../helpers/balance";
import { getBlockTimestamp } from "../helpers/block";

/**
 * Fetches and processes "TransferSingle" events from the Hyperdrive smart contract
 * starting from the deployment block to the latest block. Retrieves balance
 * and pool info at each event's block, and stores the data in the PostgreSQL
 * database.
 *
 * @param hyperdriveAddress - The address of the Hyperdrive contract to fetch
 *                            events from.
 * @param client - The PublicClient instance to interact with the blockchain.
 */
export async function saveTransferSingleEvents(
    hyperdrive: HyperdriveConfig,
    client: PublicClient,
) {
    const { address, initializationBlock } = hyperdrive;

    const logs = await client.getLogs({
        address,
        event: transferSingleAbiEvent,
        fromBlock: BigInt(initializationBlock),
        toBlock: "latest",
    });

    if (!logs) {
        console.log("No TransferSingle events found");
        return;
    }

    const toBalancePromises = Promise.all(
        logs.map((log) => {
            const args = log.args;
            const { to, id } = args;
            // Don't hit the chain for the zero address
            if (to !== ZeroAddress) {
                return getHyperdriveBalance(
                    client,
                    address,
                    log.blockNumber,
                    toHex(id!),
                    to!,
                );
            }
            return 0n;
        }),
    );

    const fromBalancePromises = Promise.all(
        logs.map((log) => {
            const args = log.args;
            const { from, id } = args;
            // Don't hit the chain for the zero address
            if (from !== ZeroAddress) {
                return getHyperdriveBalance(
                    client,
                    address,
                    log.blockNumber,
                    toHex(id!),
                    from!,
                );
            }
            return 0n;
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

    const [toBalances, fromBalances, poolInfosRaw, blockTimestamps] =
        await Promise.all([
            toBalancePromises,
            fromBalancePromises,
            poolInfoPromises,
            blockTimestampPromises,
        ]);

    const tradeEvents: Trade[] = [];
    const poolInfos: PoolInfoAtBlock[] = [];

    // populate tradeEvents and poolInfos
    logs.forEach((log, index) => {
        const { args, eventName } = log;
        const { to, from, id, value } = args;
        const blockTime = blockTimestamps[index];
        const toBalanceAtBlock = toBalances[index];
        const fromBalanceAtBlock = fromBalances[index];
        const poolInfoRaw = poolInfosRaw[index];

        const blockNumber = Number(log.blockNumber);
        const transactionHash = log.transactionHash;

        console.log(
            `Processing TransferSingle event at block ${blockNumber} between ${to} and ${from}`,
        );

        const assetType = getAssetType(toHex(id!));
        if (!isRewardsAssetType) {
            return;
        }

        const maturityTime = getMaturityTime(toHex(id!, { size: 32 }));

        if (to !== ZeroAddress && isRewardsAssetType(assetType)) {
            const toTradeEvent = new Trade();
            toTradeEvent.type = eventName;
            toTradeEvent.hyperdriveAddress = address;
            toTradeEvent.transactionHash = transactionHash;
            toTradeEvent.trader = to!;
            toTradeEvent.assetId = assetIdBigIntToHex(id!);
            toTradeEvent.blockNumber = blockNumber;
            toTradeEvent.maturityTime = maturityTime.toString();
            toTradeEvent.blockTime = Number(blockTime);
            toTradeEvent.amount = formatUnits(value!, 18);
            toTradeEvent.vaultSharePrice = formatUnits(
                poolInfoRaw.vaultSharePrice,
                18,
            );
            toTradeEvent.asBase = false;
            toTradeEvent.bondAmount = "0";
            toTradeEvent.balanceAtBlock = toBalanceAtBlock.toString();
            toTradeEvent.baseProceeds = "0";
            tradeEvents.push(toTradeEvent);
        }

        if (from !== ZeroAddress && to !== ZeroAddress) {
            console.log("to", to);
            console.log("from", from);
        }

        if (from !== ZeroAddress) {
            const fromTradeEvent = new Trade();
            fromTradeEvent.type = eventName;
            fromTradeEvent.hyperdriveAddress = address;
            fromTradeEvent.transactionHash = transactionHash;
            fromTradeEvent.trader = from!;
            fromTradeEvent.assetId = assetIdBigIntToHex(id!);
            fromTradeEvent.blockNumber = blockNumber;
            fromTradeEvent.blockTime = Number(blockTime);
            fromTradeEvent.maturityTime = maturityTime.toString();
            fromTradeEvent.amount = formatUnits(value!, 18);
            fromTradeEvent.vaultSharePrice = formatUnits(
                poolInfoRaw.vaultSharePrice,
                18,
            );
            fromTradeEvent.asBase = false;
            fromTradeEvent.bondAmount = "0";
            fromTradeEvent.balanceAtBlock = fromBalanceAtBlock.toString();
            fromTradeEvent.baseProceeds = "0";
            tradeEvents.push(fromTradeEvent);
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

    console.log("Done saving TransferSingle events.");
}
