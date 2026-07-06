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

export class Spell {
  readonly level = signal(1);

  constructor(readonly params: { readonly base: SpellBase; readonly initialLevel: number }) {
    if (params.initialLevel) {
      this.level.set(params.initialLevel);
    }
  }
}
