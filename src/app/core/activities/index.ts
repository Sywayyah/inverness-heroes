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
