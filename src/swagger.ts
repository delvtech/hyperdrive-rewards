import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hyperdrive Rewards API",
      version: "1.0.0",
      description: "API documentation for Hyperdrive Rewards",
    },
    servers: [
      {
        url: "https://rewards.hyperdrive.money",
      },
    ],
    components: {
      schemas: {
        RewardsResponse: {
          type: "object",
          properties: {
            userAddress: {
              type: "string",
              description: "The user's blockchain address.",
              example: "0x1234567890abcdef1234567890abcdef12345678",
            },
            rewards: {
              type: "array",
              $ref: "#/components/schemas/Reward",
            },
          },
          required: ["userAddress", "rewards"],
        },
        Reward: {
          type: "object",
          properties: {
            chainId: { type: "integer", example: 1 },
            claimContractAddress: {
              type: "string",
              description: "Address of the claim contract.",
              example: "0x0000000000000000000000000000000000000000",
            },
            claimableAmount: {
              type: "string",
              description: "Amount of tokens claimable.",
              example: "1000000000000000000",
            },
            rewardTokenAddress: {
              type: "string",
              description: "Token address of the reward.",
              example: "0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842",
            },
            merkleProof: {
              type: "array",
              items: { type: "string" },
              nullable: true,
              example: ["0xProof1", "0xProof2", "0xProof3"],
            },
            merkleProofLastUpdated: {
              type: "integer",
              description: "Timestamp of the last merkle proof update.",
              example: 123892327,
            },
          },
          required: [
            "chainId",
            "claimContractAddress",
            "claimable",
            "rewardTokenAddress",
            "merkleProof",
            "merkleProofLastUpdated",
          ],
        },
      },
    },
  },
  apis: ["./src/**/*.ts"],
};

export type SwaggerSpec = typeof options;

const swaggerSpec = swaggerJsdoc(options) as SwaggerSpec;

export default swaggerSpec;
