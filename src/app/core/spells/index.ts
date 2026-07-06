import { signal } from '@angular/core';
import { EntityRegistry } from '../registries';

export enum SpellActivationType {
  Targeted,
  Instant,
  Passive,
}

export interface SpellBase {
  readonly id: string;
  readonly name: string;
  readonly activationType: SpellActivationType;
  getDescription(params: { readonly spell: Spell }): string;
  // todo: should there be activities on spell level?
}

export const spellsRegistry = new EntityRegistry<SpellBase>({ name: 'Spells' });

spellsRegistry.register({
  id: 'firebolt',
  name: 'Firebolt',
  activationType: SpellActivationType.Targeted,
  getDescription(): string {
    return `Firebolt`;
  },
});

spellsRegistry.register({
  id: 'corrosive-fog',
  name: 'Corrosive Fog',
  activationType: SpellActivationType.Targeted,
  getDescription(): string {
    return `Corrosive Fog`;
  },
});

spellsRegistry.register({
  id: 'heal',
  name: 'Heal',
  activationType: SpellActivationType.Passive,
  getDescription(): string {
    return `Heal`;
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
