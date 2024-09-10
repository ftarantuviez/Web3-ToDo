// @fileoverview Static utilities for strings.

/** Narrows `s` to a string which starts with prefix `p`. */
export function startsWith<const PrefixT extends string>(
  prefix: PrefixT,
  s: string
): s is `${PrefixT}${string}` {
  return s.startsWith(prefix);
}
