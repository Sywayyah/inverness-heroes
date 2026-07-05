import { getRandomInt } from '../utils/common';

export type RangedNumber = number | [number, number];

export function rangedNumber(min: number, max?: number): RangedNumber {
  if (typeof max === 'undefined' || min === max) {
    return min;
  }

  return [min, max];
}

export function rollRangedNumber(val: RangedNumber): number {
  if (Array.isArray(val)) {
    return getRandomInt(Math.min(...val), Math.max(...val));
  }

  return val;
}

export function formattedRangedNumber(rangedValue: RangedNumber): string {
  if (Array.isArray(rangedValue)) {
    if (rangedValue[0] !== rangedValue[1]) {
      return `${rangedValue[0]}…${rangedValue[1]}`;
    } else {
      return String(rangedValue[0]);
    }
  }

  return String(rangedValue);
}
