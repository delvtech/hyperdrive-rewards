import { claimMorphoRewardsForPool } from "src/distributions/morpho/claimMorphoRewardsForPool";
import { getPoolAddresses } from "src/pools/all";
import { initializeDataSource } from "src/server/dataSource";
import { Address } from "viem";

async function main() {
    await initializeDataSource();
    const poolAddresses = getPoolAddresses();

    // do these sequentially to avoid nonce errors when submitting txns.
    for (const address of poolAddresses) {
        await claimMorphoRewardsForPool(address as Address);
    }
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
