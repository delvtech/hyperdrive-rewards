import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Address } from "viem";

@Entity("pool_reward")
@Unique(["hyperdriveAddress", "rewardTokenAddress", "startBlock", "endBlock"])
export class PoolReward implements PoolRewardInterface {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "epoch" })
    epoch!: number;

    @Column({ name: "hyperdriveAddress" })
    hyperdriveAddress!: Address;

    @Column({ name: "rewardTokenAddress" })
    rewardTokenAddress!: Address;

    @Column({ name: "amount" })
    amount!: string;

    @Column({ name: "startBlock" })
    startBlock!: number;

    @Column({ name: "endBlock" })
    endBlock!: number;
}

export interface PoolRewardInterface {
    id: number;
    hyperdriveAddress: Address;
    rewardTokenAddress: Address;
    amount: string;
    epoch: number;
    startBlock: number;
    endBlock: number;
}
