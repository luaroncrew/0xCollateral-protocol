// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockPriceOracle {
    mapping(address => uint256) public prices;

    event PriceUpdated(address indexed token, uint256 price);

    /// @notice Set the price of a token manually (in 18 decimals)
    function setAssetPrice(address token, uint256 price) external {
        prices[token] = price;
        emit PriceUpdated(token, price);
    }

    /// @notice Get the price of a token (18 decimals)
    function getAssetPrice(address token) external view returns (uint256) {
        uint256 price = prices[token];
        require(price > 0, "Price not set");
        return price;
    }
}