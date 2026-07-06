import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Battle } from '../../core/battle';
import { Character, CharBattleAction } from '../../core/characters';
import { Player } from '../../core/player';
import { shuffleArray } from '../../core/utils/arrays';
import { GameStateService } from '../../services/game-state.service';
import { take, timer } from 'rxjs';
import { ReactiveList } from '../../core/reactive/reactive-list';
import { ItemIcon } from "../../shared/components/item-icon/item-icon";

class BattleAction {
  readonly performed = signal(false);
  // todo: action level descriptions?

  constructor(
    readonly player: Player,
    readonly char: Character,
    readonly activity: CharBattleAction,
  ) {}
}

@Component({
  selector: 'app-game-battle',
  imports: [AsyncPipe, ItemIcon],
  templateUrl: './game-battle.html',
  styleUrl: './game-battle.scss',
})
export class GameBattle {
  readonly gameStateService = inject(GameStateService);

  readonly battle = new Battle();

  readonly battleActions = signal<BattleAction[]>([]);

  readonly round = signal(0);
  readonly isFightInProgress = signal(false);

  readonly history = new ReactiveList<string>();

  constructor() {
    this.initCharActions();
  }

  initCharActions(): void {
    this.gameStateService.enemyPlayersMap.forEach((player) => {
      player.chars.getValue().forEach((char) => char.initActions({ actionPoints: 10 }));
    });
  }

  beginFight(): void {
    this.round.update((val) => val + 1);

    const battleActions: BattleAction[] = [];
    this.gameStateService.players.forEach((player) => {
      player.chars.getValue().forEach((char) => {
        char.battleActions$.getValue().battleActions.forEach((action) => {
          battleActions.push(new BattleAction(player, char, action));
        });
      });
    });
    const shuffledActions = shuffleArray(battleActions);
    this.battleActions.set(shuffledActions);
    this.isFightInProgress.set(true);

    timer(500, 500)
      .pipe(take(shuffledActions.length))
      .subscribe({
        next: (i) => {
          shuffledActions[i].performed.set(true);
        },
        complete: () => {
          this.isFightInProgress.set(false);
          this.initCharActions();
        },
      });
  }

  rerollCharActions(char: Character) {
    char.initActions({ actionPoints: 10 });
    char.rerollsLeft.update((rerolls) => rerolls - 1);
  }
}
