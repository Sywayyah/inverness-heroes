// various creatures may define other custom activity types
export interface ActivitySource {
  readonly name: string;
  readonly shortName: string;
}

export const LeftHandActivitySource: ActivitySource = {
  name: 'Left Hand',
  shortName: 'LH',
};

export const RightHandActivitySource: ActivitySource = {
  name: 'Right Hand',
  shortName: 'RH',
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
