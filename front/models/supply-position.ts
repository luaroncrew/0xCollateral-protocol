import { TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE } from "@/app/constants/tokens";

export default interface SupplyPosition {
    apy: number;
    symbol: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE
    balance: number;
    usedAsCollateral: boolean;
}