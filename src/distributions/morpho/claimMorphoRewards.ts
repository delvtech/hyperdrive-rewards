import { universalRewardsDistributorAbi } from "src/abi/universalRewardsDistributor";
import { Distribution } from "src/distributions/morpho/morpho";
import { account } from "src/helpers/client";
import { PRODUCTION_MODE } from "src/helpers/environment";
import { Address, PublicClient, WalletClient } from "viem";

export async function claimMorphoRewards(
    publicClient: PublicClient,
    walletClient: WalletClient,
    hyperdriveAddress: Address,
    distribution: Distribution,
): Promise<{ amount: bigint | null; blockNumber: bigint | null }> {
    const claimed = await publicClient.readContract({
        abi: universalRewardsDistributorAbi.abi,
        address: distribution.distributor.address,
        functionName: "claimed",
        args: [distribution.user, distribution.asset.address],
    });

    // If there's nothing to claim, don't try.
    const claimable = BigInt(distribution.claimable) - claimed;
    if (claimable === 0n) {
        console.log(`Already claimed rewards for ${hyperdriveAddress}.`);
        return { amount: null, blockNumber: null };
    }

    // Claim the rewards:
    // Simulate claiming from the distributor.
    const claimArgs = [
        distribution.user,
        distribution.asset.address,
        // Note: claim the full amount in the distribution, URD will subtract claimed for you automatically
        BigInt(distribution.claimable),
        distribution.proof,
    ] as const;
    console.log(
        `claiming for pool ${hyperdriveAddress} with args: ${claimArgs}`,
    );
    const { request: claimRequest, result: amount } =
        await publicClient.simulateContract({
            address: distribution.distributor.address,
            abi: universalRewardsDistributorAbi.abi,
            functionName: "claim",
            args: claimArgs,
            account: account,
        });

    // Execute the claim.
    const claimTxHash = await walletClient.writeContract(claimRequest);
    console.log("claimTxHash", claimTxHash);

    let blockNumber: bigint;
    if (PRODUCTION_MODE) {
        const claimTransaction = await publicClient.waitForTransactionReceipt({
            hash: claimTxHash,
        });
        // This will be the block number used for the end block of the newest epoch.
        blockNumber = claimTransaction.blockNumber;
        console.log("Claim transaction blockNumber: ", blockNumber);
    } else {
        blockNumber = await publicClient.getBlockNumber();
    }

    // Return the amount claimed and the block number it was claimed at.
    return { blockNumber, amount };
}
