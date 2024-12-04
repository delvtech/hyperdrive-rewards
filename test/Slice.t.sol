
// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import "src/contracts/HyperdriveRewards.sol";
import {Merkle} from "universal-rewards-distributor/lib/murky/src/Merkle.sol";
import {ERC20Mock} from "universal-rewards-distributor/lib/openzeppelin-contracts/contracts/mocks/ERC20Mock.sol";

contract HyperdriveRewardsTest is Test, HyperdriveRewards {
    constructor() HyperdriveRewards(owner, 0, bytes32(0), bytes32(0)) {}
    bytes32[] array = new bytes32[](5);

    function setUp() public {
        array[0] = bytes32("a");
        array[1] = bytes32("b");
        array[2] = bytes32("c");
        array[3] = bytes32("d");
        array[4] = bytes32("e");
    }


    function testSliceStartToEnd() public view {
        bytes32[] memory slicedArray = _slice(array, 0, 5);
        assertEq(slicedArray.length, 5);
        assertEq(slicedArray[0], array[0]);
        assertEq(slicedArray[1], array[1]);
        assertEq(slicedArray[2], array[2]);
        assertEq(slicedArray[3], array[3]);
        assertEq(slicedArray[4], array[4]);
    }

    function testSliceStartToMiddle() public view {
        bytes32[] memory slicedArray = _slice(array, 0, 3);
        assertEq(slicedArray.length, 3);
        assertEq(slicedArray[0], array[0]);
        assertEq(slicedArray[1], array[1]);
        assertEq(slicedArray[2], array[2]);
    }

    function testSliceMiddleToEnd() public view {
        bytes32[] memory slicedArray = _slice(array, 2, 5);
        assertEq(slicedArray.length, 3);
        assertEq(slicedArray[0], array[2]);
        assertEq(slicedArray[1], array[3]);
        assertEq(slicedArray[2], array[4]);
    }

    function testSliceRevertsWhenEndIsEqualToStart() public {
        vm.expectRevert();
        _slice(array, 5, 5);
    }

    function testSliceRevertsWhenEndIsGreaterThanStart() public {
        vm.expectRevert();
        _slice(array, 5, 4);
    }

    function testSliceRevertsWhenStartIsOutOfBounds() public {
        vm.expectRevert();
        _slice(array, 6, 7);
    }

    function testSliceRevertsWhenEndIsOutOfBounds() public {
        vm.expectRevert();
        _slice(array, 5, 6);
    }
}