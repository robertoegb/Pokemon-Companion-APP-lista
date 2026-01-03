import { PokemonInstance, InstanceMove } from './types';
import { ALL_MOVES_DICTIONARY } from './moveList';

/**
 * Lógica para movimientos multi-golpe (Doble Bofetón, etc)
 * Probabilidades Gen 1: 37.5% (2), 37.5% (3), 12.5% (4), 12.5% (5)
 */
export const getMultiHitCount = (): number => {
  const r = Math.random();
  if (r < 0.375) return 2;
  if (r < 0.75) return 3;
  if (r < 0.875) return 4;
  return 5;
};

/**
 * Lógica para Metrónomo: selecciona un movimiento al azar del diccionario.
 * Excluye ataques nulos o recursivos para evitar bucles.
 */
export const getRandomMetronomeMove = (): InstanceMove => {
  const available = ALL_MOVES_DICTIONARY.filter(m => m.name !== 'Metrónomo' && m.name !== 'Transformación' && m.name !== 'Esquema');
  const move = available[Math.floor(Math.random() * available.length)];
  return { ...move, currentPp: move.maxPp };
};

/**
 * Lógica para movimientos fulminantes (OHKO) como Perforador.
 * Falla si la velocidad del oponente es mayor.
 */
export const canOhko = (attacker: PokemonInstance, defender: PokemonInstance): boolean => {
  return attacker.baseStats.speed >= defender.baseStats.speed;
};