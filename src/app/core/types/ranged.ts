import { getRandomInt } from "../utils/common";

export type RangedValue = number | [number, number];

export function rollRangedValue(val: RangedValue): number {
  if (Array.isArray(val)) {
    return getRandomInt(Math.min(...val), Math.max(...val));
  }

  return val;
}
