import { parseAbiItem } from "viem";

export const initializeEvent = parseAbiItem(
    "event Initialize(address indexed provider, uint256 lpAmount, uint256 amount, uint256 vaultSharePrice, bool asBase, uint256 apr, bytes extraData)",
);

export const addLiquidityEvent = parseAbiItem(
    "event AddLiquidity(address indexed provider, uint256 lpAmount, uint256 amount, uint256 vaultSharePrice, bool asBase, uint256 lpSharePrice, bytes extraData)",
);

export const removeLiquidityEvent = parseAbiItem(
    "event RemoveLiquidity(address indexed provider, address indexed destination, uint256 lpAmount, uint256 amount, uint256 vaultSharePrice, bool asBase, uint256 withdrawalShareAmount, uint256 lpSharePrice, bytes extraData)",
);

export const openLongEvent = parseAbiItem(
    "event OpenLong(address indexed trader, uint256 indexed assetId, uint256 amount, uint256 vaultSharePrice, bool asBase, uint256 bondAmount, bytes extraData)",
);

export const openShortEvent = parseAbiItem(
    "event OpenShort(address indexed trader, uint256 indexed assetId, uint256 maturityTime, uint256 amount, uint256 vaultSharePrice, bool asBase, uint256 baseProceeds, uint256 bondAmount, bytes extraData)",
);

export const closeLongEvent = parseAbiItem(
    "event CloseLong(address indexed trader, address indexed destination, uint256 indexed assetId, uint256 maturityTime, uint256 amount, uint256 vaultSharePrice, bool asBase, uint256 bondAmount, bytes extraData)",
);

export const closeShortEvent = parseAbiItem(
    "event CloseShort(address indexed trader, address indexed destination, uint256 indexed assetId, uint256 maturityTime, uint256 amount, uint256 vaultSharePrice, bool asBase, uint256 basePayment, uint256 bondAmount, bytes extraData)",
);

export const initializeAbiEvent = {
    type: "event",
    name: "Initialize",
    inputs: [
        { name: "provider", type: "address", indexed: true },
        { name: "lpAmount", type: "uint256", indexed: false },
        { name: "amount", type: "uint256", indexed: false },
        { name: "vaultSharePrice", type: "uint256", indexed: false },
        { name: "asBase", type: "bool", indexed: false },
        { name: "apr", type: "uint256", indexed: false },
        { name: "extraData", type: "bytes", indexed: false },
    ],
} as const;

export const addLiquidityAbiEvent = {
    type: "event",
    name: "AddLiquidity",
    inputs: [
        { name: "provider", type: "address", indexed: true },
        { name: "lpAmount", type: "uint256", indexed: false },
        { name: "amount", type: "uint256", indexed: false },
        { name: "vaultSharePrice", type: "uint256", indexed: false },
        { name: "asBase", type: "bool", indexed: false },
        { name: "lpSharePrice", type: "uint256", indexed: false },
        { name: "extraData", type: "bytes", indexed: false },
    ],
} as const;

export const removeLiquidityAbiEvent = {
    type: "event",
    name: "RemoveLiquidity",
    inputs: [
        { name: "provider", type: "address", indexed: true },
        { name: "destination", type: "address", indexed: true },
        { name: "lpAmount", type: "uint256", indexed: false },
        { name: "amount", type: "uint256", indexed: false },
        { name: "vaultSharePrice", type: "uint256", indexed: false },
        { name: "asBase", type: "bool", indexed: false },
        { name: "withdrawalShareAmount", type: "uint256", indexed: false },
        { name: "lpSharePrice", type: "uint256", indexed: false },
        { name: "extraData", type: "bytes", indexed: false },
    ],
} as const;

export const openLongAbiEvent = {
    type: "event",
    name: "OpenLong",
    inputs: [
        { name: "trader", type: "address", indexed: true },
        { name: "assetId", type: "uint256", indexed: true },
        { name: "maturityTime", type: "uint256", indexed: false },
        { name: "amount", type: "uint256", indexed: false },
        { name: "vaultSharePrice", type: "uint256", indexed: false },
        { name: "asBase", type: "bool", indexed: false },
        { name: "bondAmount", type: "uint256", indexed: false },
        { name: "extraData", type: "bytes", indexed: false },
    ],
} as const;

export const openShortAbiEvent = {
    type: "event",
    name: "OpenShort",
    inputs: [
        { name: "trader", type: "address", indexed: true },
        { name: "assetId", type: "uint256", indexed: true },
        { name: "maturityTime", type: "uint256", indexed: false },
        { name: "amount", type: "uint256", indexed: false },
        { name: "vaultSharePrice", type: "uint256", indexed: false },
        { name: "asBase", type: "bool", indexed: false },
        { name: "baseProceeds", type: "uint256", indexed: false },
        { name: "bondAmount", type: "uint256", indexed: false },
        { name: "extraData", type: "bytes", indexed: false },
    ],
} as const;

export const closeLongAbiEvent = {
    type: "event",
    name: "CloseLong",
    inputs: [
        { name: "trader", type: "address", indexed: true },
        { name: "destination", type: "address", indexed: true },
        { name: "assetId", type: "uint256", indexed: true },
        { name: "maturityTime", type: "uint256", indexed: false },
        { name: "amount", type: "uint256", indexed: false },
        { name: "vaultSharePrice", type: "uint256", indexed: false },
        { name: "asBase", type: "bool", indexed: false },
        { name: "bondAmount", type: "uint256", indexed: false },
        { name: "extraData", type: "bytes", indexed: false },
    ],
} as const;

export const closeShortAbiEvent = {
    type: "event",
    name: "CloseShort",
    inputs: [
        { name: "trader", type: "address", indexed: true },
        { name: "destination", type: "address", indexed: true },
        { name: "assetId", type: "uint256", indexed: true },
        { name: "maturityTime", type: "uint256", indexed: false },
        { name: "amount", type: "uint256", indexed: false },
        { name: "vaultSharePrice", type: "uint256", indexed: false },
        { name: "asBase", type: "bool", indexed: false },
        { name: "basePayment", type: "uint256", indexed: false },
        { name: "bondAmount", type: "uint256", indexed: false },
        { name: "extraData", type: "bytes", indexed: false },
    ],
} as const;

export const transferSingleAbiEvent = {
    type: "event",
    name: "TransferSingle",
    inputs: [
        { name: "operator", type: "address", indexed: true },
        { name: "from", type: "address", indexed: true },
        { name: "to", type: "address", indexed: true },
        { name: "id", type: "uint256", indexed: false },
        { name: "value", type: "uint256", indexed: false },
    ],
} as const;
