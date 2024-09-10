// @fileoverview Utilities for branded types, which approximate nominal
// typing.

/**
 * The `Branded` type allows us to fake nominal typing in TypeScript.
 *
 * Nominal types can help us prevent mistakes by making certain types not
 * assignable to others. For example, we might mix up `fooId` and `barId` in
 * this example:
 *
 * ```ts
 * const fooId: string = 'foo_1234';
 * const barId: string = 'bar_5678';
 *
 * function addFooToBar(fooId: string, barId: string): void {
 *   // ...
 * }
 *
 *
 * addFooToBar(barId, fooId);  // oops!
 * ```
 *
 * We can use nominal types to ensure that a `FooId` is not assignable to a
 * `BarId`:
 *
 * ```ts
 * const fooId: FooId = FooId.ofString('foo_1234');
 * const barId: BarId = BarId.ofString('bar_5678');
 *
 * function addFooToBar(fooId: FooId, barId: BarId): void {
 *   // ...
 * }
 *
 * addFooToBar(barId, fooId);  // This is a type error!
 * ```
 *
 * Note that this is a type-level trick, and does not incur a runtime cost
 * (besides the function call to `brand`, which may be optimized away)
 */
export type Branded<B extends symbol, T> = T & Readonly<{ [BRAND]: B }>;
declare const BRAND: unique symbol;

/** Given a brand `b` and a value `t`, brands `t` with `b`. */
export function brand<B extends symbol, T>(_brand: B, t: T): Branded<B, T> {
  return t as Branded<B, T>;
}
