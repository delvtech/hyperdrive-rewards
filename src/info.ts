import { Request, Response, Router } from "express";
import { AppDataSource } from "./dataSource";
import { PoolInfo } from "./entity/PoolInfo";

export const infoRouter = Router();

infoRouter.get("/pools/:chainId", async (req: Request, res: Response) => {
  const { chaindId } = req.params;
  const uniqueHyperdriveAddresses: { hyperdrive_address: string }[] =
    await AppDataSource.getRepository(PoolInfo)
      .createQueryBuilder("pool_info")
      .select("DISTINCT hyperdrive_address", "hyperdrive_address")
      .getRawMany();
  console.log("uniqueHyperdriveAddresses", uniqueHyperdriveAddresses);
  res.json(uniqueHyperdriveAddresses);
});
