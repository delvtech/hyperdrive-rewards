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
export class PoolInfoAtBlock implements PoolInfoAtBlockInterface {
    // Extra data
    @PrimaryColumn()
    blockNumber: number;

    @Column({ name: "hyperdriveAddress", type: "character varying" })
    hyperdriveAddress: string;

    // PoolInfo data, stored as BigInt
    @Column({ name: "shareReserves" })
    shareReserves: string;

    @Column({ name: "shareAdjustment" })
    shareAdjustment: string;

    @Column({ name: "zombieBaseProceeds" })
    zombieBaseProceeds: string;

    @Column({ name: "zombieShareReserves" })
    zombieShareReserves: string;

    @Column({ name: "bondReserves" })
    bondReserves: string;

    @Column({ name: "lpTotalSupply" })
    lpTotalSupply: string;

    @Column({ name: "vaultSharePrice" })
    vaultSharePrice: string;

    @Column({ name: "longsOutstanding" })
    longsOutstanding: string;

    @Column({ name: "longAverageMaturityTime" })
    longAverageMaturityTime: string;

    @Column({ name: "shortsOutstanding" })
    shortsOutstanding: string;

    @Column({ name: "shortAverageMaturityTime" })
    shortAverageMaturityTime: string;

    @Column({ name: "withdrawalSharesReadyToWithdraw" })
    withdrawalSharesReadyToWithdraw: string;

    @Column({ name: "withdrawalSharesProceeds" })
    withdrawalSharesProceeds: string;

    @Column({ name: "lpSharePrice" })
    lpSharePrice: string;

    @Column({ name: "longExposure" })
    longExposure: string;
}

export interface PoolInfoAtBlockInterface {
    blockNumber: number;

    hyperdriveAddress: string;

    shareReserves: string;

    shareAdjustment: string;

    zombieBaseProceeds: string;

    zombieShareReserves: string;

    bondReserves: string;

    lpTotalSupply: string;

    vaultSharePrice: string;

    longsOutstanding: string;

    longAverageMaturityTime: string;

    shortsOutstanding: string;

    shortAverageMaturityTime: string;

    withdrawalSharesReadyToWithdraw: string;

    withdrawalSharesProceeds: string;

    lpSharePrice: string;

    longExposure: string;
}
