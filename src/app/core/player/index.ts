import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../characters';

export class Player {
  readonly gold = signal(0);

  readonly chars = new BehaviorSubject<Character[]>([]);
}
