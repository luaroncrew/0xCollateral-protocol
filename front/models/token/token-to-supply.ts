import Token from ".";

/**
 * TokenToSupply
 * Represents a token that can be supplied
 * @extends Token
 */
export default interface TokenToSupply extends Token {
  /**
   * The amount of token available to supply
   */
  apyStable: number;
  /**
   * The annual percentage yield (APY) for stable supply
   */
  walletBalance: number;
}
