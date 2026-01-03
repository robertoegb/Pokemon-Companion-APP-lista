
import { 
  ZoneEvents, 
  ExplorationEvent, 
  ZoneItemPoolEntry, 
  NPC, 
  EncounterEntry, 
  NPCPokemonPoolEntry, 
  PokemonInstance 
} from '../types';
import { POKEDEX } from '../data';
import { NPC_POKEMON_REGISTRY } from '../npcPokemonData';
import { NPC_POKEMON_PART1 } from '../npcPokemonData_part1';
import { NPC_POKEMON_PART2 } from '../npcPokemonData_part2';
import { NPC_POKEMON_PART3 } from '../npcPokemonData_part3';
import { NPC_POKEMON_PART4 } from '../npcPokemonData_part4';
import { createPokemonInstance } from './firebaseService';

const FULL_NPC_REGISTRY: Record<string, NPCPokemonPoolEntry[]> = {
    ...NPC_POKEMON_REGISTRY,
    ...NPC_POKEMON_PART1,
    ...NPC_POKEMON_PART2,
    ...NPC_POKEMON_PART3,
    ...NPC_POKEMON_PART4
};

export const determineExplorationEvent = (events: ZoneEvents): ExplorationEvent => {
  const total = events.wild + events.npc + events.item + events.nothing;
  if (total === 0) return 'NOTHING';
  
  const random = Math.random() * total;
  let cumulative = 0;

  cumulative += events.wild;
  if (random < cumulative) return 'WILD';

  cumulative += events.npc;
  if (random < cumulative) return 'NPC';

  cumulative += events.item;
  if (random < cumulative) return 'ITEM';

  return 'NOTHING';
};

export const pickWildPokemonEncounter = (pool: EncounterEntry[]): { pokemonId: number, level: number } => {
  if (!pool || pool.length === 0) return { pokemonId: 19, level: 2 }; 
  
  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  
  let selected = pool[0];
  for (const entry of pool) {
    if (random < entry.weight) {
      selected = entry;
      break;
    }
    random -= entry.weight;
  }

  const level = Math.floor(Math.random() * (selected.maxLevel - selected.minLevel + 1)) + selected.minLevel;
  return { pokemonId: selected.pokemonId, level };
};

export const pickRandomNpcFromPool = (pool: NPC[]): NPC | null => {
  if (!pool || pool.length === 0) return null;
  
  const totalWeight = pool.reduce((sum, npc) => sum + npc.weight, 0);
  let random = Math.random() * totalWeight;

  for (const npc of pool) {
    if (random < npc.weight) return npc;
    random -= npc.weight;
  }
  return pool[0];
};

export const generateNpcTeam = (npc: NPC): PokemonInstance[] => {
  const pool = FULL_NPC_REGISTRY[npc.id] || [];
  if (pool.length === 0) {
      console.warn(`No se encontró pool de pokemon para el NPC ID: ${npc.id}`);
      return [];
  }

  const teamSize = npc.teamSize;
  const selectedEntries: NPCPokemonPoolEntry[] = [];
  const availablePool = [...pool];
  
  for (let i = 0; i < teamSize; i++) {
    if (availablePool.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      selectedEntries.push(availablePool[randomIndex]);
      availablePool.splice(randomIndex, 1);
    } else {
      const randomIndex = Math.floor(Math.random() * pool.length);
      selectedEntries.push(pool[randomIndex]);
    }
  }

  return selectedEntries.map(entry => {
    const base = POKEDEX.find(p => p.id === entry.pokemonId) || POKEDEX[0];
    const level = Math.floor(Math.random() * (entry.nivelMax - entry.nivelMin + 1)) + entry.nivelMin;
    return createPokemonInstance(base, level);
  });
};

export const pickRandomItemFromPool = (pool: ZoneItemPoolEntry[]): ZoneItemPoolEntry => {
  if (!pool || pool.length === 0) return { name: 'Poción', quantity: 1, weight: 1 };
  
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of pool) {
    if (random < item.weight) return item;
    random -= item.weight;
  }
  return pool[0];
};
