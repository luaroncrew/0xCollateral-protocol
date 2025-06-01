import { TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE } from "@/app/constants/tokens";

export default interface BorrowPosition {
    symbol: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE
    apy: number;
    apyType: "stable" | "variable";
    debt: number;
}