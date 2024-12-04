// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity 0.8.19;

import "universal-rewards-distributor/src/UniversalRewardsDistributor.sol";
import { console2 as console } from "forge-std/console2.sol";

/// @title HyperdriveRewards
/// @author DELV
/// @notice HyperdriveRewards is a child contract of UniversalRewardsDistributor with the added functionality of batch claim.
contract HyperdriveRewards is UniversalRewardsDistributor {

    /// Errors ///

    /// @notice Thrown when an argument to batchClaim has an icorrect length.
    error IncorrentLength();

    /// @notice Thrown when the end index is less than the start index.
    error ArrayEndIndexLessThanStartIndex();

    /// @notice Thrown when an array index is out of bounds.
    error ArrayIndexOutOfBounds();

    /// @notice Instantiates a new HyperdriveRewards contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param initialTimelock The initial timelock of the contract.
    /// @param initialRoot The initial merkle root.
    /// @param initialIpfsHash The optional ipfs hash containing metadata about
    ///                        the root (e.g. the merkle tree itself).
    /// @dev Warning: The `initialIpfsHash` might not correspond to the `initialRoot`.
    constructor(address initialOwner, uint256 initialTimelock, bytes32 initialRoot, bytes32 initialIpfsHash) UniversalRewardsDistributor(initialOwner, initialTimelock, initialRoot, initialIpfsHash) {}

    /// @notice Calls claim for the list of accounts and rewards.
    /// @param accounts The addresses to claim rewards for.
    /// @param rewards The addresses of the reward tokens.
    /// @param claimable The overall claimable amount of token rewards for each
    ///                  account and token.
    /// @param proofs The merkle proof that validates this claim.
    /// @param proofLength The length of each merkle proof.
    /// @return amount The amount of reward token claimed.
    function batchClaim(address[] calldata accounts, address[] calldata rewards, uint256[] calldata claimable, bytes32[] calldata proofs, uint256 proofLength) external returns (uint256[] memory) {
        if (accounts.length != rewards.length || accounts.length != claimable.length || accounts.length * proofLength != proofs.length || proofs.length % proofLength != 0) {
            revert IncorrentLength();
        }

        uint256[] memory amounts = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; i++) {
            bytes32[] memory proof = _slice(proofs, i * proofLength, (i + 1) * proofLength);
            amounts[i] = this.claim(accounts[i], rewards[i], claimable[i], proof);
        }

        return amounts;
    }

    /// @dev Slices an array.
    /// @param array The array to slice
    /// @param start The starting index of the slice, inclusive.
    /// @param end The ending index of the slice, exclusive.
    function _slice(bytes32[] memory array, uint start, uint end) internal pure returns (bytes32[] memory) {
        if(end < start) {
          revert ArrayEndIndexLessThanStartIndex();
        }
        if (end < 0 || end > array.length || start < 0 || start > array.length - 1) {
          revert ArrayIndexOutOfBounds();
        }

        bytes32[] memory sliced = new bytes32[](end - start);
        for (uint i = start; i < end; i++) {
            sliced[i - start] = array[i];
        }
        return sliced;
    }
}