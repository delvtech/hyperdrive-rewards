import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("wallet_pnl")
export class Wallet {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  hyperdrive_address: string;

  @Column()
  block_number: string;

  @Column()
  wallet_address: string;

  @Column()
  token_type: string;

  @Column()
  maturity_time: string;

  @Column()
  token_id: string;

  @Column()
  token_balance: string;

  @Column()
  unrealized_value: string;

  @Column()
  pnl: string;

  @Column()
  last_balance_update_block: string;
}
