import { BigNumberish } from "./BigNumberish";
import { brand, Branded } from "./Brand";

/**
 * The ID of a blockchain.
 * For simplicity, a {@link ChainId} must be a positive integer.
 */
export type ChainId = Branded<typeof CHAIN_ID_BRAND, bigint>;
const CHAIN_ID_BRAND: unique symbol = Symbol("ChainId");

/** Static utilities for the {@link ChainId} type. */
export const ChainId = {
  /** The Polygon Amoy blockchain's ID. */
  POLYGON_AMOY: ofNumericOrThrow(80002n),
  /**
   * Parses `n` to a {@link ChainId}, or returns `undefined` if it cannot be
   * parsed in this way.
   *
   * For simplicity, a {@link ChainId} must be a positive bigint.
   */
  ofNumeric,
  /**
   * Parses `n` to a {@link ChainId}, or throws if it cannot be
   * parsed in this way. Generally this should only be used for parsing
   * constants, or in tests.
   *
   * For simplicity, a {@link ChainId} must be a positive bigint.
   */
  ofNumericOrThrow,
} as const;

function ofInt(n: bigint): ChainId | undefined {
  if (n <= 0n) return undefined;

  return brand(CHAIN_ID_BRAND, n);
}

function ofIntOrThrow(n: bigint): ChainId {
  const chainId = ofInt(n);

  if (chainId === undefined) {
    throw new Error("Invalid Chain ID!");
  }

  return chainId;
}

function ofNumeric(s: BigNumberish): ChainId | undefined {
  const n = BigInt(s);

  if (n < 0n) return undefined;

  return ofInt(n);
}

function ofNumericOrThrow(s: BigNumberish): ChainId {
  const n = BigInt(s);

  if (n < 0n) throw new Error("Invalid Chain ID!");

  return ofIntOrThrow(n);
}
