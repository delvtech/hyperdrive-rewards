import { PoolReward } from "src/entity/PoolReward";
import { AppDataSource } from "src/server/dataSource";

// Gets the previous PoolReward if there is one.
export async function queryLastPoolReward(
    hyperdriveAddress: string,
    rewardTokenAddress: string,
): Promise<PoolReward | null> {
    const repository = AppDataSource.getRepository(PoolReward);

    const latestReward = await repository
        .createQueryBuilder("pool_reward")
        .where("pool_reward.hyperdriveAddress = :hyperdriveAddress", {
            hyperdriveAddress,
        })
        .andWhere("pool_reward.rewardTokenAddress = :rewardTokenAddress", {
            rewardTokenAddress,
        })
        .orderBy("pool_reward.epoch", "DESC")
        .getOne();

    return latestReward;
}
