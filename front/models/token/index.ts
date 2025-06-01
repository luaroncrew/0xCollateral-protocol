import { TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE } from "@/app/constants/tokens";

/**
 * Token
 */
export default interface Token {
  /**
   * The id of the token
   */
  id: number;
  /**
   * The symbol of the token
   */
  symbol: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE;
}
