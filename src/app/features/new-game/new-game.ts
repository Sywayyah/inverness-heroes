import { Component, inject, signal } from '@angular/core';
import { Character, charsRegistry, CharType } from '../../core/characters';
import { GameStateService } from '../../services/game-state.service';
import { View, ViewsService } from '../../services/views.service';

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

  startGame(): void {
    this.viewsService.setActiveView(View.Game);
    this.gameStateService.mainPlayer.chars.next([
      new Character({ base: this.selectedCharacter() }),
    ]);
    this.gameStateService.neutralPlayer.chars.next([
      new Character({ base: charsRegistry.getEntityById('char-zombie') }),
    ]);
  }
}
