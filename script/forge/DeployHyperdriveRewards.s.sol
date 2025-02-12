// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "src/contracts/HyperdriveRewards.sol";
import { console2 as console } from "forge-std/console2.sol";

contract DeployHyperdriveRewards is Script {
    function run() external {
        vm.startBroadcast();

        // Define deployment parameters
        address owner = msg.sender;  // Set deployer as the owner
        uint256 startTime = block.timestamp;
        bytes32 initialMerkleRoot = bytes32(0);
        bytes32 initialExtraData = bytes32(0);

        // Deploy the contract
        HyperdriveRewards rewardsContract = new HyperdriveRewards(
            owner,
            startTime,
            initialMerkleRoot,
            initialExtraData
        );

        console.log("HyperdriveRewards deployed at:", address(rewardsContract));

        vm.stopBroadcast();
    }
}
