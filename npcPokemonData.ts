
import { NPCPokemonPoolEntry } from './types';
import { NPC_POKEMON_SPECIAL } from './npcPokemonData_special';

/**
 * Registro unificado de equipos Pokémon por ID de instancia de NPC (zona_npc_id).
 * Estructura plana para evitar errores de mapeo entre plantas/subzonas.
 */
export const NPC_POKEMON_REGISTRY: Record<string, NPCPokemonPoolEntry[]> = {
  ...NPC_POKEMON_SPECIAL
};
