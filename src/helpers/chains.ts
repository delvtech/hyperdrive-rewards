import { base, mainnet } from "viem/chains";

export const supportedChains = [mainnet, base];

export type SupportedChains = typeof mainnet | typeof base;

export type SupportedChainIds = "1" | "8453";

export const chainsByChainId: Record<SupportedChainIds, SupportedChains> = {
    "1": mainnet,
    "8453": base,
};
