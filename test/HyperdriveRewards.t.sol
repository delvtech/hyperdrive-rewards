// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import "src/contracts/HyperdriveRewards.sol";
import {Merkle} from "universal-rewards-distributor/lib/murky/src/Merkle.sol";
import {ERC20Mock} from "universal-rewards-distributor/lib/openzeppelin-contracts/contracts/mocks/ERC20Mock.sol";

contract HyperdriveRewardsTest is Test {
    HyperdriveRewards public rewardsContract;

    Merkle merkle = new Merkle();
    bytes32[] internal merkleData = new bytes32[](8);
    bytes32 internal merkleRoot;
    ERC20Mock internal token1;
    ERC20Mock internal token2;

    address owner = _addrFromHashedString("Owner");
    address updater = _addrFromHashedString("Updater");
    address user1 = _addrFromHashedString("User1");
    address user2 = _addrFromHashedString("User2");
    address user3 = _addrFromHashedString("User3");
    address user4 = _addrFromHashedString("User4");

    address[] public users = [user1, user2, user3, user4];

    function setUp() public {
        rewardsContract = new HyperdriveRewards(owner, 0, bytes32(0), bytes32(0));
        token1 = new ERC20Mock();
        token2 = new ERC20Mock();

        vm.startPrank(owner);
        rewardsContract.setRootUpdater(updater, true);

        vm.warp(block.timestamp + 1);
        vm.stopPrank();

        token1.mint(owner, 1000 ether * 200);
        token2.mint(owner, 1000 ether * 200);

        token1.mint(address(rewardsContract), 1000 ether * 200);
        token2.mint(address(rewardsContract), 1000 ether * 200);

        merkleData[0] = keccak256(bytes.concat(keccak256(abi.encode(user1, address(token1), 1 ether))));
        merkleData[1] = keccak256(bytes.concat(keccak256(abi.encode(user2, address(token1), 1 ether))));
        merkleData[2] = keccak256(bytes.concat(keccak256(abi.encode(user3, address(token1), 1 ether))));
        merkleData[3] = keccak256(bytes.concat(keccak256(abi.encode(user4, address(token1), 1 ether))));
        merkleData[4] = keccak256(bytes.concat(keccak256(abi.encode(user1, address(token2), 1 ether))));
        merkleData[5] = keccak256(bytes.concat(keccak256(abi.encode(user2, address(token2), 1 ether))));
        merkleData[6] = keccak256(bytes.concat(keccak256(abi.encode(user3, address(token2), 1 ether))));
        merkleData[7] = keccak256(bytes.concat(keccak256(abi.encode(user4, address(token2), 1 ether))));

        merkleRoot = merkle.getRoot(merkleData);

        vm.startPrank(updater);
        rewardsContract.setRoot(merkleRoot, bytes32(0));
        vm.warp(block.timestamp + 1);
        vm.stopPrank();
    }


    function testBatchClaim() public {
        address[] memory accounts = new address[](4);
        accounts[0] = user1;
        accounts[1] = user2;
        accounts[2] = user3;
        accounts[3] = user1;

        address[] memory rewards = new address[](4);
        rewards[0] = address(token1);
        rewards[1] = address(token1);
        rewards[2] = address(token1);
        rewards[3] = address(token2);

        uint256[] memory claimables = new uint256[](4);
        claimables[0] = 1 ether;
        claimables[1] = 1 ether;
        claimables[2] = 1 ether;
        claimables[3] = 1 ether;

        bytes32[] memory proof1 = merkle.getProof(merkleData, 0);
        bytes32[] memory proof2 = merkle.getProof(merkleData, 1);
        bytes32[] memory proof3 = merkle.getProof(merkleData, 2);
        bytes32[] memory proof4 = merkle.getProof(merkleData, 4);

        bytes32[] memory proofs = new bytes32[](12);
        proofs[0] = proof1[0];
        proofs[1] = proof1[1];
        proofs[2] = proof1[2];

        proofs[3] = proof2[0];
        proofs[4] = proof2[1];
        proofs[5] = proof2[2];

        proofs[6] = proof3[0];
        proofs[7] = proof3[1];
        proofs[8] = proof3[2];

        proofs[9] = proof4[0];
        proofs[10] = proof4[1];
        proofs[11] = proof4[2];

        rewardsContract.batchClaim(accounts, rewards, claimables, proofs, 3);

        for (uint256 i = 0; i < accounts.length; i++) {
            assertEq(rewardsContract.claimed(accounts[i], rewards[i]), claimables[i]);
        }
    }

    function _addrFromHashedString(string memory str) internal pure returns (address) {
        return address(uint160(uint256(keccak256(bytes(str)))));
    }
}