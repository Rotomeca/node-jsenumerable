declare module '@rotomeca/jsenumerable';
declare namespace Rotomeca {
  namespace Enumerable {
    namespace Utils {
      type LastOrDefaultOptions<T, TDefault> = {
        default_value?: T | TDefault | null | undefined;
        where?: WhereCallback<T> | null | undefined;
      };
    }
    type WhereCallback<T> = (item: T, index: number) => boolean;
    type SelectCallback<T, TResult> = (item: T, index: number) => TResult;
    type SelectorCallback<T, TResult> = (item: T) => TResult;
  }
}

declare class KeyValuePair<TKey, TValue> {
  readonly key: TKey;
  readonly value: TValue;
  constructor(key: TKey, value: TValue);
}

declare class RotomecaGenerator<T> {
  iterable: Iterable<T>;
  constructor(generator: Iterable<T>);
  [Symbol.iterator](): Iterator<T>;
  next<TResult>(): IteratorResult<TResult>;
  where(
    callback: Rotomeca.Enumerable.WhereCallback<T>,
  ): RotomecaWhereGenerator<T>;
  select<TResult>(
    callback: Rotomeca.Enumerable.SelectCallback<T, TResult>,
  ): RotomecaSelectGenerator<T, TResult>;
  groupBy<Tkey, TValue>(
    key_selector: Rotomeca.Enumerable.SelectorCallback<T, Tkey>,
    value_selector?:
      | Rotomeca.Enumerable.SelectorCallback<T, TValue>
      | null
      | undefined,
  ): RotomecaGroupByGenerator<T, Tkey, TValue>;
  orderBy<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): RotomecaOrderGenerator<T, TTested>;
  orderByDescending<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): RotomecaOrderByDesendingGenerator<T, TTested>;

  any(callback: Rotomeca.Enumerable.WhereCallback<T>): boolean;
  all(callback: Rotomeca.Enumerable.WhereCallback<T>): boolean;
  contains(item: T): boolean;
  first(callback?: Rotomeca.Enumerable.WhereCallback<T>): T;
  firstOrDefault<TDefault>(
    default_value?: T | TDefault | null | undefined,
    callback?: Rotomeca.Enumerable.WhereCallback<T>,
  ): T | TDefault;
  last(where?: Rotomeca.Enumerable.WhereCallback<T>): T;
  lastOrDefault<TDefault>({
    default_value,
    where,
  }?: Rotomeca.Enumerable.Utils.LastOrDefaultOptions<T, TDefault>):
    | T
    | TDefault;
}

declare abstract class ARotomecaCallbackGenerator<
  T,
  TFunc extends Function,
> extends RotomecaGenerator<T> {
  callback: TFunc;
  constructor(iterable: Iterable<T>, callback: TFunc);
}

declare abstract class ARotomecaKeyValueSelector<
  T,
  TResult,
  TKey extends Function,
  TValue extends Function,
> extends RotomecaGenerator<TResult> {
  keySelector: TKey;
  constructor(
    iterable: Iterable<T>,
    keySelector: TKey,
    valueSelector?: TValue | null | undefined,
  );
}

declare abstract class ARotomecaOrderGenerator<
  T,
  TTested,
> extends ARotomecaCallbackGenerator<
  T,
  Rotomeca.Enumerable.SelectorCallback<T, TTested>
> {
  constructor(
    iterable: Iterable<T>,
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  );
  abstract sort(a: TTested, b: TTested): number;
  next<TResult>(): IteratorResult<TResult>;
}

declare class RotomecaWhereGenerator<T> extends ARotomecaCallbackGenerator<
  T,
  Rotomeca.Enumerable.WhereCallback<T>
> {
  constructor(
    iterable: Iterable<T>,
    callback: Rotomeca.Enumerable.WhereCallback<T>,
  );
  next<TResult>(): IteratorResult<TResult>;
}

declare class RotomecaSelectGenerator<
  T,
  TResult,
> extends ARotomecaCallbackGenerator<
  T,
  Rotomeca.Enumerable.SelectCallback<T, TResult>
> {
  constructor(
    iterable: Iterable<T>,
    callback: Rotomeca.Enumerable.SelectCallback<T, TResult>,
  );
  next<TResult>(): IteratorResult<TResult>;
}

declare class RotomecaGroupedItems<TKey, TValue> {
  constructor(key: TKey, iterable: Iterable<TValue>);
  key: TKey;
  iterable: Iterable<TValue>;
  next(): IteratorResult<KeyValuePair<TKey, TValue>>;
  get_values(try_get_array?: boolean): TValue[] | RotomecaGenerator<TValue>;
}

declare class RotomecaGroupByGenerator<
  T,
  TKey,
  TValue,
> extends ARotomecaKeyValueSelector<
  T,
  RotomecaGroupedItems<TKey, TValue>,
  Rotomeca.Enumerable.SelectorCallback<T, TKey>,
  Rotomeca.Enumerable.SelectorCallback<T, TValue>
> {
  constructor(
    iterable: Iterable<T>,
    keySelector: Rotomeca.Enumerable.SelectorCallback<T, TKey>,
    valueSelector?: Rotomeca.Enumerable.SelectorCallback<T, TValue>,
  );
  next(): IteratorResult<RotomecaGroupedItems<TKey, TValue>>;
}

declare class RotomecaOrderGenerator<
  T,
  TTested,
> extends ARotomecaOrderGenerator<T, TTested> {
  constructor(
    iterable: Iterable<T>,
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  );
  sort(a: TTested, b: TTested): number;
}

declare class RotomecaOrderByDesendingGenerator<
  T,
  TTested,
> extends RotomecaOrderGenerator<T, TTested> {
  constructor(
    iterable: Iterable<T>,
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  );
  sort(a: TTested, b: TTested): number;
}
