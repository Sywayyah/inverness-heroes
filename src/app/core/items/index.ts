import { BehaviorSubject } from 'rxjs';
import { BaseAction, TwoHandsActivitySource, OneHandActivitySource } from '../activities';
import { Character } from '../characters';
import { Modifiers } from '../modifiers';
import { ModGroup } from '../modifiers/mod-group';
import { ReactiveList } from '../reactive/reactive-list';
import { EntityRegistry } from '../registries';
import { RangedNumber, rangedNumber, rollRangedNumber } from '../types/ranged';
import { ItemModifiers } from './item-modifiers';

export enum WeaponType {
  Weapon = 'weapon',

  Head = 'head-armor',
  Body = 'body-armor',
  Boots = 'boots',
  Gloves = 'gloves',

  Shield = 'shield',

  Charm = 'charm',
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

  readonly type: WeaponType;
  // if not specified - item never breaks
  readonly durability?: RangedNumber;
  readonly itemStats?: ItemBaseStats;

  readonly actions?: BaseAction[];
}

export const itemsRegistry = new EntityRegistry<ItemBase>({ name: 'Items' });

itemsRegistry.register({
  id: 'two-handed-sword',
  name: 'Two-Handed Sword',
  type: WeaponType.Weapon,
  durability: [25, 30],
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
  type: WeaponType.Head,
  itemStats: {
    defence: rangedNumber(6, 10),
  },
});

itemsRegistry.register({
  id: 'shield',
  durability: [20, 30],
  name: 'Shield',
  type: WeaponType.Shield,
  itemStats: {
    defence: rangedNumber(10, 13),
  },
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
  type: WeaponType.Weapon,
  itemStats: {
    minDamage: rangedNumber(10),
    maxDamage: rangedNumber(16),
  },
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

itemsRegistry.register({ id: 'candle', name: 'Candle', type: WeaponType.Charm });

// heavy sword: actions damage increased by strength, if strengh is high enough - can give block/uninterruptable status while swinging

export type ItemState = Readonly<{
  ownerCharacter: Character;
  durability: number;
  maxDurability: number;
}>;

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

  constructor(readonly params: { readonly base: ItemBase; readonly ownerChar: Character }) {
    const durability = params.base.durability ? rollRangedNumber(params.base.durability) : Infinity;
    this.stateSubject$ = new BehaviorSubject<ItemState>({
      ownerCharacter: params.ownerChar,
      durability: durability,
      maxDurability: durability,
    });
  }
}
