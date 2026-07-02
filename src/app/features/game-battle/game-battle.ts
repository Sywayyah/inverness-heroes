import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { getRandomItem } from '../../core/utils/common';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-game-battle',
  imports: [AsyncPipe],
  templateUrl: './game-battle.html',
  styleUrl: './game-battle.scss',
})
export class GameBattle {
  readonly gameStateService = inject(GameStateService);

  constructor() {
    this.initFight();
  }

  initFight(): void {
    this.gameStateService.enemyPlayersMap.forEach((currentPlayer, enemyPlayer) => {
      currentPlayer.chars.getValue().forEach((char) => {
        char.initBattle(enemyPlayer);
      });
    });
  }

  beginFight(): void {}
}
