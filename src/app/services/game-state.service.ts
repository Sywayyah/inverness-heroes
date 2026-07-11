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
  readonly activeArea = signal<GameArea | null>(null);

  constructor() {}

  getEnemyOfThePlayer(player: Player): Player {
    return this.enemyPlayersMap.get(player)!;
  }
}
