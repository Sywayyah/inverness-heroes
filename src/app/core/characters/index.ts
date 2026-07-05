import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ActivitySource,
  BothHandsActivitySource,
  LegActivitySource,
  MouthActivitySource,
  OneHandActivitySource,
} from '../activities';
import { Item, ItemBaseAction } from '../items';
import { Modifiers } from '../modifiers';
import { EntityRegistry } from '../registries';
import { MappedRecordTypes } from '../types/mappings';
import { getNRandomItems, getNRandomUniqueItems, getRandomInt } from '../utils/common';
import { Inventory } from './inventory';

export enum CharType {
  Playable,
  Neutral,
}

export interface CharacterBase {
  readonly id: string;
  readonly name: string;
  readonly description?: string;

  // neutral if not specified
  readonly type?: CharType;

  readonly baseStats: {
    readonly strength: number;
    readonly agility: number;
    readonly vitality: number;
    readonly intelligence: number;
  };

  readonly baseValues: {
    readonly health: number;
    readonly mana?: number;
  };

  // 5 x 2 if not specified
  readonly inventoryBase?: {
    readonly width: number;
    readonly height: number;
  };

  readonly baseModifiers?: Modifiers;

  readonly activitySources: ActivitySource[];

  readonly baseActivities: CharActivity[];
}

export interface CharActivity {
  readonly name: string;
  readonly sources?: ActivitySource[];
}

export const charsRegistry = new EntityRegistry<CharacterBase>({ name: 'Characters' });

const HumanActivitySources: ActivitySource[] = [
  OneHandActivitySource,
  BothHandsActivitySource,
  MouthActivitySource,
  LegActivitySource,
];

charsRegistry.register({
  id: 'char-alch',
  name: 'Alchemist',
  description: `A character well-versed in enchantment, learning and gold gaining`,
  baseStats: { agility: 2, strength: 2, vitality: 3, intelligence: 3 },
  type: CharType.Playable,

  baseValues: {
    health: 50,
    mana: 15,
  },

  inventoryBase: {
    height: 2,
    width: 8,
  },

  baseActivities: [
    { name: 'Punch', sources: [OneHandActivitySource] },
    { name: 'Kick', sources: [LegActivitySource] },
  ],

  activitySources: HumanActivitySources,
});

charsRegistry.register({
  id: 'char-paladin',
  name: 'Paladin',
  description: `Faith allows Paladings to endure countless battles`,
  baseStats: { agility: 2, intelligence: 1, strength: 3, vitality: 4 },
  type: CharType.Playable,

  baseValues: {
    health: 60,
    mana: 10,
  },

  inventoryBase: {
    width: 7,
    height: 2,
  },

  baseActivities: [
    { name: 'Punch', sources: [OneHandActivitySource] },
    { name: 'Prayer', sources: [MouthActivitySource] },
  ],

  activitySources: HumanActivitySources,
});

charsRegistry.register({
  id: 'char-bers',
  name: 'Berserk',
  description: `Berserk turns battlefield into a whirlwind of blades`,
  type: CharType.Playable,

  baseStats: {
    agility: 4,
    intelligence: 2,
    strength: 3,
    vitality: 3,
  },

  baseValues: {
    health: 55,
    mana: 13,
  },

  inventoryBase: {
    height: 2,
    width: 6,
  },

  baseActivities: [
    { name: 'Punch', sources: [OneHandActivitySource] },
    { name: 'Kick', sources: [LegActivitySource] },
  ],

  activitySources: HumanActivitySources,
});

charsRegistry.register({
  id: 'char-ranger',
  name: 'Ranger',
  description: `Ranger uses wide variety of ranged weapons to shoot enemies down`,
  type: CharType.Playable,

  baseStats: {
    agility: 4,
    intelligence: 2,
    strength: 2,
    vitality: 2,
  },

  baseValues: {
    health: 55,
    mana: 13,
  },

  inventoryBase: {
    height: 2,
    width: 6,
  },

  baseActivities: [
    { name: 'Punch', sources: [OneHandActivitySource] },
    { name: 'Kick', sources: [LegActivitySource] },
  ],

  activitySources: HumanActivitySources,
});

charsRegistry.register({
  id: 'char-zombie',
  name: 'Zombie',
  baseStats: {
    agility: 1,
    intelligence: 0,
    strength: 2,
    vitality: 2,
  },
  baseValues: {
    health: 20,
  },
  description: 'A common undead enemy without any outstanding stats',

  baseActivities: [
    { name: 'Bite' },
    {
      name: 'Punch',
      sources: [OneHandActivitySource, BothHandsActivitySource],
    },
  ],

  activitySources: HumanActivitySources,
});

charsRegistry.register({
  id: 'char-skeleton-warrior',
  name: 'Skeleton Warrior',
  baseStats: {
    agility: 1,
    intelligence: 1,
    strength: 2,
    vitality: 2,
  },
  baseValues: {
    health: 25,
  },
  description: 'A common undead enemy without any outstanding stats',

  baseActivities: [{ name: 'Punch', sources: [OneHandActivitySource] }],

  activitySources: HumanActivitySources,
});

export interface ItemAction {
  readonly item: Item;
  readonly actions: ItemBaseAction[];
}

interface CharBattleActions {
  readonly char: { readonly activity: CharActivity };
  readonly item: { readonly item: Item; readonly action: ItemBaseAction };
}

export type CharBattleAction = MappedRecordTypes<CharBattleActions>;

export class Character {
  readonly stateSubject$ = new BehaviorSubject({
    maxHealth: 0,
    health: 0,
    maxMana: 0,
    mana: 0,
  });

  readonly statsSubject$ = new BehaviorSubject({
    strength: 0,
    agility: 0,
    vitality: 0,
    intelligence: 0,
  });

  readonly inventory: Inventory;

  readonly battleActions$ = new BehaviorSubject<{
    battleActions: CharBattleAction[];
  }>({
    battleActions: [],
  });

  readonly rerollsLeft = signal(1);

  get base(): CharacterBase {
    return this.params.base;
  }

  constructor(readonly params: { readonly base: CharacterBase }) {
    const health = params.base.baseValues.health;
    const mana = params.base.baseValues.mana ?? 0;

    this.stateSubject$.next({
      health: health,
      maxHealth: health,
      mana,
      maxMana: mana,
    });

    this.statsSubject$.next(params.base.baseStats);

    this.inventory = new Inventory({
      width: params.base.inventoryBase?.width ?? 5,
      height: params.base.inventoryBase?.height ?? 2,
    });
  }

  initBattle(): void {
    this.rerollsLeft.set(1);
  }

  initActions(params: { readonly actionPoints: number }): void {
    const itemsWithActions = this.inventory.getItems().filter((item) => item.base.actions?.length);
    const itemActions = itemsWithActions.flatMap((item) =>
      item.base.actions!.map((action) => ({ item, action })),
    );

    const randomItemActions = getNRandomItems(itemActions, 5);

    const charActivities = this.params.base.baseActivities;

    const randomCharActivities = getNRandomItems(charActivities, getRandomInt(2, 4));

    const finalList: CharBattleAction[] = [
      ...randomItemActions.map((itemAction): CharBattleAction => ({
        type: 'item',
        params: itemAction,
      })),
      ...randomCharActivities.map((charActivity): CharBattleAction => ({
        type: 'char',
        params: { activity: charActivity },
      })),
    ];

    const randomizedFinalList = getNRandomUniqueItems(finalList, 6);
    this.battleActions$.next({ battleActions: randomizedFinalList });
  }
}
