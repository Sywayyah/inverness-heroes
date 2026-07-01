import { BehaviorSubject } from 'rxjs';

export class Grid2D<T> {
  readonly state$ = new BehaviorSubject<T[][]>([]);

  constructor(
    readonly params: { readonly width: number; readonly height: number; cellGenerator(): T },
  ) {
    this.state$.next(
      Array.from({ length: params.height }, (_, i) =>
        Array.from({ length: params.width }, () => params.cellGenerator()),
      ),
    );
  }
}
