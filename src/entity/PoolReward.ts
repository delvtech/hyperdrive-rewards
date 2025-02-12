import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pool_reward")
export class PoolReward {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    epoch!: number;

    @Column()
    hyperdriveAddress!: string;

    @Column()
    tokenAddress!: string;

    @Column()
    amount!: string;

    @Column()
    startBlock!: number;

    @Column()
    endBlock!: number;
}
