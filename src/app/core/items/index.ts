import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseAction, OneHandActivitySource, TwoHandsActivitySource } from '../activities';
import { Character } from '../characters';
import { Grid2D } from '../grid/grid';
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
import { getRandomInt, rollChance } from '../utils/common';
import { getFormattedModValues } from './configs';
import { ItemModifiers } from './item-modifiers';
import { ReactiveState } from '../reactive/reactive-state';

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

  Tool = 'tool',

  Resource = 'resource',
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
  readonly imgSrc: string;

  readonly type: ItemBaseType;
  // if not specified - item never breaks
  readonly durability?: RangedNumber;
  readonly itemStats?: ItemBaseStats;

  readonly buyPrice?: RangedNumber;
  // if not specified - about 3 times less than buy price
  readonly sellPrice?: RangedNumber;

  readonly actions?: BaseAction[];

  readonly sockets?: RangedNumber;

  readonly stackable?: boolean;
  readonly maxStackSize?: number;
}

export const itemsRegistry = new EntityRegistry<ItemBase>({ name: 'Items' });

itemsRegistry.register({
  id: 'two-handed-sword',
  name: 'Two-Handed Sword',
  type: ItemBaseType.Weapon,
  imgSrc: 'images/items/weapons/two-handed-sword.png',
  durability: rangedNumber(25, 30),

  sockets: rangedNumber(0, 3),
  buyPrice: rangedNumber(25),

  itemStats: {
    minDamage: rangedNumber(9, 11),
    maxDamage: rangedNumber(13, 15),
    accuracy: rangedNumber(25),
  },
  actions: [
    {
      name: 'Heavy Slash',
      sources: [
        {
          source: OneHandActivitySource,
          stats: {
            minDamage: rangedNumber(10, 12),
            maxDamage: rangedNumber(13, 15),
            accuracy: rangedNumber(15, 30),
          },
          getRequirements() {
            return { actionPoints: 3 };
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            minDamage: rangedNumber(18),
            maxDamage: rangedNumber(23),
            accuracy: rangedNumber(30, 35),
          },
          getRequirements() {
            return { actionPoints: 7 };
          },
        },
      ],
    },
    {
      name: 'Light Slash',
      sources: [
        {
          source: OneHandActivitySource,
          stats: {
            accuracy: rangedNumber(27, 33),
          },

          getRequirements() {
            return { actionPoints: 2 };
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            accuracy: rangedNumber(36, 45),
          },
          getRequirements() {
            return { actionPoints: 4 };
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

  sockets: rangedNumber(0, 2),
  imgSrc: 'images/items/helms/iron-helm.png',
  type: ItemBaseType.Helm,
  itemStats: {
    defence: rangedNumber(6, 10),
  },

  buyPrice: rangedNumber(10, 15),
});

itemsRegistry.register({
  id: 'shield',
  durability: [20, 30],
  name: 'Stout Shield',
  imgSrc: 'images/items/shields/stout-shield.png',

  sockets: rangedNumber(0, 2),

  type: ItemBaseType.Shield,
  itemStats: {
    defence: rangedNumber(10, 13),
    minDamage: rangedNumber(3, 4),
    maxDamage: rangedNumber(4, 6),
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
            minDamage: rangedNumber(3),
            maxDamage: rangedNumber(5, 6),
          },
          getRequirements() {
            return { actionPoints: 2 };
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            accuracy: rangedNumber(30, 35),
            minDamage: rangedNumber(4),
            maxDamage: rangedNumber(6, 8),
          },

          getRequirements() {
            return { actionPoints: 3 };
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
  sockets: rangedNumber(0, 3),

  itemStats: {
    minDamage: rangedNumber(10),
    maxDamage: rangedNumber(16),
  },
  imgSrc: 'images/items/weapons/crossbow.png',

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
          getRequirements() {
            return { actionPoints: 3 };
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: {
            accuracy: rangedNumber(30, 35),
          },
          getRequirements() {
            return { actionPoints: 5 };
          },
        },
      ],
    },
  ],
});

itemsRegistry.register({
  id: 'iron-pickaxe',
  imgSrc: 'images/items/tools/pickaxe.png',
  name: 'Pickaxe',
  type: ItemBaseType.Tool,
  buyPrice: rangedNumber(5, 10),
  durability: rangedNumber(20, 30),
});

itemsRegistry.register({
  id: 'iron-axe',
  imgSrc: 'images/items/tools/axe.png',
  name: 'Axe',
  type: ItemBaseType.Tool,
  buyPrice: rangedNumber(5, 10),
  durability: rangedNumber(20, 30),
});

itemsRegistry.register({
  id: 'candle',
  name: 'Candle',
  type: ItemBaseType.Charm,

  imgSrc: 'images/items/charms/golden-ring.png',

  buyPrice: rangedNumber(6, 8),
});

itemsRegistry.register({
  id: 'res-wood',
  name: 'Wood',
  imgSrc: 'images/resources/wood.png',
  type: ItemBaseType.Resource,

  stackable: true,
  maxStackSize: 99,

  buyPrice: 5,
  sellPrice: 2,
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

export class ItemSocket {
  readonly item$ = new BehaviorSubject<Item | null>(null);
}

export class Item {
  readonly state: ReactiveState<ItemState>;

  readonly mods = new ModGroup<Modifiers>();

  readonly modifiersList = new ReactiveList<{
    readonly itemModifier: ItemModifiers;
    readonly mods: Modifiers;
  }>();

  readonly sockets = signal(0);
  readonly socketsGrid?: Grid2D<ItemSocket>;

  get base(): ItemBase {
    return this.params.base;
  }

  readonly stats = new ReactiveState<RolledItemStats>({
    maxDamage: 0,
    minDamage: 0,
    defence: 0,
  });

  readonly buyPrice = signal(0);
  readonly sellPrice = signal(getRandomInt(1, 5));

  readonly amount = signal(1);
  readonly isStackable: boolean;
  readonly hasDurability: boolean;

  constructor(
    readonly params: {
      readonly base: ItemBase;
      readonly ownerChar: Character;
      readonly itemLevel: number;
      readonly count?: number;
    },
  ) {
    const base = params.base;
    this.isStackable = base.stackable ?? false;

    if (this.isStackable) {
      this.amount.set(params.count ?? 1);
    }

    const durability = base.durability ? rollRangedNumber(base.durability) : Infinity;
    this.hasDurability = durability !== Infinity;

    this.state = new ReactiveState<ItemState>({
      ownerCharacter: params.ownerChar,
      durability: durability,
      maxDurability: durability,
    });

    const itemStats = base.itemStats;

    const maxDamage = itemStats?.maxDamage ? rollRangedNumber(itemStats.maxDamage) : 0;
    let minDamage = itemStats?.minDamage ? rollRangedNumber(itemStats.minDamage) : 0;

    if (maxDamage && minDamage === 0) minDamage = maxDamage;

    this.stats.setValue({
      minDamage: minDamage,
      maxDamage: maxDamage,
      defence: itemStats?.defence ? rollRangedNumber(itemStats.defence) : 0,
    });

    this.setBuyPrice(rollRangedNumber(base.buyPrice ?? 10));

    if (base.sockets && rollChance(0.25)) {
      const socketsRoll = rollRangedNumber(base.sockets);
      this.sockets.set(socketsRoll);
      this.socketsGrid = new Grid2D({
        width: socketsRoll,
        height: 1,
        cellGenerator: () => new ItemSocket(),
      });
    }
  }

  setBuyPrice(price: number): void {
    this.buyPrice.set(Math.round(price));
    this.sellPrice.set(Math.round(price / 3));
  }

  getDescription(): string {
    const itemStats = this.stats.getValue();

    const damage = rangedNumber(itemStats.minDamage, itemStats.maxDamage);
    const itemStatLines = [];

    if (damage) {
      itemStatLines.push(`Damage: ${formattedRangedNumber(damage)}`);
    }

    if (itemStats.defence) {
      itemStatLines.push(`Defence: ${itemStats.defence}`);
    }

    const itemState = this.state.getValue();

    if (itemState.durability !== Infinity) {
      itemStatLines.push(`Durability: ${itemState.durability}/${itemState.maxDurability}`);
    }

    if (this.sockets()) {
      itemStatLines.push(`Sockets: ${this.sockets()}`);
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

      [ItemBaseType.Tool]: 'Tool',
      [ItemBaseType.Resource]: 'Resource',
    };

    const allMods = this.mods.getAllCombinedValues();

    const modLines = getFormattedModValues(allMods);
    if (this.base.actions) {
      itemStatLines.push('\nActions:');

      this.base.actions?.forEach((action) => {
        action.sources?.forEach((source) => {
          itemStatLines.push(`${action.name} - ${source.source.name}`);
        });
      });

      if (modLines.length) {
        itemStatLines.push('\n');
      }
    }

    // use with Alt key
    // const modifiersDescriptions = this.modifiersList
    //   .getValue()
    //   .map((modItem) => modItem.itemModifier.getDescription({ item: this, mods: modItem.mods }))
    //   .join('\n');

    return [
      `${this.base.name}`,
      `${typeMapping[this.base.type]}`,

      ...itemStatLines,

      ...modLines,
      // modifiersDescriptions,
    ].join('\n');
  }
}
