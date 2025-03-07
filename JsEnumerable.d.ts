import { RGenerator } from './JsEnumerable';

declare module '@rotomeca/jsenumerable';
declare namespace Rotomeca {
  namespace Enumerable {
    namespace Utils {
      type LastOrDefaultOptions<T, TDefault> = {
        default_value?: T | TDefault | null | undefined;
        where?: WhereCallback<T> | null | undefined;
      };
      type SomeGenerator<T> =
        | Iterable<T>
        | Array<T>
        | JsEnumerable<T>
        | RotomecaGenerator<T>;
      type SomeGeneratorWithObject<T> = SomeGenerator<T> | { [key: string]: T };
    }
    type WhereCallback<T> = (item: T, index: number) => boolean;
    type SelectCallback<T, TResult> = (item: T, index: number) => TResult;
    type SelectorCallback<T, TResult> = (item: T) => TResult;
    type RGenerator<T> = () => JsEnumerable<T>;
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
  then<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): RotomecaThenGenerator<T, TTested>;
  thenDescending<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): RotomecaThenDescendingGenerator<T, TTested>;
  reverse(): RotomecaReverseGenerator<T>;
  take(howMany: number): RotomecaTakeGenerator<T>;
  add(item: T): RotomecaAggegateGenerator<T, T>;
  aggregate<Y>(item: Y): RotomecaAggegateGenerator<T, Y>;
  remove(item: T): RotomecaRemoveGenerator<T>;
  removeAtIndex(index: number): RotomecaRemoveAtIndexGenerator<T>;
  distinct<Y>(
    selector?: Rotomeca.Enumerable.SelectorCallback<T, Y> | null,
  ): RotomecaGenerator<Y>;
  except(array: T[]): RotomecaGenerator<T>;
  union<TResult>(
    array: T[],
    c?: Rotomeca.Enumerable.SelectorCallback<T, TResult> | null,
  ): RotomecaUnionGenerator<T, T, TResult>;
  intersect(array: T[]): RotomecaIntersectGenerator<T, T>;
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
  flat(): RotomecaFlatGenerator<T>;
  count(): number;
  join(separator?: string): string;
  max<Y>(selector: Rotomeca.Enumerable.SelectorCallback<T, Y>): Y;
  min<Y>(selector: Rotomeca.Enumerable.SelectorCallback<T, Y>): Y;
  toArray(): T[];
  toJsonObject(): { [key: string]: T };
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

declare abstract class ARotomecaItemModifierGenerator<
  T,
  TModifier,
> extends RotomecaGenerator<T> {
  constructor(iterable: Iterable<T>, item: TModifier);
  next<TResult>(): IteratorResult<TResult>;
}

declare abstract class ARotomecaRemoverGenerator<
  T,
> extends ARotomecaItemModifierGenerator<T, T> {
  constructor(iterable: Iterable<T>, item: T);
  next<TResult>(): IteratorResult<TResult>;
  abstract compare(item: T): T;
  abstract before(): void;
  abstract after(): void;
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
  next<TResult>(): IteratorResult<TResult>;
}

declare class RotomecaOrderGenerator<
  T,
  TTested,
> extends ARotomecaOrderGenerator<T, TTested> {
  constructor(
    iterable: Iterable<T>,
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  );
  sort(a: T | TTested, b: T | TTested): number;
}

declare class RotomecaOrderByDesendingGenerator<
  T,
  TTested,
> extends RotomecaOrderGenerator<T, TTested> {
  constructor(
    iterable: Iterable<T>,
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  );
  sort(a: T | TTested, b: T | TTested): number;
}

declare class RotomecaThenGenerator<T, TTested> extends ARotomecaOrderGenerator<
  T,
  TTested
> {
  constructor(
    iterable: Iterable<T>,
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  );
  sort(a: T | TTested, b: T | TTested): number;
}

declare class RotomecaThenDescendingGenerator<
  T,
  TTested,
> extends RotomecaThenGenerator<T, TTested> {
  constructor(
    iterable: Iterable<T>,
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  );
  sort(a: T | TTested, b: T | TTested): number;
}

declare class RotomecaAggegateGenerator<
  T,
  Y,
> extends ARotomecaItemModifierGenerator<T, Y> {
  constructor(iterable: Iterable<T>, item: Y);
  next<TResult>(): IteratorResult<TResult>;
}

declare class RotomecaRemoveGenerator<T> extends ARotomecaRemoverGenerator<T> {
  constructor(iterable: Iterable<T>, item: T);
}

declare class RotomecaRemoveAtIndexGenerator<
  T,
> extends ARotomecaRemoverGenerator<T> {
  constructor(iterable: Iterable<T>, index: number);
  compare(item: T): number;
  before(): void;
}

declare class RotomecaFlatGenerator<T> extends RotomecaGenerator<T> {
  constructor(iterable: Iterable<T>);
  next<TResult>(): IteratorResult<TResult>;
  generate(iterable: Iterable<T>): Iterable<T>;
  check(item: T): boolean;
}

declare class RotomecaUnionGenerator<
  T,
  Y,
  TResult,
> extends ARotomecaItemModifierGenerator<T, Y> {
  constructor(
    iterable: Iterable<T>,
    array: Y[],
    selector: Rotomeca.Enumerable.SelectorCallback<Y | T, TResult>,
  );
  next<TResult>(): IteratorResult<TResult>;
  generate(have_selector: boolean, generator: Iterable<T>): Iterable<T>;
}

declare class RotomecaIntersectGenerator<
  T,
  Y,
> extends ARotomecaItemModifierGenerator<T, Y> {
  constructor(iterable: Iterable<T>, array: Y[]);
  next<TResult>(): IteratorResult<TResult>;
}

declare class RotomecaReverseGenerator<T> extends RotomecaGenerator<T> {
  constructor(iterable: Iterable<T>);
  next<TResult>(): IteratorResult<TResult>;
}

declare class RotomecaTakeGenerator<T> extends ARotomecaItemModifierGenerator<
  T,
  number
> {
  constructor(iterable: Iterable<T>, item: number);
  next<TResult>(): IteratorResult<TResult>;
}

declare class ObjectKeyEnumerable<T> extends RotomecaGenerator<
  KeyValuePair<string, T>
> {
  constructor(object: { [key: string]: T });
  _generate(): IteratorResult<KeyValuePair<string, T>>;
}

declare class JsEnumerable<T> {
  constructor(generator: Iterable<T>);
  constructor(generator: Array<T>);
  constructor(generator: RotomecaGenerator<T>);
  constructor(generator: JsEnumerable<T>);
  constructor(generator: { [key: string]: T });
  readonly generator: Rotomeca.Enumerable.RGenerator<T>;
  where(callback: Rotomeca.Enumerable.WhereCallback<T>): JsEnumerable<T>;
  select<TResult>(
    selector: Rotomeca.Enumerable.SelectCallback<T, TResult>,
  ): JsEnumerable<TResult>;
  groupBy<Tkey, TValue>(
    key_selector: Rotomeca.Enumerable.SelectorCallback<T, Tkey>,
    value_selector?:
      | Rotomeca.Enumerable.SelectorCallback<T, TValue>
      | null
      | undefined,
  ): JsEnumerable<RotomecaGroupedItems<Tkey, TValue>>;
  orderBy<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): JsEnumerable<T>;
  orderByDescending<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): JsEnumerable<T>;
  then<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): JsEnumerable<T>;
  thenDescending<TTested>(
    selector: Rotomeca.Enumerable.SelectorCallback<T, TTested>,
  ): JsEnumerable<T>;
  add(item: T): JsEnumerable<T>;
  aggregate(item: Iterable<T>): JsEnumerable<T>;
  aggregate(item: Array<T>): JsEnumerable<T>;
  aggregate(item: RotomecaGenerator<T>): JsEnumerable<T>;
  aggregate(item: JsEnumerable<T>): JsEnumerable<T>;
  remove(item: T): JsEnumerable<T>;
  removeAtIndex(index: number): JsEnumerable<T>;
  distinct<Y>(
    selector?: Rotomeca.Enumerable.SelectorCallback<T, Y> | null,
  ): JsEnumerable<Y>;
  except(array: T[]): JsEnumerable<T>;
  union<TResult>(
    array: T[],
    selector?: Rotomeca.Enumerable.SelectorCallback<T, TResult> | null,
  ): JsEnumerable<TResult>;
  intersect(array: T[]): JsEnumerable<T>;
  reverse(): JsEnumerable<T>;
  take(howMany: number): JsEnumerable<T>;
  any(callback?: null | Rotomeca.Enumerable.WhereCallback<T>): boolean;
  all(callback?: null | Rotomeca.Enumerable.WhereCallback<T>): boolean;
  contains(item: T): boolean;
  first(callback?: null | Rotomeca.Enumerable.WhereCallback<T>): T;
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
  flat(): JsEnumerable<T>;
  [Symbol.iterator](): Iterator<T>;
  join(separator?: string): string;
  sum({
    where,
    selector,
  }?: {
    where?: Rotomeca.Enumerable.WhereCallback<T>;
    selector?: Rotomeca.Enumerable.SelectorCallback<T, number>;
  }): number;
  count(): number;
  max<Y>(selector: Rotomeca.Enumerable.SelectorCallback<T, Y>): number;
  min<Y>(selector: Rotomeca.Enumerable.SelectorCallback<T, Y>): number;
  toArray(): T[];
  toJsonObject(): { [key: string]: T };
  static from<TFrom>(item: Iterable<TFrom>): JsEnumerable<TFrom>;
  static from<TFrom>(item: Array<TFrom>): JsEnumerable<TFrom>;
  static from<TFrom>(item: RotomecaGenerator<TFrom>): JsEnumerable<TFrom>;
  static from<TFrom>(item: JsEnumerable<TFrom>): JsEnumerable<TFrom>;
  static from<TFrom>(item: { [key: string]: TFrom }): JsEnumerable<TFrom>;
  static choice<Y>(item: Iterable<Y>, ...args: Y[]): JsEnumerable<Y>;
  static choice<Y>(item: Array<Y>, ...args: Y[]): JsEnumerable<Y>;
  static choice<Y>(item: RotomecaGenerator<Y>, ...args: Y[]): JsEnumerable<Y>;
  static choice<Y>(item: JsEnumerable<Y>, ...args: Y[]): JsEnumerable<Y>;
  static cycle<Y>(item: Iterable<T>, ...args: Y[]): JsEnumerable<Y>;
  static cycle<Y>(item: Array<T>, ...args: Y[]): JsEnumerable<Y>;
  static cycle<Y>(item: RotomecaGenerator<T>, ...args: Y[]): JsEnumerable<Y>;
  static cycle<Y>(item: JsEnumerable<T>, ...args: Y[]): JsEnumerable<Y>;
  static empty<Y>(): JsEnumerable<Y>;
  static range(
    start: number,
    count: number,
    step?: number,
  ): JsEnumerable<number>;
  static rangeDown(
    start: number,
    count: number,
    step?: number,
  ): JsEnumerable<number>;
  static toInfinity(start?: number, step?: number): JsEnumerable<number>;
  static toNegativeInfinity(
    start?: number,
    step?: number,
  ): JsEnumerable<number>;
  static generate(callback: () => Iterable<T>): JsEnumerable<T>;
  static random(min?: number, max?: number): JsEnumerable<number>;
  static fromAsync(
    async_generator: () => Promise<Iterable<T>>,
  ): Promise<JsEnumerable<T>>;
}

export = JsEnumerable;
