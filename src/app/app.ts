import { Component, signal } from '@angular/core';
import { Views } from "./features/views/views";

@Component({
  selector: 'app-root',
  imports: [Views],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
}
