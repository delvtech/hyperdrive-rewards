import { HyperdriveConfig } from "src/appConfig/types";
import { saveAddLiquidityEvents } from "src/events/saveAddLiquidityEvents";
import { saveCheckpoints } from "src/events/saveCheckpoints";
import { saveCloseLongEvents } from "src/events/saveCloseLongEvents";
import { saveCloseShortEvents } from "src/events/saveCloseShortEvents";
import { saveInitializeEvents } from "src/events/saveInitializeEvents";
import { saveOpenLongEvents } from "src/events/saveOpenLongEvents";
import { saveOpenShortEvents } from "src/events/saveOpenShortEvents";
import { saveRemoveLiquidityEvents } from "src/events/saveRemoveLiquidityEvents";
import { saveTransferSingleEvents } from "src/events/saveTransferSingleEvents";
import { getPools } from "src/pools/all";
import { initializeDataSource } from "src/server/dataSource";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

async function saveEvents(pools: HyperdriveConfig[]) {
    await initializeDataSource();

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
        promises.push(saveCheckpoints(pool, client));
    });

    await Promise.all(promises);
}

async function main() {
    const pools = getPools();
    await saveEvents(pools);
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
