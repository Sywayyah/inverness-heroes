import { Component, inject, signal } from '@angular/core';
import { View, ViewsService } from '../../services/views.service';
import { ShopArea, ShopSlotItem } from '../../core/shop/shop-area';
import { AsyncPipe } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { Item, itemsRegistry } from '../../core/items';

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
  }

  buyItem(): void {
    const activeShopItem = this.activeShopItem();

    if (!activeShopItem) return;

    this.player.gold.update((gold) => gold - activeShopItem.goldCost);
    this.shopArea.removeItem(activeShopItem);
    this.player.chars.getValue()[0].inventory.addItem(activeShopItem.item);
  }

  startBattle(): void {
    this.viewsService.setActiveView(View.Battle);
  }
}
