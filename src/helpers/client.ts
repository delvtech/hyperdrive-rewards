import { getHyperdriveConfig } from "src/appConfig/getHyperdriveConfig";
import { chainsByChainId, SupportedChainIds } from "src/helpers/chains";
import { PRODUCTION_MODE } from "src/helpers/environment";
import {
    createPublicClient,
    createWalletClient,
    http,
    HttpTransport,
    PublicClient,
    WalletClient,
} from "viem";
import { Address, privateKeyToAccount } from "viem/accounts";

const deployerAccount = privateKeyToAccount(
    process.env.DEPLOYER_PRIVATE_KEY! as Address,
);

const localAccount = privateKeyToAccount(
    process.env.LOCAL_PRIVATE_KEY! as Address,
);

const SWEEPER_PRIVATE_KEY = process.env.SWEEPER_PRIVATE_KEY;
if (!SWEEPER_PRIVATE_KEY) {
    throw new Error("No SWEEPER_PRIVATE_KEY");
}

export const sweepAccount = privateKeyToAccount(SWEEPER_PRIVATE_KEY as Address);

export function getSweepClient(
    chainId: SupportedChainIds,
    transport?: HttpTransport,
): WalletClient {
    const chain = chainsByChainId[chainId];
    const client = createWalletClient({
        account: sweepAccount,
        chain,
        transport: transport ?? http(rpcUrl),
    });

    return client;
}

export function getSweepClientForPool(
    hyperdriveAddress: Address,
    transport?: HttpTransport,
): WalletClient {
    const poolConfig = getHyperdriveConfig(hyperdriveAddress);
    const chainId = String(poolConfig.chainId) as SupportedChainIds;
    const chain = chainsByChainId[chainId];
    const client = createWalletClient({
        account: sweepAccount,
        chain,
        transport: transport ?? http(rpcUrl),
    });

    return client;
}

export const account = PRODUCTION_MODE ? deployerAccount : localAccount;

export const localRpcUrl = "http://localhost:8545";
export const prodRpcUrl = process.env.ALCHEMY_RPC_URL!;
export const rpcUrl = PRODUCTION_MODE ? prodRpcUrl : localRpcUrl;
console.log("rpcUrl", rpcUrl);

export function getWriteClient(
    chainId: SupportedChainIds,
    transport?: HttpTransport,
): WalletClient {
    const chain = chainsByChainId[chainId];
    const client = createWalletClient({
        account,
        chain,
        transport: transport ?? http(rpcUrl),
    });

    return client;
}

export function getReadClient(
    chainId: SupportedChainIds,
    transport?: HttpTransport,
): PublicClient {
    const chain = chainsByChainId[chainId];
    const client = createPublicClient({
        chain,
        transport: transport ?? http(rpcUrl),
    }) as PublicClient;

    return client;
}
