import { Signal, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class ReactiveBase<T> {
  private readonly valueSubject$: BehaviorSubject<T>;
  private readonly signalVal: WritableSignal<T>;
  readonly value$: Observable<T>;
  readonly value: Signal<T>;

  constructor(initVal: T) {
    this.valueSubject$ = new BehaviorSubject(initVal);
    this.signalVal = signal(initVal);
    this.value$ = this.valueSubject$.asObservable();
    this.value = this.signalVal.asReadonly();
  }

  setValue(val: T): void {
    this.valueSubject$.next(val);
    this.signalVal.set(val);
  }

  getValue(): T {
    return this.signalVal();
  }

  update(fn: (prev: T) => T): void {
    this.setValue(fn(this.getValue()));
  }

  listen(): Observable<T> {
    return this.value$;
  }
}
