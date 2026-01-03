
import { PokemonBase } from './types';
import { POKEDEX_PART_1 } from './pokedexData_001_050';
import { POKEDEX_PART_2 } from './pokedexData_051_100';
import { POKEDEX_PART_3 } from './pokedexData_101_151';
import { ALL_MOVES_DICTIONARY } from './moveList';

export const ALL_MOVES = ALL_MOVES_DICTIONARY;

// Unimos todas las partes en una sola constante exportada
export const POKEDEX_151: PokemonBase[] = [
  ...POKEDEX_PART_1,
  ...POKEDEX_PART_2,
  ...POKEDEX_PART_3
];
