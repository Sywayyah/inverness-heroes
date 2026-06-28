import { Component, inject } from '@angular/core';
import { ViewsService } from '../../services/views.service';
import { MainScreen } from "../main-screen/main-screen";
import { NewGame } from "../new-game/new-game";
import { Game } from "../game/game";

@Component({
  selector: 'app-views',
  imports: [MainScreen, NewGame, Game],
  templateUrl: './views.html',
  styleUrl: './views.scss',
})
export class Views {
  readonly viewsService = inject(ViewsService);
}
