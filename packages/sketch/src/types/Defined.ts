/**
 * Remove `undefined` from a type union.
 *
 * @example
 * type MaybeUndefined = string | number | undefined;
 * type NeverUndefined = Defined<MaybeUndefined>; // type is `string | number`
 */
export type Defined<T> = T extends undefined ? never : T;
