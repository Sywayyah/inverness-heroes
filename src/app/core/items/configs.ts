import { Modifiers } from '../modifiers';
import { RangedNumber, formattedRangedNumber } from '../types/ranged';
import { ItemModifiersDescriptionParams } from './item-modifiers';

export  const modifiersConfigs: {
  readonly [K in keyof Modifiers]: { readonly label: string; readonly percent?: boolean; readonly order?: number };
} = {
  mana: {
    label: 'Mana',
    percent: false,
  },
  health: {
    label: 'Health',
    percent: false,
  },
  defence: {
    label: 'Defence',
    percent: false,
  },
  accuracy: {
    label: 'Accuracy',
    percent: false,
  },
  enhancedDamage: {
    label: 'Enhanced Damage',
  },
  maxDamage: {
    label: 'Max Damage',
    percent: false,
  },
  minDamage: {
    label: 'Min Damage',
    percent: false,
  },

  experienceGainedPercent: {
    label: 'Experience Gained',
  },
  goldGainedPercent: {
    label: 'Gold Gained',
  },

  lifeSteal: {
    label: 'Life Steal',
  },
  manaSteal: {
    label: 'Mana Steal',
  },

  allResist: {
    label: 'All Resist',
  },
  coldResist: {
    label: 'Cold Resist',
  },
  fireResist: {
    label: 'Fire Resist',
  },
  lightningResist: {
    label: 'Lightning Resist',
  },
  magicResist: {
    label: 'Magic Resist',
  },

  criticalDamageMultiplier: {
    label: 'Critical Damage Multiplier',
  },
  criticalStrikeChance: {
    label: 'Critical Damage Chance',
  },
};

export function getModStatLine(stat: keyof Modifiers, value: number): string {
  const percent = modifiersConfigs[stat]!.percent;
  const postfix = typeof percent === 'undefined' || percent ? '%' : '';

  return `${modifiersConfigs[stat]!.label}: ${value + postfix}`;
}

export function getItemStatLine({
  stat,
  params,
  ranged,
}: {
  readonly stat: keyof Modifiers;
  readonly params: ItemModifiersDescriptionParams;
  readonly ranged: RangedNumber;
}): string {
  const percent = modifiersConfigs[stat]!.percent;
  const postfix = typeof percent === 'undefined' || percent ? '%' : '';

  return `${modifiersConfigs[stat]!.label}: ${params.mods ? params.mods[stat] + postfix : ''} [${formattedRangedNumber(ranged)}${postfix}]`;
}

export function getItemStatsLines(
  params: ItemModifiersDescriptionParams,
  lines: { readonly stat: keyof Modifiers; readonly ranged: RangedNumber }[],
): string {
  return lines
    .map((line) => getItemStatLine({ stat: line.stat, params, ranged: line.ranged }))
    .join('\n');
}
