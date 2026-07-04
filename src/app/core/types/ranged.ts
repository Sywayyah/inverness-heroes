import { getRandomInt } from '../utils/common';

export type RangedNumber = number | [number, number];

export function rangedValue(min: number, max?: number): RangedNumber {
  if (typeof max === 'undefined') {
    return min;
  }
  return [min, max];
}

export function rollRangedValue(val: RangedNumber): number {
  if (Array.isArray(val)) {
    return getRandomInt(Math.min(...val), Math.max(...val));
  }

  return val;
}

export function formattedRangedValue(rangedValue: RangedNumber): string {
  if (Array.isArray(rangedValue)) {
    if (rangedValue[0] !== rangedValue[1]) {
      return `${rangedValue[0]}-${rangedValue[1]}`;
    } else {
      return String(rangedValue[0]);
    }
  }

  return String(rangedValue);
}
