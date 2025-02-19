import { MORPHO_TOKEN } from "src/distributions/morpho/morpho";
import { PRODUCTION_MODE } from "src/helpers/environment";
import { getMorphoPools } from "src/pools/morpho";
import { Address } from "viem";

export function getPools() {
    if (PRODUCTION_MODE) {
        return getProductionPools();
    }
    return getDevelopmentPools();
}

export function getProductionPools() {
    return getMorphoPools("1");
}

export function getDevelopmentPools() {
    return getMorphoPools("1");
}

export function getPoolAddresses() {
    if (PRODUCTION_MODE) {
        return getProductionPools().map(({ address }) => address);
    }
    return getDevelopmentPools().map(({ address }) => address);
}

export function getRewardTokenForPool(hyperdriveAddress: Address): Address {
    const token = rewardTokenByPool[hyperdriveAddress];
    if (!token) {
        console.log(`WARNING: Token for pool ${hyperdriveAddress} not found`);
    }

    return token;
}

// Hard
export const rewardTokenByPool: Record<Address, Address> = {
    "0xd41225855A5c5Ba1C672CcF4d72D1822a5686d30": MORPHO_TOKEN,
    "0xc8D47DE20F7053Cc02504600596A647A482Bbc46": MORPHO_TOKEN,
    "0x7548c4F665402BAb3a4298B88527824B7b18Fe27": MORPHO_TOKEN,
};
