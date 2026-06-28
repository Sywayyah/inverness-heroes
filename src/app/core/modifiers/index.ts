export interface ModifiersModel {
  goldGainedPercent: number;
  experienceGainedPercent: number;

  fireResist: number;
  coldResist: number;
  lightningResist: number;
}

export type Modifiers = Partial<Readonly<ModifiersModel>>;
