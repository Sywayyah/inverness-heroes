import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-value-bar',
  imports: [],
  templateUrl: './value-bar.html',
  styleUrl: './value-bar.scss',
})
export class ValueBar {
  readonly value = input.required<number>();
  readonly maxValue = input.required<number>();

  readonly color = input('red');
  readonly showLabel = input(false);

  readonly valueBarWidth = computed(() => (this.value() / this.maxValue()) * 100);

}
