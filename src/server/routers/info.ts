import { ZeroAddress } from "ethers";
import { Request, Response, Router } from "express";
import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { getHyperdriveConfig } from "src/appConfig/getHyperdriveConfig";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { LP_ASSET_ID } from "src/helpers/assets";
import { AppDataSource } from "src/server/dataSource";
import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { convertBigIntToString } from "../../helpers/conversion";

export const infoRouter = Router();

infoRouter.get("/pools/all/addresses", async (req: Request, res: Response) => {
    const uniqueHyperdriveAddresses: { hyperdriveAddress: string }[] =
        await AppDataSource.getRepository(PoolInfoAtBlock)
            .createQueryBuilder("pool_info_at_block")
            .select('DISTINCT "hyperdriveAddress"', "hyperdriveAddress")
            .getRawMany();
    console.log("uniqueHyperdriveAddresses", uniqueHyperdriveAddresses);
    res.json(uniqueHyperdriveAddresses);
});

infoRouter.get("/pools/all/configs", async (req: Request, res: Response) => {
    const uniqueHyperdriveAddresses: { hyperdriveAddress: Address }[] =
        await AppDataSource.getRepository(PoolInfoAtBlock)
            .createQueryBuilder("pool_info_at_block")
            .select('DISTINCT "hyperdriveAddress"', "hyperdriveAddress")
            .getRawMany();
    const hyperdrivePools = uniqueHyperdriveAddresses.map(
        ({ hyperdriveAddress }) => getHyperdriveConfig(hyperdriveAddress),
    );

    res.json(convertBigIntToString(hyperdrivePools));
});

infoRouter.get("/pools/all/infos", async (req: Request, res: Response) => {
    const uniqueHyperdriveAddresses: { hyperdriveAddress: Address }[] =
        await AppDataSource.getRepository(PoolInfoAtBlock)
            .createQueryBuilder("pool_info_at_block")
            .select('DISTINCT "hyperdriveAddress"', "hyperdriveAddress")
            .getRawMany();

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    const promises = uniqueHyperdriveAddresses.map(
        async ({ hyperdriveAddress }) => {
            return client.readContract({
                abi: hyperdriveReadAbi,
                address: hyperdriveAddress,
                functionName: "getPoolInfo",
            });
        },
    );
    const blockNumber = await client.getBlockNumber();

    const infos = await Promise.all(promises);
    const stringifiedInfos = infos.map((poolInfoRaw, index) => {
        const poolInfoAtBlock: any = {};
        poolInfoAtBlock.blockNumber = blockNumber.toString();
        poolInfoAtBlock.hyperdriveAddress = uniqueHyperdriveAddresses[index];
        poolInfoAtBlock.shareReserves = poolInfoRaw.shareReserves.toString();
        poolInfoAtBlock.shareAdjustment =
            poolInfoRaw.shareAdjustment.toString();
        poolInfoAtBlock.zombieBaseProceeds =
            poolInfoRaw.zombieBaseProceeds.toString() || "0";
        poolInfoAtBlock.zombieShareReserves =
            poolInfoRaw.zombieShareReserves.toString();
        poolInfoAtBlock.bondReserves = poolInfoRaw.bondReserves.toString();
        poolInfoAtBlock.lpTotalSupply = poolInfoRaw.lpTotalSupply.toString();
        poolInfoAtBlock.vaultSharePrice =
            poolInfoRaw.vaultSharePrice.toString();
        poolInfoAtBlock.longsOutstanding =
            poolInfoRaw.longsOutstanding.toString();
        poolInfoAtBlock.longAverageMaturityTime =
            poolInfoRaw.longAverageMaturityTime.toString();
        poolInfoAtBlock.shortsOutstanding =
            poolInfoRaw.shortsOutstanding.toString();
        poolInfoAtBlock.shortAverageMaturityTime =
            poolInfoRaw.shortAverageMaturityTime.toString();
        poolInfoAtBlock.withdrawalSharesReadyToWithdraw =
            poolInfoRaw.withdrawalSharesReadyToWithdraw.toString();
        poolInfoAtBlock.withdrawalSharesProceeds =
            poolInfoRaw.withdrawalSharesProceeds.toString();
        poolInfoAtBlock.lpSharePrice = poolInfoRaw.lpSharePrice.toString();
        poolInfoAtBlock.longExposure = poolInfoRaw.longExposure.toString();

        return poolInfoAtBlock;
    });
    res.json(stringifiedInfos);
});

infoRouter.get("/pools/all/zero", async (req: Request, res: Response) => {
    const uniqueHyperdriveAddresses: { hyperdriveAddress: Address }[] =
        await AppDataSource.getRepository(PoolInfoAtBlock)
            .createQueryBuilder("pool_info_at_block")
            .select('DISTINCT "hyperdriveAddress"', "hyperdriveAddress")
            .getRawMany();

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    const promises = uniqueHyperdriveAddresses.map(
        async ({ hyperdriveAddress }) => {
            const balance = await client.readContract({
                abi: hyperdriveReadAbi,
                address: hyperdriveAddress,
                functionName: "balanceOf",
                args: [BigInt(LP_ASSET_ID), ZeroAddress as Address],
            });
            return { hyperdriveAddress, balance: balance.toString() };
        },
    );
    const balances = await Promise.all(promises);
    res.json(balances);
});
