import "reflect-metadata";
import { DataSource } from "typeorm";
import { PoolConfig } from "./entity/PoolConfig";
import { PoolInfo } from "./entity/PoolInfo";
import { PoolInfoAtBlock } from "./entity/PoolInfoAtBlock";
import { Trade } from "./entity/TradeEvent";
import { Wallet } from "./entity/Wallet";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "hyperdrive-state-mainnet-testing.cjynrojeuawo.us-east-2.rds.amazonaws.com",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "rewards",
    ssl: {
        rejectUnauthorized: false, // This disables certificate validation
    },
    synchronize: true, // Creates table if not exists
    logging: false,
    entities: [Wallet, PoolInfo, PoolConfig, Trade, PoolInfoAtBlock],
    migrations: [],
    subscribers: [],
});

export const initializeDataSource = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connection initialized");
    } catch (error) {
        console.error("Error during DataSource initialization", error);
        process.exit(1); // Exit the process if the database connection fails
    }
};
