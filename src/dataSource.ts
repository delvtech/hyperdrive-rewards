import "reflect-metadata";
import { DataSource } from "typeorm";
import { Wallet } from "./entity/Wallet";
import { PoolInfo } from "./entity/PoolInfo";
import { PoolConfig } from "./entity/PoolConfig";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "hyperdrive-state-mainnet-testing.cjynrojeuawo.us-east-2.rds.amazonaws.com",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "agent0_db",
  ssl: {
    rejectUnauthorized: false, // This disables certificate validation
  },
  synchronize: false,
  logging: false,
  entities: [Wallet, PoolInfo, PoolConfig],
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
