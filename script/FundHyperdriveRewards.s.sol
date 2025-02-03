// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "src/contracts/HyperdriveRewards.sol";
import { Merkle } from "universal-rewards-distributor/lib/murky/src/Merkle.sol";
import { console2 as console } from "forge-std/console2.sol";


contract FundHyperdriveRewards is Script {
    struct MerkleEntry {
        string claimable; // Keep claimable as a string in JSON
        address token;
        address user;
    }

    struct RewardData {
        address user;
        uint256 chainId;
        address claimContract;
        string claimableAmount;
        address rewardToken;
        bytes32[] merkleProof;
        uint256 merkleProofLastUpdated;
    }

    function run() external {

        // Read environment variables
        address rewardsContract = vm.envAddress("REWARDS_CONTRACT");
        uint256 rewardsAmount = vm.envUint("REWARDS_AMOUNT");
        IERC20 token = IERC20(vm.envAddress("REWARDS_TOKEN"));
        address tokenWhale = vm.envAddress("REWARDS_WHALE");
        uint256 whaleBalance = token.balanceOf(tokenWhale);

        uint256 amount = rewardsAmount * 1 ether;
        console.log('token', address(token));
        console.log('rewardsContract', rewardsContract);
        console.log('amount', amount);
        console.log('tokenWhale', tokenWhale);
        console.log('whaleBalance', whaleBalance);

        // vm.startBroadcast(tokenWhale);
        vm.deal(tokenWhale, 1 ether);
        vm.startPrank(tokenWhale);

        // token.approve(rewardsContract, amount);
        token.transfer(rewardsContract, amount);
        uint256 rewardsBalance = token.balanceOf(rewardsContract);
        console.log('rewardsBalance', rewardsBalance);

        vm.stopPrank();

        // vm.stopBroadcast();
    }
}
