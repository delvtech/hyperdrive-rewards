import { hyperdriveReadAbi } from "src/abi/hyperdriveRead";
import { Address, PublicClient } from "viem";

export async function getHyperdriveBalance(
    client: PublicClient,
    hyperdriveAddress: Address,
    blockNumber: bigint,
    assetId: string,
    userAddress: Address,
) {
    return await client.readContract({
        address: hyperdriveAddress,
        abi: hyperdriveReadAbi,
        functionName: "balanceOf",
        blockNumber: blockNumber,
        args: [BigInt(assetId), userAddress],
    });
}
