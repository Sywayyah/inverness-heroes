import type { Character } from "../characters";

export interface ActionsApi {
  dealPureDamage(params: {
    readonly target: Character;
    readonly damage: number;
  }): void;
  healCharacter(params: {
    readonly char: Character;
    readonly health: number;
  }): void;
}
