// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.19;

import "universal-rewards-distributor/src/UniversalRewardsDistributor.sol";
import "universal-rewards-distributor/lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";

/// @title HyperdriveRewards
/// @author DELV
/// @notice HyperdriveRewards is a child contract of UniversalRewardsDistributor
///         with the added functionality of batch claim.
/// @custom:disclaimer The language used in this code is for coding convenience
///                    only, and is not intended to, and does not, have any
///                    particular legal or regulatory significance.
contract HyperdriveRewards is UniversalRewardsDistributor, ReentrancyGuard {
    /// Errors ///

    /// @notice Thrown when an argument to batchClaim has an incorrect length.
    error IncorrectLength();

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
    /// @dev Warning: The `initialIpfsHash` might not correspond to the
    ///      `initialRoot`.
    constructor(
        address initialOwner,
        uint256 initialTimelock,
        bytes32 initialRoot,
        bytes32 initialIpfsHash
    )
        UniversalRewardsDistributor(
            initialOwner,
            initialTimelock,
            initialRoot,
            initialIpfsHash
        )
    {}

    /// @notice Calls claim for the list of accounts and rewards.
    /// @param _accounts The addresses to claim rewards for.
    /// @param _rewards The addresses of the reward tokens.
    /// @param _claimable The overall claimable amount of token rewards for each
    ///                  account and token.
    /// @param _proofs The merkle proof that validates this claim.
    /// @return amount The amount of reward token claimed.
    function batchClaim(
        address[] calldata _accounts,
        address[] calldata _rewards,
        uint256[] calldata _claimable,
        bytes32[][] calldata _proofs
    ) external nonReentrant returns (uint256[] memory) {
        if (
            _accounts.length != _rewards.length ||
            _accounts.length != _claimable.length ||
            _accounts.length != _proofs.length
        ) {
            revert IncorrectLength();
        }

        uint256[] memory amounts = new uint256[](_accounts.length);
        for (uint256 i = 0; i < _accounts.length; i++) {
            bytes32[] memory proof = _proofs[i];
            amounts[i] = this.claim(
                _accounts[i],
                _rewards[i],
                _claimable[i],
                proof
            );
        }

        return amounts;
    }
}
