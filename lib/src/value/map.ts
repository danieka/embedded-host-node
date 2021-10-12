// Copyright 2021 Google Inc. Use of this source code is governed by an
// MIT-style license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import {hash, List, OrderedMap} from 'immutable';

import {Value} from './value';
import {SassList} from './list';

/** A SassScript map */
export class SassMap extends Value {
  private readonly contentsInternal: OrderedMap<Value, Value>;

  /** Returns a map that contains `contents`. */
  constructor(contents: OrderedMap<Value, Value>) {
    super();
    this.contentsInternal = contents;
  }

  /** Returns an empty map. */
  static empty(): SassMap {
    return new SassMap(OrderedMap<Value, Value>());
  }

  /** `this`'s contents. */
  get contents(): OrderedMap<Value, Value> {
    return this.contentsInternal;
  }

  /**
   * Returns an immutable list of `contents`'s keys and values as two-element
   * `SassList`s.
   */
  get asList(): List<Value> {
    const list = [];
    for (const entry of this.contents.entries()) {
      list.push(new SassList(entry));
    }
    return List(list);
  }

  assertMap(): SassMap {
    return this;
  }

  tryMap(): OrderedMap<Value, Value> {
    return this.contents;
  }

  equals(other: Value): boolean {
    if (
      other instanceof SassList &&
      this.contents.size === 0 &&
      other.asList.size === 0
    ) {
      return true;
    }

    if (
      !(other instanceof SassMap) ||
      this.contents.size !== other.contents.size
    ) {
      return false;
    }

    for (const [key, value] of this.contents.entries()) {
      const otherValue = other.contents.get(key);
      if (otherValue === undefined || !otherValue.equals(value)) {
        return false;
      }
    }
    return true;
  }

  hashCode(): number {
    return this.contents.reduce(
      (accumulator, value, key) =>
        accumulator ^ value.hashCode() ^ key.hashCode(),
      0
    );
  }

  toString(): string {
    let string = '(';
    string += Array.from(
      this.contents.entries(),
      ([key, value]) => `${key}: ${value}`
    ).join(', ');
    string += ')';
    return string;
  }
}
