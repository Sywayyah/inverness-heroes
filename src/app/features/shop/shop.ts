import { Component, inject, signal } from '@angular/core';
import { View, ViewsService } from '../../services/views.service';
import { ShopArea, ShopSlotItem } from '../../core/shop/shop-area';
import { AsyncPipe } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { Item, itemsRegistry } from '../../core/items';
import { InventorySlot } from '../../core/characters/inventory';
import { getRandomInt } from '../../core/utils/common';

@Component({
  selector: 'app-shop',
  imports: [AsyncPipe],
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

  constructor() {
    const ownerChar = this.player.chars.getValue()[0];

    this.shopArea.addItem({
      goldCost: 10,
      item: new Item({ base: itemsRegistry.getEntityById('iron-sword'), ownerChar: ownerChar }),
    });
    this.shopArea.addItem({
      goldCost: 8,
      item: new Item({ ownerChar, base: itemsRegistry.getEntityById('iron-helm') }),
    });
    this.shopArea.addItem({
      goldCost: 6,
      item: new Item({ ownerChar, base: itemsRegistry.getEntityById('candle') }),
    });
  }

  handlePlayerSlotClicked(targetSlot: InventorySlot): void {
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

    if (!activeShopItem) return;

    this.player.gold.update((gold) => gold - activeShopItem.goldCost);
    this.shopArea.removeItem(activeShopItem);
    this.player.chars.getValue()[0].inventory.addItem(activeShopItem.item);
    this.activeShopItem.set(null);
  }

  sellItem(): void {
    const item = this.activePlayerSlot()?.slot$.getValue();

    if (!item) return;

    this.player.chars.getValue()[0].inventory.removeItem(item);
    this.player.gold.update((gold) => gold + getRandomInt(1, 5));
    this.activePlayerSlot.set(null);
  }

  startBattle(): void {
    this.viewsService.setActiveView(View.Battle);
  }
}
