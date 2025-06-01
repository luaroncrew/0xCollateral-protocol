import TokenToBorrow from "@/models/token/token-to-borrow";
import TokenToSupply from "@/models/token/token-to-supply";

import { useMemo } from "react";

import { padHex } from 'viem';


// a list of tokens available to supply or borrow
export const TOKENS_OPERATED_BY_0XCOLLATERAL = {
  "ETH": "ETH",
  "ZCT": "ZCT",
  // USDT: "USDT",
  // USDC: "USDC",
  // BTC: "BTC",
  // NEAR: "NEAR",
} as const;

export type TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE = keyof typeof TOKENS_OPERATED_BY_0XCOLLATERAL;
export const TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES = Object.keys(TOKENS_OPERATED_BY_0XCOLLATERAL) as TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE[];

export const TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE: Record<TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE, any> = {
  "ZCT": "0x03cE5dcdc364a75Fc5A69df093134D006d4C341a",
  "ETH": "0x0000000000000000000000000000000000000000",
}

export const randomPrice = () => 100
export const randomPercetage = () => 0.5;

export const useTokensAvailableToSupply = (): TokenToSupply[] => {
  return useMemo(() => {
    return Object.entries(TOKENS_OPERATED_BY_0XCOLLATERAL).map(([_, symbol], index) => ({
      id: index + 1,
      symbol,
      apyStable: randomPercetage(), // Random APY between 0% and 100%
      walletBalance: randomPrice(), // Random wallet balance between $100 and $1000
    }))
  }, []);
}

// represents the token that a user can borrow
export const useTokensAvailableToBorrow = (): TokenToBorrow[] => {
  return useMemo(() => {
    return Object.entries(TOKENS_OPERATED_BY_0XCOLLATERAL).map(([_, symbol], index) => ({
      id: index + 1,
      symbol,
      available: randomPrice(), // Random available amount between $100 and $1000
      apyStable: randomPercetage(), // Random APY between 0% and 100%
      apyVariable: randomPercetage(), // Random APY between 0% and 100%
    }))
  }, [])
}