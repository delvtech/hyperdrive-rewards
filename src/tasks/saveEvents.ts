import { mainnetAppConfig } from "src/appConfig/mainnet";
import { HyperdriveConfig } from "src/appConfig/types";
import { AppDataSource } from "src/server/dataSource";
import { saveAddLiquidityEvents } from "src/tasks/saveAddLiquidityEvents";
import { saveCloseLongEvents } from "src/tasks/saveCloseLongEvents";
import { saveCloseShortEvents } from "src/tasks/saveCloseShortEvents";
import { saveInitializeEvents } from "src/tasks/saveInitializeEvents";
import { saveOpenLongEvents } from "src/tasks/saveOpenLongEvents";
import { saveOpenShortEvents } from "src/tasks/saveOpenShortEvents";
import { saveRemoveLiquidityEvents } from "src/tasks/saveRemoveLiquidityEvents";
import { saveTransferSingleEvents } from "src/tasks/saveTransferSingleEvents";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

async function saveEvents(pools: HyperdriveConfig[]) {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL");

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    console.log("rpcUrl", rpcUrl);

    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    const promises: Promise<void>[] = [];

    pools.forEach((pool) => {
        promises.push(saveInitializeEvents(pool, client));
        promises.push(saveOpenLongEvents(pool, client));
        promises.push(saveCloseLongEvents(pool, client));
        promises.push(saveOpenShortEvents(pool, client));
        promises.push(saveCloseShortEvents(pool, client));
        promises.push(saveAddLiquidityEvents(pool, client));
        promises.push(saveRemoveLiquidityEvents(pool, client));
        promises.push(saveTransferSingleEvents(pool, client));
    });

    await Promise.all(promises);
}

async function main() {
    const mainnetPools = mainnetAppConfig.hyperdrives.filter(
        ({ chainId }) => chainId === 1,
    ) as HyperdriveConfig[];

    const morphoPools = mainnetPools.filter(({ name }) =>
        name.includes("Morpho"),
    );
    await saveEvents(morphoPools);
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
