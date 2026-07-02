// various creatures may define other custom activity types
export interface ActivitySource {
  readonly name: string;
}

export const LeftHandActivitySource: ActivitySource = {
  name: 'Left Hand',
};

export const RightHandActivitySource: ActivitySource = {
  name: 'Right Hand',
};

export const BothHandsActivitySource: ActivitySource = {
  name: 'Both Hands',
};

export const LegActivitySource: ActivitySource = {
  name: 'Leg',
};

export const MouthActivitySource: ActivitySource = {
  name: 'Mouth',
};

export const MindActivitySource: ActivitySource = {
  name: 'Mind',
};
