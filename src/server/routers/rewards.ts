import { Request, Response, Router } from "express";
import { mainnetAppConfig } from "src/appConfig/mainnet";
import { queryRewardsForUser } from "src/query/queryRewardsForUser";
import { Address, formatEther } from "viem";
import { convertBigIntToString } from "../../helpers/conversion";

export const rewardsRouter = Router();

export interface RewardsResponse {
    userAddress: Address;
    rewards: Reward[];
}

export interface Reward {
    chainId: number;
    claimContractAddress: Address;
    claimableAmount: string;
    pendingAmount: string;
    rewardTokenAddress: Address;
    merkleProof: string[] | null;
    merkleProofLastUpdated: number;
}

interface RewardsRequest extends Request {
    params: {
        address: Address;
    };
}

/**
 * @swagger
 * /get/rewards/user/{address}:
 *   get:
 *     summary: Get rewards for an address.
 *     description: Returns the rewards associated with a specific address.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The address to retrieve rewards for.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RewardsResponse'
 *       400:
 *         description: Bad request
 */
rewardsRouter.get(
    "/user/:address",
    async (req: RewardsRequest, res: Response) => {
        const { address } = req.params;
        const { rewards } = await queryRewardsForUser(address);

        const rewardsResponse: RewardsResponse = {
            userAddress: address,
            rewards,
        };

        res.json(rewardsResponse);
    },
);

/**
 * @swagger
 * /get/rewards/all:
 *   get:
 *     summary: Get rewards for all users.
 *     description: Returns the rewards associated with a specific address.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RewardsResponse'
 *       400:
 *         description: Bad request
 */
rewardsRouter.get("/all", async (req: RewardsRequest, res: Response) => {
    const morphoRewards = Object.entries(mainnetAppConfig.rewards)
        .filter(([address, rewards]) => {
            return rewards.find((value) =>
                value.toLowerCase().startsWith("morpho"),
            );
        })
        .map(([address, rewards]) => {
            return address.split(":")[3];
        });
    console.log("morphoRewards", morphoRewards);

    const results = mainnetAppConfig.hyperdrives
        .filter(({ address }) => {
            return morphoRewards.includes(address);
        })
        .map(({ address, name, chainId }) => {
            return {
                address,
                name,
                chainId,
            };
        });
    console.log("results", results);

    const users: Address[] = [
        "0x9eB168Ab44B7c479431681558FdF34230c969DE9",
        "0x5BE217bCF537377d0D5dB025f0ddD57CefF8dA84",
        "0xC3831C1C63dC1dB31d30Ab90C1768697bFdf87f7",
        "0x91cfD910E0B93911482706e9f1523541C6c1f837",
        "0x4206eD0b6dDe3283a286f5c9b7aC87f3c790B056",
        "0x7837560135d66E8cf745e665781574178Da26097",
        "0xA9DdD91249DFdd450E81E1c56Ab60E1A62651701",
        "0xF6094C3A380AD6161Fb8240F3043392A0E427CAC",
        "0xdF7Eea635c890caf0467Ab9912d96b924A0Ce482",
    ];
    const promises = users.map((address) => queryRewardsForUser(address));
    const rewards = await Promise.all(promises);

    // DEBUG
    const totals: Record<
        string,
        {
            totalLP: bigint;
            totalShort: bigint;
            poolLP: bigint;
            poolShort: bigint;
        }
    > = {};
    const sums = rewards.map(({ sumTotalsForPools }) => sumTotalsForPools);
    sums.forEach((sum) => {
        const [hyperdriveAddress, { totalLP, totalShort, poolLP, poolShort }] =
            Object.entries(sum)[0];
        if (!totals[hyperdriveAddress]) {
            totals[hyperdriveAddress] = {
                totalLP,
                totalShort,
                poolLP,
                poolShort,
            };
        } else {
            if (totals[hyperdriveAddress].poolLP !== poolLP) {
                console.log(
                    "poolLP mismatch",
                    hyperdriveAddress,
                    totals[hyperdriveAddress].poolLP,
                    poolLP,
                );
            }
            if (totals[hyperdriveAddress].poolShort !== poolShort) {
                console.log(
                    "poolShort mismatch",
                    hyperdriveAddress,
                    totals[hyperdriveAddress].poolShort,
                    poolShort,
                );
            }
            totals[hyperdriveAddress].totalLP += totalLP;
            totals[hyperdriveAddress].totalShort += totalShort;
        }
    });
    console.log(
        "totals",
        JSON.stringify(convertBigIntToString(totals), null, 2),
    );

    const rewardsResponses = rewards.map(({ rewards }, i) => {
        return {
            userAddress: users[i],
            rewards,
        };
    });
    let total = 0n;
    rewardsResponses.forEach((reward) => {
        if (!reward.rewards.length) {
            return;
        }
        total += BigInt(reward.rewards[0]?.claimableAmount);
    });
    console.log("total", formatEther(total));

    res.json(rewardsResponses);
});
