import { mainnetAppConfig } from "src/appConfig/mainnet";
import { Address } from "viem";

type Modify<T, R> = Omit<T, keyof R> & R;

const poolConfig = mainnetAppConfig.hyperdrives[0].poolConfig;

export type PoolConfig = Modify<
    typeof poolConfig,
    { address: Address; chainId: number }
>;

export type HyperdriveConfig = Modify<
    (typeof mainnetAppConfig.hyperdrives)[0],
    {
        address: Address;
        chainId: number;
        baseToken: Address;
        vaultSharesToken: Address;
        poolConfig: PoolConfig;
    }
>;
