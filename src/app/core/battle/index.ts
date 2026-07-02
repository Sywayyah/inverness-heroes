export class BattleTimer {

}

export class Battle {
  readonly timers: BattleTimer[] = [];

  startBattle(): void {}
  stopBattle(): void {}

  createTimer(): BattleTimer {
    const timer = new BattleTimer();
    this.timers.push(timer);
    return timer;
  }
}
