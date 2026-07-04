import { BehaviorSubject } from 'rxjs';
import { ActivitySource, BothHandsActivitySource, OneHandActivitySource } from '../activities';
import { Character } from '../characters';
import { Player } from '../player';
import { EntityRegistry } from '../registries';
import { RangedNumber, rollRangedValue } from '../types/ranged';
import { ModGroup } from '../modifiers/mod-group';
import { Modifiers } from '../modifiers';
import { ReactiveList } from '../reactive/reactive-list';
import { ItemModifiers } from './item-modifiers';

export enum WeaponType {
  Weapon = 'weapon',
  Head = 'head-armor',
  Body = 'body-armor',
  Shield = 'shield',
  Boots = 'boots',
  Charm = 'charm',
}

export interface ItemActionStats {}

export interface ItemBaseAction {
  readonly name: string;
  // todo: subscribe to owner stats and update them dynamically here in method
  getStats?(params: { readonly owner: Character }): ItemActionStats;
  onActionPerformed?(params: { readonly owner: Character; readonly enemy: Player }): void;
  onActivated?(params: { readonly ownerChar: Character; readonly enemy: Player }): void;
  onBattleInit?(params: { readonly ownerChar: Character; readonly enemy: Player }): void;
  readonly activatable?: boolean;
  readonly sources?: ActivitySource[];
}

export interface ItemBase {
  readonly id: string;
  readonly name: string;

  readonly type: WeaponType;
  // if not specified - item never breaks
  readonly durability?: RangedNumber;

  readonly actions?: ItemBaseAction[];
}

export const itemsRegistry = new EntityRegistry<ItemBase>({ name: 'Items' });

itemsRegistry.register({
  id: 'iron-sword',
  name: 'Iron Sword',
  type: WeaponType.Weapon,
  durability: [25, 30],
  actions: [
    {
      name: 'Heavy Slash',
      getStats: ({ owner }) => ({}),
      onActionPerformed: () => {},
      sources: [OneHandActivitySource, BothHandsActivitySource],
    },
    {
      name: 'Light Slash',
      getStats: ({ owner }) => ({}),
      onActionPerformed: () => {},
      sources: [OneHandActivitySource, BothHandsActivitySource],
    },
  ],
});

itemsRegistry.register({
  id: 'iron-helm',
  durability: [20, 30],
  name: 'Iron Helm',
  type: WeaponType.Head,
});

itemsRegistry.register({
  id: 'shield',
  durability: [20, 30],
  name: 'Shield',
  type: WeaponType.Shield,
  actions: [
    {
      name: 'Shield Strike',
      sources: [OneHandActivitySource, BothHandsActivitySource],
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
    const durability = params.base.durability ? rollRangedValue(params.base.durability) : Infinity;
    this.stateSubject$ = new BehaviorSubject<ItemState>({
      ownerCharacter: params.ownerChar,
      durability: durability,
      maxDurability: durability,
    });
  }
}
