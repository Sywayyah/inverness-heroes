export interface ModifiersModel {
  goldGainedPercent: number;
  experienceGainedPercent: number;

  fireResist: number;
  coldResist: number;
  lightningResist: number;
  magicResist: number;

  allResist: number;

  lifeSteal: number;
  manaSteal: number;

  defence: number;
  minDamage: number;
  maxDamage: number;
  enhancedDamage: number;

  health: number;
  mana: number;

  accuracy: number;

  criticalStrikeChance: number;
  criticalDamageMultiplier: number;
}

export type Modifiers = Partial<Readonly<ModifiersModel>>;
