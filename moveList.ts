
import { Move, PokemonType, MoveCategory, StatusEffect } from './types';

const T = PokemonType;
const C = MoveCategory;
const S = StatusEffect;

const createMove = (name: string, type: PokemonType, power: number, acc: number, pp: number, cat?: MoveCategory, status?: StatusEffect, chance?: number): Move => ({
    name: name.trim(), 
    type, 
    power: power,
    accuracy: acc === 0 ? 0 : (acc || 100),
    maxPp: pp, 
    category: cat || (power > 0 ? ([T.Fire, T.Water, T.Grass, T.Electric, T.Psychic, T.Ice, T.Dragon].includes(type) ? C.Special : C.Physical) : C.Status),
    statusEffect: status, 
    statusChance: chance
});

export const ALL_MOVES_DICTIONARY: Move[] = [
  // --- NORMAL ---
  createMove('Placaje', T.Normal, 40, 100, 35),
  createMove('Arañazo', T.Normal, 40, 100, 35),
  createMove('Látigo', T.Normal, 0, 100, 30),
  createMove('Gruñido', T.Normal, 0, 100, 40),
  createMove('Mordisco', T.Normal, 60, 100, 25),
  createMove('Derribo', T.Normal, 90, 85, 20),
  createMove('Doble Filo', T.Normal, 100, 100, 15),
  createMove('Ataque Rápido', T.Normal, 40, 100, 30),
  createMove('Cuchillada', T.Normal, 70, 100, 20),
  createMove('Hipercolmillo', T.Normal, 80, 90, 15),
  createMove('Supercolmillo', T.Normal, 0, 90, 10),
  createMove('Foco Energía', T.Normal, 0, 100, 30),
  createMove('Malicioso', T.Normal, 0, 100, 30),
  createMove('Fortaleza', T.Normal, 0, 100, 30),
  createMove('Venganza', T.Normal, 20, 100, 20),
  createMove('Doble Bofetón', T.Normal, 15, 85, 10),
  createMove('Destructor', T.Normal, 40, 100, 35),
  createMove('Canto', T.Normal, 0, 55, 15, C.Status, S.Sleep, 100),
  createMove('Minimizar', T.Normal, 0, 100, 20),
  createMove('Metrónomo', T.Normal, 0, 100, 10),
  createMove('Rizo Defensa', T.Normal, 0, 100, 40),
  createMove('Golpe Cuerpo', T.Normal, 85, 100, 15, C.Physical, S.Paralysis, 30),
  createMove('Cornada', T.Normal, 65, 100, 25),
  createMove('Perforador', T.Normal, 0, 30, 5),
  createMove('Gamberrada', T.Normal, 120, 100, 10),
  createMove('Furia', T.Normal, 20, 100, 20),
  createMove('Remolino', T.Normal, 0, 100, 20),
  createMove('Golpe Cometa', T.Normal, 18, 85, 15),
  createMove('Megapuño', T.Normal, 80, 85, 20),
  createMove('Megapatada', T.Normal, 120, 75, 5),
  createMove('Deslumbrar', T.Normal, 0, 100, 30, C.Status, S.Paralysis, 100),
  createMove('Chirrido', T.Normal, 0, 85, 40),
  createMove('Autodestrucción', T.Normal, 200, 100, 5),
  createMove('Explosión', T.Normal, 250, 100, 5),
  createMove('Rapidez', T.Normal, 60, 1000, 20),
  createMove('Día de Pago', T.Normal, 40, 100, 20),
  createMove('Cabezazo', T.Normal, 70, 100, 15),
  createMove('Bombardeo', T.Normal, 15, 85, 20),
  createMove('Conversión', T.Normal, 0, 100, 30),
  createMove('Afilar', T.Normal, 0, 100, 30),
  createMove('Clavo Cañón', T.Normal, 20, 100, 15),
  createMove('Triataque', T.Normal, 80, 100, 10),
  createMove('Sustituto', T.Normal, 0, 100, 10),
  createMove('Hiperrayo', T.Normal, 150, 90, 5),
  createMove('Transformación', T.Normal, 0, 100, 10),
  createMove('Ataque Furia', T.Normal, 15, 85, 20),
  createMove('Doble Equipo', T.Normal, 0, 100, 15),
  createMove('Pisotón', T.Normal, 65, 100, 20),
  createMove('Salpicadura', T.Normal, 0, 100, 40),
  createMove('Rugido', T.Normal, 0, 100, 20),
  createMove('Supersónico', T.Normal, 0, 55, 20),
  // MT/MO Normal extendidas
  createMove('Corte', T.Normal, 50, 95, 30),
  createMove('Fuerza', T.Normal, 80, 100, 15),
  createMove('Destello', T.Normal, 0, 70, 20),
  createMove('Viento cortante', T.Normal, 80, 75, 10),
  createMove('Danza espada', T.Normal, 0, 100, 30),
  createMove('Mimético', T.Normal, 0, 100, 10),
  createMove('Bomba huevo', T.Normal, 100, 75, 10),
  createMove('Amortiguador', T.Normal, 0, 100, 10),

  // --- FUEGO ---
  createMove('Ascuas', T.Fire, 40, 100, 25, C.Special, S.Burn, 10),
  createMove('Lanzallamas', T.Fire, 90, 100, 15, C.Special, S.Burn, 10),
  createMove('Llamarada', T.Fire, 120, 85, 5, C.Special, S.Burn, 30),
  createMove('Giro Fuego', T.Fire, 35, 85, 15, C.Special),
  createMove('Puño Fuego', T.Fire, 75, 100, 15, C.Special, S.Burn, 10),

  // --- AGUA ---
  createMove('Burbuja', T.Water, 40, 100, 30),
  createMove('Pistola Agua', T.Water, 40, 100, 25),
  createMove('Surf', T.Water, 95, 100, 15),
  createMove('Hidrobomba', T.Water, 110, 80, 5),
  createMove('Refugio', T.Water, 0, 100, 40),
  createMove('Tenaza', T.Water, 35, 85, 15),
  createMove('Cascada', T.Water, 80, 100, 15),
  createMove('Martillazo', T.Water, 100, 90, 10),
  createMove('Rayo burbuja', T.Water, 65, 100, 20),

  // --- PLANTA ---
  createMove('Látigo Cepa', T.Grass, 45, 100, 25),
  createMove('Hoja Afilada', T.Grass, 55, 95, 25),
  createMove('Drenadoras', T.Grass, 0, 90, 10),
  createMove('Somnífero', T.Grass, 0, 75, 15, C.Status, S.Sleep, 100),
  createMove('Rayo Solar', T.Grass, 120, 100, 10),
  createMove('Absorber', T.Grass, 20, 100, 25),
  createMove('Danza Pétalo', T.Grass, 120, 100, 10),
  createMove('Espora', T.Grass, 0, 100, 15, C.Status, S.Sleep, 100),
  createMove('Desarrollo', T.Grass, 0, 100, 20),
  createMove('Paralizador', T.Grass, 0, 75, 30, C.Status, S.Paralysis, 100),
  createMove('Megaagotar', T.Grass, 40, 100, 10),

  // --- ELÉCTRICO ---
  createMove('Impactrueno', T.Electric, 40, 100, 30, C.Special, S.Paralysis, 10),
  createMove('Onda Trueno', T.Electric, 0, 90, 20, C.Status, S.Paralysis, 100),
  createMove('Rayo', T.Electric, 90, 100, 15, C.Special, S.Paralysis, 10),
  createMove('Trueno', T.Electric, 110, 70, 10, C.Special, S.Paralysis, 30),
  createMove('Puño Trueno', T.Electric, 75, 100, 15, C.Special, S.Paralysis, 10),

  // --- PSÍQUICO ---
  createMove('Confusión', T.Psychic, 50, 100, 25, C.Special, S.Confusion, 10),
  createMove('Psíquico', T.Psychic, 90, 100, 10, C.Special, S.Confusion, 10),
  createMove('Agilidad', T.Psychic, 0, 100, 30),
  createMove('Hipnosis', T.Psychic, 0, 60, 20, C.Status, S.Sleep, 100),
  createMove('Amnesia', T.Psychic, 0, 100, 20),
  createMove('Teletransporte', T.Psychic, 0, 100, 20),
  createMove('Psicorrayo', T.Psychic, 65, 100, 20, C.Special, S.Confusion, 10),
  createMove('Reflejo', T.Psychic, 0, 100, 20),
  createMove('Barrera', T.Psychic, 0, 100, 20),
  createMove('Recuperación', T.Psychic, 0, 100, 20),
  createMove('Come Sueños', T.Psychic, 100, 100, 15),
  createMove('Kinético', T.Psychic, 0, 80, 15),
  createMove('Meditación', T.Psychic, 0, 100, 40),
  createMove('Psicoonda', T.Psychic, 0, 80, 15),

  // --- VENENO ---
  createMove('Polvo Veneno', T.Poison, 0, 75, 35, C.Status, S.Poison, 100),
  createMove('Residuos', T.Poison, 65, 100, 20, C.Physical, S.Poison, 30),
  createMove('Ácido', T.Poison, 40, 100, 30),
  createMove('Picotazo Veneno', T.Poison, 15, 100, 35, C.Physical, S.Poison, 30),
  createMove('Polución', T.Poison, 30, 70, 20, C.Physical, S.Poison, 40),
  createMove('Gas Venenoso', T.Poison, 0, 90, 40, C.Status, S.Poison, 100),
  createMove('Armadura Ácida', T.Poison, 0, 100, 20),
  createMove('Tóxico', T.Poison, 0, 85, 10),

  // --- BICHO ---
  createMove('Disparo Demora', T.Bug, 0, 95, 40),
  createMove('Chupavidas', T.Bug, 20, 100, 15),
  createMove('Doble Ataque', T.Bug, 25, 100, 20),
  createMove('Pin Misil', T.Bug, 25, 95, 20),

  // --- VOLADOR ---
  createMove('Tornado', T.Normal, 40, 100, 35),
  createMove('Ataque Ala', T.Flying, 60, 100, 35),
  createMove('Picotazo', T.Flying, 35, 100, 35),
  createMove('Pico Taladro', T.Flying, 80, 100, 20),
  createMove('Mov. Espejo', T.Flying, 0, 100, 20),
  createMove('Ataque Aéreo', T.Flying, 140, 90, 5),
  createMove('Vuelo', T.Flying, 90, 95, 15),

  // --- TIERRA ---
  createMove('Ataque Arena', T.Normal, 0, 100, 15),
  createMove('Excavación', T.Ground, 80, 100, 10),
  createMove('Terremoto', T.Ground, 100, 100, 10),
  createMove('Hueso Palo', T.Ground, 65, 85, 20),
  createMove('Huesomerang', T.Ground, 50, 90, 10),
  createMove('Fisura', T.Ground, 0, 30, 5),

  // --- ROCA ---
  createMove('Lanzarrocas', T.Rock, 50, 90, 15),
  createMove('Avalancha', T.Rock, 75, 90, 10),

  // --- LUCHA ---
  createMove('Doble Patada', T.Fighting, 30, 100, 30),
  createMove('Sumisión', T.Fighting, 80, 80, 25),
  createMove('Patada Baja', T.Fighting, 50, 100, 20),
  createMove('Mov. Sísmico', T.Fighting, 0, 100, 20),
  createMove('Puño Kárate', T.Normal, 50, 100, 25),
  createMove('Patada Giro', T.Fighting, 60, 85, 15),
  createMove('Patada Salto', T.Fighting, 70, 95, 25),
  createMove('Patada Salto Alta', T.Fighting, 85, 90, 20),
  createMove('Contador', T.Fighting, 0, 100, 20),

  // --- FANTASMA / HIELO / OTROS ---
  createMove('Rayo Confuso', T.Ghost, 0, 100, 10, C.Status, S.Confusion, 100),
  createMove('Lengüetazo', T.Ghost, 30, 100, 30, C.Physical, S.Paralysis, 30),
  createMove('Tinieblas', T.Ghost, 0, 100, 15),
  createMove('Rayo Aurora', T.Ice, 65, 100, 20),
  createMove('Rayo Hielo', T.Ice, 90, 100, 10, C.Special, S.Freeze, 10),
  createMove('Ventisca', T.Ice, 110, 70, 5, C.Special, S.Freeze, 10),
  createMove('Neblina', T.Ice, 0, 100, 30),
  createMove('Niebla', T.Ice, 0, 100, 30),
  createMove('Para Hielo', T.Ice, 75, 100, 15, C.Special, S.Freeze, 10),
  createMove('Furia Dragón', T.Dragon, 0, 100, 10),
  createMove('Beso Amoroso', T.Normal, 0, 75, 10, C.Status, S.Sleep, 100),
  createMove('Descanso', T.Psychic, 0, 100, 5),
  createMove('Anulación', T.Normal, 0, 100, 20),
  createMove('Pantalla Humo', T.Normal, 0, 100, 20),
  createMove('Agarre', T.Normal, 55, 100, 30),
  createMove('Guillotina', T.Normal, 0, 30, 5),
  createMove('Constricción', T.Normal, 15, 90, 20)
];
