import { Request, Response, Router } from "express";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { AppDataSource } from "src/server/dataSource";

export const infoRouter = Router();

// TODO: add chainId to query
infoRouter.get("/pools/:chainId", async (req: Request, res: Response) => {
    const { chaindId } = req.params;
    const uniqueHyperdriveAddresses: { hyperdrive_address: string }[] =
        await AppDataSource.getRepository(PoolInfoAtBlock)
            .createQueryBuilder("pool_info_at_block")
            .select("DISTINCT hyperdriveAddress", "hyperdriveAddress")
            .getRawMany();
    res.json(uniqueHyperdriveAddresses);
});
