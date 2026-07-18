import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { InventorySlot } from '../../core/characters/inventory';
import { Item, itemsRegistry } from '../../core/items';
import { itemModifiersRegistry } from '../../core/items/item-modifiers';
import { ShopArea, ShopSlotItem } from '../../core/shop/shop-area';
import { getNRandomItems, getNRandomUniqueItems, getRandomInt } from '../../core/utils/common';
import { GameStateService } from '../../services/game-state.service';
import { View, ViewsService } from '../../services/views.service';
import { ItemIcon } from '../../shared/components/item-icon/item-icon';
import { rangedNumber, rollRangedNumber } from '../../core/types/ranged';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [AsyncPipe, ItemIcon, FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  readonly viewsService = inject(ViewsService);
  readonly stateService = inject(GameStateService);

  readonly shopArea = new ShopArea({ width: 4, height: 4 });
  readonly player = this.stateService.mainPlayer;

  readonly activePlayerSlot = signal<InventorySlot | null>(null);
  readonly activeShopItem = signal<ShopSlotItem | null>(null);

  readonly buyAmount = signal(1);
  readonly sellAmount = signal(1);

  constructor() {
    const ownerChar = this.player.chars.getValue()[0];
    const itemLevel = rangedNumber(1, 10);

    this.shopArea.addItem({
      item: new Item({
        base: itemsRegistry.getEntityById('two-handed-sword'),
        ownerChar: ownerChar,
        itemLevel: rollRangedNumber(itemLevel),
      }),
    });
    this.shopArea.addItem({
      item: new Item({
        ownerChar,
        base: itemsRegistry.getEntityById('iron-helm'),
        itemLevel: rollRangedNumber(itemLevel),
      }),
    });
    this.shopArea.addItem({
      item: new Item({
        ownerChar,
        base: itemsRegistry.getEntityById('candle'),
        itemLevel: rollRangedNumber(itemLevel),
      }),
    });
    this.shopArea.addItem({
      item: new Item({
        ownerChar,
        base: itemsRegistry.getEntityById('shield'),
        itemLevel: rollRangedNumber(itemLevel),
      }),
    });

    this.shopArea.addItem({
      item: new Item({
        ownerChar,
        base: itemsRegistry.getEntityById('res-wood'),
        itemLevel: 1,
        count: getRandomInt(4, 10),
      }),
    });

    getNRandomItems(itemsRegistry.entities, getRandomInt(1, 5)).forEach((itemBase) => {
      this.shopArea.addItem({
        item: new Item({ ownerChar, base: itemBase, itemLevel: rollRangedNumber(itemLevel) }),
      });
    });

    this.shopArea.getSlotsWithItems().forEach((slot) => {
      const mods = getNRandomUniqueItems(
        itemModifiersRegistry.entities,
        getRandomInt(0, Math.min(itemModifiersRegistry.entities.length, 6)),
      );

      mods.forEach((mod) => {
        const { mods } = mod.generateStats({ item: slot.item });
        slot.item.modifiersList.push({ itemModifier: mod, mods });
        slot.item.mods.addMods(mods);
      });
    });

    this.shopArea.getSlotsWithItems().forEach((slot) => {
      console.log('----');
      console.log(slot.item.base.name, slot.item.mods.getAllCombinedValues());
      slot.item.modifiersList.getValue().forEach(({ itemModifier, mods }) => {
        console.log(
          itemModifier.title,
          mods,
          itemModifier.getDescription({ item: slot.item, mods: mods }),
        );
      });
    });
  }

  handlePlayerSlotClicked(targetSlot: InventorySlot): void {
    this.sellAmount.set(1);
    const activePlayerSlot = this.activePlayerSlot();

    const slotItem = targetSlot.slot$.getValue()!;

    if (!activePlayerSlot) {
      if (!slotItem) {
        this.activePlayerSlot.set(null);
      } else {
        this.activePlayerSlot.set(targetSlot);
      }
      return;
    }

    targetSlot.slot$.next(activePlayerSlot.slot$.getValue());
    activePlayerSlot.slot$.next(slotItem);

    this.activePlayerSlot.set(null);
  }

  buyItem(): void {
    const activeShopItem = this.activeShopItem();
    const char = this.player.chars.getValue()[0];

    if (!activeShopItem) return;

    if (activeShopItem.item.isStackable) {
      activeShopItem.item.amount.update((amount) => amount - this.buyAmount());
      const existingItem = char.inventory
        .getItems()
        .find((item) => item.base.id === activeShopItem.item.base.id);
      if (existingItem) {
        existingItem.amount.update((amount) => amount + this.buyAmount());
      } else {
        const newStackableItem = new Item({
          base: activeShopItem.item.base,
          itemLevel: 1,
          ownerChar: char,
          count: this.buyAmount(),
        });
        char.inventory.addItem(newStackableItem);
      }
      if (activeShopItem.item.amount() <= 0) {
        this.shopArea.removeItem(activeShopItem);
      }
    } else {
      char.inventory.addItem(activeShopItem.item);
      this.shopArea.removeItem(activeShopItem);
    }

    this.player.gold.update((gold) => gold - activeShopItem.item.buyPrice() * this.buyAmount());

    this.activeShopItem.set(null);
  }

  sellItem(): void {
    const item = this.activePlayerSlot()?.slot$.getValue();

    if (!item) return;

    const char = this.player.chars.getValue()[0];

    if (item.isStackable) {
      item.amount.update((amount) => amount - this.sellAmount());

      if (item.amount() <= 0) {
        char.inventory.removeItem(item);
      }

      // todo: add max stack logic
      const existingItem = this.shopArea
        .getSlotsWithItems()
        .find((shopItem) => shopItem.item.base.id === item.base.id);

      if (existingItem) {
        existingItem.item.amount.update((amount) => amount + this.sellAmount());
      } else {
        const newItem = new Item({
          base: item.base,
          itemLevel: 1,
          ownerChar: char,
          count: this.sellAmount(),
        });
        this.shopArea.addItem({ item: newItem });
      }
    } else {
      this.shopArea.addItem({ item: item });
      char.inventory.removeItem(item);
    }

    this.player.gold.update((gold) => gold + item.sellPrice() * this.sellAmount());
    this.activePlayerSlot.set(null);
  }

  goToMap(): void {
    this.viewsService.setActiveView(View.Map);
  }
}
