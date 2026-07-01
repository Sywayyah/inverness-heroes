import { Component, inject } from '@angular/core';
import { View, ViewsService } from '../../services/views.service';

@Component({
  selector: 'app-shop',
  imports: [],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  readonly viewsService = inject(ViewsService);

  startBattle(): void {
    this.viewsService.setActiveView(View.Battle);
  }
}
