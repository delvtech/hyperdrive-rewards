import {
    HyperdriveConfig,
    mainnetAppConfig,
} from "@delvtech/hyperdrive-appconfig/dist/index.cjs";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { AppDataSource } from "../dataSource";
import { saveAddLiquidityEvents } from "./saveAddLiquidityEvents";
import { saveCloseLongEvents } from "./saveCloseLongEvents";
import { saveCloseShortEvents } from "./saveCloseShortEvents";
import { saveOpenLongEvents } from "./saveOpenLongEvents";
import { saveOpenShortEvents } from "./saveOpenShortEvents";
import { saveRemoveLiquidityEvents } from "./saveRemoveLiquidityEvents";
import { saveTransferSingleEvents } from "./saveTransferSingleEvents";

async function saveEvents(pools: HyperdriveConfig[]) {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL");

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    console.log("rpcUrl", rpcUrl);

    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    let promises: Promise<void>[] = [];

    pools.forEach((pool) => {
        promises.push(saveOpenLongEvents(pool, client));
        promises.push(saveCloseLongEvents(pool, client));
        promises.push(saveOpenShortEvents(pool, client));
        promises.push(saveCloseShortEvents(pool, client));
        promises.push(saveAddLiquidityEvents(pool, client));
        promises.push(saveRemoveLiquidityEvents(pool, client));
    });

    await Promise.all(promises);

    promises = [];
    pools.forEach((pool) => {
        promises.push(saveTransferSingleEvents(pool, client));
    });

    await Promise.all(promises);
}

const mainnetPools = mainnetAppConfig.hyperdrives;

const morphoPools = mainnetPools.filter(({ name }) => name.includes("Morpho"));

saveEvents(morphoPools).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
