import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Activity,
  ActivitySource,
  BaseAction,
  LegActivitySource,
  MouthActivitySource,
  OneHandActivitySource,
  TwoHandsActivitySource,
} from '../activities';
import { Item } from '../items';
import { Modifiers } from '../modifiers';
import { ReactiveList } from '../reactive/reactive-list';
import { EntityRegistry } from '../registries';
import { Spell, spellsRegistry } from '../spells';
import { MappedRecordTypes } from '../types/mappings';
import { rangedNumber } from '../types/ranged';
import {
  getNRandomItems,
  getNRandomUniqueItems,
  getRandomInt,
  getRandomItem,
} from '../utils/common';
import { Inventory } from './inventory';

export enum CharType {
  Playable,
  Neutral,
}

export interface CharacterBase {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly imgSrc: string;

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

  readonly baseActivities: BaseAction[];

  readonly spells?: string[];
}

export const charsRegistry = new EntityRegistry<CharacterBase>({ name: 'Characters' });

const HumanActivitySources: ActivitySource[] = [
  OneHandActivitySource,
  TwoHandsActivitySource,
  MouthActivitySource,
  LegActivitySource,
];

charsRegistry.register({
  id: 'char-alch',
  name: 'Alchemist',
  description: `A character well-versed in enchantment, learning and gold gaining`,
  baseStats: { agility: 2, strength: 2, vitality: 3, intelligence: 3 },
  type: CharType.Playable,
  imgSrc: 'images/units/alchemist.png',

  baseValues: {
    health: 50,
    mana: 15,
  },

  inventoryBase: {
    height: 2,
    width: 8,
  },

  baseActivities: [
    {
      name: 'Punch',
      imgSrc: 'images/common/action.png',
      sources: [
        {
          source: OneHandActivitySource,
          stats: { minDamage: 3, maxDamage: 5, accuracy: rangedNumber(25, 40) },
        },
      ],
    },
    {
      name: 'Kick',
      imgSrc: 'images/common/speed.png',

      sources: [
        {
          source: LegActivitySource,
          stats: { minDamage: 5, maxDamage: 8, accuracy: rangedNumber(30, 45) },
        },
      ],
    },
  ],

  activitySources: HumanActivitySources,

  spells: ['corrosive-fog'],
});

charsRegistry.register({
  id: 'char-paladin',
  name: 'Paladin',
  imgSrc: 'images/units/knight.png',

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
    {
      name: 'Punch',
      imgSrc: 'images/common/action.png',

      sources: [
        {
          source: OneHandActivitySource,
          stats: { minDamage: 4, maxDamage: 9, accuracy: rangedNumber(30, 40) },
        },
      ],
    },
    {
      name: 'Prayer',
      imgSrc: 'images/common/mind-action.png',
      sources: [{ source: MouthActivitySource }],
    },
  ],

  activitySources: HumanActivitySources,
  spells: ['heal', 'firebolt'],
});

charsRegistry.register({
  id: 'char-bers',
  name: 'Berserk',
  imgSrc: 'images/units/berserk.png',

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
    {
      name: 'Punch',
      imgSrc: 'images/common/action.png',
      sources: [
        {
          source: OneHandActivitySource,
          stats: { minDamage: 4, maxDamage: 7, accuracy: rangedNumber(35, 45) },
        },
      ],
    },
    {
      name: 'Kick',
      imgSrc: 'images/common/speed.png',
      sources: [
        {
          source: LegActivitySource,

          stats: { minDamage: 6, maxDamage: 8, accuracy: rangedNumber(40, 45) },
        },
      ],
    },
  ],

  activitySources: HumanActivitySources,

  spells: ['heal'],
});

charsRegistry.register({
  id: 'char-ranger',
  name: 'Ranger',
  description: `Ranger uses wide variety of ranged weapons to shoot enemies down`,
  type: CharType.Playable,
  imgSrc: 'images/units/ranger.png',

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
    {
      name: 'Punch',
      imgSrc: 'images/common/action.png',
      sources: [
        {
          source: OneHandActivitySource,
          stats: { minDamage: 3, maxDamage: 4, accuracy: rangedNumber(20, 25) },
        },
      ],
    },
    {
      name: 'Kick',
      imgSrc: 'images/common/speed.png',
      sources: [
        {
          source: LegActivitySource,
          stats: { minDamage: 3, maxDamage: 6, accuracy: rangedNumber(25, 30) },
        },
      ],
    },
  ],

  activitySources: HumanActivitySources,

  spells: ['firebolt'],
});

charsRegistry.register({
  id: 'char-zombie',
  name: 'Zombie',
  imgSrc: 'images/units/zombie.png',

  baseStats: {
    agility: 1,
    intelligence: 0,
    strength: 2,
    vitality: 2,
  },
  baseValues: {
    health: 25,
  },
  description: 'A common undead enemy without any outstanding stats',

  baseActivities: [
    {
      name: 'Bite',
      imgSrc: 'images/common/claw-attack.png',
      sources: [
        {
          source: MouthActivitySource,
          stats: { minDamage: rangedNumber(1, 3), maxDamage: rangedNumber(3, 4) },
        },
      ],
    },
    {
      name: 'Punch',
      imgSrc: 'images/common/action.png',

      sources: [
        {
          source: OneHandActivitySource,
          stats: { minDamage: 3, maxDamage: 5, accuracy: rangedNumber(10, 20) },
        },
        {
          source: TwoHandsActivitySource,
          stats: { minDamage: 4, maxDamage: 7, accuracy: rangedNumber(15, 25) },
        },
      ],
    },
  ],

  activitySources: HumanActivitySources,
});

charsRegistry.register({
  id: 'char-skeleton-warrior',
  name: 'Skeleton Warrior',
  imgSrc: 'images/units/skeleton.png',

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

  baseActivities: [
    {
      name: 'Punch',
      imgSrc: 'images/common/action.png',

      sources: [
        {
          source: OneHandActivitySource,
          stats: { minDamage: 3, maxDamage: 6, accuracy: rangedNumber(30, 35) },
        },
      ],
    },
  ],

  activitySources: HumanActivitySources,
});

interface CharBattleActions {
  readonly charSpell: { readonly spell: Spell };
  readonly char: {
    readonly action: BaseAction;
    readonly activity?: Activity;
  };
  readonly item: {
    readonly item: Item;
    readonly action: BaseAction;
    readonly source?: Activity;
  };
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

  readonly spells = new ReactiveList<Spell>();

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

    const spells = this.base.spells?.map(
      (spellId) => new Spell({ base: spellsRegistry.getEntityById(spellId), initialLevel: 1 }),
    );

    if (spells) {
      this.spells.setValue(spells);
    }
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

    const randomSpells = getNRandomItems(this.spells.getValue(), getRandomInt(0, 3));

    const finalList: CharBattleAction[] = [
      ...randomItemActions.map((itemAction): CharBattleAction => ({
        type: 'item',
        params: { ...itemAction, source: getRandomItem(itemAction.action.sources ?? []) },
      })),
      ...randomCharActivities.map((charActivity): CharBattleAction => ({
        type: 'char',
        params: {
          action: charActivity,
          activity: getRandomItem(charActivity.sources ?? []),
        },
      })),
      ...randomSpells.map((spell): CharBattleAction => ({ type: 'charSpell', params: { spell } })),
    ];

    const randomizedFinalList = getNRandomUniqueItems(finalList, 6);
    this.battleActions$.next({ battleActions: randomizedFinalList });
  }
}
