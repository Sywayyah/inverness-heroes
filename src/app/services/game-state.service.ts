import { Service } from '@angular/core';
import { Player } from '../core/player';

@Service()
export class GameStateService {
  readonly mainPlayer = new Player();
  readonly neutralPlayer = new Player();
}
