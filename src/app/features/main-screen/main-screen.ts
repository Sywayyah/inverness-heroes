import { Component, inject } from '@angular/core';
import { ViewsService } from '../../services/views.service';

@Component({
  selector: 'app-main-screen',
  imports: [],
  templateUrl: './main-screen.html',
  styleUrl: './main-screen.scss',
})
export class MainScreen {
  readonly viewsService = inject(ViewsService);
}
