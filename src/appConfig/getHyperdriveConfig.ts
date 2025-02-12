import { mainnetAppConfig } from "src/appConfig/mainnet";
import { HyperdriveConfig } from "src/appConfig/types";
import { Address } from "viem";

export function getHyperdriveConfig(hyperdriveAddress: Address) {
    const poolConfig = mainnetAppConfig.hyperdrives.find(
        ({ address }) => address === hyperdriveAddress,
    ) as HyperdriveConfig;

    if (!poolConfig) {
        throw new Error("fetchRewardsEpoch: Invalid hyperdriveAddress");
    }
    return poolConfig;
}
