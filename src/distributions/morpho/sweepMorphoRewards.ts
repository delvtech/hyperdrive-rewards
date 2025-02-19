import { morphoBlueHyperdrive } from "src/abi/morphoBlueHyperdrive";
import { getHyperdriveConfig } from "src/appConfig/getHyperdriveConfig";
import { Distribution } from "src/distributions/morpho/morpho";
import { SupportedChainIds } from "src/helpers/chains";
import { getSweepClient, sweepAccount } from "src/helpers/client";
import { PRODUCTION_MODE } from "src/helpers/environment";
import { Address, PublicClient } from "viem";

export async function sweepMorphoRewards(
    rewardTokenAddress: Address,
    hyperdriveAddress: Address,
    publicClient: PublicClient,
    distribution: Distribution,
) {
    console.log(
        `Sweeping token ${rewardTokenAddress} from pool ${hyperdriveAddress}`,
    );

    const { request: sweepRequest } = await publicClient.simulateContract({
        address: hyperdriveAddress,
        abi: morphoBlueHyperdrive.abi,
        functionName: "sweep",
        args: [distribution.asset.address],
        account: sweepAccount,
    });

    // Execute the sweep.
    const poolConfig = getHyperdriveConfig(hyperdriveAddress);
    const chainId = String(poolConfig.chainId) as SupportedChainIds;
    const sweepClient = getSweepClient(chainId);
    const sweepTxHash = await sweepClient.writeContract(sweepRequest);
    console.log("sweepTxHash", sweepTxHash);
    if (PRODUCTION_MODE) {
        await publicClient.waitForTransactionReceipt({
            hash: sweepTxHash,
        });
    }
}
