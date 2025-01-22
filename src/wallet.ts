import { Request, Response, Router } from "express";
import { AppDataSource } from "./dataSource";
import { Wallet } from "./entity/Wallet";

export const walletRouter = Router();

export interface WalletRequest extends Request {
  params: {
    limit: string;
  };
}

walletRouter.get(
  "/pnl/:limit",
  async (req: WalletRequest, res: Response): Promise<void> => {
    const { limit } = req.params;
    const records = await fetchWalletPnlRecords(Number(limit));
    res.json(records);
  }
);

const fetchWalletPnlRecords = async (limit: number): Promise<Wallet[]> => {
  let records: Wallet[] = [];
  const walletTable = AppDataSource.getRepository(Wallet);
  records = await walletTable.find({
    take: limit,
  });

  return records;
};

walletRouter.get(
  "/addresses/:chainId",
  async (req: Request, res: Response): Promise<void> => {
    const { chainId } = req.params;
    const records = await fetchWalletAddresses(Number(chainId));
    res.json(records);
  }
);

export const fetchWalletAddresses = async (
  chainId: number
): Promise<string[]> => {
  let records: string[] = [];
  const walletTable = AppDataSource.getRepository(Wallet);
  const rows = await walletTable
    .createQueryBuilder("wallet_pnl")
    .select("DISTINCT wallet_pnl.wallet_address", "wallet_address")
    .getRawMany();
  records = rows.map((row) => row.wallet_address);

  return records;
};
