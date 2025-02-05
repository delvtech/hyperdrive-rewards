import {
    HyperdriveConfig,
    mainnetAppConfig,
} from "@delvtech/hyperdrive-appconfig/dist/index.cjs";
import { Address, PublicClient, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { hyperdriveReadAbi } from "../abi/hyperdriveRead";
import { AppDataSource } from "../dataSource";
import { Balance } from "../entity/Balance";
import { Trade } from "../entity/Trade";
import { getAssetType } from "../helpers/assets";

async function saveBalances(pools: HyperdriveConfig[]) {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL");

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    console.log("rpcUrl", rpcUrl);
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    // Step 1: Get all users and their tokens
    const userTokens = await getAllUsersAndTokens();
    console.log("Fetched unique traders and tokens:", userTokens.length);

    for (const { hyperdriveAddress, trader, assetId } of userTokens) {
        // Step 2: Get all distinct block numbers for this pool
        const blocks = await getBlocksForPool(hyperdriveAddress);
        console.log(
            `Processing ${blocks.length} blocks for ${hyperdriveAddress}`,
        );

        const balancesToSave: Balance[] = [];

        // Step 3: Fetch balances at each block
        // TODO: at each block, fetch all tokens for each user, so we'll need a nested for-loop or an inner function with a loop that goes by user and token
        for (const { blockNumber } of blocks) {
            const balance = await getBalanceAtBlock(
                client,
                hyperdriveAddress,
                assetId,
                trader,
                BigInt(blockNumber),
            );
            if (balance !== null) {
                const balanceRecord = new Balance();

                balanceRecord.hyperdriveAddress = hyperdriveAddress;
                balanceRecord.trader = trader;
                balanceRecord.assetId = assetId;
                balanceRecord.assetType = getAssetType(assetId);
                balanceRecord.balance = balance.toString();
                balanceRecord.blockNumber = blockNumber;

                balancesToSave.push(balanceRecord);
            }
        }

        // Step 4: Save balances to DB
        if (balancesToSave.length > 0) {
            await saveBalancesToDB(balancesToSave);
            console.log(
                `Saved ${balancesToSave.length} balances for ${trader}`,
            );
        }
    }
}

// returns a shape like this:
// [
//   {
//     "hyperdriveAddress": "0xABC123...",
//     "trader": "0xUSER123...",
//     "assetId": "0xTOKEN456..."
//   }
// ]
async function getAllUsersAndTokens() {
    return AppDataSource.getRepository(Trade)
        .createQueryBuilder("t")
        .select(["DISTINCT t.hyperdriveAddress", "t.trader", "t.assetId"])
        .getRawMany();
}

const mainnetPools = mainnetAppConfig.hyperdrives;

const morphoPools = mainnetPools.filter(({ name }) => name.includes("Morpho"));

saveBalances(morphoPools).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});

async function getBalanceAtBlock(
    client: PublicClient,
    hyperdriveAddress: Address,
    assetId: bigint,
    trader: Address,
    blockNumber: bigint,
) {
    try {
        const balance = await client.readContract({
            address: hyperdriveAddress,
            abi: hyperdriveReadAbi,
            functionName: "balanceOf",
            blockNumber: blockNumber,
            args: [assetId, trader],
        });

        return balance;
    } catch (error) {
        console.error(
            `Failed to get balance for ${trader} at block ${blockNumber}`,
        );
        return null;
    }
}

async function getBlocksForPool(hyperdriveAddress: Address) {
    return AppDataSource.getRepository(Trade)
        .createQueryBuilder("t")
        .select("DISTINCT t.blockNumber", "blockNumber")
        .where("t.hyperdriveAddress = :hyperdriveAddress", {
            hyperdriveAddress,
        })
        .orderBy("t.blockNumber", "ASC")
        .getRawMany();
}

async function saveBalancesToDB(balances: Balance[]) {
    await AppDataSource.createQueryBuilder()
        .insert()
        .into(Balance)
        .values(balances)
        .orIgnore()
        .execute();
}
