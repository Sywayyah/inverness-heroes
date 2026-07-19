import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { timer } from 'rxjs';
import { BattleAction } from '../../core/activities';
import { Character } from '../../core/characters';
import { Player } from '../../core/player';
import { ReactiveList } from '../../core/reactive/reactive-list';
import { rollRangedNumber } from '../../core/types/ranged';
import { shuffleArray } from '../../core/utils/arrays';
import { getRandomInt } from '../../core/utils/common';
import { GameStateService } from '../../services/game-state.service';
import { View, ViewsService } from '../../services/views.service';
import { ItemIcon } from '../../shared/components/item-icon/item-icon';
import { ValueBar } from '../../shared/components/value-bar/value-bar';

@Component({
  selector: 'app-game-battle',
  imports: [AsyncPipe, ItemIcon, ValueBar],
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
      player.chars.getValue().forEach((char) => char.initActions());
    });
  }

  beginFight(): void {
    this.round.update((val) => val + 1);

    const battleActions: BattleAction[] = [];
    this.gameStateService.players.forEach((player) => {
      player.chars.getValue().forEach((char) => {
        char.battleActions$.getValue().battleActions.forEach((action) => {
          if (!player.params.controlable) {
            battleActions.push(new BattleAction(player, char, action));
          } else {
            if (action.isSelected()) {
              battleActions.push(new BattleAction(player, char, action));
            }
          }
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

    timer(650).subscribe(() => {
      action.performed.set(true);

      const targetChar = this.gameStateService.enemyPlayersMap
        .get(action.player)!
        .chars.getValue()[0];

      const activity = action.activity;
      switch (activity.type) {
        case 'charSpell':
          const spell = activity.params.spell;
          spell.base.onActivated?.({
            actions: {
              dealPureDamage: (params) =>
                this.dealPureDamageToUnit({ char: params.target, damage: params.damage }),
              healCharacter: (params) => this.healUnit(params),
            },
            spell,
            target: targetChar,
            owner: action.char,
            action: action,
          });
          break;
        case 'char':
          const source = activity.params.activity;

          let activityMinDamage = source?.stats?.minDamage
            ? rollRangedNumber(source?.stats?.minDamage)
            : 0;
          const activityMaxDamage = source?.stats?.maxDamage
            ? rollRangedNumber(source?.stats?.maxDamage)
            : 0;

          if (!activityMinDamage) activityMinDamage = activityMaxDamage;

          const charActivityDamage = getRandomInt(activityMinDamage, activityMaxDamage);
          action.history.push(`Dealing ${charActivityDamage} damage`);

          this.dealPureDamageToUnit({
            char: targetChar,
            damage: charActivityDamage,
          });

          break;
        case 'item':
          const itemStats = activity.params.item.stats$.getValue();
          const minDamage = itemStats.minDamage;
          const maxDamage = itemStats.maxDamage;

          if (maxDamage === 0) break;

          const enhancedDamage = action.char.mods.getNumericModValue('enhancedDamage') ?? 0;
          const damageDealt = getRandomInt(minDamage, maxDamage);
          const finalDamage = Math.round(damageDealt + damageDealt * (enhancedDamage / 100));
          action.history.push(`Dealing ${finalDamage} damage`);

          this.dealPureDamageToUnit({
            char: targetChar,
            damage: finalDamage,
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

  dealPureDamageToUnit({
    char,
    damage,
  }: {
    readonly char: Character;
    readonly damage: number;
  }): void {
    const charState = char.stateSubject$.getValue();
    const health = charState.health;
    const newHealth = Math.max(health - damage, 0);

    char.stateSubject$.next({ ...charState, health: newHealth });

    char.messages.push(`${damage}`);
  }

  healUnit({ char, health }: { readonly char: Character; readonly health: number }): void {
    const charState = char.stateSubject$.getValue();
    const initHealth = charState.health;
    const newHealth = Math.min(initHealth + health, charState.maxHealth);

    char.stateSubject$.next({ ...charState, health: newHealth });
  }

  rerollCharActions(char: Character): void {
    char.initActions();
    char.rerollsLeft.update((rerolls) => rerolls - 1);
  }

  leaveTheBattle(): void {
    this.viewsService.setActiveView(View.Map);
    this.gameStateService.players.forEach((player) =>
      player.chars.getValue().forEach((char) => char.messages.clear()),
    );
  }
}
