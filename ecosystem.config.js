require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "anvil",
      script: "anvil",
      args: function () {
        return `--host 0.0.0.0 --port 8545 --fork-url ${process.env.ALCHEMY_RPC_URL} --chain-id ${process.env.ANVIL_CHAIN_ID}`;
      }(),
      env: {
        ALCHEMY_RPC_URL: process.env.ALCHEMY_RPC_URL,
        ANVIL_CHAIN_ID: process.env.ANVIL_CHAIN_ID,
      },
    },
    {
      name: "rewards-api",
      script: "dist/server.js",
      watch: ["dist"], // Only watch the dist directory
      env: {
        NODE_ENV: "production",
      },
    }
  ],
};