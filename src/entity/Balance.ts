import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("balances")
export class Balance {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    hyperdriveAddress!: string;

    @Column()
    trader!: string;

    @Column()
    assetId!: string;

    @Column()
    assetType!: string;

    @Column()
    balance!: string;

    @Column()
    blockNumber!: number;
}
