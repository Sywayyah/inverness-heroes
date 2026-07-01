import { BehaviorSubject } from 'rxjs';
import { Item } from '../items';

export class InventorySlot {
  readonly slot$ = new BehaviorSubject<Item | null>(null);
}

export class Inventory {
  // rows of cells
  readonly state$ = new BehaviorSubject<InventorySlot[][]>([]);

  readonly itemsSet = new Set<Item>();

  constructor(readonly params: { readonly width: number; readonly height: number }) {
    this.state$.next(
      Array.from({ length: params.height }, (_, i) =>
        Array.from({ length: params.width }, () => new InventorySlot()),
      ),
    );
  }

  getItems(): Item[] {
    return [...this.itemsSet];
  }

  // adds item to first empty slot
  addItem(item: Item): void {
    if (this.itemsSet.has(item)) {
      console.warn('Inventory already has item', item);
      return;
    }

    const rowWithEmptyCell = this.state$.getValue().find((row) =>
      row.find((cell) => {
        const isEmptyCell = cell.slot$.getValue() === null;

        if (isEmptyCell) {
          cell.slot$.next(item);
          this.itemsSet.add(item);
        }

        return isEmptyCell;
      }),
    );

    if (!rowWithEmptyCell) {
      console.warn('No empty cells in inventory, cannot add ', item);
    }

    this.notify();
  }

  // removes item instance from inventory
  removeItem(item: Item): void {
    if (!this.itemsSet.has(item)) {
      console.warn('Inventory has no item to remove', item);
      return;
    }

    const rowWithItem = this.state$.getValue().find((row) =>
      row.find((cell) => {
        const slotHasItem = cell.slot$.getValue() === item;

        if (slotHasItem) {
          cell.slot$.next(null);
          this.itemsSet.delete(item);
        }

        return slotHasItem;
      }),
    );

    if (!rowWithItem) {
      console.warn('Failed to find item to remove');
    }

    this.notify();
  }

  notify(): void {
    // basic reemit to notify about change
    this.state$.next(this.state$.getValue());
  }
}
