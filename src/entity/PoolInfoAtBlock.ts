import { Column, Entity, PrimaryColumn, ValueTransformer } from "typeorm";

// Converts database numeric strings to BigInt
export class BigIntTransformer implements ValueTransformer {
    from(value: string | null): BigInt | null {
        return value ? BigInt(value) : null;
    }
    to(value: BigInt | null): string | null {
        return value ? value.toString() : null;
    }
}

@Entity("pool_info_at_block")
export class PoolInfoAtBlock {
    // Extra data
    @PrimaryColumn()
    blockNumber: number;

    @Column({ type: "character varying" })
    hyperdriveAddress: string;

    // @Column({ type: "timestamp without time zone" })
    // timestamp: Date;

    // @Column({ type: "numeric" })
    // hyperdrive_base_balance: number;

    // @Column({ type: "numeric" })
    // hyperdrive_eth_balance: number;

    // @Column({ type: "numeric" })
    // vault_shares: number;

    // PoolInfo data, stored as BigInt
    @Column()
    shareReserves: string;

    @Column()
    shareAdjustment: string;

    @Column()
    zombieBaseProceeds: string;

    @Column()
    zombieShareReserves: string;

    @Column()
    bondReserves: string;

    @Column()
    lpTotalSupply: string;

    @Column()
    vaultSharePrice: string;

    @Column()
    longsOutstanding: string;

    @Column()
    longAverageMaturityTime: string;

    @Column()
    shortsOutstanding: string;

    @Column()
    shortAverageMaturityTime: string;

    @Column()
    withdrawalSharesReadyToWithdraw: string;

    @Column()
    withdrawalSharesProceeds: string;

    @Column()
    lpSharePrice: string;

    @Column()
    longExposure: string;
}
