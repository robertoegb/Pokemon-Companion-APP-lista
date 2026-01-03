
import { PokemonInstance, Item, PokemonBase, Move } from './types';
import { calculateHp } from './services/firebaseService';
import { POKEDEX } from './data';
import { getMoveLearnedAtLevel, getAllLearnedMovesUpToLevel } from './moveLearningData';

const STONE_EVOLUTIONS: Record<string, Record<number, number>> = {
  fire: { 37: 38, 58: 59, 133: 136 }, 
  water: { 61: 62, 90: 91, 120: 121, 133: 134 }, 
  thunder: { 25: 26, 133: 135 }, 
  leaf: { 44: 45, 70: 71, 102: 103 }, 
  moon: { 30: 31, 33: 34, 35: 36, 39: 40 } 
};

const checkIsFainted = (pokemon: PokemonInstance): boolean => {
  const hp = Number(pokemon.currentHp);
  return isNaN(hp) || hp <= 0;
};

export const canUseItemOnPokemon = (pokemon: PokemonInstance, item: Item): boolean => {
  const [action, value] = item.effect.split(':');
  const isFainted = checkIsFainted(pokemon);
  
  switch (action) {
    case 'heal':
      if (isFainted) return false;
      if (pokemon.currentHp >= pokemon.maxHp && !item.effect.includes('pp')) return false;
      return true;
    case 'pp_all':
      if (isFainted) return false;
      return pokemon.moves.some(m => m.currentPp < m.maxPp);
    case 'pp':
      if (isFainted) return false;
      // Para Éter, verificamos si existe al menos un movimiento que no esté lleno
      return pokemon.moves.some(m => m.currentPp < m.maxPp);
    case 'revive':
      return isFainted;
    case 'level':
      if (isFainted) return false;
      return pokemon.level < 100;
    case 'evolve':
      if (isFainted) return false;
      return !!STONE_EVOLUTIONS[value]?.[pokemon.id];
    case 'cure':
      if (isFainted || !pokemon.status) return false;
      const statusMap: Record<string, string> = { burn: 'BRN', paralysis: 'PAR', poison: 'PSN', freeze: 'FRZ', sleep: 'SLP' };
      return value === 'all' || pokemon.status === statusMap[value];
    case 'flee':
      return true;
    default:
      return false;
  }
};

export const applyItemToPokemon = (
  pokemon: PokemonInstance, 
  item: Item, 
  selectedMoveIndex?: number
): { updated: PokemonInstance; message: string; success: boolean; evolvedBase?: PokemonBase } => {
  let updated = JSON.parse(JSON.stringify(pokemon)) as PokemonInstance;
  const [action, value] = item.effect.split(':');
  let message = `¡Usaste ${item.name} en ${pokemon.name}!`;
  let success = true;
  let evolvedBase: PokemonBase | undefined = undefined;
  const isFainted = checkIsFainted(updated);

  if (isFainted && action !== 'revive') {
      return { updated, message: "No tiene efecto en un Pokémon debilitado.", success: false };
  }

  const safeMaxHp = updated.maxHp || calculateHp(updated.baseStats.hp, updated.level) || 10;

  switch (action) {
    case 'heal':
      if (updated.currentHp >= safeMaxHp && !item.effect.includes('pp')) {
          return { updated, message: "Ya tiene los PS al máximo.", success: false };
      }
      if (value === 'full' || value === 'full_pp') {
        updated.currentHp = safeMaxHp;
      } else {
        updated.currentHp = Math.min(safeMaxHp, updated.currentHp + parseInt(value));
      }
      if (value === 'full_pp') {
        updated.moves = updated.moves.map(m => ({ ...m, currentPp: m.maxPp }));
      }
      break;

    case 'pp_all':
      if (!updated.moves.some(m => m.currentPp < m.maxPp)) return { updated, message: "Los PP ya están al máximo.", success: false };
      updated.moves = updated.moves.map(m => ({
        ...m,
        currentPp: value === 'full' ? m.maxPp : Math.min(m.maxPp, m.currentPp + parseInt(value))
      }));
      break;

    case 'pp':
      if (selectedMoveIndex !== undefined) {
        const m = updated.moves[selectedMoveIndex];
        if (m.currentPp >= m.maxPp) return { updated, message: "Ese ataque ya tiene los PP al máximo.", success: false };
        m.currentPp = value === 'full' ? m.maxPp : Math.min(m.maxPp, m.currentPp + parseInt(value));
        message = `¡Restaurados los PP de ${m.name}!`;
      } else {
          return { updated, message: "Debes seleccionar un ataque.", success: false };
      }
      break;

    case 'revive':
      if (!isFainted) return { updated, message: "¡Aún tiene energía!", success: false };
      const ratio = parseFloat(value) || 0.5;
      updated.currentHp = Math.max(1, Math.floor(safeMaxHp * ratio));
      updated.status = undefined; 
      break;

    case 'level':
      if (updated.level >= 100) return { updated, message: "Ya está al nivel máximo.", success: false };
      updated.level += 1;
      updated.maxHp = calculateHp(updated.baseStats.hp, updated.level);
      updated.currentHp = updated.maxHp;
      updated.exp = Math.pow(updated.level, 3);
      updated.expToNextLevel = Math.pow(updated.level + 1, 3);
      message = `¡${pokemon.name} subió al nivel ${updated.level}!`;
      break;

    case 'evolve':
      const targetId = STONE_EVOLUTIONS[value]?.[pokemon.id];
      if (targetId) {
        const foundEvolved = POKEDEX.find(p => p.id === targetId);
        if (foundEvolved) {
          evolvedBase = foundEvolved;
          message = `¡${pokemon.name} está evolucionando!`;
          return { updated, message, success: true, evolvedBase };
        }
      }
      return { updated, message: "No parece tener ningún efecto...", success: false };

    case 'cure':
      if (!updated.status && value !== 'all') return { updated, message: "No tiene ningún problema de estado.", success: false };
      const statusMap: Record<string, string> = { burn: 'BRN', paralysis: 'PAR', poison: 'PSN', freeze: 'FRZ', sleep: 'SLP' };
      if (value === 'all' || updated.status === statusMap[value]) {
          updated.status = undefined;
          message = `¡${pokemon.name} se ha curado de su problema de estado!`;
      } else {
          return { updated, message: `Este objeto no cura ese problema.`, success: false };
      }
      break;
    case 'flee':
      message = "¡Se usó para escapar del combate!";
      break;
    default:
      success = false;
      message = "Este objeto no se puede usar aquí.";
  }

  return { updated, message, success, evolvedBase };
};
