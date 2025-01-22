import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from "typeorm";

@Entity("pool_info")
export class PoolInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  block_number: bigint;

  @Column({ type: "character varying" })
  hyperdrive_address: string;

  @Column({ type: "timestamp without time zone" })
  timestamp: Date;

  @Column({ type: "bigint" })
  epoch_timestamp: bigint;

  @Column({ type: "numeric" })
  share_reserves: number;

  @Column({ type: "numeric" })
  share_adjustment: number;

  @Column({ type: "numeric" })
  zombie_base_proceeds: number;

  @Column({ type: "numeric" })
  zombie_share_reserves: number;

  @Column({ type: "numeric" })
  bond_reserves: number;

  @Column({ type: "numeric" })
  lp_total_supply: number;

  @Column({ type: "numeric" })
  vault_share_price: number;

  @Column({ type: "numeric" })
  longs_outstanding: number;

  @Column({ type: "numeric" })
  long_average_maturity_time: number;

  @Column({ type: "numeric" })
  shorts_outstanding: number;

  @Column({ type: "numeric" })
  short_average_maturity_time: number;

  @Column({ type: "numeric" })
  withdrawal_shares_ready_to_withdraw: number;

  @Column({ type: "numeric" })
  withdrawal_shares_proceeds: number;

  @Column({ type: "numeric" })
  lp_share_price: number;

  @Column({ type: "numeric" })
  long_exposure: number;

  @Column({ type: "numeric" })
  total_supply_withdrawal_shares: number;

  @Column({ type: "numeric" })
  gov_fees_accrued: number;

  @Column({ type: "numeric" })
  hyperdrive_base_balance: number;

  @Column({ type: "numeric" })
  hyperdrive_eth_balance: number;

  @Column({ type: "numeric" })
  variable_rate: number;

  @Column({ type: "numeric" })
  vault_shares: number;

  @Column({ type: "numeric" })
  spot_price: number;

  @Column({ type: "numeric" })
  fixed_rate: number;
}

// Converts database numeric strings to BigInt
export class BigIntTransformer implements ValueTransformer {
  from(value: string | null): BigInt | null {
    return value ? BigInt(value) : null;
  }
  to(value: BigInt | null): string | null {
    return value ? value.toString() : null;
  }
}

// Converts database numeric strings to Number
export class NumberTransformer implements ValueTransformer {
  from(value: string | null): number | null {
    return value ? Number(value) : null;
  }
  to(value: number | null): number | null {
    return value ? value : null;
  }
}
