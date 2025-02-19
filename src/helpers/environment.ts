import "dotenv/config";
import { Address } from "viem";

if (
    !process.env.NODE_ENV ||
    !["production", "development"].includes(process.env.NODE_ENV)
) {
    throw new Error("NODE_ENV not set to production or developmoent");
}

export const PRODUCTION_MODE = process.env.NODE_ENV === "production";
export const DEVELOPMENT_MODE = process.env.NODE_ENV === "development";

if (!process.env.REWARDS_CONTRACT) {
    throw new Error("No REWARDS_CONTRACT_FOUND");
}
export const REWARDS_CONTRACT = process.env.REWARDS_CONTRACT as Address;
