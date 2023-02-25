// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable{
  uint public dropValue;
  mapping(address => bool) public isClaimed;

  constructor() ERC20('CELOG Token', 'CELOG') {
    dropValue = 5000 * (10 ** 18);
    _mint(msg.sender, dropValue);
  }

  function selfClaimDrop() public {
    require(!isClaimed[msg.sender], "User already Claimed");
    isClaimed[msg.sender] = true;
    _mint(msg.sender, dropValue);
  }

  function specialDrop(address to) public onlyOwner {
    _mint(to, dropValue);
  }
}