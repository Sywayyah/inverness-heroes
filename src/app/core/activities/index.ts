import { RangedNumber } from '../types/ranged';

// various creatures may define other custom activity types
export interface ActivitySource {
  readonly name: string;
  readonly shortName: string;
}

export const OneHandActivitySource: ActivitySource = {
  name: 'One Hand',
  shortName: 'OH',
};

export const BothHandsActivitySource: ActivitySource = {
  name: 'Both Hands',
  shortName: 'BH',
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

export interface Activity {
  readonly source: ActivitySource;
  readonly stats?: ActionStats;
}

export interface BaseAction {
  readonly name: string;
  readonly sources?: Activity[];
}
