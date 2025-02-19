import { Abi } from "viem";

export const morphoBlueHyperdrive = {
    abi: [
        {
            type: "function",
            name: "PERMIT_TYPEHASH",
            inputs: [],
            outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "addLiquidity",
            inputs: [
                {
                    name: "_contribution",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_minLpSharePrice",
                    type: "uint256",
                    internalType: "uint256",
                },
                { name: "_minApr", type: "uint256", internalType: "uint256" },
                { name: "_maxApr", type: "uint256", internalType: "uint256" },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                { name: "lpShares", type: "uint256", internalType: "uint256" },
            ],
            stateMutability: "payable",
        },
        {
            type: "function",
            name: "adminController",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "balanceOf",
            inputs: [
                { name: "tokenId", type: "uint256", internalType: "uint256" },
                { name: "owner", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "baseToken",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "batchTransferFrom",
            inputs: [
                { name: "from", type: "address", internalType: "address" },
                { name: "to", type: "address", internalType: "address" },
                { name: "ids", type: "uint256[]", internalType: "uint256[]" },
                {
                    name: "values",
                    type: "uint256[]",
                    internalType: "uint256[]",
                },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "checkpoint",
            inputs: [
                {
                    name: "_checkpointTime",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_maxIterations",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "closeLong",
            inputs: [
                {
                    name: "_maturityTime",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_bondAmount",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_minOutput",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                { name: "proceeds", type: "uint256", internalType: "uint256" },
            ],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "closeShort",
            inputs: [
                {
                    name: "_maturityTime",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_bondAmount",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_minOutput",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                { name: "proceeds", type: "uint256", internalType: "uint256" },
            ],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "collateralToken",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "collectGovernanceFee",
            inputs: [
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                { name: "proceeds", type: "uint256", internalType: "uint256" },
            ],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "convertToBase",
            inputs: [
                {
                    name: "_shareAmount",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "convertToShares",
            inputs: [
                {
                    name: "_baseAmount",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "decimals",
            inputs: [],
            outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "domainSeparator",
            inputs: [],
            outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getCheckpoint",
            inputs: [
                {
                    name: "_checkpointTime",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Checkpoint",
                    components: [
                        {
                            name: "weightedSpotPrice",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "lastWeightedSpotPriceUpdateTime",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "vaultSharePrice",
                            type: "uint128",
                            internalType: "uint128",
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getCheckpointExposure",
            inputs: [
                {
                    name: "_checkpointTime",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [{ name: "", type: "int256", internalType: "int256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getMarketState",
            inputs: [],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct IHyperdrive.MarketState",
                    components: [
                        {
                            name: "shareReserves",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "bondReserves",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "longExposure",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "longsOutstanding",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "shareAdjustment",
                            type: "int128",
                            internalType: "int128",
                        },
                        {
                            name: "shortsOutstanding",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "longAverageMaturityTime",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "shortAverageMaturityTime",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "isInitialized",
                            type: "bool",
                            internalType: "bool",
                        },
                        {
                            name: "isPaused",
                            type: "bool",
                            internalType: "bool",
                        },
                        {
                            name: "zombieBaseProceeds",
                            type: "uint112",
                            internalType: "uint112",
                        },
                        {
                            name: "zombieShareReserves",
                            type: "uint128",
                            internalType: "uint128",
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getPoolConfig",
            inputs: [],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct IHyperdrive.PoolConfig",
                    components: [
                        {
                            name: "baseToken",
                            type: "address",
                            internalType: "contract IERC20",
                        },
                        {
                            name: "vaultSharesToken",
                            type: "address",
                            internalType: "contract IERC20",
                        },
                        {
                            name: "linkerFactory",
                            type: "address",
                            internalType: "address",
                        },
                        {
                            name: "linkerCodeHash",
                            type: "bytes32",
                            internalType: "bytes32",
                        },
                        {
                            name: "initialVaultSharePrice",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "minimumShareReserves",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "minimumTransactionAmount",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "circuitBreakerDelta",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "positionDuration",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "checkpointDuration",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "timeStretch",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "governance",
                            type: "address",
                            internalType: "address",
                        },
                        {
                            name: "feeCollector",
                            type: "address",
                            internalType: "address",
                        },
                        {
                            name: "sweepCollector",
                            type: "address",
                            internalType: "address",
                        },
                        {
                            name: "checkpointRewarder",
                            type: "address",
                            internalType: "address",
                        },
                        {
                            name: "fees",
                            type: "tuple",
                            internalType: "struct IHyperdrive.Fees",
                            components: [
                                {
                                    name: "curve",
                                    type: "uint256",
                                    internalType: "uint256",
                                },
                                {
                                    name: "flat",
                                    type: "uint256",
                                    internalType: "uint256",
                                },
                                {
                                    name: "governanceLP",
                                    type: "uint256",
                                    internalType: "uint256",
                                },
                                {
                                    name: "governanceZombie",
                                    type: "uint256",
                                    internalType: "uint256",
                                },
                            ],
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getPoolInfo",
            inputs: [],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct IHyperdrive.PoolInfo",
                    components: [
                        {
                            name: "shareReserves",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "shareAdjustment",
                            type: "int256",
                            internalType: "int256",
                        },
                        {
                            name: "zombieBaseProceeds",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "zombieShareReserves",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "bondReserves",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "lpTotalSupply",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "vaultSharePrice",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "longsOutstanding",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "longAverageMaturityTime",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "shortsOutstanding",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "shortAverageMaturityTime",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "withdrawalSharesReadyToWithdraw",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "withdrawalSharesProceeds",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "lpSharePrice",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "longExposure",
                            type: "uint256",
                            internalType: "uint256",
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getUncollectedGovernanceFees",
            inputs: [],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getWithdrawPool",
            inputs: [],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct IHyperdrive.WithdrawPool",
                    components: [
                        {
                            name: "readyToWithdraw",
                            type: "uint128",
                            internalType: "uint128",
                        },
                        {
                            name: "proceeds",
                            type: "uint128",
                            internalType: "uint128",
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "id",
            inputs: [],
            outputs: [{ name: "", type: "bytes32", internalType: "Id" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "initialize",
            inputs: [
                {
                    name: "_contribution",
                    type: "uint256",
                    internalType: "uint256",
                },
                { name: "_apr", type: "uint256", internalType: "uint256" },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                { name: "lpShares", type: "uint256", internalType: "uint256" },
            ],
            stateMutability: "payable",
        },
        {
            type: "function",
            name: "irm",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "isApprovedForAll",
            inputs: [
                { name: "owner", type: "address", internalType: "address" },
                { name: "spender", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "isPauser",
            inputs: [
                { name: "_account", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "kind",
            inputs: [],
            outputs: [{ name: "", type: "string", internalType: "string" }],
            stateMutability: "pure",
        },
        {
            type: "function",
            name: "lltv",
            inputs: [],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "load",
            inputs: [
                {
                    name: "_slots",
                    type: "uint256[]",
                    internalType: "uint256[]",
                },
            ],
            outputs: [
                { name: "", type: "bytes32[]", internalType: "bytes32[]" },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "name",
            inputs: [
                { name: "tokenId", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "string", internalType: "string" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "name",
            inputs: [],
            outputs: [{ name: "", type: "string", internalType: "string" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "nonces",
            inputs: [
                { name: "owner", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "openLong",
            inputs: [
                { name: "_amount", type: "uint256", internalType: "uint256" },
                {
                    name: "_minOutput",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_minVaultSharePrice",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                {
                    name: "maturityTime",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "bondProceeds",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            stateMutability: "payable",
        },
        {
            type: "function",
            name: "openShort",
            inputs: [
                {
                    name: "_bondAmount",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_maxDeposit",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_minVaultSharePrice",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                {
                    name: "maturityTime",
                    type: "uint256",
                    internalType: "uint256",
                },
                { name: "deposit", type: "uint256", internalType: "uint256" },
            ],
            stateMutability: "payable",
        },
        {
            type: "function",
            name: "oracle",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "pause",
            inputs: [{ name: "_status", type: "bool", internalType: "bool" }],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "perTokenApprovals",
            inputs: [
                { name: "tokenId", type: "uint256", internalType: "uint256" },
                { name: "owner", type: "address", internalType: "address" },
                { name: "spender", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "permitForAll",
            inputs: [
                { name: "owner", type: "address", internalType: "address" },
                { name: "spender", type: "address", internalType: "address" },
                { name: "_approved", type: "bool", internalType: "bool" },
                { name: "deadline", type: "uint256", internalType: "uint256" },
                { name: "v", type: "uint8", internalType: "uint8" },
                { name: "r", type: "bytes32", internalType: "bytes32" },
                { name: "s", type: "bytes32", internalType: "bytes32" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "redeemWithdrawalShares",
            inputs: [
                {
                    name: "_withdrawalShares",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_minOutputPerShare",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                { name: "proceeds", type: "uint256", internalType: "uint256" },
                {
                    name: "withdrawalSharesRedeemed",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "removeLiquidity",
            inputs: [
                { name: "_lpShares", type: "uint256", internalType: "uint256" },
                {
                    name: "_minOutputPerShare",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "_options",
                    type: "tuple",
                    internalType: "struct IHyperdrive.Options",
                    components: [
                        {
                            name: "destination",
                            type: "address",
                            internalType: "address",
                        },
                        { name: "asBase", type: "bool", internalType: "bool" },
                        {
                            name: "extraData",
                            type: "bytes",
                            internalType: "bytes",
                        },
                    ],
                },
            ],
            outputs: [
                { name: "proceeds", type: "uint256", internalType: "uint256" },
                {
                    name: "withdrawalShares",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "setApproval",
            inputs: [
                { name: "tokenID", type: "uint256", internalType: "uint256" },
                { name: "operator", type: "address", internalType: "address" },
                { name: "amount", type: "uint256", internalType: "uint256" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "setApprovalBridge",
            inputs: [
                { name: "tokenID", type: "uint256", internalType: "uint256" },
                { name: "operator", type: "address", internalType: "address" },
                { name: "amount", type: "uint256", internalType: "uint256" },
                { name: "caller", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "setApprovalForAll",
            inputs: [
                { name: "operator", type: "address", internalType: "address" },
                { name: "approved", type: "bool", internalType: "bool" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "setGovernance",
            inputs: [
                { name: "_who", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "setPauser",
            inputs: [
                { name: "", type: "address", internalType: "address" },
                { name: "", type: "bool", internalType: "bool" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "sweep",
            inputs: [
                {
                    name: "_target",
                    type: "address",
                    internalType: "contract IERC20",
                },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "symbol",
            inputs: [
                { name: "tokenId", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "string", internalType: "string" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "target0",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "target1",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "target2",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "target3",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "target4",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "totalShares",
            inputs: [],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "totalSupply",
            inputs: [
                { name: "tokenId", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "transferFrom",
            inputs: [
                { name: "tokenID", type: "uint256", internalType: "uint256" },
                { name: "from", type: "address", internalType: "address" },
                { name: "to", type: "address", internalType: "address" },
                { name: "amount", type: "uint256", internalType: "uint256" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "transferFromBridge",
            inputs: [
                { name: "tokenID", type: "uint256", internalType: "uint256" },
                { name: "from", type: "address", internalType: "address" },
                { name: "to", type: "address", internalType: "address" },
                { name: "amount", type: "uint256", internalType: "uint256" },
                { name: "caller", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "vault",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "vaultSharesToken",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "version",
            inputs: [],
            outputs: [{ name: "", type: "string", internalType: "string" }],
            stateMutability: "pure",
        },
        {
            type: "event",
            name: "AddLiquidity",
            inputs: [
                {
                    name: "provider",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "lpAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "lpSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Approval",
            inputs: [
                {
                    name: "owner",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "spender",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "ApprovalForAll",
            inputs: [
                {
                    name: "account",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "operator",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "approved",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "CloseLong",
            inputs: [
                {
                    name: "trader",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "destination",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "assetId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "maturityTime",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "bondAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "CloseShort",
            inputs: [
                {
                    name: "trader",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "destination",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "assetId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "maturityTime",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "basePayment",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "bondAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "CollectGovernanceFee",
            inputs: [
                {
                    name: "collector",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "CreateCheckpoint",
            inputs: [
                {
                    name: "checkpointTime",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "checkpointVaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "maturedShorts",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "maturedLongs",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "lpSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Initialize",
            inputs: [
                {
                    name: "provider",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "lpAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "apr",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "OpenLong",
            inputs: [
                {
                    name: "trader",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "assetId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "maturityTime",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "bondAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "OpenShort",
            inputs: [
                {
                    name: "trader",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "assetId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "maturityTime",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "baseProceeds",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "bondAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "PauseStatusUpdated",
            inputs: [
                {
                    name: "isPaused",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "RedeemWithdrawalShares",
            inputs: [
                {
                    name: "provider",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "destination",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "withdrawalShareAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "RemoveLiquidity",
            inputs: [
                {
                    name: "provider",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "destination",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "lpAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "amount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "vaultSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "asBase",
                    type: "bool",
                    indexed: false,
                    internalType: "bool",
                },
                {
                    name: "withdrawalShareAmount",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "lpSharePrice",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "extraData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Sweep",
            inputs: [
                {
                    name: "collector",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "target",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "TransferSingle",
            inputs: [
                {
                    name: "operator",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "from",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "to",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "id",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "value",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        { type: "error", name: "BatchInputLengthMismatch", inputs: [] },
        { type: "error", name: "BelowMinimumContribution", inputs: [] },
        { type: "error", name: "CircuitBreakerTriggered", inputs: [] },
        {
            type: "error",
            name: "DecreasedPresentValueWhenAddingLiquidity",
            inputs: [],
        },
        { type: "error", name: "DistributeExcessIdleFailed", inputs: [] },
        { type: "error", name: "ExpInvalidExponent", inputs: [] },
        { type: "error", name: "ExpiredDeadline", inputs: [] },
        { type: "error", name: "InsufficientBalance", inputs: [] },
        { type: "error", name: "InsufficientLiquidity", inputs: [] },
        { type: "error", name: "InvalidApr", inputs: [] },
        { type: "error", name: "InvalidCheckpointTime", inputs: [] },
        { type: "error", name: "InvalidERC20Bridge", inputs: [] },
        { type: "error", name: "InvalidEffectiveShareReserves", inputs: [] },
        { type: "error", name: "InvalidFeeDestination", inputs: [] },
        { type: "error", name: "InvalidInitialVaultSharePrice", inputs: [] },
        { type: "error", name: "InvalidLPSharePrice", inputs: [] },
        { type: "error", name: "InvalidPresentValue", inputs: [] },
        { type: "error", name: "InvalidSignature", inputs: [] },
        { type: "error", name: "InvalidTimestamp", inputs: [] },
        { type: "error", name: "LnInvalidInput", inputs: [] },
        { type: "error", name: "MinimumSharePrice", inputs: [] },
        { type: "error", name: "MinimumTransactionAmount", inputs: [] },
        { type: "error", name: "NotPayable", inputs: [] },
        { type: "error", name: "OutputLimit", inputs: [] },
        { type: "error", name: "PoolAlreadyInitialized", inputs: [] },
        { type: "error", name: "PoolIsPaused", inputs: [] },
        { type: "error", name: "RestrictedZeroAddress", inputs: [] },
        {
            type: "error",
            name: "ReturnData",
            inputs: [{ name: "data", type: "bytes", internalType: "bytes" }],
        },
        { type: "error", name: "SweepFailed", inputs: [] },
        { type: "error", name: "TransferFailed", inputs: [] },
        { type: "error", name: "Unauthorized", inputs: [] },
        { type: "error", name: "UnexpectedSuccess", inputs: [] },
        { type: "error", name: "UnsafeCastToInt128", inputs: [] },
        { type: "error", name: "UnsafeCastToInt256", inputs: [] },
        { type: "error", name: "UnsafeCastToUint112", inputs: [] },
        { type: "error", name: "UnsafeCastToUint128", inputs: [] },
        { type: "error", name: "UnsafeCastToUint256", inputs: [] },
        { type: "error", name: "UnsupportedToken", inputs: [] },
        { type: "error", name: "UpdateLiquidityFailed", inputs: [] },
    ] as Abi,
    bytecode: { object: "0x", sourceMap: "", linkReferences: {} },
    deployedBytecode: { object: "0x", sourceMap: "", linkReferences: {} },
    methodIdentifiers: {
        "PERMIT_TYPEHASH()": "30adf81f",
        "addLiquidity(uint256,uint256,uint256,uint256,(address,bool,bytes))":
            "4c2ac1d9",
        "adminController()": "950c5d03",
        "balanceOf(uint256,address)": "3656eec2",
        "baseToken()": "c55dae63",
        "batchTransferFrom(address,address,uint256[],uint256[])": "17fad7fc",
        "checkpoint(uint256,uint256)": "414f826d",
        "closeLong(uint256,uint256,uint256,(address,bool,bytes))": "ded06231",
        "closeShort(uint256,uint256,uint256,(address,bool,bytes))": "29b23fc1",
        "collateralToken()": "b2016bd4",
        "collectGovernanceFee((address,bool,bytes))": "3e691db9",
        "convertToBase(uint256)": "b88fed9f",
        "convertToShares(uint256)": "c6e6f592",
        "decimals()": "313ce567",
        "domainSeparator()": "f698da25",
        "getCheckpoint(uint256)": "20fc4881",
        "getCheckpointExposure(uint256)": "cf210e65",
        "getMarketState()": "d8165743",
        "getPoolConfig()": "b0d96580",
        "getPoolInfo()": "60246c88",
        "getUncollectedGovernanceFees()": "c69e16ad",
        "getWithdrawPool()": "fba56008",
        "id()": "af640d0f",
        "initialize(uint256,uint256,(address,bool,bytes))": "77d05ff4",
        "irm()": "28e8fe7d",
        "isApprovedForAll(address,address)": "e985e9c5",
        "isPauser(address)": "46fbf68e",
        "kind()": "04baa00b",
        "lltv()": "217b7ffe",
        "load(uint256[])": "becee9c3",
        "name()": "06fdde03",
        "name(uint256)": "00ad800c",
        "nonces(address)": "7ecebe00",
        "openLong(uint256,uint256,uint256,(address,bool,bytes))": "cba2e58d",
        "openShort(uint256,uint256,uint256,(address,bool,bytes))": "dbbe8070",
        "oracle()": "7dc0d1d0",
        "pause(bool)": "02329a29",
        "perTokenApprovals(uint256,address,address)": "21ff32a9",
        "permitForAll(address,address,bool,uint256,uint8,bytes32,bytes32)":
            "9032c726",
        "redeemWithdrawalShares(uint256,uint256,(address,bool,bytes))":
            "074a6de9",
        "removeLiquidity(uint256,uint256,(address,bool,bytes))": "cbc13434",
        "setApproval(uint256,address,uint256)": "9cd241af",
        "setApprovalBridge(uint256,address,uint256,address)": "4ed2d6ac",
        "setApprovalForAll(address,bool)": "a22cb465",
        "setGovernance(address)": "ab033ea9",
        "setPauser(address,bool)": "7180c8ca",
        "sweep(address)": "01681a62",
        "symbol(uint256)": "4e41a1fb",
        "target0()": "21b57d53",
        "target1()": "eac3e799",
        "target2()": "a6e8a859",
        "target3()": "d899e112",
        "target4()": "f3f70707",
        "totalShares()": "3a98ef39",
        "totalSupply(uint256)": "bd85b039",
        "transferFrom(uint256,address,address,uint256)": "1c0f12b6",
        "transferFromBridge(uint256,address,address,uint256,address)":
            "e44808bc",
        "vault()": "fbfa77cf",
        "vaultSharesToken()": "0a4e1493",
        "version()": "54fd4d50",
    },
    rawMetadata:
        '{"compiler":{"version":"0.8.22+commit.4fc1097e"},"language":"Solidity","output":{"abi":[{"inputs":[],"name":"BatchInputLengthMismatch","type":"error"},{"inputs":[],"name":"BelowMinimumContribution","type":"error"},{"inputs":[],"name":"CircuitBreakerTriggered","type":"error"},{"inputs":[],"name":"DecreasedPresentValueWhenAddingLiquidity","type":"error"},{"inputs":[],"name":"DistributeExcessIdleFailed","type":"error"},{"inputs":[],"name":"ExpInvalidExponent","type":"error"},{"inputs":[],"name":"ExpiredDeadline","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[],"name":"InsufficientLiquidity","type":"error"},{"inputs":[],"name":"InvalidApr","type":"error"},{"inputs":[],"name":"InvalidCheckpointTime","type":"error"},{"inputs":[],"name":"InvalidERC20Bridge","type":"error"},{"inputs":[],"name":"InvalidEffectiveShareReserves","type":"error"},{"inputs":[],"name":"InvalidFeeDestination","type":"error"},{"inputs":[],"name":"InvalidInitialVaultSharePrice","type":"error"},{"inputs":[],"name":"InvalidLPSharePrice","type":"error"},{"inputs":[],"name":"InvalidPresentValue","type":"error"},{"inputs":[],"name":"InvalidSignature","type":"error"},{"inputs":[],"name":"InvalidTimestamp","type":"error"},{"inputs":[],"name":"LnInvalidInput","type":"error"},{"inputs":[],"name":"MinimumSharePrice","type":"error"},{"inputs":[],"name":"MinimumTransactionAmount","type":"error"},{"inputs":[],"name":"NotPayable","type":"error"},{"inputs":[],"name":"OutputLimit","type":"error"},{"inputs":[],"name":"PoolAlreadyInitialized","type":"error"},{"inputs":[],"name":"PoolIsPaused","type":"error"},{"inputs":[],"name":"RestrictedZeroAddress","type":"error"},{"inputs":[{"internalType":"bytes","name":"data","type":"bytes"}],"name":"ReturnData","type":"error"},{"inputs":[],"name":"SweepFailed","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"inputs":[],"name":"Unauthorized","type":"error"},{"inputs":[],"name":"UnexpectedSuccess","type":"error"},{"inputs":[],"name":"UnsafeCastToInt128","type":"error"},{"inputs":[],"name":"UnsafeCastToInt256","type":"error"},{"inputs":[],"name":"UnsafeCastToUint112","type":"error"},{"inputs":[],"name":"UnsafeCastToUint128","type":"error"},{"inputs":[],"name":"UnsafeCastToUint256","type":"error"},{"inputs":[],"name":"UnsupportedToken","type":"error"},{"inputs":[],"name":"UpdateLiquidityFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"lpAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"uint256","name":"lpSharePrice","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"AddLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":true,"internalType":"uint256","name":"assetId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maturityTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"uint256","name":"bondAmount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"CloseLong","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":true,"internalType":"uint256","name":"assetId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maturityTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"uint256","name":"basePayment","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bondAmount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"CloseShort","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"collector","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"}],"name":"CollectGovernanceFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"checkpointTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"checkpointVaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maturedShorts","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maturedLongs","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lpSharePrice","type":"uint256"}],"name":"CreateCheckpoint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"lpAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"uint256","name":"apr","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"assetId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maturityTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"uint256","name":"bondAmount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"OpenLong","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"assetId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maturityTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"uint256","name":"baseProceeds","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bondAmount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"OpenShort","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"isPaused","type":"bool"}],"name":"PauseStatusUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":false,"internalType":"uint256","name":"withdrawalShareAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"RedeemWithdrawalShares","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":false,"internalType":"uint256","name":"lpAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"indexed":false,"internalType":"bool","name":"asBase","type":"bool"},{"indexed":false,"internalType":"uint256","name":"withdrawalShareAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lpSharePrice","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"RemoveLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"collector","type":"address"},{"indexed":true,"internalType":"address","name":"target","type":"address"}],"name":"Sweep","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_contribution","type":"uint256"},{"internalType":"uint256","name":"_minLpSharePrice","type":"uint256"},{"internalType":"uint256","name":"_minApr","type":"uint256"},{"internalType":"uint256","name":"_maxApr","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"lpShares","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"adminController","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"batchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_checkpointTime","type":"uint256"},{"internalType":"uint256","name":"_maxIterations","type":"uint256"}],"name":"checkpoint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maturityTime","type":"uint256"},{"internalType":"uint256","name":"_bondAmount","type":"uint256"},{"internalType":"uint256","name":"_minOutput","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"closeLong","outputs":[{"internalType":"uint256","name":"proceeds","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maturityTime","type":"uint256"},{"internalType":"uint256","name":"_bondAmount","type":"uint256"},{"internalType":"uint256","name":"_minOutput","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"closeShort","outputs":[{"internalType":"uint256","name":"proceeds","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collateralToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"collectGovernanceFee","outputs":[{"internalType":"uint256","name":"proceeds","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_shareAmount","type":"uint256"}],"name":"convertToBase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_baseAmount","type":"uint256"}],"name":"convertToShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_checkpointTime","type":"uint256"}],"name":"getCheckpoint","outputs":[{"components":[{"internalType":"uint128","name":"weightedSpotPrice","type":"uint128"},{"internalType":"uint128","name":"lastWeightedSpotPriceUpdateTime","type":"uint128"},{"internalType":"uint128","name":"vaultSharePrice","type":"uint128"}],"internalType":"struct IHyperdrive.Checkpoint","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_checkpointTime","type":"uint256"}],"name":"getCheckpointExposure","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarketState","outputs":[{"components":[{"internalType":"uint128","name":"shareReserves","type":"uint128"},{"internalType":"uint128","name":"bondReserves","type":"uint128"},{"internalType":"uint128","name":"longExposure","type":"uint128"},{"internalType":"uint128","name":"longsOutstanding","type":"uint128"},{"internalType":"int128","name":"shareAdjustment","type":"int128"},{"internalType":"uint128","name":"shortsOutstanding","type":"uint128"},{"internalType":"uint128","name":"longAverageMaturityTime","type":"uint128"},{"internalType":"uint128","name":"shortAverageMaturityTime","type":"uint128"},{"internalType":"bool","name":"isInitialized","type":"bool"},{"internalType":"bool","name":"isPaused","type":"bool"},{"internalType":"uint112","name":"zombieBaseProceeds","type":"uint112"},{"internalType":"uint128","name":"zombieShareReserves","type":"uint128"}],"internalType":"struct IHyperdrive.MarketState","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPoolConfig","outputs":[{"components":[{"internalType":"contract IERC20","name":"baseToken","type":"address"},{"internalType":"contract IERC20","name":"vaultSharesToken","type":"address"},{"internalType":"address","name":"linkerFactory","type":"address"},{"internalType":"bytes32","name":"linkerCodeHash","type":"bytes32"},{"internalType":"uint256","name":"initialVaultSharePrice","type":"uint256"},{"internalType":"uint256","name":"minimumShareReserves","type":"uint256"},{"internalType":"uint256","name":"minimumTransactionAmount","type":"uint256"},{"internalType":"uint256","name":"circuitBreakerDelta","type":"uint256"},{"internalType":"uint256","name":"positionDuration","type":"uint256"},{"internalType":"uint256","name":"checkpointDuration","type":"uint256"},{"internalType":"uint256","name":"timeStretch","type":"uint256"},{"internalType":"address","name":"governance","type":"address"},{"internalType":"address","name":"feeCollector","type":"address"},{"internalType":"address","name":"sweepCollector","type":"address"},{"internalType":"address","name":"checkpointRewarder","type":"address"},{"components":[{"internalType":"uint256","name":"curve","type":"uint256"},{"internalType":"uint256","name":"flat","type":"uint256"},{"internalType":"uint256","name":"governanceLP","type":"uint256"},{"internalType":"uint256","name":"governanceZombie","type":"uint256"}],"internalType":"struct IHyperdrive.Fees","name":"fees","type":"tuple"}],"internalType":"struct IHyperdrive.PoolConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPoolInfo","outputs":[{"components":[{"internalType":"uint256","name":"shareReserves","type":"uint256"},{"internalType":"int256","name":"shareAdjustment","type":"int256"},{"internalType":"uint256","name":"zombieBaseProceeds","type":"uint256"},{"internalType":"uint256","name":"zombieShareReserves","type":"uint256"},{"internalType":"uint256","name":"bondReserves","type":"uint256"},{"internalType":"uint256","name":"lpTotalSupply","type":"uint256"},{"internalType":"uint256","name":"vaultSharePrice","type":"uint256"},{"internalType":"uint256","name":"longsOutstanding","type":"uint256"},{"internalType":"uint256","name":"longAverageMaturityTime","type":"uint256"},{"internalType":"uint256","name":"shortsOutstanding","type":"uint256"},{"internalType":"uint256","name":"shortAverageMaturityTime","type":"uint256"},{"internalType":"uint256","name":"withdrawalSharesReadyToWithdraw","type":"uint256"},{"internalType":"uint256","name":"withdrawalSharesProceeds","type":"uint256"},{"internalType":"uint256","name":"lpSharePrice","type":"uint256"},{"internalType":"uint256","name":"longExposure","type":"uint256"}],"internalType":"struct IHyperdrive.PoolInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUncollectedGovernanceFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWithdrawPool","outputs":[{"components":[{"internalType":"uint128","name":"readyToWithdraw","type":"uint128"},{"internalType":"uint128","name":"proceeds","type":"uint128"}],"internalType":"struct IHyperdrive.WithdrawPool","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"id","outputs":[{"internalType":"Id","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_contribution","type":"uint256"},{"internalType":"uint256","name":"_apr","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"initialize","outputs":[{"internalType":"uint256","name":"lpShares","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"irm","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"isPauser","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kind","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"lltv","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_slots","type":"uint256[]"}],"name":"load","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_minOutput","type":"uint256"},{"internalType":"uint256","name":"_minVaultSharePrice","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"openLong","outputs":[{"internalType":"uint256","name":"maturityTime","type":"uint256"},{"internalType":"uint256","name":"bondProceeds","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_bondAmount","type":"uint256"},{"internalType":"uint256","name":"_maxDeposit","type":"uint256"},{"internalType":"uint256","name":"_minVaultSharePrice","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"openShort","outputs":[{"internalType":"uint256","name":"maturityTime","type":"uint256"},{"internalType":"uint256","name":"deposit","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"perTokenApprovals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permitForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_withdrawalShares","type":"uint256"},{"internalType":"uint256","name":"_minOutputPerShare","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"redeemWithdrawalShares","outputs":[{"internalType":"uint256","name":"proceeds","type":"uint256"},{"internalType":"uint256","name":"withdrawalSharesRedeemed","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lpShares","type":"uint256"},{"internalType":"uint256","name":"_minOutputPerShare","type":"uint256"},{"components":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bool","name":"asBase","type":"bool"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct IHyperdrive.Options","name":"_options","type":"tuple"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"proceeds","type":"uint256"},{"internalType":"uint256","name":"withdrawalShares","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenID","type":"uint256"},{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setApproval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenID","type":"uint256"},{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"caller","type":"address"}],"name":"setApprovalBridge","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_who","type":"address"}],"name":"setGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bool","name":"","type":"bool"}],"name":"setPauser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_target","type":"address"}],"name":"sweep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"target0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"target1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"target2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"target3","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"target4","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenID","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenID","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"caller","type":"address"}],"name":"transferFromBridge","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vaultSharesToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}],"devdoc":{"kind":"dev","methods":{"PERMIT_TYPEHASH()":{"returns":{"_0":"The EIP712 permit typehash of the MultiToken."}},"addLiquidity(uint256,uint256,uint256,uint256,(address,bool,bytes))":{"params":{"_contribution":"The amount of capital to supply. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.","_maxApr":"The maximum APR at which the LP is willing to supply.","_minApr":"The minimum APR at which the LP is willing to supply.","_minLpSharePrice":"The minimum LP share price the LP is willing        to accept for their shares. LPs incur negative slippage when        adding liquidity if there is a net curve position in the market,        so this allows LPs to protect themselves from high levels of        slippage. The units of this quantity are either base or vault        shares, depending on the value of `_options.asBase`.","_options":"The options that configure how the operation is settled."},"returns":{"lpShares":"The LP shares received by the LP."}},"adminController()":{"returns":{"_0":"The admin controller address."}},"balanceOf(uint256,address)":{"params":{"owner":"The owner of the tokens.","tokenId":"The sub-token ID."},"returns":{"_0":"The balance of the owner."}},"baseToken()":{"returns":{"_0":"The base token."}},"batchTransferFrom(address,address,uint256[],uint256[])":{"params":{"from":"The source account.","ids":"The array of token ids of the asset to transfer.","to":"The destination account.","values":"The amount of each token to transfer."}},"checkpoint(uint256,uint256)":{"params":{"_checkpointTime":"The time of the checkpoint to create.","_maxIterations":"The number of iterations to use in the Newton\'s        method component of `_distributeExcessIdleSafe`. This defaults to        `LPMath.SHARE_PROCEEDS_MAX_ITERATIONS` if the specified value is        smaller than the constant."}},"closeLong(uint256,uint256,uint256,(address,bool,bytes))":{"params":{"_bondAmount":"The amount of longs to close.","_maturityTime":"The maturity time of the long.","_minOutput":"The minimum proceeds the trader will accept. The units        of this quantity are either base or vault shares, depending on        the value of `_options.asBase`.","_options":"The options that configure how the trade is settled."},"returns":{"proceeds":"The proceeds the user receives. The units of this         quantity are either base or vault shares, depending on the value         of `_options.asBase`."}},"closeShort(uint256,uint256,uint256,(address,bool,bytes))":{"params":{"_bondAmount":"The amount of shorts to close.","_maturityTime":"The maturity time of the short.","_minOutput":"The minimum output of this trade. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.","_options":"The options that configure how the trade is settled."},"returns":{"proceeds":"The proceeds of closing this short. The units of this         quantity are either base or vault shares, depending on the value         of `_options.asBase`."}},"collateralToken()":{"returns":{"_0":"The collateral token for this Morpho Blue market."}},"collectGovernanceFee((address,bool,bytes))":{"params":{"_options":"The options that configure how the fees are settled."},"returns":{"proceeds":"The governance fees collected. The units of this         quantity are either base or vault shares, depending on the value         of `_options.asBase`."}},"convertToBase(uint256)":{"details":"This is a convenience method that allows developers to convert from      vault shares to base without knowing the specifics of the      integration.","params":{"_shareAmount":"The vault shares amount."},"returns":{"_0":"baseAmount The base amount."}},"convertToShares(uint256)":{"details":"This is a convenience method that allows developers to convert from      base to vault shares without knowing the specifics of the      integration.","params":{"_baseAmount":"The base amount."},"returns":{"_0":"shareAmount The vault shares amount."}},"decimals()":{"returns":{"_0":"The decimals of the MultiToken."}},"domainSeparator()":{"returns":{"_0":"The EIP712 domain separator of the MultiToken."}},"getCheckpoint(uint256)":{"params":{"_checkpointTime":"The checkpoint time."},"returns":{"_0":"The checkpoint."}},"getCheckpointExposure(uint256)":{"params":{"_checkpointTime":"The checkpoint time."},"returns":{"_0":"The checkpoint exposure."}},"getMarketState()":{"returns":{"_0":"The market state."}},"getPoolConfig()":{"returns":{"_0":"The pool configuration."}},"getPoolInfo()":{"returns":{"_0":"The pool info."}},"getUncollectedGovernanceFees()":{"returns":{"_0":"The amount of uncollected governance fees."}},"getWithdrawPool()":{"returns":{"_0":"The withdrawal pool information."}},"id()":{"returns":{"_0":"The Morpho Blue ID."}},"initialize(uint256,uint256,(address,bool,bytes))":{"params":{"_apr":"The target APR.","_contribution":"The amount of capital to supply. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.","_options":"The options that configure how the operation is settled."},"returns":{"lpShares":"The initial number of LP shares created."}},"irm()":{"returns":{"_0":"The interest rate model for this Morpho Blue market."}},"isApprovedForAll(address,address)":{"params":{"owner":"The owner of the tokens.","spender":"The spender of the tokens."},"returns":{"_0":"The approval-for-all status of the spender for the owner."}},"isPauser(address)":{"params":{"_account":"The account to check."},"returns":{"_0":"The account\'s pauser status."}},"kind()":{"returns":{"_0":"The instance\'s kind."}},"lltv()":{"returns":{"_0":"The liquiditation loan to value ratio for this Morpho Blue market."}},"load(uint256[])":{"details":"This serves as a generalized getter that allows consumers to create      custom getters to suit their purposes.","params":{"_slots":"The storage slots to load."},"returns":{"_0":"The values at the specified slots."}},"name()":{"returns":{"_0":"The instance\'s name."}},"name(uint256)":{"params":{"tokenId":"The sub-token ID."},"returns":{"_0":"The name of the MultiToken."}},"nonces(address)":{"params":{"owner":"The owner of the tokens."},"returns":{"_0":"The permit nonce of the owner."}},"openLong(uint256,uint256,uint256,(address,bool,bytes))":{"params":{"_amount":"The amount of capital provided to open the long. The        units of this quantity are either base or vault shares, depending        on the value of `_options.asBase`.","_minOutput":"The minimum number of bonds to receive.","_minVaultSharePrice":"The minimum vault share price at which to        open the long. This allows traders to protect themselves from        opening a long in a checkpoint where negative interest has        accrued.","_options":"The options that configure how the trade is settled."},"returns":{"bondProceeds":"The amount of bonds the user received.","maturityTime":"The maturity time of the bonds."}},"openShort(uint256,uint256,uint256,(address,bool,bytes))":{"params":{"_bondAmount":"The amount of bonds to short.","_maxDeposit":"The most the user expects to deposit for this trade.        The units of this quantity are either base or vault shares,        depending on the value of `_options.asBase`.","_minVaultSharePrice":"The minimum vault share price at which to open        the short. This allows traders to protect themselves from opening        a short in a checkpoint where negative interest has accrued.","_options":"The options that configure how the trade is settled."},"returns":{"deposit":"The amount the user deposited for this trade. The units         of this quantity are either base or vault shares, depending on         the value of `_options.asBase`.","maturityTime":"The maturity time of the short."}},"oracle()":{"returns":{"_0":"The oracle for this Morpho Blue market."}},"pause(bool)":{"params":{"_status":"True to pause all deposits and false to unpause them."}},"perTokenApprovals(uint256,address,address)":{"params":{"owner":"The owner of the tokens.","spender":"The spender of the tokens.","tokenId":"The sub-token ID."},"returns":{"_0":"The allowance of the spender for the owner."}},"permitForAll(address,address,bool,uint256,uint8,bytes32,bytes32)":{"details":"The signature for this function follows EIP 712 standard and should      be generated with the eth_signTypedData JSON RPC call instead of      the eth_sign JSON RPC call. If using out of date parity signing      libraries the v component may need to be adjusted. Also it is very      rare but possible for v to be other values, those values are not      supported.","params":{"_approved":"A boolean of the approval status to set to.","deadline":"The timestamp which the signature must be submitted by        to be valid.","owner":"The owner of the account which is having the new approval set.","r":"The r component of the ECDSA signature.","s":"The s component of the ECDSA signature.","spender":"The address which will be allowed to spend owner\'s tokens.","v":"Extra ECDSA data which allows public key recovery from        signature assumed to be 27 or 28."}},"redeemWithdrawalShares(uint256,uint256,(address,bool,bytes))":{"params":{"_minOutputPerShare":"The minimum amount the LP expects to        receive for each withdrawal share that is burned. The units of        this quantity are either base or vault shares, depending on the        value of `_options.asBase`.","_options":"The options that configure how the operation is settled.","_withdrawalShares":"The withdrawal shares to redeem."},"returns":{"proceeds":"The amount the LP received. The units of this quantity         are either base or vault shares, depending on the value of         `_options.asBase`.","withdrawalSharesRedeemed":"The amount of withdrawal shares that         were redeemed."}},"removeLiquidity(uint256,uint256,(address,bool,bytes))":{"params":{"_lpShares":"The LP shares to burn.","_minOutputPerShare":"The minimum amount the LP expects to receive        for each withdrawal share that is burned. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.","_options":"The options that configure how the operation is settled."},"returns":{"proceeds":"The amount the LP removing liquidity receives. The         units of this quantity are either base or vault shares,         depending on the value of `_options.asBase`.","withdrawalShares":"The base that the LP receives buys out some of         their LP shares, but it may not be sufficient to fully buy the         LP out. In this case, the LP receives withdrawal shares equal in         value to the present value they are owed. As idle capital         becomes available, the pool will buy back these shares."}},"setApproval(uint256,address,uint256)":{"params":{"amount":"The max tokens the approved person can use, setting to        uint256.max will cause the value to never decrement (saving gas        on transfer).","operator":"The address who will be able to use the tokens.","tokenID":"The asset to approve the use of."}},"setApprovalBridge(uint256,address,uint256,address)":{"params":{"amount":"The max tokens the approved person can use, setting to        uint256.max will cause the value to never decrement [saving gas        on transfer].","caller":"The eth address which called the linking contract.","operator":"The address who will be able to use the tokens.","tokenID":"The asset to approve the use of."}},"setApprovalForAll(address,bool)":{"params":{"approved":"True to approve, false to remove approval.","operator":"The eth address which can access the caller\'s assets."}},"setGovernance(address)":{"details":"Don\'t call this. It doesn\'t do anything."},"setPauser(address,bool)":{"details":"Don\'t call this. It doesn\'t do anything."},"sweep(address)":{"details":"WARN: It is unlikely but possible that there is a selector overlap      with \'transferFrom\'. Any integrating contracts should be checked      for that, as it may result in an unexpected call from this address.","params":{"_target":"The target token to sweep."}},"symbol(uint256)":{"params":{"tokenId":"The sub-token ID."},"returns":{"_0":"The symbol of the MultiToken."}},"target0()":{"returns":{"_0":"The target0 address."}},"target1()":{"returns":{"_0":"The target1 address."}},"target2()":{"returns":{"_0":"The target2 address."}},"target3()":{"returns":{"_0":"The target3 address."}},"target4()":{"returns":{"_0":"The target4 address."}},"totalShares()":{"details":"This is a convenience method that allows developers to get the      total amount of vault shares without knowing the specifics of the      integration.","returns":{"_0":"The total amount of vault shares held by Hyperdrive."}},"totalSupply(uint256)":{"params":{"tokenId":"The sub-token ID."},"returns":{"_0":"The total supply of the MultiToken."}},"transferFrom(uint256,address,address,uint256)":{"params":{"amount":"The amount of token to move.","from":"The address whose balance will be reduced.","to":"The address whose balance will be increased.","tokenID":"The token identifier."}},"transferFromBridge(uint256,address,address,uint256,address)":{"params":{"amount":"The amount of token to move.","caller":"The msg.sender or the caller of the ERC20Forwarder.","from":"The address whose balance will be reduced.","to":"The address whose balance will be increased.","tokenID":"The token identifier."}},"vault()":{"returns":{"_0":"The compatible yield source."}},"vaultSharesToken()":{"returns":{"_0":"The vault shares token."}},"version()":{"returns":{"_0":"The instance\'s version."}}},"version":1},"userdoc":{"errors":{"BatchInputLengthMismatch()":[{"notice":"Thrown when the inputs to a batch transfer don\'t match in         length."}],"BelowMinimumContribution()":[{"notice":"Thrown when the initializer doesn\'t provide sufficient liquidity         to cover the minimum share reserves and the LP shares that are         burned on initialization."}],"CircuitBreakerTriggered()":[{"notice":"Thrown when the add liquidity circuit breaker is triggered."}],"DecreasedPresentValueWhenAddingLiquidity()":[{"notice":"Thrown when the present value prior to adding liquidity results in a         decrease in present value after liquidity. This is caused by a         shortage in liquidity that prevents all the open positions being         closed on the curve and therefore marked to 1."}],"DistributeExcessIdleFailed()":[{"notice":"Thrown when the distribute excess idle calculation fails due         to the starting present value calculation failing."}],"ExpInvalidExponent()":[{"notice":"Thrown when the exponent to `FixedPointMath.exp` would cause the         the result to be larger than the representable scale."}],"ExpiredDeadline()":[{"notice":"Thrown when a permit signature is expired."}],"InsufficientBalance()":[{"notice":"Thrown when a user doesn\'t have a sufficient balance to perform         an action."}],"InsufficientLiquidity()":[{"notice":"Thrown when the pool doesn\'t have sufficient liquidity to         complete the trade."}],"InvalidApr()":[{"notice":"Thrown when the pool\'s APR is outside the bounds specified by         a LP when they are adding liquidity."}],"InvalidCheckpointTime()":[{"notice":"Thrown when the checkpoint time provided to `checkpoint` is         larger than the current checkpoint or isn\'t divisible by the         checkpoint duration."}],"InvalidERC20Bridge()":[{"notice":"Thrown when the caller of one of MultiToken\'s bridge-only         functions is not the corresponding bridge."}],"InvalidEffectiveShareReserves()":[{"notice":"Thrown when the effective share reserves don\'t exceed the         minimum share reserves when the pool is initialized."}],"InvalidFeeDestination()":[{"notice":"Thrown when a destination other than the fee collector is         specified in `collectGovernanceFee`."}],"InvalidInitialVaultSharePrice()":[{"notice":"Thrown when the initial share price doesn\'t match the share         price of the underlying yield source on deployment."}],"InvalidLPSharePrice()":[{"notice":"Thrown when the LP share price couldn\'t be calculated in a         critical situation."}],"InvalidPresentValue()":[{"notice":"Thrown when the present value calculation fails."}],"InvalidSignature()":[{"notice":"Thrown when an invalid signature is used provide permit access         to the MultiToken. A signature is considered to be invalid if         it fails to recover to the owner\'s address."}],"InvalidTimestamp()":[{"notice":"Thrown when the timestamp used to construct an asset ID exceeds         the uint248 scale."}],"LnInvalidInput()":[{"notice":"Thrown when the input to `FixedPointMath.ln` is less than or         equal to zero."}],"MinimumSharePrice()":[{"notice":"Thrown when vault share price is smaller than the minimum share         price. This protects traders from unknowingly opening a long or         short after negative interest has accrued."}],"MinimumTransactionAmount()":[{"notice":"Thrown when the input or output amount of a trade is smaller         than the minimum transaction amount. This protects traders and         LPs from losses of precision that can occur at small scales."}],"NotPayable()":[{"notice":"Thrown when ether is sent to an instance that doesn\'t accept         ether as a deposit asset."}],"OutputLimit()":[{"notice":"Thrown when a slippage guard is violated."}],"PoolAlreadyInitialized()":[{"notice":"Thrown when the pool is already initialized and a trader calls         `initialize`. This prevents the pool from being reinitialized         after it has been initialized."}],"PoolIsPaused()":[{"notice":"Thrown when the pool is paused and a trader tries to add         liquidity, open a long, or open a short. Traders can still         close their existing positions while the pool is paused."}],"RestrictedZeroAddress()":[{"notice":"Thrown when the owner passed to permit is the zero address. This         prevents users from spending the funds in address zero by         sending an invalid signature to ecrecover."}],"ReturnData(bytes)":[{"notice":"Thrown by a read-only function called by the proxy. Unlike a         normal error, this error actually indicates that a read-only         call succeeded. The data that it wraps is the return data from         the read-only call."}],"SweepFailed()":[{"notice":"Thrown when an asset is swept from the pool and one of the         pool\'s depository assets changes."}],"TransferFailed()":[{"notice":"Thrown when an ether transfer fails."}],"Unauthorized()":[{"notice":"Thrown when an unauthorized user attempts to access admin         functionality."}],"UnexpectedSuccess()":[{"notice":"Thrown when a read-only call succeeds. The proxy architecture         uses a force-revert delegatecall pattern to ensure that calls         that are intended to be read-only are actually read-only."}],"UnsafeCastToInt128()":[{"notice":"Thrown when casting a value to a int128 that is outside of the         int128 scale."}],"UnsafeCastToInt256()":[{"notice":"Thrown when casting a value to a int256 that is outside of the         int256 scale."}],"UnsafeCastToUint112()":[{"notice":"Thrown when casting a value to a uint112 that is outside of the         uint128 scale."}],"UnsafeCastToUint128()":[{"notice":"Thrown when casting a value to a uint128 that is outside of the         uint128 scale."}],"UnsafeCastToUint256()":[{"notice":"Thrown when casting a value to a uint256 that is outside of the         uint256 scale."}],"UnsupportedToken()":[{"notice":"Thrown when an unsupported option is passed to a function or         a user attempts to sweep an invalid token. The options and sweep         targets that are supported vary between instances."}],"UpdateLiquidityFailed()":[{"notice":"Thrown when `LPMath.calculateUpdateLiquidity` fails."}]},"events":{"AddLiquidity(address,uint256,uint256,uint256,bool,uint256,bytes)":{"notice":"Emitted when an LP adds liquidity to the Hyperdrive pool."},"Approval(address,address,uint256)":{"notice":"Emitted when an account changes the allowance for another         account."},"ApprovalForAll(address,address,bool)":{"notice":"Emitted when an account changes the approval for all of its         tokens."},"CloseLong(address,address,uint256,uint256,uint256,uint256,bool,uint256,bytes)":{"notice":"Emitted when a long position is closed."},"CloseShort(address,address,uint256,uint256,uint256,uint256,bool,uint256,uint256,bytes)":{"notice":"Emitted when a short position is closed."},"CollectGovernanceFee(address,uint256,uint256,bool)":{"notice":"Emitted when governance fees are collected."},"CreateCheckpoint(uint256,uint256,uint256,uint256,uint256,uint256)":{"notice":"Emitted when a checkpoint is created."},"Initialize(address,uint256,uint256,uint256,bool,uint256,bytes)":{"notice":"Emitted when the Hyperdrive pool is initialized."},"OpenLong(address,uint256,uint256,uint256,uint256,bool,uint256,bytes)":{"notice":"Emitted when a long position is opened."},"OpenShort(address,uint256,uint256,uint256,uint256,bool,uint256,uint256,bytes)":{"notice":"Emitted when a short position is opened."},"PauseStatusUpdated(bool)":{"notice":"Emitted when the pause status is updated."},"RedeemWithdrawalShares(address,address,uint256,uint256,uint256,bool,bytes)":{"notice":"Emitted when an LP redeems withdrawal shares."},"RemoveLiquidity(address,address,uint256,uint256,uint256,bool,uint256,uint256,bytes)":{"notice":"Emitted when an LP removes liquidity from the Hyperdrive pool."},"Sweep(address,address)":{"notice":"Emitted when tokens are swept."},"TransferSingle(address,address,address,uint256,uint256)":{"notice":"Emitted when tokens are transferred from one account to another."}},"kind":"user","methods":{"PERMIT_TYPEHASH()":{"notice":"Gets the EIP712 permit typehash of the MultiToken."},"addLiquidity(uint256,uint256,uint256,uint256,(address,bool,bytes))":{"notice":"Allows LPs to supply liquidity for LP shares."},"adminController()":{"notice":"Gets the address that contains the admin configuration for this         instance."},"balanceOf(uint256,address)":{"notice":"Gets the balance of a spender for a sub-token."},"baseToken()":{"notice":"Gets the Hyperdrive pool\'s base token."},"batchTransferFrom(address,address,uint256[],uint256[])":{"notice":"Transfers several assets from one account to another."},"checkpoint(uint256,uint256)":{"notice":"Attempts to mint a checkpoint with the specified checkpoint time."},"closeLong(uint256,uint256,uint256,(address,bool,bytes))":{"notice":"Closes a long position with a specified maturity time."},"closeShort(uint256,uint256,uint256,(address,bool,bytes))":{"notice":"Closes a short position with a specified maturity time."},"collateralToken()":{"notice":"Returns the collateral token for this Morpho Blue market."},"collectGovernanceFee((address,bool,bytes))":{"notice":"This function collects the governance fees accrued by the pool."},"convertToBase(uint256)":{"notice":"Convert an amount of vault shares to an amount of base."},"convertToShares(uint256)":{"notice":"Convert an amount of base to an amount of vault shares."},"decimals()":{"notice":"Gets the decimals of the MultiToken."},"domainSeparator()":{"notice":"Gets the EIP712 domain separator of the MultiToken."},"getCheckpoint(uint256)":{"notice":"Gets one of the pool\'s checkpoints."},"getCheckpointExposure(uint256)":{"notice":"Gets the pool\'s exposure from a checkpoint. This is the number         of non-netted longs in the checkpoint."},"getMarketState()":{"notice":"Gets the pool\'s state relating to the Hyperdrive market."},"getPoolConfig()":{"notice":"Gets the pool\'s configuration parameters."},"getPoolInfo()":{"notice":"Gets info about the pool\'s reserves and other state that is         important to evaluate potential trades."},"getUncollectedGovernanceFees()":{"notice":"Gets the amount of governance fees that haven\'t been collected."},"getWithdrawPool()":{"notice":"Gets information relating to the pool\'s withdrawal pool. This         includes the total proceeds underlying the withdrawal pool and         the number of withdrawal shares ready to be redeemed."},"id()":{"notice":"Returns the Morpho Blue ID for this market."},"initialize(uint256,uint256,(address,bool,bytes))":{"notice":"Allows the first LP to initialize the market with a target APR."},"irm()":{"notice":"Returns the interest rate model for this Morpho Blue market."},"isApprovedForAll(address,address)":{"notice":"Gets the approval-for-all status of a spender on behalf of an         owner."},"isPauser(address)":{"notice":"Gets an account\'s pauser status within the Hyperdrive pool."},"kind()":{"notice":"Gets the instance\'s kind."},"lltv()":{"notice":"Returns the liquidation loan to value ratio for this Morpho Blue         market."},"load(uint256[])":{"notice":"Gets the storage values at the specified slots."},"name()":{"notice":"Gets the instance\'s name."},"name(uint256)":{"notice":"Gets the name of the MultiToken."},"nonces(address)":{"notice":"Gets the permit nonce for an account."},"openLong(uint256,uint256,uint256,(address,bool,bytes))":{"notice":"Opens a long position."},"openShort(uint256,uint256,uint256,(address,bool,bytes))":{"notice":"Opens a short position."},"oracle()":{"notice":"Returns the oracle for this Morpho Blue market."},"pause(bool)":{"notice":"Allows an authorized address to pause this contract."},"perTokenApprovals(uint256,address,address)":{"notice":"Gets the allowance of a spender for a sub-token."},"permitForAll(address,address,bool,uint256,uint8,bytes32,bytes32)":{"notice":"Allows a caller who is not the owner of an account to execute the         functionality of \'approve\' for all assets with the owner\'s         signature."},"redeemWithdrawalShares(uint256,uint256,(address,bool,bytes))":{"notice":"Redeems withdrawal shares by giving the LP a pro-rata amount of         the withdrawal pool\'s proceeds. This function redeems the         maximum amount of the specified withdrawal shares given the         amount of withdrawal shares ready to withdraw."},"removeLiquidity(uint256,uint256,(address,bool,bytes))":{"notice":"Allows an LP to burn shares and withdraw from the pool."},"setApproval(uint256,address,uint256)":{"notice":"Allows a user to set an approval for an individual asset with         specific amount."},"setApprovalBridge(uint256,address,uint256,address)":{"notice":"Allows the compatibility linking contract to forward calls to         set asset approvals."},"setApprovalForAll(address,bool)":{"notice":"Allows a user to approve an operator to use all of their assets."},"setGovernance(address)":{"notice":"A stub for the old setPauser functions that doesn\'t do anything         anymore."},"setPauser(address,bool)":{"notice":"A stub for the old setPauser functions that doesn\'t do anything         anymore."},"sweep(address)":{"notice":"Transfers the contract\'s balance of a target token to the fee         collector address."},"symbol(uint256)":{"notice":"Gets the symbol of the MultiToken."},"target0()":{"notice":"Gets the target0 address."},"target1()":{"notice":"Gets the target1 address."},"target2()":{"notice":"Gets the target2 address."},"target3()":{"notice":"Gets the target3 address."},"target4()":{"notice":"Gets the target4 address."},"totalShares()":{"notice":"Gets the total amount of vault shares held by Hyperdrive."},"totalSupply(uint256)":{"notice":"Gets the total supply of the MultiToken."},"transferFrom(uint256,address,address,uint256)":{"notice":"Transfers an amount of assets from the source to the destination."},"transferFromBridge(uint256,address,address,uint256,address)":{"notice":"Permissioned transfer for the bridge to access, only callable by         the ERC20 linking bridge."},"vault()":{"notice":"Gets the vault used as this pool\'s yield source."},"vaultSharesToken()":{"notice":"Gets the Hyperdrive pool\'s vault shares token."},"version()":{"notice":"Gets the instance\'s version."}},"version":1}},"settings":{"compilationTarget":{"contracts/src/interfaces/IMorphoBlueHyperdrive.sol":"IMorphoBlueHyperdrive"},"evmVersion":"paris","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200},"remappings":[":@opengsn/=lib/aerodrome/lib/gsn/packages/",":@openzeppelin/=lib/aerodrome/lib/openzeppelin-contracts/",":@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",":@uniswap/v3-core/=lib/aerodrome/lib/v3-core/",":ExcessivelySafeCall/=lib/ExcessivelySafeCall/src/",":aave-v3-core/=lib/aave-v3-origin/src/core/",":aave-v3-origin/=lib/aave-v3-origin/",":aave-v3-periphery/=lib/aave-v3-origin/src/periphery/",":aave/=lib/aave-v3-origin/src/core/contracts/",":aerodrome/=lib/aerodrome/contracts/",":createx/=lib/createx/src/",":ds-test/=lib/aerodrome/lib/ds-test/src/",":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",":eth-gas-reporter/=node_modules/eth-gas-reporter/",":etherfi/=lib/smart-contracts/",":forge-std/=lib/forge-std/src/",":gsn/=lib/aerodrome/lib/",":hardhat-deploy/=node_modules/hardhat-deploy/",":hardhat/=node_modules/hardhat/",":morpho-blue/=lib/morpho-blue/",":nomad/=lib/ExcessivelySafeCall/src/",":openzeppelin-contracts/=lib/openzeppelin-contracts/",":openzeppelin/=lib/openzeppelin-contracts/contracts/",":solady/=lib/createx/lib/solady/",":solidity-utils/=lib/aave-v3-origin/lib/solidity-utils/",":solmate/=lib/solmate/src/",":utils/=lib/aerodrome/test/utils/",":v3-core/=lib/aerodrome/lib/v3-core/"]},"sources":{"contracts/src/interfaces/IERC20.sol":{"keccak256":"0x54f00c8917f5fe81bf192a28f5e00edfdd3871ac93c43d05fafbec84509dc07a","license":"Apache-2.0","urls":["bzz-raw://ce3df2d8398326db1ee9ec067bfaf873e41f96f505a7f31a6d2298ba32542c0a","dweb:/ipfs/QmQTuioiph2ZiAPoPmzcsbpRAXSxYQDcyfTeNWTQ7afrND"]},"contracts/src/interfaces/IHyperdrive.sol":{"keccak256":"0xc8fa80fa69f6f3c35f8325ada8f67614f9dd625e627cb4a2452bc6f933a6cf3a","license":"Apache-2.0","urls":["bzz-raw://1c318bc2e2951825bbf93243fe5325cfdda86bb9c51196bdfab09de03fefd031","dweb:/ipfs/QmV9Fw942kh3KuS5Nsyj2NhVQQozx38vKLwMJtMoTDsoju"]},"contracts/src/interfaces/IHyperdriveCore.sol":{"keccak256":"0x53c5394965ddf3868b7e396968c6b5877639a5a9e69c6a7fcd4cb4e7323a03f4","license":"Apache-2.0","urls":["bzz-raw://634ea5b7d6fcb57a989ef18fd0d05aa620a99bd8773f0f3ce7b43fd730b007f4","dweb:/ipfs/QmdniNXAC5167Hx3eLzXB8B8zPJbCEE8kq9sznvxnsmK7P"]},"contracts/src/interfaces/IHyperdriveEvents.sol":{"keccak256":"0xdf497b5ae5f616f740e75a5b78f4c61ee29e3d13a71e553e8746bebb8fefa7e0","license":"Apache-2.0","urls":["bzz-raw://a900b9b2a58433f1cfb0de14c16cf24092cc0e807d3fff4e28da89042fd1d123","dweb:/ipfs/QmX7xvBPq4K54Wk6rmrSYYyEoXMfqj8fE8KbJMwoouAfxe"]},"contracts/src/interfaces/IHyperdriveRead.sol":{"keccak256":"0x755dd633f74e5892318c842ac0f73d306bd6a9171b31488ae30abab0bc79af06","license":"Apache-2.0","urls":["bzz-raw://2340ae81aa620a4eb883efa8255f570a51bb4e4a29813d8d13528b8c7a8fbe0a","dweb:/ipfs/Qma8awS1kw3WhNKn21McHYq7zyX44kcPF5a4sjbtxNzjyN"]},"contracts/src/interfaces/IMorphoBlueHyperdrive.sol":{"keccak256":"0xe387ab8c8dc7c7d10a3811560c6af3b3c4c3a28e8e270b2640efb4441a0a0468","license":"Apache-2.0","urls":["bzz-raw://8e63ec2b13c4d6ac57a6a315afe747161fa55f608e1370e0dcf04616cb2a3d2f","dweb:/ipfs/QmXjmFcUCV3V3L7fPH9xCf7S9mixnuAbYYe6DMNUprqbnD"]},"contracts/src/interfaces/IMultiToken.sol":{"keccak256":"0xa12bf0c1c22d8501b42efa8bf55375ff9ea2f14cfba02e13f87842af577814a1","license":"Apache-2.0","urls":["bzz-raw://eddf5bf542205e1f077ff3bdf9910bd4612b0f7fa47e15786ca143f4b9cecb11","dweb:/ipfs/Qmc9Y7inShyE1JnoRctqe5X66yVgMrTaUBtuDWoMoT6Ynb"]},"contracts/src/interfaces/IMultiTokenCore.sol":{"keccak256":"0x25488a61182c05606923ada426c701a54fed9a2478f5a45f39fb85b49ed17e33","license":"Apache-2.0","urls":["bzz-raw://3d117283eb412127c6e7538c7e97980c7e2eea5a33c58014840efaf1ca47ba67","dweb:/ipfs/QmbkVfupfbhnmeeBuSTgfy2CB8WjSnMQLsLReyxFAyWk9S"]},"contracts/src/interfaces/IMultiTokenEvents.sol":{"keccak256":"0xcf0334b0fa3a8a1c36191a3e830d0f13968ea8a84e8e3a64e36517271702f5e1","license":"Apache-2.0","urls":["bzz-raw://8777489b37cc9dc5021ff7f4e72641942d6e160bb1f99f5c9d91974066ed9d89","dweb:/ipfs/QmYKpRq8o1CmjpxoFxq3WsZxcZFguewr8gyTaDgUs6ws3d"]},"contracts/src/interfaces/IMultiTokenMetadata.sol":{"keccak256":"0xeb2eca9693f2502d68f9a878d8478902595cf8a91d2c7d72c75fdc6da9d7c678","license":"Apache-2.0","urls":["bzz-raw://019fba0bb197250ee2aed5b1173c1e84675a2f94b3fbb050e50aaebfb2274fd3","dweb:/ipfs/QmRh5eEcbAAnjrrGoXwgfNjo5C6GYekw7jkXXMzoJHC9A8"]},"contracts/src/interfaces/IMultiTokenRead.sol":{"keccak256":"0xef515314bad7cd731d3ed0da453e7e6ac0abe8d5313a29416d7d32247a4d9a79","license":"Apache-2.0","urls":["bzz-raw://2a3d745e509ec9524503eabeda096ec1b7b780a3558640151426b200815c778e","dweb:/ipfs/QmTZ8Kqm9QYKBcbWw7vGj6iS54jEJzaeAoxWdbWirXGWqd"]},"lib/morpho-blue/src/interfaces/IMorpho.sol":{"keccak256":"0xee9fbe10e0cd31b8d4c2c2effadaf337a6c6c43c9bdb94d2cad79fdffc47a86e","license":"GPL-2.0-or-later","urls":["bzz-raw://bc94b9b24900994cba898911edf82545052e738f6c9c2a7a56589c122014d363","dweb:/ipfs/QmXp9qkTnoPoio6KvdCFnCVW6Tjfb4Kbd4zByuiwQwwmwx"]}},"version":1}',
    metadata: {
        compiler: { version: "0.8.22+commit.4fc1097e" },
        language: "Solidity",
        output: {
            abi: [
                { inputs: [], type: "error", name: "BatchInputLengthMismatch" },
                { inputs: [], type: "error", name: "BelowMinimumContribution" },
                { inputs: [], type: "error", name: "CircuitBreakerTriggered" },
                {
                    inputs: [],
                    type: "error",
                    name: "DecreasedPresentValueWhenAddingLiquidity",
                },
                {
                    inputs: [],
                    type: "error",
                    name: "DistributeExcessIdleFailed",
                },
                { inputs: [], type: "error", name: "ExpInvalidExponent" },
                { inputs: [], type: "error", name: "ExpiredDeadline" },
                { inputs: [], type: "error", name: "InsufficientBalance" },
                { inputs: [], type: "error", name: "InsufficientLiquidity" },
                { inputs: [], type: "error", name: "InvalidApr" },
                { inputs: [], type: "error", name: "InvalidCheckpointTime" },
                { inputs: [], type: "error", name: "InvalidERC20Bridge" },
                {
                    inputs: [],
                    type: "error",
                    name: "InvalidEffectiveShareReserves",
                },
                { inputs: [], type: "error", name: "InvalidFeeDestination" },
                {
                    inputs: [],
                    type: "error",
                    name: "InvalidInitialVaultSharePrice",
                },
                { inputs: [], type: "error", name: "InvalidLPSharePrice" },
                { inputs: [], type: "error", name: "InvalidPresentValue" },
                { inputs: [], type: "error", name: "InvalidSignature" },
                { inputs: [], type: "error", name: "InvalidTimestamp" },
                { inputs: [], type: "error", name: "LnInvalidInput" },
                { inputs: [], type: "error", name: "MinimumSharePrice" },
                { inputs: [], type: "error", name: "MinimumTransactionAmount" },
                { inputs: [], type: "error", name: "NotPayable" },
                { inputs: [], type: "error", name: "OutputLimit" },
                { inputs: [], type: "error", name: "PoolAlreadyInitialized" },
                { inputs: [], type: "error", name: "PoolIsPaused" },
                { inputs: [], type: "error", name: "RestrictedZeroAddress" },
                {
                    inputs: [
                        { internalType: "bytes", name: "data", type: "bytes" },
                    ],
                    type: "error",
                    name: "ReturnData",
                },
                { inputs: [], type: "error", name: "SweepFailed" },
                { inputs: [], type: "error", name: "TransferFailed" },
                { inputs: [], type: "error", name: "Unauthorized" },
                { inputs: [], type: "error", name: "UnexpectedSuccess" },
                { inputs: [], type: "error", name: "UnsafeCastToInt128" },
                { inputs: [], type: "error", name: "UnsafeCastToInt256" },
                { inputs: [], type: "error", name: "UnsafeCastToUint112" },
                { inputs: [], type: "error", name: "UnsafeCastToUint128" },
                { inputs: [], type: "error", name: "UnsafeCastToUint256" },
                { inputs: [], type: "error", name: "UnsupportedToken" },
                { inputs: [], type: "error", name: "UpdateLiquidityFailed" },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "provider",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "lpAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "lpSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "AddLiquidity",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "spender",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "value",
                            type: "uint256",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "Approval",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "account",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "operator",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "bool",
                            name: "approved",
                            type: "bool",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "ApprovalForAll",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "trader",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "destination",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "assetId",
                            type: "uint256",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "maturityTime",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "bondAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "CloseLong",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "trader",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "destination",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "assetId",
                            type: "uint256",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "maturityTime",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "basePayment",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "bondAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "CloseShort",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "collector",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "CollectGovernanceFee",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "checkpointTime",
                            type: "uint256",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "checkpointVaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "maturedShorts",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "maturedLongs",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "lpSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "CreateCheckpoint",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "provider",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "lpAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "apr",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "Initialize",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "trader",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "assetId",
                            type: "uint256",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "maturityTime",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "bondAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "OpenLong",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "trader",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "assetId",
                            type: "uint256",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "maturityTime",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "baseProceeds",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "bondAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "OpenShort",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "bool",
                            name: "isPaused",
                            type: "bool",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "PauseStatusUpdated",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "provider",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "destination",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "withdrawalShareAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "RedeemWithdrawalShares",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "provider",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "destination",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "lpAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "vaultSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bool",
                            name: "asBase",
                            type: "bool",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "withdrawalShareAmount",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "lpSharePrice",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "bytes",
                            name: "extraData",
                            type: "bytes",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "RemoveLiquidity",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "collector",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "target",
                            type: "address",
                            indexed: true,
                        },
                    ],
                    type: "event",
                    name: "Sweep",
                    anonymous: false,
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "operator",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "from",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                            indexed: true,
                        },
                        {
                            internalType: "uint256",
                            name: "id",
                            type: "uint256",
                            indexed: false,
                        },
                        {
                            internalType: "uint256",
                            name: "value",
                            type: "uint256",
                            indexed: false,
                        },
                    ],
                    type: "event",
                    name: "TransferSingle",
                    anonymous: false,
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "PERMIT_TYPEHASH",
                    outputs: [
                        { internalType: "bytes32", name: "", type: "bytes32" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_contribution",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minLpSharePrice",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minApr",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_maxApr",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "payable",
                    type: "function",
                    name: "addLiquidity",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "lpShares",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "adminController",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenId",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "balanceOf",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "baseToken",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "from",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
                        {
                            internalType: "uint256[]",
                            name: "ids",
                            type: "uint256[]",
                        },
                        {
                            internalType: "uint256[]",
                            name: "values",
                            type: "uint256[]",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "batchTransferFrom",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_checkpointTime",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_maxIterations",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "checkpoint",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_maturityTime",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_bondAmount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minOutput",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "closeLong",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "proceeds",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_maturityTime",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_bondAmount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minOutput",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "closeShort",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "proceeds",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "collateralToken",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "collectGovernanceFee",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "proceeds",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_shareAmount",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "convertToBase",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_baseAmount",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "convertToShares",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "decimals",
                    outputs: [
                        { internalType: "uint8", name: "", type: "uint8" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "domainSeparator",
                    outputs: [
                        { internalType: "bytes32", name: "", type: "bytes32" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_checkpointTime",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "getCheckpoint",
                    outputs: [
                        {
                            internalType: "struct IHyperdrive.Checkpoint",
                            name: "",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "uint128",
                                    name: "weightedSpotPrice",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "lastWeightedSpotPriceUpdateTime",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "vaultSharePrice",
                                    type: "uint128",
                                },
                            ],
                        },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_checkpointTime",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "getCheckpointExposure",
                    outputs: [
                        { internalType: "int256", name: "", type: "int256" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "getMarketState",
                    outputs: [
                        {
                            internalType: "struct IHyperdrive.MarketState",
                            name: "",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "uint128",
                                    name: "shareReserves",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "bondReserves",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "longExposure",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "longsOutstanding",
                                    type: "uint128",
                                },
                                {
                                    internalType: "int128",
                                    name: "shareAdjustment",
                                    type: "int128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "shortsOutstanding",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "longAverageMaturityTime",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "shortAverageMaturityTime",
                                    type: "uint128",
                                },
                                {
                                    internalType: "bool",
                                    name: "isInitialized",
                                    type: "bool",
                                },
                                {
                                    internalType: "bool",
                                    name: "isPaused",
                                    type: "bool",
                                },
                                {
                                    internalType: "uint112",
                                    name: "zombieBaseProceeds",
                                    type: "uint112",
                                },
                                {
                                    internalType: "uint128",
                                    name: "zombieShareReserves",
                                    type: "uint128",
                                },
                            ],
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "getPoolConfig",
                    outputs: [
                        {
                            internalType: "struct IHyperdrive.PoolConfig",
                            name: "",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "contract IERC20",
                                    name: "baseToken",
                                    type: "address",
                                },
                                {
                                    internalType: "contract IERC20",
                                    name: "vaultSharesToken",
                                    type: "address",
                                },
                                {
                                    internalType: "address",
                                    name: "linkerFactory",
                                    type: "address",
                                },
                                {
                                    internalType: "bytes32",
                                    name: "linkerCodeHash",
                                    type: "bytes32",
                                },
                                {
                                    internalType: "uint256",
                                    name: "initialVaultSharePrice",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "minimumShareReserves",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "minimumTransactionAmount",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "circuitBreakerDelta",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "positionDuration",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "checkpointDuration",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "timeStretch",
                                    type: "uint256",
                                },
                                {
                                    internalType: "address",
                                    name: "governance",
                                    type: "address",
                                },
                                {
                                    internalType: "address",
                                    name: "feeCollector",
                                    type: "address",
                                },
                                {
                                    internalType: "address",
                                    name: "sweepCollector",
                                    type: "address",
                                },
                                {
                                    internalType: "address",
                                    name: "checkpointRewarder",
                                    type: "address",
                                },
                                {
                                    internalType: "struct IHyperdrive.Fees",
                                    name: "fees",
                                    type: "tuple",
                                    components: [
                                        {
                                            internalType: "uint256",
                                            name: "curve",
                                            type: "uint256",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "flat",
                                            type: "uint256",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "governanceLP",
                                            type: "uint256",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "governanceZombie",
                                            type: "uint256",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "getPoolInfo",
                    outputs: [
                        {
                            internalType: "struct IHyperdrive.PoolInfo",
                            name: "",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "uint256",
                                    name: "shareReserves",
                                    type: "uint256",
                                },
                                {
                                    internalType: "int256",
                                    name: "shareAdjustment",
                                    type: "int256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "zombieBaseProceeds",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "zombieShareReserves",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "bondReserves",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "lpTotalSupply",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "vaultSharePrice",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "longsOutstanding",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "longAverageMaturityTime",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "shortsOutstanding",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "shortAverageMaturityTime",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "withdrawalSharesReadyToWithdraw",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "withdrawalSharesProceeds",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "lpSharePrice",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "longExposure",
                                    type: "uint256",
                                },
                            ],
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "getUncollectedGovernanceFees",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "getWithdrawPool",
                    outputs: [
                        {
                            internalType: "struct IHyperdrive.WithdrawPool",
                            name: "",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "uint128",
                                    name: "readyToWithdraw",
                                    type: "uint128",
                                },
                                {
                                    internalType: "uint128",
                                    name: "proceeds",
                                    type: "uint128",
                                },
                            ],
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "id",
                    outputs: [
                        { internalType: "Id", name: "", type: "bytes32" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_contribution",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_apr",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "payable",
                    type: "function",
                    name: "initialize",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "lpShares",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "irm",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "spender",
                            type: "address",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "isApprovedForAll",
                    outputs: [{ internalType: "bool", name: "", type: "bool" }],
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_account",
                            type: "address",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "isPauser",
                    outputs: [{ internalType: "bool", name: "", type: "bool" }],
                },
                {
                    inputs: [],
                    stateMutability: "pure",
                    type: "function",
                    name: "kind",
                    outputs: [
                        { internalType: "string", name: "", type: "string" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "lltv",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256[]",
                            name: "_slots",
                            type: "uint256[]",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "load",
                    outputs: [
                        {
                            internalType: "bytes32[]",
                            name: "",
                            type: "bytes32[]",
                        },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenId",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "name",
                    outputs: [
                        { internalType: "string", name: "", type: "string" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "name",
                    outputs: [
                        { internalType: "string", name: "", type: "string" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "nonces",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_amount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minOutput",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minVaultSharePrice",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "payable",
                    type: "function",
                    name: "openLong",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "maturityTime",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "bondProceeds",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_bondAmount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_maxDeposit",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minVaultSharePrice",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "payable",
                    type: "function",
                    name: "openShort",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "maturityTime",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deposit",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "oracle",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [
                        { internalType: "bool", name: "_status", type: "bool" },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "pause",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenId",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "spender",
                            type: "address",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "perTokenApprovals",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "spender",
                            type: "address",
                        },
                        {
                            internalType: "bool",
                            name: "_approved",
                            type: "bool",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                        { internalType: "uint8", name: "v", type: "uint8" },
                        { internalType: "bytes32", name: "r", type: "bytes32" },
                        { internalType: "bytes32", name: "s", type: "bytes32" },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "permitForAll",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_withdrawalShares",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minOutputPerShare",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "redeemWithdrawalShares",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "proceeds",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "withdrawalSharesRedeemed",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_lpShares",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_minOutputPerShare",
                            type: "uint256",
                        },
                        {
                            internalType: "struct IHyperdrive.Options",
                            name: "_options",
                            type: "tuple",
                            components: [
                                {
                                    internalType: "address",
                                    name: "destination",
                                    type: "address",
                                },
                                {
                                    internalType: "bool",
                                    name: "asBase",
                                    type: "bool",
                                },
                                {
                                    internalType: "bytes",
                                    name: "extraData",
                                    type: "bytes",
                                },
                            ],
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "removeLiquidity",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "proceeds",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "withdrawalShares",
                            type: "uint256",
                        },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenID",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "operator",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "setApproval",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenID",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "operator",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "caller",
                            type: "address",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "setApprovalBridge",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "operator",
                            type: "address",
                        },
                        {
                            internalType: "bool",
                            name: "approved",
                            type: "bool",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "setApprovalForAll",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_who",
                            type: "address",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "setGovernance",
                },
                {
                    inputs: [
                        { internalType: "address", name: "", type: "address" },
                        { internalType: "bool", name: "", type: "bool" },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "setPauser",
                },
                {
                    inputs: [
                        {
                            internalType: "contract IERC20",
                            name: "_target",
                            type: "address",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "sweep",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenId",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "symbol",
                    outputs: [
                        { internalType: "string", name: "", type: "string" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "target0",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "target1",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "target2",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "target3",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "target4",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "totalShares",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenId",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    name: "totalSupply",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenID",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "from",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "transferFrom",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenID",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "from",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "caller",
                            type: "address",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                    name: "transferFromBridge",
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "vault",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "view",
                    type: "function",
                    name: "vaultSharesToken",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                },
                {
                    inputs: [],
                    stateMutability: "pure",
                    type: "function",
                    name: "version",
                    outputs: [
                        { internalType: "string", name: "", type: "string" },
                    ],
                },
            ],
            devdoc: {
                kind: "dev",
                methods: {
                    "PERMIT_TYPEHASH()": {
                        returns: {
                            _0: "The EIP712 permit typehash of the MultiToken.",
                        },
                    },
                    "addLiquidity(uint256,uint256,uint256,uint256,(address,bool,bytes))":
                        {
                            params: {
                                _contribution:
                                    "The amount of capital to supply. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.",
                                _maxApr:
                                    "The maximum APR at which the LP is willing to supply.",
                                _minApr:
                                    "The minimum APR at which the LP is willing to supply.",
                                _minLpSharePrice:
                                    "The minimum LP share price the LP is willing        to accept for their shares. LPs incur negative slippage when        adding liquidity if there is a net curve position in the market,        so this allows LPs to protect themselves from high levels of        slippage. The units of this quantity are either base or vault        shares, depending on the value of `_options.asBase`.",
                                _options:
                                    "The options that configure how the operation is settled.",
                            },
                            returns: {
                                lpShares: "The LP shares received by the LP.",
                            },
                        },
                    "adminController()": {
                        returns: { _0: "The admin controller address." },
                    },
                    "balanceOf(uint256,address)": {
                        params: {
                            owner: "The owner of the tokens.",
                            tokenId: "The sub-token ID.",
                        },
                        returns: { _0: "The balance of the owner." },
                    },
                    "baseToken()": { returns: { _0: "The base token." } },
                    "batchTransferFrom(address,address,uint256[],uint256[])": {
                        params: {
                            from: "The source account.",
                            ids: "The array of token ids of the asset to transfer.",
                            to: "The destination account.",
                            values: "The amount of each token to transfer.",
                        },
                    },
                    "checkpoint(uint256,uint256)": {
                        params: {
                            _checkpointTime:
                                "The time of the checkpoint to create.",
                            _maxIterations:
                                "The number of iterations to use in the Newton's        method component of `_distributeExcessIdleSafe`. This defaults to        `LPMath.SHARE_PROCEEDS_MAX_ITERATIONS` if the specified value is        smaller than the constant.",
                        },
                    },
                    "closeLong(uint256,uint256,uint256,(address,bool,bytes))": {
                        params: {
                            _bondAmount: "The amount of longs to close.",
                            _maturityTime: "The maturity time of the long.",
                            _minOutput:
                                "The minimum proceeds the trader will accept. The units        of this quantity are either base or vault shares, depending on        the value of `_options.asBase`.",
                            _options:
                                "The options that configure how the trade is settled.",
                        },
                        returns: {
                            proceeds:
                                "The proceeds the user receives. The units of this         quantity are either base or vault shares, depending on the value         of `_options.asBase`.",
                        },
                    },
                    "closeShort(uint256,uint256,uint256,(address,bool,bytes))":
                        {
                            params: {
                                _bondAmount: "The amount of shorts to close.",
                                _maturityTime:
                                    "The maturity time of the short.",
                                _minOutput:
                                    "The minimum output of this trade. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.",
                                _options:
                                    "The options that configure how the trade is settled.",
                            },
                            returns: {
                                proceeds:
                                    "The proceeds of closing this short. The units of this         quantity are either base or vault shares, depending on the value         of `_options.asBase`.",
                            },
                        },
                    "collateralToken()": {
                        returns: {
                            _0: "The collateral token for this Morpho Blue market.",
                        },
                    },
                    "collectGovernanceFee((address,bool,bytes))": {
                        params: {
                            _options:
                                "The options that configure how the fees are settled.",
                        },
                        returns: {
                            proceeds:
                                "The governance fees collected. The units of this         quantity are either base or vault shares, depending on the value         of `_options.asBase`.",
                        },
                    },
                    "convertToBase(uint256)": {
                        details:
                            "This is a convenience method that allows developers to convert from      vault shares to base without knowing the specifics of the      integration.",
                        params: { _shareAmount: "The vault shares amount." },
                        returns: { _0: "baseAmount The base amount." },
                    },
                    "convertToShares(uint256)": {
                        details:
                            "This is a convenience method that allows developers to convert from      base to vault shares without knowing the specifics of the      integration.",
                        params: { _baseAmount: "The base amount." },
                        returns: { _0: "shareAmount The vault shares amount." },
                    },
                    "decimals()": {
                        returns: { _0: "The decimals of the MultiToken." },
                    },
                    "domainSeparator()": {
                        returns: {
                            _0: "The EIP712 domain separator of the MultiToken.",
                        },
                    },
                    "getCheckpoint(uint256)": {
                        params: { _checkpointTime: "The checkpoint time." },
                        returns: { _0: "The checkpoint." },
                    },
                    "getCheckpointExposure(uint256)": {
                        params: { _checkpointTime: "The checkpoint time." },
                        returns: { _0: "The checkpoint exposure." },
                    },
                    "getMarketState()": {
                        returns: { _0: "The market state." },
                    },
                    "getPoolConfig()": {
                        returns: { _0: "The pool configuration." },
                    },
                    "getPoolInfo()": { returns: { _0: "The pool info." } },
                    "getUncollectedGovernanceFees()": {
                        returns: {
                            _0: "The amount of uncollected governance fees.",
                        },
                    },
                    "getWithdrawPool()": {
                        returns: { _0: "The withdrawal pool information." },
                    },
                    "id()": { returns: { _0: "The Morpho Blue ID." } },
                    "initialize(uint256,uint256,(address,bool,bytes))": {
                        params: {
                            _apr: "The target APR.",
                            _contribution:
                                "The amount of capital to supply. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.",
                            _options:
                                "The options that configure how the operation is settled.",
                        },
                        returns: {
                            lpShares:
                                "The initial number of LP shares created.",
                        },
                    },
                    "irm()": {
                        returns: {
                            _0: "The interest rate model for this Morpho Blue market.",
                        },
                    },
                    "isApprovedForAll(address,address)": {
                        params: {
                            owner: "The owner of the tokens.",
                            spender: "The spender of the tokens.",
                        },
                        returns: {
                            _0: "The approval-for-all status of the spender for the owner.",
                        },
                    },
                    "isPauser(address)": {
                        params: { _account: "The account to check." },
                        returns: { _0: "The account's pauser status." },
                    },
                    "kind()": { returns: { _0: "The instance's kind." } },
                    "lltv()": {
                        returns: {
                            _0: "The liquiditation loan to value ratio for this Morpho Blue market.",
                        },
                    },
                    "load(uint256[])": {
                        details:
                            "This serves as a generalized getter that allows consumers to create      custom getters to suit their purposes.",
                        params: { _slots: "The storage slots to load." },
                        returns: { _0: "The values at the specified slots." },
                    },
                    "name()": { returns: { _0: "The instance's name." } },
                    "name(uint256)": {
                        params: { tokenId: "The sub-token ID." },
                        returns: { _0: "The name of the MultiToken." },
                    },
                    "nonces(address)": {
                        params: { owner: "The owner of the tokens." },
                        returns: { _0: "The permit nonce of the owner." },
                    },
                    "openLong(uint256,uint256,uint256,(address,bool,bytes))": {
                        params: {
                            _amount:
                                "The amount of capital provided to open the long. The        units of this quantity are either base or vault shares, depending        on the value of `_options.asBase`.",
                            _minOutput:
                                "The minimum number of bonds to receive.",
                            _minVaultSharePrice:
                                "The minimum vault share price at which to        open the long. This allows traders to protect themselves from        opening a long in a checkpoint where negative interest has        accrued.",
                            _options:
                                "The options that configure how the trade is settled.",
                        },
                        returns: {
                            bondProceeds:
                                "The amount of bonds the user received.",
                            maturityTime: "The maturity time of the bonds.",
                        },
                    },
                    "openShort(uint256,uint256,uint256,(address,bool,bytes))": {
                        params: {
                            _bondAmount: "The amount of bonds to short.",
                            _maxDeposit:
                                "The most the user expects to deposit for this trade.        The units of this quantity are either base or vault shares,        depending on the value of `_options.asBase`.",
                            _minVaultSharePrice:
                                "The minimum vault share price at which to open        the short. This allows traders to protect themselves from opening        a short in a checkpoint where negative interest has accrued.",
                            _options:
                                "The options that configure how the trade is settled.",
                        },
                        returns: {
                            deposit:
                                "The amount the user deposited for this trade. The units         of this quantity are either base or vault shares, depending on         the value of `_options.asBase`.",
                            maturityTime: "The maturity time of the short.",
                        },
                    },
                    "oracle()": {
                        returns: {
                            _0: "The oracle for this Morpho Blue market.",
                        },
                    },
                    "pause(bool)": {
                        params: {
                            _status:
                                "True to pause all deposits and false to unpause them.",
                        },
                    },
                    "perTokenApprovals(uint256,address,address)": {
                        params: {
                            owner: "The owner of the tokens.",
                            spender: "The spender of the tokens.",
                            tokenId: "The sub-token ID.",
                        },
                        returns: {
                            _0: "The allowance of the spender for the owner.",
                        },
                    },
                    "permitForAll(address,address,bool,uint256,uint8,bytes32,bytes32)":
                        {
                            details:
                                "The signature for this function follows EIP 712 standard and should      be generated with the eth_signTypedData JSON RPC call instead of      the eth_sign JSON RPC call. If using out of date parity signing      libraries the v component may need to be adjusted. Also it is very      rare but possible for v to be other values, those values are not      supported.",
                            params: {
                                _approved:
                                    "A boolean of the approval status to set to.",
                                deadline:
                                    "The timestamp which the signature must be submitted by        to be valid.",
                                owner: "The owner of the account which is having the new approval set.",
                                r: "The r component of the ECDSA signature.",
                                s: "The s component of the ECDSA signature.",
                                spender:
                                    "The address which will be allowed to spend owner's tokens.",
                                v: "Extra ECDSA data which allows public key recovery from        signature assumed to be 27 or 28.",
                            },
                        },
                    "redeemWithdrawalShares(uint256,uint256,(address,bool,bytes))":
                        {
                            params: {
                                _minOutputPerShare:
                                    "The minimum amount the LP expects to        receive for each withdrawal share that is burned. The units of        this quantity are either base or vault shares, depending on the        value of `_options.asBase`.",
                                _options:
                                    "The options that configure how the operation is settled.",
                                _withdrawalShares:
                                    "The withdrawal shares to redeem.",
                            },
                            returns: {
                                proceeds:
                                    "The amount the LP received. The units of this quantity         are either base or vault shares, depending on the value of         `_options.asBase`.",
                                withdrawalSharesRedeemed:
                                    "The amount of withdrawal shares that         were redeemed.",
                            },
                        },
                    "removeLiquidity(uint256,uint256,(address,bool,bytes))": {
                        params: {
                            _lpShares: "The LP shares to burn.",
                            _minOutputPerShare:
                                "The minimum amount the LP expects to receive        for each withdrawal share that is burned. The units of this        quantity are either base or vault shares, depending on the value        of `_options.asBase`.",
                            _options:
                                "The options that configure how the operation is settled.",
                        },
                        returns: {
                            proceeds:
                                "The amount the LP removing liquidity receives. The         units of this quantity are either base or vault shares,         depending on the value of `_options.asBase`.",
                            withdrawalShares:
                                "The base that the LP receives buys out some of         their LP shares, but it may not be sufficient to fully buy the         LP out. In this case, the LP receives withdrawal shares equal in         value to the present value they are owed. As idle capital         becomes available, the pool will buy back these shares.",
                        },
                    },
                    "setApproval(uint256,address,uint256)": {
                        params: {
                            amount: "The max tokens the approved person can use, setting to        uint256.max will cause the value to never decrement (saving gas        on transfer).",
                            operator:
                                "The address who will be able to use the tokens.",
                            tokenID: "The asset to approve the use of.",
                        },
                    },
                    "setApprovalBridge(uint256,address,uint256,address)": {
                        params: {
                            amount: "The max tokens the approved person can use, setting to        uint256.max will cause the value to never decrement [saving gas        on transfer].",
                            caller: "The eth address which called the linking contract.",
                            operator:
                                "The address who will be able to use the tokens.",
                            tokenID: "The asset to approve the use of.",
                        },
                    },
                    "setApprovalForAll(address,bool)": {
                        params: {
                            approved:
                                "True to approve, false to remove approval.",
                            operator:
                                "The eth address which can access the caller's assets.",
                        },
                    },
                    "setGovernance(address)": {
                        details: "Don't call this. It doesn't do anything.",
                    },
                    "setPauser(address,bool)": {
                        details: "Don't call this. It doesn't do anything.",
                    },
                    "sweep(address)": {
                        details:
                            "WARN: It is unlikely but possible that there is a selector overlap      with 'transferFrom'. Any integrating contracts should be checked      for that, as it may result in an unexpected call from this address.",
                        params: { _target: "The target token to sweep." },
                    },
                    "symbol(uint256)": {
                        params: { tokenId: "The sub-token ID." },
                        returns: { _0: "The symbol of the MultiToken." },
                    },
                    "target0()": { returns: { _0: "The target0 address." } },
                    "target1()": { returns: { _0: "The target1 address." } },
                    "target2()": { returns: { _0: "The target2 address." } },
                    "target3()": { returns: { _0: "The target3 address." } },
                    "target4()": { returns: { _0: "The target4 address." } },
                    "totalShares()": {
                        details:
                            "This is a convenience method that allows developers to get the      total amount of vault shares without knowing the specifics of the      integration.",
                        returns: {
                            _0: "The total amount of vault shares held by Hyperdrive.",
                        },
                    },
                    "totalSupply(uint256)": {
                        params: { tokenId: "The sub-token ID." },
                        returns: { _0: "The total supply of the MultiToken." },
                    },
                    "transferFrom(uint256,address,address,uint256)": {
                        params: {
                            amount: "The amount of token to move.",
                            from: "The address whose balance will be reduced.",
                            to: "The address whose balance will be increased.",
                            tokenID: "The token identifier.",
                        },
                    },
                    "transferFromBridge(uint256,address,address,uint256,address)":
                        {
                            params: {
                                amount: "The amount of token to move.",
                                caller: "The msg.sender or the caller of the ERC20Forwarder.",
                                from: "The address whose balance will be reduced.",
                                to: "The address whose balance will be increased.",
                                tokenID: "The token identifier.",
                            },
                        },
                    "vault()": {
                        returns: { _0: "The compatible yield source." },
                    },
                    "vaultSharesToken()": {
                        returns: { _0: "The vault shares token." },
                    },
                    "version()": { returns: { _0: "The instance's version." } },
                },
                version: 1,
            },
            userdoc: {
                kind: "user",
                methods: {
                    "PERMIT_TYPEHASH()": {
                        notice: "Gets the EIP712 permit typehash of the MultiToken.",
                    },
                    "addLiquidity(uint256,uint256,uint256,uint256,(address,bool,bytes))":
                        {
                            notice: "Allows LPs to supply liquidity for LP shares.",
                        },
                    "adminController()": {
                        notice: "Gets the address that contains the admin configuration for this         instance.",
                    },
                    "balanceOf(uint256,address)": {
                        notice: "Gets the balance of a spender for a sub-token.",
                    },
                    "baseToken()": {
                        notice: "Gets the Hyperdrive pool's base token.",
                    },
                    "batchTransferFrom(address,address,uint256[],uint256[])": {
                        notice: "Transfers several assets from one account to another.",
                    },
                    "checkpoint(uint256,uint256)": {
                        notice: "Attempts to mint a checkpoint with the specified checkpoint time.",
                    },
                    "closeLong(uint256,uint256,uint256,(address,bool,bytes))": {
                        notice: "Closes a long position with a specified maturity time.",
                    },
                    "closeShort(uint256,uint256,uint256,(address,bool,bytes))":
                        {
                            notice: "Closes a short position with a specified maturity time.",
                        },
                    "collateralToken()": {
                        notice: "Returns the collateral token for this Morpho Blue market.",
                    },
                    "collectGovernanceFee((address,bool,bytes))": {
                        notice: "This function collects the governance fees accrued by the pool.",
                    },
                    "convertToBase(uint256)": {
                        notice: "Convert an amount of vault shares to an amount of base.",
                    },
                    "convertToShares(uint256)": {
                        notice: "Convert an amount of base to an amount of vault shares.",
                    },
                    "decimals()": {
                        notice: "Gets the decimals of the MultiToken.",
                    },
                    "domainSeparator()": {
                        notice: "Gets the EIP712 domain separator of the MultiToken.",
                    },
                    "getCheckpoint(uint256)": {
                        notice: "Gets one of the pool's checkpoints.",
                    },
                    "getCheckpointExposure(uint256)": {
                        notice: "Gets the pool's exposure from a checkpoint. This is the number         of non-netted longs in the checkpoint.",
                    },
                    "getMarketState()": {
                        notice: "Gets the pool's state relating to the Hyperdrive market.",
                    },
                    "getPoolConfig()": {
                        notice: "Gets the pool's configuration parameters.",
                    },
                    "getPoolInfo()": {
                        notice: "Gets info about the pool's reserves and other state that is         important to evaluate potential trades.",
                    },
                    "getUncollectedGovernanceFees()": {
                        notice: "Gets the amount of governance fees that haven't been collected.",
                    },
                    "getWithdrawPool()": {
                        notice: "Gets information relating to the pool's withdrawal pool. This         includes the total proceeds underlying the withdrawal pool and         the number of withdrawal shares ready to be redeemed.",
                    },
                    "id()": {
                        notice: "Returns the Morpho Blue ID for this market.",
                    },
                    "initialize(uint256,uint256,(address,bool,bytes))": {
                        notice: "Allows the first LP to initialize the market with a target APR.",
                    },
                    "irm()": {
                        notice: "Returns the interest rate model for this Morpho Blue market.",
                    },
                    "isApprovedForAll(address,address)": {
                        notice: "Gets the approval-for-all status of a spender on behalf of an         owner.",
                    },
                    "isPauser(address)": {
                        notice: "Gets an account's pauser status within the Hyperdrive pool.",
                    },
                    "kind()": { notice: "Gets the instance's kind." },
                    "lltv()": {
                        notice: "Returns the liquidation loan to value ratio for this Morpho Blue         market.",
                    },
                    "load(uint256[])": {
                        notice: "Gets the storage values at the specified slots.",
                    },
                    "name()": { notice: "Gets the instance's name." },
                    "name(uint256)": {
                        notice: "Gets the name of the MultiToken.",
                    },
                    "nonces(address)": {
                        notice: "Gets the permit nonce for an account.",
                    },
                    "openLong(uint256,uint256,uint256,(address,bool,bytes))": {
                        notice: "Opens a long position.",
                    },
                    "openShort(uint256,uint256,uint256,(address,bool,bytes))": {
                        notice: "Opens a short position.",
                    },
                    "oracle()": {
                        notice: "Returns the oracle for this Morpho Blue market.",
                    },
                    "pause(bool)": {
                        notice: "Allows an authorized address to pause this contract.",
                    },
                    "perTokenApprovals(uint256,address,address)": {
                        notice: "Gets the allowance of a spender for a sub-token.",
                    },
                    "permitForAll(address,address,bool,uint256,uint8,bytes32,bytes32)":
                        {
                            notice: "Allows a caller who is not the owner of an account to execute the         functionality of 'approve' for all assets with the owner's         signature.",
                        },
                    "redeemWithdrawalShares(uint256,uint256,(address,bool,bytes))":
                        {
                            notice: "Redeems withdrawal shares by giving the LP a pro-rata amount of         the withdrawal pool's proceeds. This function redeems the         maximum amount of the specified withdrawal shares given the         amount of withdrawal shares ready to withdraw.",
                        },
                    "removeLiquidity(uint256,uint256,(address,bool,bytes))": {
                        notice: "Allows an LP to burn shares and withdraw from the pool.",
                    },
                    "setApproval(uint256,address,uint256)": {
                        notice: "Allows a user to set an approval for an individual asset with         specific amount.",
                    },
                    "setApprovalBridge(uint256,address,uint256,address)": {
                        notice: "Allows the compatibility linking contract to forward calls to         set asset approvals.",
                    },
                    "setApprovalForAll(address,bool)": {
                        notice: "Allows a user to approve an operator to use all of their assets.",
                    },
                    "setGovernance(address)": {
                        notice: "A stub for the old setPauser functions that doesn't do anything         anymore.",
                    },
                    "setPauser(address,bool)": {
                        notice: "A stub for the old setPauser functions that doesn't do anything         anymore.",
                    },
                    "sweep(address)": {
                        notice: "Transfers the contract's balance of a target token to the fee         collector address.",
                    },
                    "symbol(uint256)": {
                        notice: "Gets the symbol of the MultiToken.",
                    },
                    "target0()": { notice: "Gets the target0 address." },
                    "target1()": { notice: "Gets the target1 address." },
                    "target2()": { notice: "Gets the target2 address." },
                    "target3()": { notice: "Gets the target3 address." },
                    "target4()": { notice: "Gets the target4 address." },
                    "totalShares()": {
                        notice: "Gets the total amount of vault shares held by Hyperdrive.",
                    },
                    "totalSupply(uint256)": {
                        notice: "Gets the total supply of the MultiToken.",
                    },
                    "transferFrom(uint256,address,address,uint256)": {
                        notice: "Transfers an amount of assets from the source to the destination.",
                    },
                    "transferFromBridge(uint256,address,address,uint256,address)":
                        {
                            notice: "Permissioned transfer for the bridge to access, only callable by         the ERC20 linking bridge.",
                        },
                    "vault()": {
                        notice: "Gets the vault used as this pool's yield source.",
                    },
                    "vaultSharesToken()": {
                        notice: "Gets the Hyperdrive pool's vault shares token.",
                    },
                    "version()": { notice: "Gets the instance's version." },
                },
                version: 1,
            },
        },
        settings: {
            remappings: [
                "@opengsn/=lib/aerodrome/lib/gsn/packages/",
                "@openzeppelin/=lib/aerodrome/lib/openzeppelin-contracts/",
                "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
                "@uniswap/v3-core/=lib/aerodrome/lib/v3-core/",
                "ExcessivelySafeCall/=lib/ExcessivelySafeCall/src/",
                "aave-v3-core/=lib/aave-v3-origin/src/core/",
                "aave-v3-origin/=lib/aave-v3-origin/",
                "aave-v3-periphery/=lib/aave-v3-origin/src/periphery/",
                "aave/=lib/aave-v3-origin/src/core/contracts/",
                "aerodrome/=lib/aerodrome/contracts/",
                "createx/=lib/createx/src/",
                "ds-test/=lib/aerodrome/lib/ds-test/src/",
                "erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",
                "eth-gas-reporter/=node_modules/eth-gas-reporter/",
                "etherfi/=lib/smart-contracts/",
                "forge-std/=lib/forge-std/src/",
                "gsn/=lib/aerodrome/lib/",
                "hardhat-deploy/=node_modules/hardhat-deploy/",
                "hardhat/=node_modules/hardhat/",
                "morpho-blue/=lib/morpho-blue/",
                "nomad/=lib/ExcessivelySafeCall/src/",
                "openzeppelin-contracts/=lib/openzeppelin-contracts/",
                "openzeppelin/=lib/openzeppelin-contracts/contracts/",
                "solady/=lib/createx/lib/solady/",
                "solidity-utils/=lib/aave-v3-origin/lib/solidity-utils/",
                "solmate/=lib/solmate/src/",
                "utils/=lib/aerodrome/test/utils/",
                "v3-core/=lib/aerodrome/lib/v3-core/",
            ],
            optimizer: { enabled: true, runs: 200 },
            metadata: { bytecodeHash: "ipfs" },
            compilationTarget: {
                "contracts/src/interfaces/IMorphoBlueHyperdrive.sol":
                    "IMorphoBlueHyperdrive",
            },
            evmVersion: "paris",
            libraries: {},
        },
        sources: {
            "contracts/src/interfaces/IERC20.sol": {
                keccak256:
                    "0x54f00c8917f5fe81bf192a28f5e00edfdd3871ac93c43d05fafbec84509dc07a",
                urls: [
                    "bzz-raw://ce3df2d8398326db1ee9ec067bfaf873e41f96f505a7f31a6d2298ba32542c0a",
                    "dweb:/ipfs/QmQTuioiph2ZiAPoPmzcsbpRAXSxYQDcyfTeNWTQ7afrND",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IHyperdrive.sol": {
                keccak256:
                    "0xc8fa80fa69f6f3c35f8325ada8f67614f9dd625e627cb4a2452bc6f933a6cf3a",
                urls: [
                    "bzz-raw://1c318bc2e2951825bbf93243fe5325cfdda86bb9c51196bdfab09de03fefd031",
                    "dweb:/ipfs/QmV9Fw942kh3KuS5Nsyj2NhVQQozx38vKLwMJtMoTDsoju",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IHyperdriveCore.sol": {
                keccak256:
                    "0x53c5394965ddf3868b7e396968c6b5877639a5a9e69c6a7fcd4cb4e7323a03f4",
                urls: [
                    "bzz-raw://634ea5b7d6fcb57a989ef18fd0d05aa620a99bd8773f0f3ce7b43fd730b007f4",
                    "dweb:/ipfs/QmdniNXAC5167Hx3eLzXB8B8zPJbCEE8kq9sznvxnsmK7P",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IHyperdriveEvents.sol": {
                keccak256:
                    "0xdf497b5ae5f616f740e75a5b78f4c61ee29e3d13a71e553e8746bebb8fefa7e0",
                urls: [
                    "bzz-raw://a900b9b2a58433f1cfb0de14c16cf24092cc0e807d3fff4e28da89042fd1d123",
                    "dweb:/ipfs/QmX7xvBPq4K54Wk6rmrSYYyEoXMfqj8fE8KbJMwoouAfxe",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IHyperdriveRead.sol": {
                keccak256:
                    "0x755dd633f74e5892318c842ac0f73d306bd6a9171b31488ae30abab0bc79af06",
                urls: [
                    "bzz-raw://2340ae81aa620a4eb883efa8255f570a51bb4e4a29813d8d13528b8c7a8fbe0a",
                    "dweb:/ipfs/Qma8awS1kw3WhNKn21McHYq7zyX44kcPF5a4sjbtxNzjyN",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IMorphoBlueHyperdrive.sol": {
                keccak256:
                    "0xe387ab8c8dc7c7d10a3811560c6af3b3c4c3a28e8e270b2640efb4441a0a0468",
                urls: [
                    "bzz-raw://8e63ec2b13c4d6ac57a6a315afe747161fa55f608e1370e0dcf04616cb2a3d2f",
                    "dweb:/ipfs/QmXjmFcUCV3V3L7fPH9xCf7S9mixnuAbYYe6DMNUprqbnD",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IMultiToken.sol": {
                keccak256:
                    "0xa12bf0c1c22d8501b42efa8bf55375ff9ea2f14cfba02e13f87842af577814a1",
                urls: [
                    "bzz-raw://eddf5bf542205e1f077ff3bdf9910bd4612b0f7fa47e15786ca143f4b9cecb11",
                    "dweb:/ipfs/Qmc9Y7inShyE1JnoRctqe5X66yVgMrTaUBtuDWoMoT6Ynb",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IMultiTokenCore.sol": {
                keccak256:
                    "0x25488a61182c05606923ada426c701a54fed9a2478f5a45f39fb85b49ed17e33",
                urls: [
                    "bzz-raw://3d117283eb412127c6e7538c7e97980c7e2eea5a33c58014840efaf1ca47ba67",
                    "dweb:/ipfs/QmbkVfupfbhnmeeBuSTgfy2CB8WjSnMQLsLReyxFAyWk9S",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IMultiTokenEvents.sol": {
                keccak256:
                    "0xcf0334b0fa3a8a1c36191a3e830d0f13968ea8a84e8e3a64e36517271702f5e1",
                urls: [
                    "bzz-raw://8777489b37cc9dc5021ff7f4e72641942d6e160bb1f99f5c9d91974066ed9d89",
                    "dweb:/ipfs/QmYKpRq8o1CmjpxoFxq3WsZxcZFguewr8gyTaDgUs6ws3d",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IMultiTokenMetadata.sol": {
                keccak256:
                    "0xeb2eca9693f2502d68f9a878d8478902595cf8a91d2c7d72c75fdc6da9d7c678",
                urls: [
                    "bzz-raw://019fba0bb197250ee2aed5b1173c1e84675a2f94b3fbb050e50aaebfb2274fd3",
                    "dweb:/ipfs/QmRh5eEcbAAnjrrGoXwgfNjo5C6GYekw7jkXXMzoJHC9A8",
                ],
                license: "Apache-2.0",
            },
            "contracts/src/interfaces/IMultiTokenRead.sol": {
                keccak256:
                    "0xef515314bad7cd731d3ed0da453e7e6ac0abe8d5313a29416d7d32247a4d9a79",
                urls: [
                    "bzz-raw://2a3d745e509ec9524503eabeda096ec1b7b780a3558640151426b200815c778e",
                    "dweb:/ipfs/QmTZ8Kqm9QYKBcbWw7vGj6iS54jEJzaeAoxWdbWirXGWqd",
                ],
                license: "Apache-2.0",
            },
            "lib/morpho-blue/src/interfaces/IMorpho.sol": {
                keccak256:
                    "0xee9fbe10e0cd31b8d4c2c2effadaf337a6c6c43c9bdb94d2cad79fdffc47a86e",
                urls: [
                    "bzz-raw://bc94b9b24900994cba898911edf82545052e738f6c9c2a7a56589c122014d363",
                    "dweb:/ipfs/QmXp9qkTnoPoio6KvdCFnCVW6Tjfb4Kbd4zByuiwQwwmwx",
                ],
                license: "GPL-2.0-or-later",
            },
        },
        version: 1,
    },
    id: 293,
};
