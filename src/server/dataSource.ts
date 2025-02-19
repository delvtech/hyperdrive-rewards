import "reflect-metadata";
import { PoolConfig } from "src/entity/PoolConfig";
import { PoolInfoAtBlock } from "src/entity/PoolInfoAtBlock";
import { PoolReward } from "src/entity/PoolReward";
import { Trade } from "src/entity/Trade";
import { UserReward } from "src/entity/UserReward";
import { PRODUCTION_MODE } from "src/helpers/environment";
import { DataSource } from "typeorm";

const database = PRODUCTION_MODE ? "rewards" : "rewards_test";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "hyperdrive-state-mainnet-testing.cjynrojeuawo.us-east-2.rds.amazonaws.com",
    port: 5432,
    username: "postgres",
    password: "password",
    database: database,
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
        console.log(`Database connection (${database}) initialized`);
    } catch (error) {
        console.error("Error during DataSource initialization", error);
        process.exit(1); // Exit the process if the database connection fails
    }
};
