import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../characters';
import { ReactiveList } from '../reactive/reactive-list';

export class Player {
  readonly gold = signal(0);

  readonly chars = new ReactiveList<Character>();

  readonly name = signal('');
  readonly color = signal('');

  constructor(readonly params: { readonly defaultName: string; readonly color: string; readonly controlable?: boolean }) {
    this.name.set(params.defaultName);
    this.color.set(params.color);
  }
}
