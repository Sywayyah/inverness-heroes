import { Grid2D } from '../grid/grid';
import { Item } from '../items';
import { ReactiveValue } from '../reactive/reactive-value';

export interface ShopSlotItem {
  readonly item: Item;
}

export class ShopAreaSlot {
  readonly slotItem = new ReactiveValue<ShopSlotItem | null>(null);
}

export class ShopArea {
  readonly itemsGrid: Grid2D<ShopAreaSlot>;

  constructor(readonly params: { readonly width: number; readonly height: number }) {
    this.itemsGrid = new Grid2D({
      height: params.height,
      width: params.width,
      cellGenerator: () => new ShopAreaSlot(),
    });
  }

  getSlotsWithItems(): ShopSlotItem[] {
    const items: ShopSlotItem[] = [];

    this.itemsGrid.state.getValue().forEach((row) =>
      row.forEach((slot) => {
        const cellItem = slot.slotItem.getValue();
        if (cellItem) items.push(cellItem);
      }),
    );

    return items;
  }

  addItem(item: ShopSlotItem): void {
    this.itemsGrid.state.getValue().find((row) =>
      row.find((cell) => {
        const isEmptyCell = cell.slotItem.getValue() === null;

        if (isEmptyCell) {
          cell.slotItem.setValue(item);
        }

        return isEmptyCell;
      }),
    );
  }

  removeItem(item: ShopSlotItem): void {
    this.itemsGrid.state.getValue().find((row) =>
      row.find((cell) => {
        const cellHasItem = cell.slotItem.getValue() === item;

        if (cellHasItem) {
          cell.slotItem.setValue(null);
        }

        return cellHasItem;
      }),
    );
  }
}
