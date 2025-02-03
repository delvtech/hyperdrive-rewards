// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "src/contracts/HyperdriveRewards.sol";
import { Merkle } from "universal-rewards-distributor/lib/murky/src/Merkle.sol";
import { console2 as console } from "forge-std/console2.sol";

contract UpdateMerkleRoot is Script {
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
        vm.startBroadcast();

        // Read environment variables
        address contractAddress = vm.envAddress("REWARDS_CONTRACT");
        console.log("contractAddress", contractAddress);
        string memory merkleJson = vm.envString("MERKLE_JSON");

        // Read JSON file containing Merkle data
        string memory jsonContent = vm.readFile(merkleJson);

        // Parse JSON into a dynamic array of structs
        MerkleEntry[] memory merkleEntries = abi.decode(
            vm.parseJson(jsonContent, ".data"),
            (MerkleEntry[])
        );
        console.log("merkleEntries");

        // Generate Merkle tree data and reward info
        console.log("Processing Merkle Entries...");
        bytes32[] memory merkleData = new bytes32[](merkleEntries.length);
        RewardData[] memory rewards = new RewardData[](merkleEntries.length);

        console.log("{");
        console.log('  "rewards": [');
        for (uint256 i = 0; i < merkleEntries.length; i++) {
            uint256 claimableAmount = stringToUint(merkleEntries[i].claimable);

            // Compute hash for Merkle tree
            bytes32 leaf = keccak256(
                bytes.concat(
                    keccak256(
                        abi.encode(
                            merkleEntries[i].user,
                            merkleEntries[i].token,
                            claimableAmount
                        )
                    )
                )
            );
            merkleData[i] = leaf;
        }

        Merkle merkle = new Merkle();

        for (uint256 i = 0; i < merkleData.length; i++) {
            // Compute Merkle proof
            bytes32[] memory proof = merkle.getProof(merkleData, i);
            // Store reward data
            rewards[i] = RewardData({
                user: merkleEntries[i].user,
                chainId: 708, // Base chain ID (replace if needed)
                claimContract: contractAddress,
                claimableAmount: merkleEntries[i].claimable,
                rewardToken: merkleEntries[i].token,
                merkleProof: proof,
                merkleProofLastUpdated: block.timestamp
            });
            console.log("    {");
            console.log('      "user": "', merkleEntries[i].user, '",');
            console.log('      "chainId": 708', ",");
            console.log('      "claimContract": "', contractAddress, '",');
            console.log(
                '      "claimableAmount": ',
                merkleEntries[i].claimable,
                ","
            );
            console.log('      "rewardToken": "', merkleEntries[i].token, '",');
            console.log('      "proof": ', bytes32ArrayToString(proof), ",");
            console.log(
                '      "merkleProofLastUpdated": ',
                block.timestamp
            );
            console.log("    },");
        }
        console.log("  ]");
        console.log("}");



        bytes32[] memory _proof = rewards[0].merkleProof;
        console.logBytes32(_proof[0]);
        console.logBytes32(_proof[1]);
        console.logBytes32(_proof[2]);
        console.logBytes32(_proof[3]);


        // Compute the Merkle root
        bytes32 merkleRoot = merkle.getRoot(merkleData);
        console.log("Merkle root: ", bytes32ToHexString(merkleRoot));

        // Save rewards data to JSON file
        // string memory outputJson = vm.serializeJson(".rewards", rewards);
        // string memory outputFilePath = "data/rewards_output.json";
        // vm.writeFile(outputFilePath, outputJson);
        // console.log("Rewards JSON written to:", outputFilePath);

        // Update the Merkle root in the contract
        HyperdriveRewards rewardsContract = HyperdriveRewards(contractAddress);
        rewardsContract.setRoot(merkleRoot, bytes32(0));

        console.log("Merkle root updated.");

        vm.stopBroadcast();
    }

    // Convert a string to uint256 manually (works for big numbers)
    function stringToUint(string memory s) internal pure returns (uint256) {
        bytes memory b = bytes(s);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            require(b[i] >= 0x30 && b[i] <= 0x39, "Invalid number"); // Ensure valid digits (0-9)
            result = result * 10 + (uint256(uint8(b[i])) - 48); // Convert ASCII to number
        }
        return result;
    }

    // Convert uint256 to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        while (_i != 0) {
            length -= 1;
            bstr[length] = bytes1(uint8(48 + uint256(_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }

    function bytes32ArrayToString(
        bytes32[] memory array
    ) internal pure returns (string memory) {
        string memory result = "["; // Start JSON array
        for (uint256 i = 0; i < array.length; i++) {
            result = string(
                abi.encodePacked(result, '"', bytes32ToHexString(array[i]), '"')
            );
            if (i < array.length - 1) {
                result = string(abi.encodePacked(result, ",")); // Add commas between elements
            }
        }
        return string(abi.encodePacked(result, "]")); // Close JSON array
    }

    // Converts a bytes32 to a hex string (e.g., 0xabc123...)
    function bytes32ToHexString(
        bytes32 _bytes
    ) internal pure returns (string memory) {
        bytes memory HEX_CHARS = "0123456789abcdef";
        bytes memory str = new bytes(2 + _bytes.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < _bytes.length; i++) {
            str[2 + i * 2] = HEX_CHARS[uint8(_bytes[i] >> 4)];
            str[3 + i * 2] = HEX_CHARS[uint8(_bytes[i] & 0x0f)];
        }
        return string(str);
    }
}
