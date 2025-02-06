import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { Address } from "viem";
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
