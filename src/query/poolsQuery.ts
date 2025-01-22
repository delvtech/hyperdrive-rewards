import { parseEther } from "viem";
import { AppDataSource as dataSource } from "../dataSource";
import { PoolInfo } from "../entity/PoolInfo";
import { Wallet } from "../entity/Wallet";
import { FixedNumber } from "ethers";
import { ONE } from "../constants";
import { PoolConfig } from "../entity/PoolConfig";

export async function fetchHyperdriveAddressesForUser(
  walletAddress: string,
  chainId: number
): Promise<string[]> {
  const uniqueHyperdriveAddresses: { hyperdrive_address: string }[] =
    await dataSource
      .getRepository(Wallet)
      .createQueryBuilder("wallet_pnl")
      .select("DISTINCT wallet_pnl.hyperdrive_address", "hyperdrive_address")
      .where("wallet_pnl.wallet_address = :walletAddress", {
        walletAddress,
      })
      .getRawMany();

  return uniqueHyperdriveAddresses.map(
    ({ hyperdrive_address }) => hyperdrive_address
  );
}

export async function fetchAllHyperdriveAddresses(
  chainId: number
): Promise<string[]> {
  const uniqueHyperdriveAddresses: { hyperdrive_address: string }[] =
    await dataSource
      .getRepository(PoolConfig)
      .createQueryBuilder("pool_config")
      .select("DISTINCT hyperdrive_address", "hyperdrive_address")
      .getRawMany();

  return uniqueHyperdriveAddresses.map(
    ({ hyperdrive_address }) => hyperdrive_address
  );
}
