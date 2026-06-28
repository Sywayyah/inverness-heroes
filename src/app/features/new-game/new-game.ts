import { Component, inject, signal } from '@angular/core';
import { charsRegistry } from '../../core/characters';
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

  readonly characters = charsRegistry.entities;

  readonly selectedCharacter = signal(this.characters[0]);
}
