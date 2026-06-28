import { Component, inject } from '@angular/core';
import { ViewsService } from '../../services/views.service';

@Component({
  selector: 'app-new-game',
  imports: [],
  templateUrl: './new-game.html',
  styleUrl: './new-game.scss',
})
export class NewGame {
  readonly viewsService = inject(ViewsService);
}
