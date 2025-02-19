import { mainnetAppConfig } from "src/appConfig/mainnet";
import { HyperdriveConfig } from "src/appConfig/types";
import { SupportedChainIds } from "src/helpers/chains";

export function getMorphoPools(chainId: SupportedChainIds): HyperdriveConfig[] {
    const pools = mainnetAppConfig.hyperdrives.filter(
        ({ chainId: poolChainId }) => poolChainId === Number(chainId),
    ) as HyperdriveConfig[];

    const morphoPools = pools.filter(({ name }) => name.includes("Morpho"));

    return morphoPools;
}
