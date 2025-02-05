import { PublicClient } from "viem";
export async function getBlockTimestamp(
    client: PublicClient,
    blockNumber: bigint | number,
) {
    try {
        // Fetch the block information
        const block = await client.getBlock({
            blockNumber: BigInt(blockNumber),
        });

        // Access and return the timestamp
        return block.timestamp;
    } catch (error) {
        console.error("Error fetching block:", error);
        throw error;
    }
}
