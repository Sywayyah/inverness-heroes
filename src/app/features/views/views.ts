import { Component, inject } from '@angular/core';
import { ViewsService } from '../../services/views.service';
import { MainScreen } from "../main-screen/main-screen";
import { NewGame } from "../new-game/new-game";
import { GameBattle } from "../game-battle/game-battle";
import { Shop } from '../shop/shop';

@Component({
  selector: 'app-views',
  imports: [MainScreen, NewGame, GameBattle,Shop],
  templateUrl: './views.html',
  styleUrl: './views.scss',
})
export class Views {
  readonly viewsService = inject(ViewsService);
}
