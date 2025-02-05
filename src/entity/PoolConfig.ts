import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pool_config")
export class PoolConfig {
    @PrimaryGeneratedColumn("uuid")
    hyperdrive_address: string;

    @Column({ type: "varchar" })
    base_token: string;

    @Column({ type: "varchar" })
    vault_shares_token: string;

    @Column({ type: "varchar" })
    linker_factory: string;

    @Column({ type: "numeric" })
    initial_vault_share_price: number;

    @Column({ type: "numeric" })
    minimum_share_reserves: number;

    @Column({ type: "numeric" })
    minimum_transaction_amount: number;

    @Column({ type: "numeric" })
    circuit_breaker_delta: number;

    @Column({ type: "integer" })
    position_duration: number;

    @Column({ type: "integer" })
    checkpoint_duration: number;

    @Column({ type: "numeric" })
    time_stretch: number;

    @Column({ type: "varchar" })
    governance: string;

    @Column({ type: "varchar" })
    fee_collector: string;

    @Column({ type: "varchar" })
    sweep_collector: string;

    @Column({ type: "numeric" })
    curve_fee: number;

    @Column({ type: "numeric" })
    flat_fee: number;

    @Column({ type: "numeric" })
    governance_lp_fee: number;

    @Column({ type: "numeric" })
    governance_zombie_fee: number;

    @Column({ type: "numeric" })
    inv_time_stretch: number;
}
