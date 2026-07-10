import { Component, inject } from '@angular/core';
import { ViewsService } from '../../services/views.service';
import { GameBattle } from '../game-battle/game-battle';
import { GameMap } from '../game-map/game-map';
import { MainScreen } from '../main-screen/main-screen';
import { NewGame } from '../new-game/new-game';
import { Shop } from '../shop/shop';

@Component({
  selector: 'app-views',
  imports: [MainScreen, NewGame, GameBattle, Shop, GameMap],
  templateUrl: './views.html',
  styleUrl: './views.scss',
})
export class Views {
  readonly viewsService = inject(ViewsService);
}
