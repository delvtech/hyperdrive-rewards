// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "src/contracts/HyperdriveRewards.sol";
import { Merkle } from "universal-rewards-distributor/lib/murky/src/Merkle.sol";
import "universal-rewards-distributor/lib/openzeppelin-contracts/contracts/utils/Strings.sol";

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
        string memory merkleJson = vm.envString("MERKLE_JSON");

        // Read JSON file containing Merkle data
        string memory jsonContent = vm.readFile(merkleJson);

        // Parse JSON into a dynamic array of structs
        MerkleEntry[] memory merkleEntries = abi.decode(
            vm.parseJson(jsonContent, ".data"),
            (MerkleEntry[])
        );

        // Generate Merkle tree data and reward info
        bytes32[] memory merkleData = new bytes32[](merkleEntries.length);
        string memory rewardsJson = '{"rewards": ['; // JSON array start

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

            // Manually serialize the struct as JSON
            string memory rewardJson = "{";
            rewardJson = string.concat(
                rewardJson,
                '"user": "',
                toChecksumAddress(merkleEntries[i].user),
                '",'
            );
            rewardJson = string.concat(rewardJson, '"chainId": 708,');
            rewardJson = string.concat(
                rewardJson,
                '"claimContract": "',
                toChecksumAddress(contractAddress),
                '",'
            );
            rewardJson = string.concat(
                rewardJson,
                '"claimableAmount": "',
                merkleEntries[i].claimable,
                '",'
            );
            rewardJson = string.concat(
                rewardJson,
                '"rewardToken": "',
                toChecksumAddress(merkleEntries[i].token),
                '",'
            );
            rewardJson = string.concat(
                rewardJson,
                '"proof": ',
                bytes32ArrayToJson(proof),
                ","
            );
            rewardJson = string.concat(
                rewardJson,
                '"merkleProofLastUpdated": ',
                Strings.toString(block.timestamp)
            );
            rewardJson = string.concat(rewardJson, "}");

            // Append to rewards array JSON
            rewardsJson = string.concat(rewardsJson, rewardJson);
            if (i < merkleEntries.length - 1) {
                rewardsJson = string.concat(rewardsJson, ",");
            }
        }
        rewardsJson = string.concat(rewardsJson, "]}"); // Close JSON array

        // Save rewards data to JSON file
        string memory outputFilePath = "data/ethereum_test_out.json";
        vm.writeFile(outputFilePath, rewardsJson);

        // Compute the Merkle root
        bytes32 merkleRoot = merkle.getRoot(merkleData);
        console.log("merkleRoot", bytes32ToHexString(merkleRoot));
        // vm.writeFile("data/merkle_root.json", vm.serializeJson(".merkleRoot", merkleRoot));

        // Update the Merkle root in the contract
        HyperdriveRewards rewardsContract = HyperdriveRewards(contractAddress);
        rewardsContract.setRoot(merkleRoot, bytes32(0));

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

    // Convert bytes32 array to a JSON array
    function bytes32ArrayToJson(
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

    string internal constant _SYMBOLS = "0123456789abcdef";
    string internal constant _CAPITAL = "0123456789ABCDEF";
    function toChecksumAddress(
        address tempaddr
    ) public pure returns (string memory) {
        bytes memory lowercase = addressToLowercaseBytes(tempaddr); // Convert to lowercase hex without '0x'
        bytes32 hashedAddr = keccak256(abi.encodePacked(lowercase)); // Hash the lowercase address

        bytes memory result = new bytes(42); // Store checksum address with '0x' prepended
        result[0] = "0";
        result[1] = "x";

        uint160 addrValue = uint160(tempaddr);
        uint160 hashValue = uint160(bytes20(hashedAddr));

        for (uint i = 41; i > 1; --i) {
            // Start from last hex digit
            uint addrIndex = addrValue & 0xf; // Get last hex digit of address
            uint hashIndex = hashValue & 0xf; // Get corresponding hash digit

            if (hashIndex > 7) {
                result[i] = bytes1(bytes(_CAPITAL)[addrIndex]); // Uppercase if hash digit > 7
            } else {
                result[i] = bytes1(bytes(_SYMBOLS)[addrIndex]); // Lowercase otherwise
            }

            addrValue >>= 4; // Move to the next hex digit
            hashValue >>= 4;
        }

        return string(result);
    }

    function addressToLowercaseBytes(
        address x
    ) internal pure returns (bytes memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = getChar(hi);
            s[2 * i + 1] = getChar(lo);
        }
        return s;
    }

    function getChar(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        // 0-9
        else return bytes1(uint8(b) + 0x57); // a-f
    }
}
