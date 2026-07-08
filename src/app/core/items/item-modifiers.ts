import { Item } from '.';
import { Modifiers } from '../modifiers';
import { EntityRegistry } from '../registries';
import { formattedRangedNumber, rangedNumber, rollRangedNumber } from '../types/ranged';
import { getItemStatsLines } from './configs';

export interface GeneratedItemStats {
  readonly mods: Modifiers;
}

export type GenerateItemModsParams = { readonly item: Item };

export type ItemModifiersDescriptionParams = { readonly item?: Item; readonly mods?: Modifiers };

export interface ItemModifiers {
  readonly id: string;
  readonly title: string;
  generateStats(params: GenerateItemModsParams): GeneratedItemStats;
  getDescription(params: ItemModifiersDescriptionParams): string;
}

export const itemModifiersRegistry = new EntityRegistry<ItemModifiers>({ name: 'items modifiers' });

const apprenticeStats = { mana: rangedNumber(2, 6) };
itemModifiersRegistry.register({
  id: 'armor-apprentice',
  title: 'Apprentice',

  getDescription(params): string {
    return getItemStatsLines(params, [{ stat: 'mana', ranged: apprenticeStats.mana }]);
  },
  generateStats(item): GeneratedItemStats {
    return { mods: { mana: rollRangedNumber(apprenticeStats.mana) } };
  },
});

const sharpnessStats = {
  enhancedDamage: rangedNumber(10, 40),
  labels: {
    10: 'Sharpness',
    30: 'Serrated Sharpness',
    50: 'Unholy Sharpness',
    80: 'Infernal Sharpness',
    100: 'Absolute Sharpness',
  },
};
itemModifiersRegistry.register({
  id: 'weapon-sharpness',
  title: 'Sharpness',

  getDescription(params): string {
    return getItemStatsLines(params, [
      { stat: 'enhancedDamage', ranged: sharpnessStats.enhancedDamage },
    ]);
  },
  generateStats(item): GeneratedItemStats {
    return { mods: { enhancedDamage: rollRangedNumber(sharpnessStats.enhancedDamage) } };
  },
});

const batformStats = {
  lifeLeach: rangedNumber(1, 3),
  manaLeach: rangedNumber(1, 3),
  allResists: rangedNumber(-10, -15),
};
itemModifiersRegistry.register({
  id: 'weapon-bat-form',
  title: 'Batform',

  getDescription(params): string {
    return getItemStatsLines(params, [
      { stat: 'lifeSteal', ranged: batformStats.lifeLeach },
      { stat: 'manaSteal', ranged: batformStats.manaLeach },
      { stat: 'allResist', ranged: batformStats.allResists },
    ]);
  },
  generateStats(params): GeneratedItemStats {
    return {
      mods: {
        lifeSteal: rollRangedNumber(batformStats.lifeLeach),
        manaSteal: rollRangedNumber(batformStats.manaLeach),
        allResist: rollRangedNumber(batformStats.allResists),
      },
    };
  },
});

/*
  Modifiers can add activities, spells, passive effects, on attack effects, etc.
*/
/*
  todo: global modifiers
  params: function skip(), like preventDefault()
*/
