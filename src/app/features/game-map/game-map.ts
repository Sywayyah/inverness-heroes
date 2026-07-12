import { Component, inject, signal } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { View, ViewsService } from '../../services/views.service';
import { AreaObject } from '../../core/locations/game-area';

@Component({
  selector: 'app-game-map',
  imports: [],
  templateUrl: './game-map.html',
  styleUrl: './game-map.scss',
})
export class GameMap {
  readonly stateService = inject(GameStateService);
  readonly viewsService = inject(ViewsService);

  readonly hoveredAreaObject = signal<AreaObject | null>(null);

  handleRoomClicked(areaObject: AreaObject): void {
    areaObject.params.onClick?.();
  }
}
