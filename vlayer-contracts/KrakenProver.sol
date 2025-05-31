// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {Web, WebProof, WebProofLib, WebLib} from "vlayer-0.1.0/WebProof.sol";


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


contract KrakenProver is Prover {
    using WebProofLib for WebProof;
    using WebLib for Web;

    string public constant STRIPE_BASE_URL = "https://api.stripe.com/v1/payment_intents/";

    function main(
        WebProof calldata webProof,
        string calldata intentId
    ) public view returns (
        Proof memory,
        int256 amountCollateralized,
        address collateralizedForAddress,
        string memory usedIntentId
    ) {
        string memory data_url = string(abi.encodePacked(STRIPE_BASE_URL, intentId));

        Web memory web = webProof.verify(data_url);

        int256 _amountCollateralized = web.jsonGetInt("amount_capturable") * 10e8;
        string memory collateralizedFor = web.jsonGetString("metadata.address");

        // verify that the collateralizedFor is a valid address
        address _collateralizedForAddress = stringToAddress(collateralizedFor);

        require(_amountCollateralized > 0, "Amount must be positive");
        return (proof(), _amountCollateralized, _collateralizedForAddress, intentId);
    }
}
