import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { Address, formatEther, parseEther } from "viem";
import { fetchRewardsForUserNew } from "./query/rewardsQuery";

// 0xA29A771683b4857bBd16e1e4f27D5B6bfF53209B // morpho usde/DAI
// 0x7548c4F665402BAb3a4298B88527824B7b18Fe27 // morpho wsETH/USDA
// 0xc8D47DE20F7053Cc02504600596A647A482Bbc46 // morpho wsETH/USDC

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
        const rewards = await fetchRewardsForUserNew(address);

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
    const promises = users.map((address) => fetchRewardsForUserNew(address));
    const rewards = await Promise.all(promises);
    const rewardsResponses = rewards.map((rewards, i) => {
        return {
            userAddress: users[i],
            rewards,
        };
    });
    let total = 0n;
    rewardsResponses.forEach((reward) => {
        total += parseEther(reward.rewards[0].claimableAmount);
    });
    console.log("total", formatEther(total));

    res.json(rewardsResponses);
});

/**
 * @swagger
 * /get/rewards/stub/{address}:
 *   get:
 *     summary: Get stubbed rewards for an address.
 *     description: Returns mocked rewards from mainnet_test.json for a specific address.
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
 *       404:
 *         description: No rewards found for the address.
 *       500:
 *         description: Internal Server Error.
 */
rewardsRouter.get(
    "/stub/:address",
    async (req: RewardsRequest, res: Response) => {
        const { address } = req.params;

        try {
            const stubbedResponse = getStubbedResponse(address);
            if (!stubbedResponse) {
                res.status(404).json({
                    error: "No rewards found for this address",
                });
            } else {
                res.json(stubbedResponse);
            }
        } catch (error) {
            console.error("Error generating stubbed response:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
);

/**
 * Reads data from mainnet_test.json and returns stubbed rewards for a given address.
 */
function getStubbedResponse(address: Address): RewardsResponse | null {
    try {
        // Load JSON data
        const filePath = path.join(__dirname, "../data/mainnet_test_out.json"); // Adjust path if necessary
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);

        // Find user entry
        const userRewards = jsonData.rewards.find(
            (entry: any) => entry.user.toLowerCase() === address.toLowerCase(),
        );

        if (!userRewards) return null;

        // Return formatted rewards response
        // TODO: get the pendingAmount from the latest epoch from the database.
        return {
            userAddress: address as Address,
            rewards: [
                {
                    chainId: userRewards.chainId,
                    claimContractAddress: userRewards.claimContract,
                    claimableAmount: userRewards.claimableAmount,
                    pendingAmount: "0",
                    rewardTokenAddress: userRewards.rewardToken,
                    merkleProof: userRewards.proof,
                    merkleProofLastUpdated: userRewards.merkleProofLastUpdated,
                },
            ],
        };
    } catch (error) {
        console.error("Error reading stub data:", error);
        return null;
    }
}
