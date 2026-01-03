
import { EncounterEntry } from './types';
import { WILD_ROUTES_1_12 } from './wildEncounters_routes_1_12';
import { WILD_ROUTES_13_25 } from './wildEncounters_routes_13_25';
import { WILD_SPECIAL } from './wildEncounters_special';

export const WILD_POKEMON_REGISTRY: Record<string, EncounterEntry[]> = {
  ...WILD_ROUTES_1_12,
  ...WILD_ROUTES_13_25,
  ...WILD_SPECIAL
};
