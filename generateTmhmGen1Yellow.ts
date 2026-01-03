/**
 * INSTRUCCIONES DE USO:
 * 1. Asegúrate de tener Node.js instalado.
 * 2. Ejecuta: npx ts-node scripts/generateTmhmGen1Yellow.ts
 * El script actualizará src/data/tmhmCompatibility.gen1.yellow.ts automáticamente.
 */

import fs from 'fs';
import path from 'path';

const POKEMON_COUNT = 151;
const VERSION_GROUP = 'yellow';
const BASE_API = 'https://pokeapi.co/api/v2';

// Mapeo de Machine Index (0-54) a Move PokeAPI Name
// Basado en Gen 1
const MACHINE_TO_MOVE: string[] = [
  // TMs 01-50
  'mega-punch', 'razor-wind', 'swords-dance', 'whirlwind', 'mega-kick',
  'toxic', 'horn-drill', 'body-slam', 'take-down', 'double-edge',
  'bubble-beam', 'water-gun', 'ice-beam', 'blizzard', 'hyper-beam',
  'pay-day', 'submission', 'counter', 'seismic-toss', 'rage',
  'mega-drain', 'solar-beam', 'dragon-rage', 'thunderbolt', 'thunder',
  'earthquake', 'fissure', 'dig', 'psychic', 'teleport',
  'mimic', 'double-team', 'reflect', 'bide', 'metronome',
  'self-destruct', 'egg-bomb', 'fire-blast', 'swift', 'skull-bash',
  'soft-boiled', 'dream-eater', 'sky-attack', 'rest', 'thunder-wave',
  'psywave', 'explosion', 'rock-slide', 'tri-attack', 'substitute',
  // HMs 01-05
  'cut', 'fly', 'surf', 'strength', 'flash'
];

async function generate() {
  console.log('--- Iniciando generación de compatibilidad MT/MO (Yellow) ---');
  const masks: Record<number, number[]> = {};

  for (let id = 1; id <= POKEMON_COUNT; id++) {
    // Fix: Accessing stdout via any to avoid type errors in environments where process is not fully typed
    (process as any).stdout.write(`Procesando #${id}... `);
    const response = await fetch(`${BASE_API}/pokemon/${id}`);
    const data = await response.json();
    
    const learnableMoves = new Set<string>();
    
    data.moves.forEach((moveEntry: any) => {
      const isMachine = moveEntry.version_group_details.some((detail: any) => 
        detail.version_group.name === VERSION_GROUP && 
        detail.move_learn_method.name === 'machine'
      );

      if (isMachine) {
        learnableMoves.add(moveEntry.move.name);
      }
    });

    // Construir Bitmask (7 bytes)
    const pokemonMask = new Array(7).fill(0);
    MACHINE_TO_MOVE.forEach((moveName, index) => {
      if (learnableMoves.has(moveName)) {
        const byteIndex = Math.floor(index / 8);
        const bitPosition = index % 8;
        pokemonMask[byteIndex] |= (1 << bitPosition);
      }
    });

    masks[id] = pokemonMask;
    console.log('OK');
  }

  // Validaciones
  console.log('\nValidando datos...');
  const totalTMs = 50;
  const totalHMs = 5;
  
  // Mew (151) debe tener casi todo a 255
  if (masks[151][0] !== 255) console.warn('Aviso: Mew no tiene compatibilidad completa en el primer byte.');

  // Escribir archivo
  const fileContent = `
/**
 * ARCHIVO GENERADO AUTOMÁTICAMENTE - NO EDITAR MANUALMENTE
 * Fuente: PokeAPI (Version Group: Yellow)
 * Fecha: ${new Date().toISOString()}
 */
export const TMHM_MASK: Record<number, number[]> = ${JSON.stringify(masks, null, 2)};

export function canLearnTMHM(pokemonId: number, machineCode: string): boolean {
  const mask = TMHM_MASK[pokemonId];
  if (!mask) return false;

  let index = 0;
  if (machineCode.startsWith('tm')) {
    index = parseInt(machineCode.substring(2)) - 1;
  } else if (machineCode.startsWith('hm')) {
    index = 50 + (parseInt(machineCode.substring(2)) - 1);
  } else {
    return false;
  }

  const byteIndex = Math.floor(index / 8);
  const bitPosition = index % 8;
  return (mask[byteIndex] & (1 << bitPosition)) !== 0;
}
`;

  // Fix: Accessing cwd via any to avoid type errors in environments where process is not fully typed
  const outputPath = path.join((process as any).cwd(), 'src/data/tmhmCompatibility.gen1.yellow.ts');
  fs.writeFileSync(outputPath, fileContent);
  console.log(`\n¡Éxito! Archivo generado en: ${outputPath}`);
}

generate().catch(console.error);