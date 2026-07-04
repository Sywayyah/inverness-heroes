import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Character, ItemAction } from '../../core/characters';
import { Item, ItemBaseAction } from '../../core/items';
import { Player } from '../../core/player';
import { GameStateService } from '../../services/game-state.service';
import { ActivitySource } from '../../core/activities';
import { Battle } from '../../core/battle';

@Component({
  selector: 'app-game-battle',
  imports: [AsyncPipe],
  templateUrl: './game-battle.html',
  styleUrl: './game-battle.scss',
})
export class GameBattle {
  readonly gameStateService = inject(GameStateService);

  readonly battle = new Battle();

  constructor() {
    this.initFight();
  }

  initFight(): void {
    this.gameStateService.enemyPlayersMap.forEach((player) => {
      player.chars.getValue().forEach((char) => char.initActions({ actionPoints: 10 }));
    });
  }

  beginFight(): void {}

  rerollCharActions(char: Character) {
    char.initActions({ actionPoints: 10 });
    char.rerollsLeft.update((rerolls) => rerolls - 1);
  }
}
