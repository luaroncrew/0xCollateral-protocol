// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LendingPoolCore is Ownable {
    address public constant ETH_ADDRESS = address(0);
    address public immutable zcToken;

    mapping(address => bool) public whitelistedAddresses;

    struct ReserveData {
        uint256 totalLiquidity;
        uint256 totalBorrows;
        uint256 liquidityRate; // fixed interest rate in basis points (e.g. 500 = 5%)
        mapping(address => uint256) userDeposits;
    }

    mapping(address => ReserveData) public reserves; // token => ReserveData
    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);

    modifier validToken(address _token) {
        require(_token == ETH_ADDRESS || _token == zcToken, "Invalid token");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelistedAddresses[msg.sender] || msg.sender == owner(), "Caller not whitelisted");
        _;
    }

    constructor(address _zcToken) Ownable(msg.sender) {
        zcToken = _zcToken;
        // Initialize reserves for both ETH and zcToken
        ReserveData storage ethReserve = reserves[ETH_ADDRESS];
        ethReserve.totalLiquidity = 0;
        ethReserve.totalBorrows = 0;
        ethReserve.liquidityRate = 500; // 5% default rate

        ReserveData storage zcTokenReserve = reserves[zcToken];
        zcTokenReserve.totalLiquidity = 0;
        zcTokenReserve.totalBorrows = 0;
        zcTokenReserve.liquidityRate = 500; // 5% default rate

        // Whitelist the owner by default
        whitelistedAddresses[msg.sender] = true;
        emit AddressWhitelisted(msg.sender);
    }

    function addToWhitelist(address _address) external onlyOwner {
        require(!whitelistedAddresses[_address], "Address already whitelisted");
        whitelistedAddresses[_address] = true;
        emit AddressWhitelisted(_address);
    }

    function removeFromWhitelist(address _address) external onlyOwner {
        require(whitelistedAddresses[_address], "Address not whitelisted");
        require(_address != owner(), "Cannot remove owner from whitelist");
        whitelistedAddresses[_address] = false;
        emit AddressRemovedFromWhitelist(_address);
    }

    function transferToken(address _token, address _to, uint256 _amount) external validToken(_token) payable onlyWhitelisted {
        require(_amount > 0, "Amount must be > 0");
        ReserveData storage reserve = reserves[_token];
        require(reserve.totalLiquidity >= _amount, "Insufficient liquidity");

        reserve.totalLiquidity -= _amount;

        if (_token == ETH_ADDRESS) {
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(_token).transfer(_to, _amount);
        }
    }

    function transferTokenFrom(address _token, address _from, address _to, uint256 _amount) external validToken(_token) payable onlyWhitelisted {
        require(_amount > 0, "Amount must be > 0");

        if (_token == ETH_ADDRESS) {
            require(msg.value == _amount, "ETH amount mismatch");
        } else {
            require(msg.value == 0, "ETH not accepted for token transfers");
            IERC20(_token).transferFrom(_from, _to, _amount);
        }

        ReserveData storage reserve = reserves[_token];
        reserve.totalLiquidity += _amount;
    }

    function deposit(address _token, uint256 _amount, address _from) external payable validToken(_token) onlyWhitelisted {
        require(_amount > 0, "Amount must be > 0");
        
        ReserveData storage reserve = reserves[_token];

        if (_token == ETH_ADDRESS) {
            require(msg.value == _amount, "ETH amount mismatch");
        } else {
            require(msg.value == 0, "ETH not accepted for token deposits");
            IERC20(_token).transferFrom(_from, address(this), _amount);
        }

        reserve.totalLiquidity += _amount;
        reserve.userDeposits[_from] += _amount;

        emit Deposit(_from, _token, _amount);
    }

    function withdraw(address _token, uint256 _amount) external validToken(_token) onlyWhitelisted {
        ReserveData storage reserve = reserves[_token];
        uint256 userBalance = reserve.userDeposits[tx.origin];

        require(_amount > 0 && _amount <= userBalance, "Invalid amount");

        reserve.totalLiquidity -= _amount;
        reserve.userDeposits[tx.origin] -= _amount;

        if (_token == ETH_ADDRESS) {
            (bool success, ) = tx.origin.call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(_token).transfer(tx.origin, _amount);
        }

        emit Withdraw(tx.origin, _token, _amount);
    }

    function getUserDeposit(address _token, address _user) external view validToken(_token) returns (uint256) {
        return reserves[_token].userDeposits[_user];
    }

    function setLiquidityRate(address _token, uint256 _rate) external validToken(_token) {
        reserves[_token].liquidityRate = _rate;
    }

    function reduceUserDeposit(address _token, address _user, uint256 _amount) external validToken(_token) onlyWhitelisted {        
        ReserveData storage reserve = reserves[_token];
        require(reserve.userDeposits[_user] >= _amount, "Insufficient deposit");
        
        reserve.totalLiquidity -= _amount;
        reserve.userDeposits[_user] -= _amount;
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
