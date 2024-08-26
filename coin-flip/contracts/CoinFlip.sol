// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool guess) public payable returns (bool) {
        require(msg.value > 0, "Must bet some tokens");
        
        // Generate a random number
        bool result = block.timestamp % 2 == 0;

        if (result == guess) {
            payable(msg.sender).transfer(msg.value * 2);
            return true;
        } else {
            return false;
        }
    }

    receive() external payable {}
}
