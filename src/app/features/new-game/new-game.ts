import { Component, inject, signal } from '@angular/core';
import { ViewsService } from '../../services/views.service';
import { charsRegistry } from '../../core/characters';

@Component({
  selector: 'app-new-game',
  imports: [],
  templateUrl: './new-game.html',
  styleUrl: './new-game.scss',
})
export class NewGame {
  readonly viewsService = inject(ViewsService);

  readonly characters = charsRegistry.characters;

  readonly selectedCharacter = signal(this.characters[0]);
}
