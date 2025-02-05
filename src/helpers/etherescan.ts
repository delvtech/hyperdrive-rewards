import "dotenv/config";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export async function getDeploymentBlock(
    contractAddress: string,
): Promise<bigint | null> {
    try {
        const url = `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1" && data.result.length > 0) {
            const deploymentTx = data.result[0];
            return deploymentTx.blockNumber;
        } else {
            console.log("No deployment transaction found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching deployment block:", error);
        return null;
    }
}
