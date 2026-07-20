import { Component, inject, signal } from '@angular/core';
import { Character, charsRegistry, CharType } from '../../core/characters';
import { DefaultScenario, scenariosRegistry } from '../../core/scenarios/scenarios';
import { GameStateService } from '../../services/game-state.service';
import { ViewsService } from '../../services/views.service';

@Component({
  selector: 'app-new-game',
  imports: [],
  templateUrl: './new-game.html',
  styleUrl: './new-game.scss',
})
export class NewGame {
  readonly viewsService = inject(ViewsService);
  readonly gameStateService = inject(GameStateService);

  readonly characters = charsRegistry.entities.filter((char) => char.type === CharType.Playable);

  readonly selectedCharacter = signal(this.characters[0]);

  readonly scenarios = scenariosRegistry.entities;

  readonly selectedScenario = signal(DefaultScenario);

  startGame(): void {
    this.gameStateService.mainPlayer.chars.setValue([
      new Character({ base: this.selectedCharacter() }),
    ]);

    this.selectedScenario().init({ gameState: this.gameStateService, views: this.viewsService });
  }
}
