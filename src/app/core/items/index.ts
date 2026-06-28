import { BehaviorSubject } from 'rxjs';
import { Character } from '../characters';
import { EntityRegistry } from '../registries';

export enum WeaponType {
  Weapon = 'weapon',
  Head = 'head-armor',
  Body = 'body-armor',
  Shield = 'shield',
  Boots = 'boots',
  Charm = 'charm',
}

export interface ItemActionStats {
  readonly baseTime: { readonly min: number; readonly max: number };
}

export interface ItemBaseAction {
  readonly name: string;
  // todo: subscribe to owner stats and update them dynamically here in method
  getStats(params: { readonly owner: Character }): ItemActionStats;
  onActionPerformed?(params: { readonly owner: Character; readonly enemy: Character }): void;
}

export interface ItemBase {
  readonly id: string;
  readonly name: string;

  readonly type: WeaponType;

  readonly actions?: ItemBaseAction[];
}

export const itemsRegistry = new EntityRegistry<ItemBase>({ name: 'Items' });

itemsRegistry.register({
  id: 'iron-sword',
  name: 'Iron Sword',
  type: WeaponType.Weapon,
  actions: [
    {
      name: 'Heavy Slash',
      getStats: ({ owner }) => ({ baseTime: { min: 1000, max: 1400 } }),
      onActionPerformed: () => {},
    },
    {
      name: 'Light Slash',
      getStats: ({ owner }) => ({ baseTime: { min: 350, max: 500 } }),
      onActionPerformed: () => {},
    },
  ],
});
itemsRegistry.register({ id: 'iron-helm', name: 'Iron Helm', type: WeaponType.Head });

// heavy sword: actions damage increased by strength, if strengh is high enough - can give block/uninterruptable status while swinging

export type ItemState = Readonly<{
  ownerCharacter: Character;
}>;

export class Item {
  readonly stateSubject$: BehaviorSubject<ItemState>;

  constructor(readonly params: { readonly base: ItemBase; readonly ownerChar: Character }) {
    this.stateSubject$ = new BehaviorSubject<ItemState>({
      ownerCharacter: params.ownerChar,
    });
  }
}
