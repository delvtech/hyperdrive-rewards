import "reflect-metadata";
import { PoolConfig } from "src/entity/PoolConfig";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { PoolReward } from "src/entity/PoolReward";
import { Trade } from "src/entity/Trade";
import { UserReward } from "src/entity/UserReward";
import { DataSource } from "typeorm";

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
    entities: [PoolConfig, PoolInfoAtBlock, Trade, PoolReward, UserReward],
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
