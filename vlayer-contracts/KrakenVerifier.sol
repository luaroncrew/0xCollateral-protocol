// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {KrakenProver} from "./KrakenProver.sol";

function hexCharToByte(bytes1 char) pure returns (uint8) {
    uint8 byteValue = uint8(char);
    if (byteValue >= uint8(bytes1("0")) && byteValue <= uint8(bytes1("9"))) {
        return byteValue - uint8(bytes1("0"));
    } else if (byteValue >= uint8(bytes1("a")) && byteValue <= uint8(bytes1("f"))) {
        return 10 + byteValue - uint8(bytes1("a"));
    } else if (byteValue >= uint8(bytes1("A")) && byteValue <= uint8(bytes1("F"))) {
        return 10 + byteValue - uint8(bytes1("A"));
    }
    revert("Invalid hex character");
}


function stringToAddress(string memory str) pure returns (address) {
    bytes memory strBytes = bytes(str);
    require(strBytes.length == 42, "Invalid address length");
    bytes memory addrBytes = new bytes(20);

    for (uint256 i = 0; i < 20; i++) {
        addrBytes[i] = bytes1(hexCharToByte(strBytes[2 + i * 2]) * 16 + hexCharToByte(strBytes[3 + i * 2]));
    }

    return address(uint160(bytes20(addrBytes)));
}


interface ERC20 {
    function mint(address to, uint256 amount) external;
}

interface ILendingPool {
    function deposit(address _token, uint256 _amount, address _from) external payable;
}


contract KrakenVerifier is Verifier {
    // ecosystem addresses
    address public token;
    address public poolCore;

    mapping(address => int256) public collateralizedAmounts;
    mapping(bytes32 => bool) public usedIntentIds;

    event Collateralized(address indexed user, int256 amount, bytes32 intentId);

    address public prover;

    constructor(address _prover) {
        prover = _prover;
    }

    function verify(
        Proof calldata,
        int256 amountCollateralized,
        address collateralizedForAddress,
        string calldata usedIntentId
    ) public onlyVerified(prover, KrakenProver.main.selector) {

        bytes32 _intentId = bytes32(bytes(usedIntentId));

        // verify if the intent was already consumed
        require(!usedIntentIds[_intentId], "Intent ID already used");

        if (collateralizedAmounts[collateralizedForAddress] == 0) {
            collateralizedAmounts[collateralizedForAddress] = 0;
        }

        usedIntentIds[_intentId] = true;

        // increment collateralized amount for the address
        mintZCTokensToAddress(collateralizedForAddress, uint256(amountCollateralized));
        addUserCollateralToPool(uint256(amountCollateralized), collateralizedForAddress);

        // for dev use, keep track of the collateral in the state of the current contract
        collateralizedAmounts[collateralizedForAddress] += amountCollateralized;

        emit Collateralized(collateralizedForAddress, amountCollateralized, _intentId);
    }

    // issue ZC tokens to the user
    function mintZCTokensToAddress(address to, uint256 amount) private {
        ERC20(token).mint(to, amount);
    }

    // a function that communicates with the lending pool
    //to deposit the collateralized amount
    function addUserCollateralToPool(uint256 amount, address user) private {
        ILendingPool(poolCore).deposit(token, amount, user);
    }

    // -------------- developer methods --------------

    // view function to read collateralized amount
    // for any address (developer use)
    function getCollateralizedAmount(string calldata user) external view returns (int256) {
        address key = stringToAddress(user);
        return collateralizedAmounts[key];
    }

    // configure the contract to work with the
    //lending pool and specific collateral token address
    function setZCTokenAndPool(address _token, address _pool) external {
        token = _token;
        poolCore = _pool;
    }
}
