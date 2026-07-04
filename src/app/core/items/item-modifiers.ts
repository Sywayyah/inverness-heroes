import { Item } from '.';
import { Modifiers } from '../modifiers';
import { EntityRegistry } from '../registries';
import { formattedRangedValue, RangedNumber, rangedValue, rollRangedValue } from '../types/ranged';

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

  stats: { mana: rangedValue(2, 6) },

  getDescription(): string {
    return `Mana: ${formattedRangedValue(this.stats.mana)}`;
  },
  generateStats(item): GeneratedItemStats {
    return { mods: { mana: rollRangedValue(this.stats.mana) } };
  },
});

itemModifiersRegistry.register({
  id: 'weapon-sharpness',
  title: 'Sharpness',
  itemLevel: [1, 10],

  stats: {
    enhancedDamage: rangedValue(10, 40),
  },

  getDescription(item): string {
    return `Enhanced Damage: ${formattedRangedValue(this.stats.enhancedDamage)}%`;
  },
  generateStats(item): GeneratedItemStats {
    return { mods: { enhancedDamage: rollRangedValue(this.stats.enhancedDamage) } };
  },
});

itemModifiersRegistry.register({
  id: 'weapon-bat-form',
  title: 'Batform',
  itemLevel: [1, 15],

  stats: {
    lifeLeach: rangedValue(1, 3),
    manaLeach: rangedValue(1, 3),
    allResists: rangedValue(-10, -10),
  },

  getDescription(params): string {
    return [
      `Life Leach: ${formattedRangedValue(this.stats.lifeLeach)}%`,
      `Mana Leach: ${formattedRangedValue(this.stats.manaLeach)}%`,
      `All Resists: ${formattedRangedValue(this.stats.allResists)}%`,
    ].join('\n');
  },
  generateStats(params): GeneratedItemStats {
    return {
      mods: {
        lifeLeach: rollRangedValue(this.stats.lifeLeach),
        manaLeach: rollRangedValue(this.stats.manaLeach),
        allResist: rollRangedValue(this.stats.allResists),
      },
    };
  },
});
