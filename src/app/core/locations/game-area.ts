import { signal } from '@angular/core';
import { Grid2D } from '../grid/grid';
import { ReactiveList } from '../reactive/reactive-list';

enum RoomType {
  Enemy,
  Shop,
  Decoration,
}

export class GameAreaRoom {
  constructor(readonly params: { readonly img: string; readonly name: string }) {}
}

export class GameAreaCell {
  readonly backgroundImg = signal<string>('');
  readonly room = signal<GameAreaRoom | null>(null);

  constructor(params: { readonly bgImage?: string }) {
    this.backgroundImg.set(params.bgImage ?? '');
  }
}

interface RoomModel {
  readonly x: number;
  readonly y: number;
  readonly room: GameAreaRoom;
}

export class GameArea {
  readonly cells: Grid2D<GameAreaCell>;

  readonly rooms = new ReactiveList<RoomModel>();

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

  addRoom(data: RoomModel): void {
    this.rooms.push(data);
    this.cells.getXYCell(data.x, data.y).room.set(data.room);
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
