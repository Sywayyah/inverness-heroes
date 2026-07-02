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

  beginFight(): void {
    this.gameStateService.players.forEach((player) => {
      player.chars.getValue().forEach((char) => {
        const itemsWithActions = char.inventory.getItems().filter((item) => {
          return item.params.base.actions?.length;
        });

        const itemWithActions = getRandomItem(itemsWithActions);

        if (!itemWithActions) return;

        const action = getRandomItem(itemWithActions.params.base.actions!);

        console.log(action?.name);
      });
    });
  }
}
