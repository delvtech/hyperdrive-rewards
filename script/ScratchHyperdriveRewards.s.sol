// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "src/contracts/HyperdriveRewards.sol";
import { Merkle } from "universal-rewards-distributor/lib/murky/src/Merkle.sol";
import { console2 as console } from "forge-std/console2.sol";

contract ScratchHyperdriveRewards is Script {
    function run() external {
        vm.startBroadcast();

        // Read environment variables
        address contractAddress = vm.envAddress("REWARDS_CONTRACT");
        console.log("contractAddress", contractAddress);

        // Update the Merkle root in the contract
        HyperdriveRewards rewardsContract = HyperdriveRewards(contractAddress);
        address user = 0x04F5c67Be870758E6D5200a15f7722B471EbB821;
        console.log('user', user);
        address token = 0x58D97B57BB95320F9a05dC918Aef65434969c2B2;
        console.log('token', token);

        // Call the claim function (assuming there's one)
        uint256 claimed = rewardsContract.claimed(user, token);
        console.log("claimed", claimed);

        uint256 claimable = 2803826510228852736;
        bytes32[] memory proof = new bytes32[](4);
        proof[0] = bytes32(0x77d4a92d62bc682c6cb7ac727c5cbb28b5cc5da409cc0fc4ff1bc1b90c9b3422);
        proof[1] = bytes32(0x22f7a7ca8d373c4db667751c741e4de6a1ae9d18b88145d6d79442d1d04b5337);
        proof[2] = bytes32(0x57c7928d4de582036aba9f38e4c124e464deda89621cb6eae6632acb7c264870);
        proof[3] = bytes32(0x1424736d53ffdf9546d0d41f7468f56757c3a00f0a7ce1318188ab464f10d578);

        uint256 rewardsBalance = IERC20(token).balanceOf(contractAddress);
        bytes32 root = rewardsContract.root();
        console.log('root');
        console.logBytes32(root);
        console.log('rewardsBalance', rewardsBalance);
        // uint256 amount = rewardsContract.claim(user, token, claimable, proof);

        // Call the claim function (assuming there's one)
        claimed = rewardsContract.claimed(user, token);
        console.log("claimed", claimed);
        vm.stopBroadcast();
    }
}
