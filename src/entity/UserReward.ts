import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Address } from "viem";

@Entity("user_reward")
@Unique(["epoch", "rewardTokenAddress", "userAddress", "hyperdriveAddress"])
export class UserReward implements UserRewardInterface {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "epoch" })
    epoch!: number;

    @Column({ name: "hyperdriveAddress" })
    hyperdriveAddress!: Address;

    @Column({ name: "rewardTokenAddress" })
    rewardTokenAddress!: Address;

    @Column({ name: "userAddress" })
    userAddress!: Address;

    @Column({ name: "amount" })
    amount!: string;

    @Column({ name: "startBlock" })
    startBlock!: number;

    @Column({ name: "endBlock" })
    endBlock!: number;
}

export interface UserRewardInterface {
    id: number;
    epoch: number;
    hyperdriveAddress: Address;
    rewardTokenAddress: Address;
    userAddress: Address;
    amount: string;
    startBlock: number;
    endBlock: number;
}
