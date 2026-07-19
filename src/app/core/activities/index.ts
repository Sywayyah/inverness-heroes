import { signal } from '@angular/core';
import { Character, CharBattleAction } from '../characters';
import { Player } from '../player';
import { ReactiveList } from '../reactive/reactive-list';
import { RangedNumber } from '../types/ranged';
import { Item } from '../items';

// various creatures may define other custom activity types
export interface ActivitySource {
  readonly name: string;
  readonly shortName: string;
}

export const OneHandActivitySource: ActivitySource = {
  name: 'One Hand',
  shortName: 'OH',
};

export const TwoHandsActivitySource: ActivitySource = {
  name: 'Two Hands',
  shortName: 'TH',
};

export const LegActivitySource: ActivitySource = {
  name: 'Leg',
  shortName: 'L',
};

export const MouthActivitySource: ActivitySource = {
  name: 'Mouth',
  shortName: 'MO',
};

export const MindActivitySource: ActivitySource = {
  name: 'Mind',
  shortName: 'MI',
};

export interface ActionStatsModel {
  minDamage: RangedNumber;
  maxDamage: RangedNumber;

  defence: RangedNumber;

  accuracy: RangedNumber;

  chanceToBlock: RangedNumber;
}

export type ActionStats = Partial<Readonly<ActionStatsModel>>;

export interface ActivityRequirements {
  readonly actionPoints?: number;
}

export interface Activity {
  readonly source: ActivitySource;
  readonly stats?: ActionStats;
  getRequirements?(params: { readonly ownerChar: Character; readonly item?: Item }): ActivityRequirements;
}

export interface BaseAction {
  readonly name: string;
  readonly sources?: Activity[];
  readonly imgSrc?: string;
}

export class BattleAction {
  readonly performed = signal(false);
  readonly history = new ReactiveList<string>();

  constructor(
    readonly player: Player,
    readonly char: Character,
    readonly activity: CharBattleAction,
  ) {}
}
