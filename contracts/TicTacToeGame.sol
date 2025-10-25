// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicTacToeGame {
    // Minimum payment in wei (can be updated for different USD values)
    uint256 public minPayment;
    
    event GameStarted(address indexed player, uint256 timestamp, uint256 amountPaid);
    event MinPaymentUpdated(uint256 newMinPayment);
    
    constructor() {
        // Default to very small amount for testing (0.0001 ETH)
        minPayment = 0.0001 ether;
    }
    
    function startGame() external payable {
        require(msg.value >= minPayment, "Insufficient payment");
        
        emit GameStarted(msg.sender, block.timestamp, msg.value);
    }
    
    function updateMinPayment(uint256 newMinPayment) external {
        minPayment = newMinPayment;
        emit MinPaymentUpdated(newMinPayment);
    }
    
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
