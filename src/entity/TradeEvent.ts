import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("trades")
export class Trade {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "character varying" })
    hyperdriveAddress: string;

    @Column({ type: "varchar", length: 66, unique: true }) // Unique index
    transactionHash!: string;

    @Column()
    trader!: string;

    @Column()
    assetId!: string;

    @Column()
    blockNumber!: number;

    @Column()
    maturityTime!: string;

    @Column()
    amount!: string;

    @Column()
    vaultSharePrice!: string;

    @Column()
    asBase!: boolean;

    @Column()
    bondAmount!: string;

    @Column()
    baseProceeds!: string;

    @Column()
    balanceAtBlock!: string;

    // @CreateDateColumn()
    // timestamp!: Date;
}
