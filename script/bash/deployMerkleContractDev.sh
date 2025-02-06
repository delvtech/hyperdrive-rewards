#!/bin/bash

# Deploy the contracts
forge script script/DeployHyperdriveRewards.s.sol --rpc-url https://eth-mainnet.g.alchemy.com/v2/YjUJYXT79LWtfH1bsgFmwDpCzc5-x21p --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast --ffi

# Update the merkle root
forge script script/UpdateMerkleRoot.s.sol --ffi --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Impersonate the token whale account
cast rpc anvil_impersonateAccount 0x2286f24f5662D3a0E4806a0262B69Da0DB1Ee51d

# Fund the merkle contract with the reward token from the whale account
cast send 0x58D97B57BB95320F9a05dC918Aef65434969c2B2 --from 0x2286f24f5662D3a0E4806a0262B69Da0DB1Ee51d "transfer(address,uint256)(bool)" 0xfD3e0cEe740271f070607aEddd0Bf4Cf99C92204 10000000000000000000000 --unlocked