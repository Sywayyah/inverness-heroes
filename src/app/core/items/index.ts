import { EntityRegistry } from '../registries';

export enum WeaponType {
  Weapon = 'weapon',
  Head = 'head-armor',
  Body = 'body-armor',
  Shield = 'shield',
  Boots = 'boots',
  Charm = 'charm',
}

export interface ItemBase {
  readonly id: string;
  readonly name: string;

  readonly type: WeaponType;
}

export const itemsRegistry = new EntityRegistry<ItemBase>({ name: 'Items' });

itemsRegistry.register({ id: 'iron-sword', name: 'Iron Sword', type: WeaponType.Weapon });
itemsRegistry.register({ id: 'iron-helm', name: 'Iron Helm', type: WeaponType.Head });
