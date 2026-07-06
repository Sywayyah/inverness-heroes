import { EntityRegistry } from '../registries';

export interface SpellBase {
  readonly id: string;
  readonly name: string;
}

export const spellsRegistry = new EntityRegistry<SpellBase>({ name: 'Spells' });

spellsRegistry.register({
  id: 'firebolt',
  name: 'Firebolt',
});

export class Spell {
  constructor(readonly params: { readonly base: SpellBase }) {}
}
