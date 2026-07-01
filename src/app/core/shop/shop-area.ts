import { BehaviorSubject } from 'rxjs';
import { Grid2D } from '../grid/grid';
import { Item } from '../items';

export interface ShopSlotItem {
  readonly item: Item;
  readonly goldCost: number;
}

export class ShopAreaSlot {
  readonly cell$ = new BehaviorSubject<ShopSlotItem | null>(null);
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

  addItem(item: ShopSlotItem): void {
    this.itemsGrid.state$.getValue().find((row) =>
      row.find((cell) => {
        const isEmptyCell = cell.cell$.getValue() === null;

        if (isEmptyCell) {
          cell.cell$.next(item);
        }

        return isEmptyCell;
      }),
    );
  }

  removeItem(item: ShopSlotItem): void {
    this.itemsGrid.state$.getValue().find((row) =>
      row.find((cell) => {
        const cellHasItem = cell.cell$.getValue() === item;

        if (cellHasItem) {
          cell.cell$.next(null);
        }

        return cellHasItem;
      }),
    );
  }
}
