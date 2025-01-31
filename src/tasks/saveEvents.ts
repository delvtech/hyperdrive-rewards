import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { AppDataSource } from "../dataSource";
import { saveAddLiquidityEvents } from "./saveAddLiquidityEvents";
import { saveCloseShortEvents } from "./saveCloseShortEvents";
import { saveOpenShortEvents } from "./saveOpenShortEvents";

const morphoUsdeDaiAddress: Address =
    "0xA29A771683b4857bBd16e1e4f27D5B6bfF53209B";

const morphoWsEthUsdaAddress: Address =
    "0x7548c4F665402BAb3a4298B88527824B7b18Fe27";

const morphoSusdeDaiAddress: Address =
    "0xd41225855A5c5Ba1C672CcF4d72D1822a5686d30";

const addresses = [
    morphoUsdeDaiAddress,
    morphoWsEthUsdaAddress,
    morphoSusdeDaiAddress,
];

async function saveEvents(addresses: Address[]) {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL");

    const rpcUrl = process.env.ALCHEMY_RPC_URL!;
    console.log("rpcUrl", rpcUrl);

    const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
    });

    addresses.forEach((address) => {
        saveOpenShortEvents(address, client);
        saveCloseShortEvents(address, client);
        saveAddLiquidityEvents(address, client);
        saveAddLiquidityEvents(address, client);
    });
}

saveEvents(addresses).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
