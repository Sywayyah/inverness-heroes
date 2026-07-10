import { Service, signal } from '@angular/core';

export enum View {
  MainScreen,
  NewGame,
  Battle,
  Shop,
  Settings,
  Map
}

@Service()
export class ViewsService {
  readonly state = {
    activeView: signal(View.MainScreen),
  };

  readonly View = View;

  setActiveView(view: View): void {
    this.state.activeView.set(view);
  }
}
