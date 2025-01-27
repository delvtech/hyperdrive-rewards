import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-viem";
import "dotenv/config";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.19",
        settings: {
            viaIR: false,
            optimizer: {
                enabled: true,
                runs: 13000,
            },
            evmVersion: "cancun",
            metadata: {
                useLiteralContent: true,
            },
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY ?? "",
    },
    networks: {},
};

export default config;
