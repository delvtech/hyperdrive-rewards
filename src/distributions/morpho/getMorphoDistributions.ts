import { getHyperdriveConfig } from "src/appConfig/getHyperdriveConfig";
import { getMorphoRewardsInfo } from "src/distributions/morpho/getMorphoRewardsInfo";
import {
    MORPHO_TOKEN,
    MorphoApiResponse,
} from "src/distributions/morpho/morpho";
import { Address } from "viem";

export async function getMorphoRewardsForPool(hyperdriveAddress: Address) {
    // Setup
    const poolConfig = getHyperdriveConfig(hyperdriveAddress);
    const rewardTokenAddress = MORPHO_TOKEN;

    // Get the distribution information from Morpho.
    const rewardsInfo: MorphoApiResponse =
        await getMorphoRewardsInfo(hyperdriveAddress);

    // If there are no rewards, skip.
    if (rewardsInfo.data.length === 0) {
        console.log(`Distribution not found for pool: ${hyperdriveAddress}`);
        return;
    }

    // Look for the morpho token distribution, ignoring the legacy token for now.
    const distribution = rewardsInfo.data.find((dataItem) => {
        const { asset, user } = dataItem;
        return (
            asset.address === rewardTokenAddress && user === hyperdriveAddress
        );
    });

    // If there is no distribution for this pool, skip.
    if (!distribution) {
        console.log(
            `Distribution not found for pool: ${hyperdriveAddress} and token: ${rewardTokenAddress}`,
        );
        return;
    }

    return distribution;
}
