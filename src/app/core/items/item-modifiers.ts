import { Item } from '.';
import { Modifiers } from '../modifiers';
import { EntityRegistry } from '../registries';
import { formattedRangedNumber, RangedNumber, rangedNumber, rollRangedNumber } from '../types/ranged';

interface GeneratedItemStats {
  readonly mods: Modifiers;
}

type GenerateItemModsParams = { readonly item: Item };

type ItemModifiersDescriptionParams = { readonly item?: Item };

export interface ItemModifiers {
  readonly id: string;
  readonly title: string;
  readonly itemLevel: RangedNumber;
  generateStats(params: GenerateItemModsParams): GeneratedItemStats;
  getDescription(params: ItemModifiersDescriptionParams): string;
}

export const itemModifiersRegistry = new EntityRegistry<ItemModifiers>({ name: 'items modifiers' });

itemModifiersRegistry.register({
  id: 'armor-apprentice',
  title: 'Apprentice',
  itemLevel: [1, 10],

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
  itemLevel: [1, 10],

  stats: {
    enhancedDamage: rangedNumber(10, 40),
  },

  getDescription(item): string {
    return `Enhanced Damage: ${formattedRangedNumber(this.stats.enhancedDamage)}%`;
  },
  generateStats(item): GeneratedItemStats {
    return { mods: { enhancedDamage: rollRangedNumber(this.stats.enhancedDamage) } };
  },
});

itemModifiersRegistry.register({
  id: 'weapon-bat-form',
  title: 'Batform',
  itemLevel: [1, 15],

  stats: {
    lifeLeach: rangedNumber(1, 3),
    manaLeach: rangedNumber(1, 3),
    allResists: rangedNumber(-10, -10),
  },

  getDescription(params): string {
    return [
      `Life Leach: ${formattedRangedNumber(this.stats.lifeLeach)}%`,
      `Mana Leach: ${formattedRangedNumber(this.stats.manaLeach)}%`,
      `All Resists: ${formattedRangedNumber(this.stats.allResists)}%`,
    ].join('\n');
  },
  generateStats(params): GeneratedItemStats {
    return {
      mods: {
        lifeLeach: rollRangedNumber(this.stats.lifeLeach),
        manaLeach: rollRangedNumber(this.stats.manaLeach),
        allResist: rollRangedNumber(this.stats.allResists),
      },
    };
  },
});
