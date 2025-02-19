import { MorphoApiResponse } from "src/distributions/morpho/morpho";
import { Address } from "viem";

export async function getMorphoRewardsInfo(
    hyperdriveAddress: Address,
): Promise<MorphoApiResponse> {
    const url = `https://rewards.morpho.org/v1/users/${hyperdriveAddress}/distributions`;
    const response = await fetch(url);
    const rewardInfo: MorphoApiResponse = await response.json();

    return rewardInfo;
}
