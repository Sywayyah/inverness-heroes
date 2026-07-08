import { signal } from '@angular/core';
import { EntityRegistry } from '../registries';
import { Character } from '../characters';
import { getRandomInt } from '../utils/common';
import { BattleAction } from '../activities';

export enum SpellActivationType {
  Targeted,
  Instant,
  Passive,
}

interface OnSpellActivatedParams {
  readonly owner: Character;
  readonly target?: Character;
  readonly action: BattleAction;
  readonly spell: Spell;
  readonly actions: {
    dealPureDamage(params: { readonly target: Character; readonly damage: number }): void;
    healCharacter(params: { readonly char: Character; readonly health: number }): void;
  };
}

export interface SpellBase {
  readonly id: string;
  readonly name: string;
  readonly imgSrc: string;
  readonly activationType: SpellActivationType;
  getDescription(params: { readonly spell: Spell }): string;
  // todo: should there be activities on spell level?

  onActivated?(params: OnSpellActivatedParams): void;
}

export const spellsRegistry = new EntityRegistry<SpellBase>({ name: 'Spells' });

spellsRegistry.register({
  id: 'firebolt',
  name: 'Firebolt',
  imgSrc: `images/spells/firebolt.png`,
  activationType: SpellActivationType.Targeted,
  getDescription(): string {
    return `Firebolt`;
  },
  onActivated({ actions, owner, target, action: activity, spell }): void {
    if (!target) {
      return;
    }
    const rolledDamage = getRandomInt(5, 8);
    actions.dealPureDamage({ target, damage: rolledDamage });
    activity.history.push(`Dealing ${rolledDamage} fire damage`);
  },
});

spellsRegistry.register({
  id: 'corrosive-fog',
  name: 'Corrosive Fog',
  imgSrc: `images/spells/corrosive-fog.png`,
  activationType: SpellActivationType.Targeted,
  getDescription(): string {
    return `Corrosive Fog`;
  },
  onActivated({ action: activity }): void {
    activity.history.push(`Debuff!`);
  },
});

spellsRegistry.register({
  id: 'heal',
  name: 'Heal',
  imgSrc: `images/spells/inner-light.png`,
  activationType: SpellActivationType.Passive,
  getDescription(): string {
    return `Heal`;
  },
  onActivated({ actions, action: activity, owner, spell }): void {
    const healValue = 5;
    actions.healCharacter({ char: owner, health: healValue });
    activity.history.push(`Restored ${healValue} Health`);
  },
});

export class Spell {
  readonly level = signal(1);

  get base(): SpellBase {
    return this.params.base;
  }

  constructor(readonly params: { readonly base: SpellBase; readonly initialLevel: number }) {
    if (params.initialLevel) {
      this.level.set(params.initialLevel);
    }
  }
}
