import { MORPHO_TOKEN } from "src/distributions/morpho/morpho";
import { SupportedChainIds } from "src/helpers/chains";
import { getSweepClient, sweepAccount } from "src/helpers/client";
import { PRODUCTION_MODE, REWARDS_CONTRACT } from "src/helpers/environment";
import { Address, erc20Abi, PublicClient } from "viem";

export async function transferMorphoRewards(
    publicClient: PublicClient,
    chainId: SupportedChainIds,
    rewardTokenAddress: Address,
) {
    // First, get the balance to transfer.
    const rewardBalance = await publicClient.readContract({
        address: rewardTokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [sweepAccount.address],
    });

    // Simulate the request.
    const { request: transferRequest } = await publicClient.simulateContract({
        address: MORPHO_TOKEN,
        abi: erc20Abi,
        functionName: "transfer",
        args: [REWARDS_CONTRACT, rewardBalance],
        account: sweepAccount,
    });

    // Transfer from sweep account to to sweep account.
    const sweepClient = getSweepClient(chainId);
    const transferTxHash = await sweepClient.writeContract(transferRequest);
    console.log("transferTxHash", transferTxHash);
    if (PRODUCTION_MODE) {
        await publicClient.waitForTransactionReceipt({
            hash: transferTxHash,
        });
    }
}
