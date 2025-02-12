import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_reward")
export class UserReward {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    epoch!: number;

    @Column()
    hyperdriveAddress!: string;

    @Column()
    tokenAddress!: string;

    @Column()
    userAddress!: string;

    @Column()
    amount!: string;

    @Column()
    startBlock!: number;

    @Column()
    endBlock!: number;
}
