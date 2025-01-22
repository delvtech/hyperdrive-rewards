import { Request, Response, Router } from "express";
import { AppDataSource } from "./dataSource";
import { PoolInfo } from "./entity/PoolInfo";
import { Address } from "viem";
import { PoolConfig } from "./entity/PoolConfig";

export const poolRouter = Router();

export interface WalletRequest extends Request {
  params: {
    address: Address;
  };
}

poolRouter.get(
  "/info/:address",
  async (req: WalletRequest, res: Response): Promise<void> => {
    const { address } = req.params;
    const records = await fetchPoolInfo(address);
    res.json(records);
  }
);

const fetchPoolInfo = async (address: Address): Promise<PoolInfo[]> => {
  let records: PoolInfo[] = [];
  const poolInfoTable = AppDataSource.getRepository(PoolInfo);
  records = await poolInfoTable.find({
    take: 10,
  });

  return records;
};

poolRouter.get(
  "/config/:address/:chainId",
  async (req: Request, res: Response) => {
    const { address } = req.params;
    const config: PoolConfig | null = await AppDataSource.getRepository(
      PoolConfig
    ).findOne({
      where: { hyperdrive_address: address },
    });
    res.json(config);
  }
);
