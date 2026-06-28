import { Modifiers } from '../modifiers';
import { EntityRegistry } from '../registries';

export interface Character {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  readonly baseStats: {
    readonly strength: number;
    readonly agility: number;
    readonly vitality: number;
    readonly intelligence: number;
  };

  readonly baseValues: {
    readonly health: number;
    readonly mana: number;
  };

  readonly baseModifiers?: Modifiers;
}

export const charsRegistry = new EntityRegistry<Character>({ name: 'Characters' });

charsRegistry.register({
  id: 'char-alch',
  name: 'Alchemist',
  description: `A character well-versed in enchantment, learning and gold gaining`,
  baseStats: { agility: 2, strength: 2, vitality: 3, intelligence: 3 },

  baseValues: {
    health: 50,
    mana: 15,
  },
});

charsRegistry.register({
  id: 'char-paladin',
  name: 'Paladin',
  description: `Faith allows Paladings to endure countless battles`,
  baseStats: { agility: 2, intelligence: 1, strength: 3, vitality: 4 },

  baseValues: {
    health: 60,
    mana: 10,
  },
});

charsRegistry.register({
  id: 'char-bers',
  name: 'Berserk',
  description: `Berserk turns battlefield into a whirlwind of blades`,
  baseStats: {
    agility: 2,
    intelligence: 2,
    strength: 3,
    vitality: 3,
  },

  baseValues: {
    health: 55,
    mana: 13,
  },
});
