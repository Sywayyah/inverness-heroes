import { BehaviorSubject } from 'rxjs';
import { Modifiers } from '../modifiers';
import { EntityRegistry } from '../registries';
import { Inventory } from './inventory';
import { Player } from '../player';
import { getRandomItem } from '../utils/common';
import { Item, ItemBaseAction } from '../items';

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
}

export const charsRegistry = new EntityRegistry<CharacterBase>({ name: 'Characters' });

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
});

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

  readonly battleState$ = new BehaviorSubject<{
    readonly itemActions: { item: Item; actions: ItemBaseAction[] }[];
  }>({ itemActions: [] });

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

  initBattle(enemyPlayer: Player): void {
    const itemsWithActions = this.inventory.getItems().filter((item) => {
      return item.params.base.actions?.length;
    });

    const itemWithActions = getRandomItem(itemsWithActions);

    if (!itemWithActions) return;

    const action = getRandomItem(itemWithActions.params.base.actions!);

    console.log(action?.name);

    this.battleState$.next({
      itemActions: itemsWithActions.map((item) => ({ item, actions: item.params.base.actions! })),
    });
  }
}
