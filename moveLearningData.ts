
import { ALL_MOVES_DICTIONARY } from './moveList';
import { Move } from './types';
import { LEARNING_001_050 } from './learningData_001_050';
import { LEARNING_051_100 } from './learningData_051_100';
import { LEARNING_101_151 } from './learningData_101_151';

export const normalizeMoveName = (s: string) => 
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

interface LearnableMove {
  level: number;
  moveName: string;
}

export const MOVE_LEARNING_TABLE: Record<number, LearnableMove[]> = {
  ...LEARNING_001_050,
  ...LEARNING_051_100,
  ...LEARNING_101_151
};

export const getMoveByName = (name: string): Move | undefined => {
  const normalizedSearch = normalizeMoveName(name);
  return ALL_MOVES_DICTIONARY.find(m => normalizeMoveName(m.name) === normalizedSearch);
};

export const getMoveLearnedAtLevel = (pokemonId: number, level: number): Move | null => {
  const table = MOVE_LEARNING_TABLE[pokemonId] || [];
  const entry = table.find(e => e.level === level);
  return entry ? getMoveByName(entry.moveName) || null : null;
};

export const getAllLearnedMovesUpToLevel = (pokemonId: number, level: number): Move[] => {
  const learningTable = MOVE_LEARNING_TABLE[pokemonId] || [];
  const learned: Move[] = [];
  const seenNormalized = new Set<string>();

  learningTable.forEach(entry => {
    const normalizedName = normalizeMoveName(entry.moveName);
    if (entry.level <= level && !seenNormalized.has(normalizedName)) {
      const move = getMoveByName(entry.moveName);
      if (move) {
        learned.push(move);
        seenNormalized.add(normalizedName);
      }
    }
  });

  return learned;
};

export const getMovesForLevel = (pokemonId: number, level: number): Move[] => {
  const allLearned = getAllLearnedMovesUpToLevel(pokemonId, level);
  return allLearned.slice(-4);
};
