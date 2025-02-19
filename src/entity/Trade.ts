import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("trades")
export class Trade implements TradeInterface {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "type" })
    type: string;

    @Column({ name: "hyperdriveAddress" })
    hyperdriveAddress: string;

    @Column({
        name: "transactionHash",
        type: "varchar",
        length: 66,
        unique: true,
    }) // Unique index
    transactionHash!: string;

    @Column({ name: "trader" })
    trader!: string;

    @Column({ name: "assetId" })
    assetId!: string;

    @Column({ name: "blockNumber" })
    blockNumber!: number;

    @Column({ name: "blockTime" })
    blockTime!: number;

    @Column({ name: "maturityTime" })
    maturityTime!: string;

    @Column({ name: "amount" })
    amount!: string;

    @Column({ name: "vaultSharePrice" })
    vaultSharePrice!: string;

    @Column({ name: "asBase" })
    asBase!: boolean;

    @Column({ name: "bondAmount" })
    bondAmount!: string;

    @Column({ name: "baseProceeds" })
    baseProceeds!: string;

    @Column({ name: "balanceAtBlock" })
    balanceAtBlock!: string;
}

export interface TradeInterface {
    id: number;
    type: string;
    hyperdriveAddress: string;
    transactionHash: string;
    trader: string;
    assetId: string;
    blockNumber: number;
    blockTime: number;
    maturityTime: string;
    amount: string;
    vaultSharePrice: string;
    asBase: boolean;
    bondAmount: string;
    baseProceeds: string;
    balanceAtBlock: string;
}
