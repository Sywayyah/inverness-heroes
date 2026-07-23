import { signal, WritableSignal } from '@angular/core';
import {
  Activity,
  ActivitySource,
  BaseAction,
  LegActivitySource,
  MouthActivitySource,
  OneHandActivitySource,
  TwoHandsActivitySource,
} from '../activities';
import { ActionsApi } from '../api';
import { Item } from '../items';
import { Modifiers } from '../modifiers';
import { ModGroup } from '../modifiers/mod-group';
import { Player } from '../player';
import { ReactiveList } from '../reactive/reactive-list';
import { ReactiveState } from '../reactive/reactive-state';
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

export enum ActionActivationType {
  Instant,
  Target,
  ItemTarget,
}

// todo: introduce class? maybe even subclasses
export interface BattleMetaActionBase {
  readonly title: string;
  getDescription(): string;
  readonly activationType: ActionActivationType;
  onInstantActivation?(params: {
    readonly player: Player;
    readonly ownerChar: Character;
    readonly actions: ActionsApi;
  }): void;
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

  readonly baseActions?: BattleMetaActionBase[];

  readonly baseModifiers?: Modifiers;

  // todo: not sure if needed
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
          getRequirements() {
            return { actionPoints: 1 };
          },
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
          getRequirements() {
            return { actionPoints: 2 };
          },
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

  baseActions: [
    {
      title: 'Heal',
      activationType: ActionActivationType.Instant,
      getDescription() {
        return `Heal 3-6 health, cost: 2 action points`;
      },
      onInstantActivation({ ownerChar, actions }) {
        const actionPointsCost = 2;
        if (ownerChar.battleState.getValue().actionPoints < actionPointsCost) {
          return;
        }
        actions.healCharacter({ char: ownerChar, health: getRandomInt(3, 6) });
        ownerChar.battleState.patchWith((state) => ({
          actionPoints: state.actionPoints - actionPointsCost,
        }));
      },
    },
  ],

  baseActivities: [
    {
      name: 'Punch',
      imgSrc: 'images/common/action.png',

      sources: [
        {
          source: OneHandActivitySource,
          stats: { minDamage: 4, maxDamage: 9, accuracy: rangedNumber(30, 40) },
          getRequirements() {
            return { actionPoints: 2 };
          },
        },
      ],
    },
    {
      name: 'Prayer',
      imgSrc: 'images/common/mind-action.png',
      sources: [
        {
          source: MouthActivitySource,
          getRequirements() {
            return { actionPoints: 1 };
          },
        },
      ],
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
          getRequirements() {
            return { actionPoints: 1 };
          },
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
          getRequirements() {
            return { actionPoints: 3 };
          },
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
          getRequirements() {
            return { actionPoints: 1 };
          },
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
          getRequirements() {
            return { actionPoints: 2 };
          },
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
          getRequirements() {
            return { actionPoints: 2 };
          },
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
          getRequirements() {
            return { actionPoints: 1 };
          },
        },
        {
          source: TwoHandsActivitySource,
          stats: { minDamage: 4, maxDamage: 7, accuracy: rangedNumber(15, 25) },
          getRequirements() {
            return { actionPoints: 2 };
          },
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
          getRequirements() {
            return { actionPoints: 2 };
          },
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

export type CharBattleAction = MappedRecordTypes<CharBattleActions> & {
  readonly requirements: { readonly actionPoints: number };
  readonly isSelected: WritableSignal<boolean>;
};

export class Character {
  readonly charState = new ReactiveState({
    maxHealth: 0,
    health: 0,
    maxMana: 0,
    mana: 0,
    level: 1,
    maxLevel: 99,
  });

  readonly statsState = new ReactiveState({
    strength: 0,
    agility: 0,
    vitality: 0,
    intelligence: 0,
  });

  readonly inventory: Inventory;

  readonly battleActions = new ReactiveState<{
    readonly battleActions: CharBattleAction[];
    readonly metaActions: BattleMetaActionBase[];
  }>({
    battleActions: [],
    metaActions: [],
  });

  readonly battleState = new ReactiveState<{ actionPoints: number }>({ actionPoints: 10 });
  // readonly battleSelectedActions = new ReactiveList<CharBattleAction>();

  readonly rerollsLeft = signal(1);

  readonly spells = new ReactiveList<Spell>();

  readonly mods = new ModGroup<Modifiers>();

  readonly messages = new ReactiveList<string>();

  get base(): CharacterBase {
    return this.params.base;
  }

  constructor(readonly params: { readonly base: CharacterBase }) {
    const health = params.base.baseValues.health;
    const mana = params.base.baseValues.mana ?? 0;

    this.charState.setValue({
      health: health,
      maxHealth: health,
      mana,
      maxMana: mana,
      level: 1,
      maxLevel: 99,
    });

    this.statsState.setValue(params.base.baseStats);

    this.inventory = new Inventory({
      width: params.base.inventoryBase?.width ?? 5,
      height: params.base.inventoryBase?.height ?? 2,
      onItemAdded: (item) => {
        this.mods.addParentGroup(item.mods);
      },
      onItemRemoved: (item) => {
        this.mods.removeParentGroup(item.mods);
      },
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

  initActions(): void {
    this.battleState.patch({ actionPoints: 10 });
    this.battleActions.patch({ metaActions: this.base.baseActions });

    const itemsWithActions = this.inventory.getItems().filter((item) => item.base.actions?.length);
    const itemActions = itemsWithActions.flatMap((item) =>
      item.base.actions!.map((action) => ({ item, action })),
    );

    const randomItemActions = getNRandomItems(itemActions, 5);

    const charActivities = this.params.base.baseActivities;

    const randomCharActivities = getNRandomItems(charActivities, getRandomInt(2, 4));

    const randomSpells = getNRandomItems(this.spells.getValue(), getRandomInt(0, 3));

    const finalList: CharBattleAction[] = [
      ...randomItemActions.map((itemAction): CharBattleAction => {
        const source = getRandomItem(itemAction.action.sources ?? []);
        return {
          type: 'item',
          params: { ...itemAction, source: source },
          requirements: {
            actionPoints:
              source?.getRequirements?.({ item: itemAction.item, ownerChar: this }).actionPoints ??
              0,
          },
          isSelected: signal(false),
        };
      }),
      ...randomCharActivities.map((charActivity): CharBattleAction => {
        const source = getRandomItem(charActivity.sources ?? []);
        return {
          type: 'char',
          params: {
            action: charActivity,
            activity: source,
          },
          requirements: {
            actionPoints: source?.getRequirements?.({ ownerChar: this }).actionPoints ?? 0,
          },
          isSelected: signal(false),
        };
      }),
      ...randomSpells.map((spell): CharBattleAction => ({
        type: 'charSpell',
        params: { spell },
        requirements: {
          actionPoints:
            spell.base.getRequirements?.({ ownerChar: this, spell: spell }).actionPoints ?? 0,
        },
        isSelected: signal(false),
      })),
    ];

    const randomizedFinalList = getNRandomUniqueItems(finalList, 6);
    this.battleActions.patch({ battleActions: randomizedFinalList });
  }

  toggleBattleActionSelected(action: CharBattleAction): void {
    if (!action.isSelected()) {
      if (this.battleState.getValue().actionPoints >= (action.requirements.actionPoints ?? 0)) {
        this.addBattleAction(action);
      }
    } else {
      this.removeBattleAction(action);
    }
  }

  addBattleAction(action: CharBattleAction): void {
    action.isSelected.set(true);
    this.battleState.patchWith((state) => ({
      actionPoints: state.actionPoints - (action.requirements.actionPoints ?? 0),
    }));
  }

  removeBattleAction(action: CharBattleAction): void {
    action.isSelected.set(false);
    this.battleState.patchWith((state) => ({
      actionPoints: state.actionPoints + (action.requirements.actionPoints ?? 0),
    }));
  }
}
