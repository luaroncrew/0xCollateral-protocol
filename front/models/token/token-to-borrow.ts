import Token from ".";

/**
 * TokenToBorrow
 * Represents a token that can be borrowed
 * @extends Token
 */
export default interface TokenToBorrow extends Token {
  /**
   * The amount of token available to borrow
   */
  available: number;
  /**
   * The annual percentage yield (APY) for stable borrowing
   */
  apyStable: number;
  /**
   * The annual percentage yield (APY) for variable borrowing
   */
  apyVariable: number;
}
