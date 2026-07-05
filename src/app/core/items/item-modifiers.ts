import { Item } from '.';
import { Modifiers } from '../modifiers';
import { EntityRegistry } from '../registries';
import { formattedRangedNumber, rangedNumber, rollRangedNumber } from '../types/ranged';
import { getItemStatsLines } from './utils';

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

itemModifiersRegistry.register({
  id: 'armor-apprentice',
  title: 'Apprentice',

  stats: { mana: rangedNumber(2, 6) },

  getDescription(): string {
    return `Mana: ${formattedRangedNumber(this.stats.mana)}`;
  },
  generateStats(item): GeneratedItemStats {
    return { mods: { mana: rollRangedNumber(this.stats.mana) } };
  },
});

itemModifiersRegistry.register({
  id: 'weapon-sharpness',
  title: 'Sharpness',

  stats: {
    enhancedDamage: rangedNumber(10, 40),
    labels: {
      10: 'Sharpness',
      30: 'Serrated Sharpness',
      50: 'Unholy Sharpness',
      80: 'Infernal Sharpness',
      100: 'Absolute Sharpness',
    },
  },

  getDescription(params): string {
    return getItemStatsLines(params, [
      { stat: 'enhancedDamage', ranged: this.stats.enhancedDamage },
    ]);
  },
  generateStats(item): GeneratedItemStats {
    return { mods: { enhancedDamage: rollRangedNumber(this.stats.enhancedDamage) } };
  },
});

itemModifiersRegistry.register({
  id: 'weapon-bat-form',
  title: 'Batform',

  stats: {
    lifeLeach: rangedNumber(1, 3),
    manaLeach: rangedNumber(1, 3),
    allResists: rangedNumber(-10, -15),
  },

  getDescription(params): string {
    return getItemStatsLines(params, [
      { stat: 'lifeLeech', ranged: this.stats.lifeLeach },
      { stat: 'manaLeech', ranged: this.stats.manaLeach },
      { stat: 'allResist', ranged: this.stats.allResists },
    ]);
  },
  generateStats(params): GeneratedItemStats {
    return {
      mods: {
        lifeLeech: rollRangedNumber(this.stats.lifeLeach),
        manaLeech: rollRangedNumber(this.stats.manaLeach),
        allResist: rollRangedNumber(this.stats.allResists),
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
