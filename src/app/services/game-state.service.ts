import { Service, signal, WritableSignal } from '@angular/core';
import { GameArea, GameAreaRoom } from '../core/locations/game-area';
import { Player } from '../core/player';

@Service()
export class GameStateService {
  readonly mainPlayer = new Player({
    defaultName: 'Player',
    color: '#ff000069',
    controlable: true,
  });
  readonly neutralPlayer = new Player({ defaultName: 'Neutral', color: '#80808080' });

  readonly players = [this.mainPlayer, this.neutralPlayer];

  readonly enemyPlayersMap = new Map<Player, Player>([
    [this.mainPlayer, this.neutralPlayer],
    [this.neutralPlayer, this.mainPlayer],
  ]);

  readonly areas: GameArea[] = [];
  readonly activeArea: WritableSignal<GameArea>;

  constructor() {
    const mainArea = new GameArea({
      height: 7,
      width: 7,
      areaName: 'Dungeon',
      defaultCellBgImage: 'images/tiles/black-area.png',
    });
    mainArea.setCellsBgImg({
      fromX: 1,
      fromY: 1,
      toX: 6,
      toY: 6,
      image: 'images/tiles/small-rocks.png',
    });

    mainArea.addRoom({
      x: 1,
      y: 1,
      room: new GameAreaRoom({ img: 'images/units/zombie.png', name: 'Prison Cell' }),
    });

    this.areas.push(mainArea);
    this.activeArea = signal(mainArea);
  }

  getEnemyOfThePlayer(player: Player): Player {
    return this.enemyPlayersMap.get(player)!;
  }
}
