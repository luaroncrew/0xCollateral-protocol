"use client"

// normally calculated by the SC, for MOCK only
import SupplyPosition from "@/models/supply-position";
import BorrowPosition from "@/models/borrow-position";

import { randomPercetage, randomPrice, TOKENS_OPERATED_BY_0XCOLLATERAL } from "./tokens";
import { useMemo } from "react";

export const MARKET_STATS_FOR_USER = {

    // in $, formula: assets - liabilities
    netWorth: 3234.232,

    // Net APY (%) is the combined effect
    // of all supply and borrow positions
    // on net worth, including incentives.
    // It is possible to have a negative net APY if
    // debt APY is higher than supply APY.
    netAPY: 4.53,

    // as defined in whitepaper. A hf below 1 means that the loans are under-collateralized
    // and the liquidators can buy the collateral at a discount.
    // to say differently, the user gets liquidated immediately if the health factor is below 1.
    healthFactor: 1.23,
}

export const useSupplyPositions = (): SupplyPosition[] => {
    return useMemo(() => {
        return [{
            symbol: TOKENS_OPERATED_BY_0XCOLLATERAL.ETH,
            apy: randomPercetage(),
            balance: randomPrice(),
            usedAsCollateral: true,
        },
        {
            symbol: TOKENS_OPERATED_BY_0XCOLLATERAL.ZCT,
            apy: randomPercetage(),
            balance: randomPrice(),
            usedAsCollateral: false,
        },]
    }, []);
}

export const useSupplyPositionsTotalAPY = (): number => {

    const supplyPositions = useSupplyPositions();

    const total = supplyPositions.reduce((acc, position) => {
        return acc + position.apy;
    }, 0);

    return total / supplyPositions.length; // Average APY across all supply positions
}

export const useSupplyPositionsTotalBalance = (): number => {

    const supplyPositions = useSupplyPositions();

    const total = supplyPositions.reduce((acc, position) => {
        return acc + position.balance;
    }, 0);

    return total;
}

export const useBorrowPositions = (): BorrowPosition[] => {
    return useMemo(() => {
        return [{
            symbol: TOKENS_OPERATED_BY_0XCOLLATERAL.ETH,
            apy: randomPercetage(),
            debt: randomPrice(),
            apyType: "stable",
        },
        {
            symbol: TOKENS_OPERATED_BY_0XCOLLATERAL.ZCT,
            apy: randomPercetage(),
            debt: randomPrice(),
            apyType: "variable",
        },]
    }, []);
}

export const getBorrowPositionsTotalAPY = (): number => {

    const borrowPositions = useBorrowPositions();

    const total = borrowPositions.reduce((acc, position) => {
        return acc + position.apy;
    }, 0);

    return total / borrowPositions.length; // Average APY across all borrow positions
}

export const getBorrowPositionsTotalDebt = (): number => {

    const borrowPositions = useBorrowPositions();

    const total = borrowPositions.reduce((acc, position) => {
        return acc + position.debt;
    }, 0);

    return total;
}