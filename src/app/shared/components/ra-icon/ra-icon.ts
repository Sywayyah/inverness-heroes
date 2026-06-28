import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ra-icon',
  imports: [],
  templateUrl: './ra-icon.html',
  styleUrl: './ra-icon.scss',
})
export class RaIcon {
  readonly icon = input.required<string>();
}
