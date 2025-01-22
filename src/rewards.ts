import { Request, Response, Router } from "express";
import { Address, parseEther, zeroAddress } from "viem";
import { base } from "viem/chains";
import { fetchRewardsForUser } from "./query/rewardsQuery";
import { fetchWalletAddresses } from "./wallet";
import { FixedNumber } from "ethers";
import { fetchAllHyperdriveAddresses } from "./query/poolsQuery";

export const rewardsRouter = Router();

export interface RewardsResponse {
  userAddress: Address;
  rewards: Reward[];
}

export interface Reward {
  chainId: number;
  claimContract: Address;
  claimableAmount: string;
  rewardToken: Address;
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
    const rewards = await fetchRewardsForUser(address);

    res.json(rewards);
  }
);

/**
 * @swagger
 * /get/rewards/stub{address}:
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
  "/stub/:address",
  async (req: RewardsRequest, res: Response) => {
    const { address } = req.params;
    const dummyRewards = getDummyRewardsResponse(address);

    res.json(dummyRewards);
  }
);

export function getDummyRewardsResponse(account: Address) {
  const dummyRewardsResponse: RewardsResponse = {
    userAddress: account,
    rewards: [
      {
        // rewards for this user that they can claim
        chainId: base.id,
        claimContract: zeroAddress,
        claimableAmount: parseEther("100").toString(),
        rewardToken: "0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842",
        merkleProof: ["0xProof", "0xProof", "0xProof"],
        merkleProofLastUpdated: 123892327,
      },
      {
        // rewards are accumulating, but the merkle root hasn't been added
        // to the claimContract yet
        chainId: base.id,
        claimContract: zeroAddress,
        claimableAmount: parseEther("0").toString(),
        rewardToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913i",
        merkleProof: null,
        merkleProofLastUpdated: 123892327,
      },
    ],
  };

  return dummyRewardsResponse;
}

interface RewardsTable {
  hyperdriveAddress: Address;
  rewardsToken: Address;
  epoch: [number, number];
  emissionRate: number;
}
const rewardsTable: RewardsTable[] = [
  {
    hyperdriveAddress: "0x0000000000000000000000000000000000000000",
    rewardsToken: "0x0000000000000000000000000000000000000000",
    epoch: [0, 0],
    emissionRate: 0,
  },
];

// 0xA29A771683b4857bBd16e1e4f27D5B6bfF5320 // morpho usde/DAI
// 0x7548c4F665402BAb3a4298B88527824B7b18Fe // morpho wsETH/USDA
// 0xc8D47DE20F7053Cc02504600596A647A482Bbc // morpho wsETH/USDC

rewardsRouter.get("/all", async (req: RewardsRequest, res: Response) => {
  const addresses = await fetchWalletAddresses(1);
  const allRewards = await Promise.all(
    addresses.map((address) => fetchRewardsForUser(address))
  );

  const rewardsByPool: Record<
    string,
    { LP: FixedNumber[]; Short: FixedNumber[] }
  > = {};
  const hyperdriveAddresses = await fetchAllHyperdriveAddresses(1);
  hyperdriveAddresses.forEach((address) => {
    rewardsByPool[address] = { LP: [], Short: [] };
  });

  allRewards.forEach((userRewards) => {
    userRewards.percentLPByPool.forEach(({ hyperdrive_address, percentLP }) => {
      rewardsByPool[hyperdrive_address].LP.push(percentLP);
    });
    userRewards.percentShortByPool.forEach(
      ({ hyperdrive_address, percentShort }) => {
        rewardsByPool[hyperdrive_address].Short.push(percentShort);
      }
    );
  });

  res.json(rewardsByPool);
});
