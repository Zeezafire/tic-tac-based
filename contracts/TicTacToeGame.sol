// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicTacToeGame {
    uint256 public constant GAME_FEE = 0.1 ether;
    
    event GameStarted(address indexed player, uint256 timestamp, uint256 amountPaid);
    
    function startGame() external payable {
        require(msg.value >= GAME_FEE, "Insufficient payment. Game requires 0.1 ETH");
        
        emit GameStarted(msg.sender, block.timestamp, msg.value);
    }
    
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
