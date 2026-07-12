import { signal } from '@angular/core';
import { Grid2D } from '../grid/grid';
import { ReactiveList } from '../reactive/reactive-list';

enum AreaObjectType {
  Enemy,
  Shop,
  Decoration,
}

export class AreaObject {
  readonly completed = signal(false);

  constructor(
    readonly params: {
      readonly img: string;
      readonly name: string;
      onClick?(params: { readonly selfObject: AreaObject }): void;
    },
  ) {}
}

export class GameAreaCell {
  readonly backgroundImg = signal<string>('');
  readonly areaObject = signal<AreaObject | null>(null);

  constructor(params: { readonly bgImage?: string }) {
    this.backgroundImg.set(params.bgImage ?? '');
  }
}

interface AreaObjectModel {
  readonly x: number;
  readonly y: number;
  readonly object: AreaObject;
}

export class GameArea {
  readonly cells: Grid2D<GameAreaCell>;

  readonly rooms = new ReactiveList<AreaObjectModel>();

  constructor(
    readonly params: {
      readonly width: number;
      readonly height: number;
      readonly areaName: string;
      readonly defaultCellBgImage?: string;
    },
  ) {
    this.cells = new Grid2D({
      width: params.width,
      height: params.height,
      cellGenerator: () => new GameAreaCell({ bgImage: params.defaultCellBgImage }),
    });
  }

  addAreaObject(data: AreaObjectModel): void {
    this.rooms.push(data);
    this.cells.getXYCell(data.x, data.y).areaObject.set(data.object);
  }

  setCellsBgImg({
    fromX,
    fromY,
    toX,
    toY,
    image,
  }: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    image: string;
  }): void {
    for (let x = fromX; x < toX; x++) {
      for (let y = fromY; y < toY; y++) {
        this.cells.getXYCell(x, y).backgroundImg.set(image);
      }
    }
  }
}
