import { getHyperdriveConfig } from "src/appConfig/getHyperdriveConfig";
import { claimMorphoRewards } from "src/distributions/morpho/claimMorphoRewards";
import { getMorphoRewardsInfo } from "src/distributions/morpho/getMorphoRewardsInfo";
import {
    MORPHO_TOKEN,
    MorphoApiResponse,
} from "src/distributions/morpho/morpho";
import { sweepMorphoRewards } from "src/distributions/morpho/sweepMorphoRewards";
import { transferMorphoRewards } from "src/distributions/morpho/transferMorphoRewards";
import { PoolReward } from "src/entity/PoolReward";
import { SupportedChainIds } from "src/helpers/chains";
import { getReadClient, getWriteClient } from "src/helpers/client";
import { queryLastPoolReward } from "src/query/queryLastPoolReward";
import { AppDataSource } from "src/server/dataSource";
import { Address } from "viem";

export async function claimMorphoRewardsForPool(hyperdriveAddress: Address) {
    // Setup
    const poolConfig = getHyperdriveConfig(hyperdriveAddress);
    const chainId = String(poolConfig.chainId) as SupportedChainIds;
    const publicClient = getReadClient(chainId);
    const walletClient = getWriteClient(chainId);
    const rewardTokenAddress = MORPHO_TOKEN;

    // Get the distribution information from Morpho.
    const rewardsInfo: MorphoApiResponse =
        await getMorphoRewardsInfo(hyperdriveAddress);

    // If there are no rewards for the pool, skip.
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

    // If there is no distribution for the token, skip.
    if (!distribution) {
        console.log(
            `Distribution not found for pool: ${hyperdriveAddress} and token: ${rewardTokenAddress}`,
        );
        return;
    }

    // Try to claim any rewards.
    const { amount, blockNumber } = await claimMorphoRewards(
        publicClient,
        walletClient,
        hyperdriveAddress,
        distribution,
    );

    // If nothing was claimed then there's no update to the PoolReward table.
    if (!amount) {
        return;
    }

    // Find the latest reward for this pool.
    const lastPoolReward = await queryLastPoolReward(
        hyperdriveAddress,
        rewardTokenAddress,
    );

    // Construct the PoolReward entry.
    const poolReward = new PoolReward();
    // If this is the first reward claimed for the pool, use initial values.
    if (lastPoolReward === null) {
        poolReward.epoch = 0;
        poolReward.startBlock = Number(poolConfig.initializationBlock);
    }

    // Otherwise we'll increment appropriately.
    else {
        poolReward.epoch = lastPoolReward.epoch + 1;
        poolReward.startBlock = lastPoolReward.endBlock + 1;
    }
    poolReward.amount = amount.toString();
    poolReward.endBlock = Number(blockNumber);
    poolReward.hyperdriveAddress = hyperdriveAddress;
    poolReward.rewardTokenAddress = rewardTokenAddress;

    // Log the claim to the database.
    await AppDataSource.createQueryBuilder()
        .insert()
        .into(PoolReward)
        .values(poolReward)
        .orIgnore() // This will ignore duplicate transaction hashes.
        .execute();

    // Sweep the rewards from pool.
    await sweepMorphoRewards(
        rewardTokenAddress,
        hyperdriveAddress,
        publicClient,
        distribution,
    );

    // Transfer to HyperdriveRewards.
    await transferMorphoRewards(publicClient, chainId, rewardTokenAddress);
}
