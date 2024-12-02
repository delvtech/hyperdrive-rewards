// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity 0.8.19;

import "universal-rewards-distributor/src/UniversalRewardsDistributor.sol";
import { console2 as console } from "forge-std/console2.sol";

contract HyperdriveRewards is UniversalRewardsDistributor {

    error IncorrentLength();
    error ArrayEndIndexLessThanStartIndex();
    error ArrayIndexOutOfBounds();

    constructor(address initialOwner, uint256 initialTimelock, bytes32 initialRoot, bytes32 initialIpfsHash) UniversalRewardsDistributor(initialOwner, initialTimelock, initialRoot, initialIpfsHash) {}

    function batchClaim(address[] calldata account, address[] calldata reward, uint256[] calldata claimable, bytes32[] calldata proofs, uint256 proofLength) external returns (uint256[] memory) {
        console.log('batchClaim');
        if (account.length != reward.length || account.length != claimable.length || account.length * proofLength != proofs.length || proofs.length % proofLength != 0) {
            console.log('proofs.length', proofs.length);
            console.log('proofLength', proofLength);
            console.log('claimable.length', claimable.length);
            console.log('reward.length', reward.length);
            console.log('account.length', account.length);
            revert IncorrentLength();
        }

        uint256[] memory amounts = new uint256[](account.length);
        console.log('amounts');
        for (uint256 i = 0; i < account.length; i++) {
            bytes32[] memory proof = _slice(proofs, i * proofLength, (i + 1) * proofLength);
            amounts[i] = this.claim(account[i], reward[i], claimable[i], proof);
        }

        return amounts;
    }

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