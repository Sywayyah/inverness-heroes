import { BehaviorSubject } from 'rxjs';
import { BaseAction, OneHandActivitySource, TwoHandsActivitySource } from '../activities';
import { Character } from '../characters';
import { Modifiers } from '../modifiers';
import { ModGroup } from '../modifiers/mod-group';
import { ReactiveList } from '../reactive/reactive-list';
import { EntityRegistry } from '../registries';
import {
  formattedRangedNumber,
  RangedNumber,
  rangedNumber,
  rollRangedNumber,
} from '../types/ranged';
import { ItemModifiers } from './item-modifiers';
import { signal } from '@angular/core';

export enum ItemBaseType {
  Weapon = 'weapon',

  Helm = 'helm',
  Body = 'body-armor',
  Boots = 'boots',
  Gloves = 'gloves',

  Shield = 'shield',

  Charm = 'charm',
  Ring = 'ring',
  Amulet = 'amulet',
}

export interface ItemBaseStatsModel {
  minDamage: RangedNumber;
  maxDamage: RangedNumber;
  defence: RangedNumber;
  accuracy: RangedNumber;
}

export type ItemBaseStats = Partial<Readonly<ItemBaseStatsModel>>;

export interface ItemBase {
  readonly id: string;
  readonly name: string;

  readonly type: ItemBaseType;
  // if not specified - item never breaks
  readonly durability?: RangedNumber;
  readonly itemStats?: ItemBaseStats;

  readonly buyPrice?: RangedNumber;
  // if not specified - about 3 times less than buy price
  readonly sellPrice?: RangedNumber;

  readonly actions?: BaseAction[];
}

export const itemsRegistry = new EntityRegistry<ItemBase>({ name: 'Items' });

itemsRegistry.register({
  id: 'two-handed-sword',
  name: 'Two-Handed Sword',
  type: ItemBaseType.Weapon,
  durability: rangedNumber(25, 30),

  basePrice: rangedNumber(25),

  itemStats: {
    minDamage: rangedNumber(9, 11),
    maxDamage: rangedNumber(13, 15),
    accuracy: rangedNumber(25),
  },
  actions: [
    {
      name: 'Heavy Slash',
      onActionPerformed: () => {},
      sources: [
        {
          source: OneHandActivitySource,
          stats: {
            minDamage: rangedNumber(10, 12),
            maxDamage: rangedNumber(13, 15),
            accuracy: rangedNumber(15, 30),
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            minDamage: rangedNumber(18),
            maxDamage: rangedNumber(23),
            accuracy: rangedNumber(30, 35),
          },
        },
      ],
    },
    {
      name: 'Light Slash',
      onActionPerformed: () => {},
      sources: [
        {
          source: OneHandActivitySource,
          stats: {
            accuracy: rangedNumber(27, 33),
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            accuracy: rangedNumber(36, 45),
          },
        },
      ],
    },
  ],
});

itemsRegistry.register({
  id: 'iron-helm',
  durability: [20, 30],
  name: 'Iron Helm',
  type: ItemBaseType.Helm,
  itemStats: {
    defence: rangedNumber(6, 10),
  },

  buyPrice: rangedNumber(10, 15),
});

itemsRegistry.register({
  id: 'shield',
  durability: [20, 30],
  name: 'Shield',
  type: ItemBaseType.Shield,
  itemStats: {
    defence: rangedNumber(10, 13),
  },

  buyPrice: rangedNumber(15, 22),

  actions: [
    {
      name: 'Shield Strike',
      sources: [
        {
          source: OneHandActivitySource,
          stats: {
            accuracy: rangedNumber(20, 25),
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            accuracy: rangedNumber(30, 35),
          },
        },
      ],
    },
  ],
});

itemsRegistry.register({
  id: 'crossbow',
  durability: [23, 26],
  name: 'Crossbow',
  type: ItemBaseType.Weapon,
  itemStats: {
    minDamage: rangedNumber(10),
    maxDamage: rangedNumber(16),
  },

  buyPrice: rangedNumber(13, 20),

  actions: [
    {
      name: 'Shoot',
      sources: [
        {
          source: OneHandActivitySource,
          stats: {
            accuracy: rangedNumber(15, 20),
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            accuracy: rangedNumber(30, 35),
          },
        },
      ],
    },
  ],
});

itemsRegistry.register({
  id: 'candle',
  name: 'Candle',
  type: ItemBaseType.Charm,

  buyPrice: rangedNumber(6, 8),
});

// heavy sword: actions damage increased by strength, if strengh is high enough - can give block/uninterruptable status while swinging

export type ItemState = Readonly<{
  ownerCharacter: Character;
  durability: number;
  maxDurability: number;
}>;

export interface RolledItemStatsModel {
  defence: number;
  minDamage: number;
  maxDamage: number;
}

export type RolledItemStats = Readonly<RolledItemStatsModel>;

export class Item {
  readonly stateSubject$: BehaviorSubject<ItemState>;

  readonly mods = new ModGroup<Modifiers>();

  readonly modifiersList = new ReactiveList<{
    readonly itemModifier: ItemModifiers;
    readonly mods: Modifiers;
  }>();

  get base(): ItemBase {
    return this.params.base;
  }

  readonly stats$ = new BehaviorSubject<RolledItemStats>({
    maxDamage: 0,
    minDamage: 0,
    defence: 0,
  });

  readonly buyPrice = signal(0);

  constructor(readonly params: { readonly base: ItemBase; readonly ownerChar: Character }) {
    const base = params.base;

    const durability = base.durability ? rollRangedNumber(base.durability) : Infinity;

    this.stateSubject$ = new BehaviorSubject<ItemState>({
      ownerCharacter: params.ownerChar,
      durability: durability,
      maxDurability: durability,
    });

    const itemStats = base.itemStats;

    this.stats$.next({
      minDamage: itemStats?.minDamage ? rollRangedNumber(itemStats.minDamage) : 0,
      maxDamage: itemStats?.maxDamage ? rollRangedNumber(itemStats.maxDamage) : 0,
      defence: itemStats?.defence ? rollRangedNumber(itemStats.defence) : 0,
    });

    this.buyPrice.set(rollRangedNumber(base.buyPrice ?? 10));
  }

  getDescription(): string {
    const itemStats = this.stats$.getValue();

    const damage = rangedNumber(itemStats.minDamage, itemStats.maxDamage);
    const statLines = [];

    if (damage) {
      statLines.push(`Damage: ${formattedRangedNumber(damage)}`);
    }

    if (itemStats.defence) {
      statLines.push(`Defence: ${itemStats.defence}`);
    }

    const itemState = this.stateSubject$.getValue();

    if (itemState.durability !== Infinity) {
      statLines.push(`Durability: ${itemState.durability}/${itemState.maxDurability}`);
    }

    const typeMapping: Record<ItemBaseType, string> = {
      [ItemBaseType.Helm]: 'Helm',
      [ItemBaseType.Body]: 'Body Armor',
      [ItemBaseType.Gloves]: 'Gloves',
      [ItemBaseType.Boots]: 'Boots',

      [ItemBaseType.Shield]: 'Shield',
      [ItemBaseType.Weapon]: 'Weapon',

      [ItemBaseType.Charm]: 'Charm',
      [ItemBaseType.Amulet]: 'Amulet',
      [ItemBaseType.Ring]: 'Ring',
    };

    return [
      `${this.base.name}`,
      `${typeMapping[this.base.type]}`,

      ...statLines,

      this.modifiersList
        .getValue()
        .map((modItem) => modItem.itemModifier.getDescription({ item: this, mods: modItem.mods }))
        .join('\n'),
    ].join('\n');
  }
}
