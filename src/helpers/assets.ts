import { isHex, toHex } from "viem";

export function getAssetType(assetId: string) {
    if (!isHex(assetId)) {
        throw new Error("getAssetType: Invalid assetId");
    }

    switch (assetId.slice(0, 3)) {
        case "0x0":
            return "LP";
        case "0x1":
            return "Long";
        case "0x2":
            return "Short";
        case "0x3":
            return "WithdrawalShare";
        default:
            throw new Error("getAssetType: Unknown Asset Type");
    }
}
export type AssetType = ReturnType<typeof getAssetType>;

export type RewardsAssetType = Extract<
    ReturnType<typeof getAssetType>,
    "LP" | "Short"
>;

// Type guard function to check if a value is a RewardsAssetType
export function isRewardsAssetType(
    value: AssetType,
): value is RewardsAssetType {
    return value === "LP" || value === "Short";
}

export function getMaturityTime(assetId: string): bigint {
    const hexTime = "0x" + assetId.slice(-10);
    return BigInt(hexTime);
}

export function assetIdBigIntToHex(assetId: bigint): string {
    return toHex(assetId, { size: 32 });
}
