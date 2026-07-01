import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-game',
  imports: [AsyncPipe],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  readonly gameStateService = inject(GameStateService);

  beginFight(): void {
    this.gameStateService.players.forEach((player) => {
      player.chars.getValue().forEach((char) => {
        char.inventory.getItems().forEach((item) => {
          item.params.base.actions?.forEach(action => {});
        });
      });
    });
  }
}
