import { Component, input } from '@angular/core';
import { Item } from '../../../core/items';
import { ValueBar } from '../value-bar/value-bar';

type DescriptionAttachment = 'left' | 'right' | 'middle';

@Component({
  selector: 'app-item-icon',
  imports: [ValueBar],
  templateUrl: './item-icon.html',
  styleUrl: './item-icon.scss',
})
export class ItemIcon {
  readonly item = input.required<Item>();

  readonly attachment = input<DescriptionAttachment>('left');

  readonly showCost = input(false);
  readonly showSellPrice = input(false);
  readonly showHoverDescription = input(true);
}
