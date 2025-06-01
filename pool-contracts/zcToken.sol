// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract zcToken is ERC20, Ownable {
    mapping(address => bool) public whitelistedAddresses;
    
    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);

    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
        Ownable(msg.sender) 
    {}

    modifier onlyWhitelisted() {
        require(whitelistedAddresses[msg.sender], "Caller is not whitelisted");
        _;
    }

    function addToWhitelist(address account) external onlyOwner {
        require(!whitelistedAddresses[account], "Address already whitelisted");
        whitelistedAddresses[account] = true;
        emit AddressWhitelisted(account);
    }

    function removeFromWhitelist(address account) external onlyOwner {
        require(whitelistedAddresses[account], "Address not whitelisted");
        whitelistedAddresses[account] = false;
        emit AddressRemovedFromWhitelist(account);
    }

    function mint(address user, uint256 amount) external onlyWhitelisted {
        _mint(user, amount);
    }

    function burn(address user, uint256 amount) external onlyWhitelisted {
        _burn(user, amount);
    }

    function ownerMint(address user, uint256 amount) external onlyOwner {
        _mint(user, amount);
    }
}
