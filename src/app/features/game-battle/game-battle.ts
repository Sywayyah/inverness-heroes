import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { timer } from 'rxjs';
import { Character, CharBattleAction } from '../../core/characters';
import { DamageType } from '../../core/common/damage';
import { Player } from '../../core/player';
import { ReactiveList } from '../../core/reactive/reactive-list';
import { shuffleArray } from '../../core/utils/arrays';
import { getRandomInt } from '../../core/utils/common';
import { GameStateService } from '../../services/game-state.service';
import { View, ViewsService } from '../../services/views.service';
import { ItemIcon } from '../../shared/components/item-icon/item-icon';

class BattleAction {
  readonly performed = signal(false);
  readonly history = new ReactiveList<string>();

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
  readonly viewsService = inject(ViewsService);

  readonly battleActions = signal<BattleAction[]>([]);

  readonly round = signal(0);
  readonly isFightInProgress = signal(false);

  readonly isFightOver = signal(false);
  readonly winner = signal<Player | null>(null);

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

    this.scheduleBattleTick();
  }

  scheduleBattleTick(): void {
    const action = this.battleActions().find((action) => !action.performed());

    if (!action) {
      this.isFightInProgress.set(false);
      this.initCharActions();
      return;
    }

    timer(500).subscribe(() => {
      action.performed.set(true);

      const activity = action.activity;
      switch (activity.type) {
        case 'char':
          break;
        case 'item':
          const itemStats = activity.params.item.stats$.getValue();
          const minDamage = itemStats.minDamage;
          const maxDamage = itemStats.maxDamage;

          if (maxDamage === 0) break;

          const damageDealt = getRandomInt(minDamage, maxDamage);
          action.history.push(`Dealing ${damageDealt} damage`);
          const targetChar = this.gameStateService.enemyPlayersMap
            .get(action.player)!
            .chars.getValue()[0];
          this.dealDamageTo({
            char: targetChar,
            type: DamageType.Physical,
            damage: damageDealt,
          });

          break;
      }

      this.checkWin();
    });
  }

  checkWin(): void {
    const losingPlayer = this.gameStateService.players.find((player) => {
      return player.chars.getValue().every((char) => char.stateSubject$.getValue().health === 0);
    });

    if (losingPlayer) {
      const winningPlayer = this.gameStateService.getEnemyOfThePlayer(losingPlayer);
      this.winner.set(winningPlayer);
      this.isFightOver.set(true);
      this.isFightInProgress.set(false);
      return;
    }

    this.scheduleBattleTick();
  }

  dealDamageTo({
    char,
    damage,
    type,
  }: {
    readonly char: Character;
    readonly type: DamageType;
    readonly damage: number;
  }): void {
    const charState = char.stateSubject$.getValue();
    const health = charState.health;
    const newHealth = Math.max(health - damage, 0);

    char.stateSubject$.next({ ...charState, health: newHealth });

    if (health === 0) {
    }
  }

  rerollCharActions(char: Character): void {
    char.initActions({ actionPoints: 10 });
    char.rerollsLeft.update((rerolls) => rerolls - 1);
  }

  leaveTheBattle(): void {
    this.viewsService.setActiveView(View.Shop);
  }
}
