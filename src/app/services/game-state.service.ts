import { Service } from '@angular/core';
import { Player } from '../core/player';

@Service()
export class GameStateService {
  readonly mainPlayer = new Player({ defaultName: 'Player', color: '#ff000069', controlable: true });
  readonly neutralPlayer = new Player({ defaultName: 'Neutral', color: '#80808080' });

  readonly players = [this.mainPlayer, this.neutralPlayer];

  readonly enemyPlayersMap = new Map<Player, Player>([
    [this.mainPlayer, this.neutralPlayer],
    [this.neutralPlayer, this.mainPlayer],
  ]);
}
