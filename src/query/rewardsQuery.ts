import { parseEther } from "viem";
import { AppDataSource as dataSource } from "../dataSource";
import { PoolInfo } from "../entity/PoolInfo";
import { Wallet } from "../entity/Wallet";
import { FixedNumber } from "ethers";
import { ONE } from "../constants";

interface RawQueryResult {
  p_block_number: string; // bigint in DB
  p_epoch_timestamp: string; // bigint in DB
  p_share_reserves: string; // numeric parsed as bigint with 18 decimals
  p_lp_total_supply: string; // numeric parsed as bigint with 18 decimals
  p_vault_share_price: string; // numeric parsed as bigint with 18 decimals
  p_shorts_outstanding: string; // numeric parsed as bigint with 18 decimals
  p_lp_share_price: string; // numeric parsed as bigint with 18 decimals
  p_vault_shares: string; // numeric parsed as bigint with 18 decimals
  w_hyperdrive_address: string; // character varying in DB
  w_token_type: string; // character varying in DB
  w_token_balance: string; // numeric parsed as bigint with 18 decimals
  w_wallet_address: string; // character varying in DB
}
interface QueryResult {
  block_number: string; // bigint in DB
  epoch_timestamp: string; // bigint in DB
  share_reserves: bigint; // numeric parsed as bigint with 18 decimals
  lp_total_supply: bigint; // numeric parsed as bigint with 18 decimals
  vault_share_price: bigint; // numeric parsed as bigint with 18 decimals
  shorts_outstanding: bigint; // numeric parsed as bigint with 18 decimals
  lp_share_price: bigint; // numeric parsed as bigint with 18 decimals
  vault_shares: bigint; // numeric parsed as bigint with 18 decimals
  hyperdrive_address: string; // character varying in DB
  token_type: string; // character varying in DB
  token_balance: bigint; // numeric parsed as bigint with 18 decimals
  wallet_address: string; // character varying in DB
}

export async function fetchRewardsForUser(address: string) {
  const uniqueHyperdriveAddresses: { hyperdrive_address: string }[] =
    await dataSource
      .getRepository(Wallet)
      .createQueryBuilder("wallet_pnl")
      .select("DISTINCT wallet_pnl.hyperdrive_address", "hyperdrive_address")
      .where("wallet_pnl.wallet_address = :walletAddress", {
        walletAddress: address,
      })
      .getRawMany();

  const promises = uniqueHyperdriveAddresses.map(({ hyperdrive_address }) => {
    return dataSource
      .getRepository(PoolInfo)
      .createQueryBuilder("p")
      .leftJoinAndMapMany(
        "p.wallet_pnl",
        Wallet,
        "w",
        "p.block_number = w.block_number AND w.wallet_address = :walletAddress AND w.hyperdrive_address = :hyperdriveAddress AND (w.token_type = 'SHORT' OR w.token_type = 'LP')"
      )
      .where("p.hyperdrive_address = :hyperdriveAddress", {
        hyperdrive_address,
      })
      .setParameter("walletAddress", address)
      .setParameter("hyperdriveAddress", hyperdrive_address)
      .orderBy("p.block_number", "ASC")
      .select([
        "p.block_number",
        "p.epoch_timestamp",
        "p.share_reserves",
        "p.lp_total_supply",
        "p.vault_share_price",
        "p.shorts_outstanding",
        "p.lp_share_price",
        "p.vault_shares",
        "w.hyperdrive_address",
        "w.token_type",
        "w.token_balance",
        "w.wallet_address",
      ])
      .getRawMany();
  });

  const rawResults: RawQueryResult[][] = (await Promise.all(
    promises
  )) as unknown as RawQueryResult[][];

  const queryResults: QueryResult[][] = rawResults.map((poolResults) =>
    poolResults.map((result) => {
      const {
        p_block_number,
        p_epoch_timestamp,
        p_share_reserves,
        p_lp_total_supply,
        p_vault_share_price,
        p_shorts_outstanding,
        p_vault_shares,
        p_lp_share_price,
        w_token_balance,
        w_token_type,
        w_wallet_address,
        w_hyperdrive_address,
      } = result;
      const parsedResult: QueryResult = {
        block_number: p_block_number,
        epoch_timestamp: p_epoch_timestamp,
        share_reserves: parseEther(p_share_reserves),
        lp_total_supply: parseEther(p_lp_total_supply),
        vault_share_price: parseEther(p_vault_share_price),
        shorts_outstanding: parseEther(p_shorts_outstanding),
        lp_share_price: parseEther(p_lp_share_price),
        vault_shares: parseEther(p_vault_shares),
        hyperdrive_address: w_hyperdrive_address,
        token_type: w_token_type,
        token_balance: parseEther(w_token_balance ?? "0"),
        wallet_address: w_wallet_address,
      };
      return parsedResult;
    })
  );

  const resultsByPool = uniqueHyperdriveAddresses.map(
    ({ hyperdrive_address }, index) => {
      return {
        hyperdrive_address,
        results: queryResults[index],
      };
    }
  );

  const percentLPByPool = resultsByPool.map(
    ({ hyperdrive_address, results }) => {
      let previousResult: QueryResult = results[0];
      results.shift();
      const percents = results.map((result) => {
        const { epoch_timestamp } = result;
        const totalLpPortion = FixedNumber.fromValue(
          previousResult.share_reserves - previousResult.shorts_outstanding,
          18
        );
        let timeWeightedPercent = FixedNumber.fromValue(0, 18);
        if (
          previousResult.token_type === "LP" &&
          previousResult.token_balance > 0
        ) {
          const startTime = FixedNumber.fromValue(
            BigInt(previousResult.epoch_timestamp) * ONE,
            18
          );
          const endTime = FixedNumber.fromValue(
            BigInt(epoch_timestamp) * ONE,
            18
          );
          const time = endTime.sub(startTime);
          timeWeightedPercent = time
            .mul(FixedNumber.fromValue(previousResult.token_balance, 18))
            .div(totalLpPortion);
        }
        previousResult = result;
        return { hyperdrive_address, timeWeightedPercent };
      });

      const startTime = FixedNumber.fromValue(
        BigInt(results[0].epoch_timestamp) * ONE,
        18
      );
      const endTime = FixedNumber.fromValue(
        BigInt(results[results.length - 1].epoch_timestamp) * ONE,
        18
      );

      const summedPercents = percents.reduce((acc, percent) => {
        return acc.add(percent.timeWeightedPercent);
      }, FixedNumber.fromValue(0, 18));

      const percentLP = endTime.gt(startTime)
        ? summedPercents.div(endTime.sub(startTime))
        : FixedNumber.fromValue(0, 18);

      return { hyperdrive_address, percentLP };
    }
  );

  const percentShortByPool = resultsByPool.map(
    ({ hyperdrive_address, results }) => {
      let previousResult: QueryResult = results[0];
      results.shift();
      const percents = results.map((result) => {
        const { epoch_timestamp } = result;
        const totalShortPortion = FixedNumber.fromValue(
          previousResult.shorts_outstanding,
          18
        );
        let timeWeightedPercent = FixedNumber.fromValue(0, 18);
        if (
          previousResult.token_type === "SHORT" &&
          previousResult.token_balance > 0
        ) {
          const startTime = FixedNumber.fromValue(
            BigInt(previousResult.epoch_timestamp) * ONE,
            18
          );
          const endTime = FixedNumber.fromValue(
            BigInt(epoch_timestamp) * ONE,
            18
          );
          const time = endTime.sub(startTime);
          timeWeightedPercent = time
            .mul(FixedNumber.fromValue(previousResult.token_balance, 18))
            .div(totalShortPortion);
        }
        previousResult = result;
        return { hyperdrive_address, timeWeightedPercent };
      });

      const startTime = FixedNumber.fromValue(
        BigInt(results[0].epoch_timestamp) * ONE,
        18
      );
      const endTime = FixedNumber.fromValue(
        BigInt(results[results.length - 1].epoch_timestamp) * ONE,
        18
      );

      const summedPercents = percents.reduce((acc, percent) => {
        return acc.add(percent.timeWeightedPercent);
      }, FixedNumber.fromValue(0, 18));

      const percentShort = endTime.gt(startTime)
        ? summedPercents.div(endTime.sub(startTime))
        : FixedNumber.fromValue(0, 18);

      return { hyperdrive_address, percentShort };
    }
  );

  return { address, percentLPByPool, percentShortByPool };
}
