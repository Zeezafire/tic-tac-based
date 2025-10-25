// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicTacToeGame {
    address public owner;
    // Very small minimum to allow dynamic USD pricing from frontend
    uint256 public minPayment;
    
    event GameStarted(address indexed player, uint256 timestamp, uint256 amountPaid);
    event MinPaymentUpdated(uint256 newMinPayment);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        // Set to 0.00001 ETH (about $0.02 at $2000/ETH) to allow $0.10 payments
        minPayment = 0.00001 ether;
    }
    
    function startGame() external payable {
        require(msg.value >= minPayment, "Insufficient payment");
        
        emit GameStarted(msg.sender, block.timestamp, msg.value);
    }
    
    function updateMinPayment(uint256 newMinPayment) external onlyOwner {
        minPayment = newMinPayment;
        emit MinPaymentUpdated(newMinPayment);
    }
    
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
