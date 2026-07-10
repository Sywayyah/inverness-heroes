import { Component, inject } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { View, ViewsService } from '../../services/views.service';

@Component({
  selector: 'app-game-map',
  imports: [],
  templateUrl: './game-map.html',
  styleUrl: './game-map.scss',
})
export class GameMap {
  readonly stateService = inject(GameStateService);
  readonly viewsService = inject(ViewsService);

  handleRoomClicked() {
    // temporary logic
    this.viewsService.setActiveView(View.Shop);
  }
}
