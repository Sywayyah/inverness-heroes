import { Service } from '@angular/core';
import { Player } from '../core/player';

@Service()
export class GameStateService {
  readonly mainPlayer = new Player();
  readonly neutralPlayer = new Player();

  readonly players = [this.mainPlayer, this.neutralPlayer];

  readonly enemyPlayersMap = new Map<Player, Player>([
    [this.mainPlayer, this.neutralPlayer],
    [this.neutralPlayer, this.mainPlayer],
  ]);
}
