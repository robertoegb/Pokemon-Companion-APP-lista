
export interface MachineEntry {
  code: string; 
  moveName: string; 
  systemMoveName: string; 
  pokeApiId: string; 
}

export const TMHM_CATALOG: MachineEntry[] = [
  // HMs
  { code: 'hm01', moveName: 'Corte', systemMoveName: 'Corte', pokeApiId: 'cut' },
  { code: 'hm02', moveName: 'Vuelo', systemMoveName: 'Vuelo', pokeApiId: 'fly' },
  { code: 'hm03', moveName: 'Surf', systemMoveName: 'Surf', pokeApiId: 'surf' },
  { code: 'hm04', moveName: 'Fuerza', systemMoveName: 'Fuerza', pokeApiId: 'strength' },
  { code: 'hm05', moveName: 'Destello', systemMoveName: 'Destello', pokeApiId: 'flash' },

  // TMs
  { code: 'tm01', moveName: 'Megapuño', systemMoveName: 'Megapuño', pokeApiId: 'mega-punch' },
  { code: 'tm02', moveName: 'Viento cortante', systemMoveName: 'Viento cortante', pokeApiId: 'razor-wind' },
  { code: 'tm03', moveName: 'Danza espada', systemMoveName: 'Danza espada', pokeApiId: 'swords-dance' },
  { code: 'tm04', moveName: 'Remolino', systemMoveName: 'Remolino', pokeApiId: 'whirlwind' },
  { code: 'tm05', moveName: 'Megapatada', systemMoveName: 'Megapatada', pokeApiId: 'mega-kick' },
  { code: 'tm06', moveName: 'Tóxico', systemMoveName: 'Tóxico', pokeApiId: 'toxic' },
  { code: 'tm07', moveName: 'Perforador', systemMoveName: 'Perforador', pokeApiId: 'horn-drill' },
  { code: 'tm08', moveName: 'Golpe cuerpo', systemMoveName: 'Golpe Cuerpo', pokeApiId: 'body-slam' },
  { code: 'tm09', moveName: 'Derribo', systemMoveName: 'Derribo', pokeApiId: 'take-down' },
  { code: 'tm10', moveName: 'Doble filo', systemMoveName: 'Doble Filo', pokeApiId: 'double-edge' },
  { code: 'tm11', moveName: 'Rayo burbuja', systemMoveName: 'Rayo burbuja', pokeApiId: 'bubble-beam' },
  { code: 'tm12', moveName: 'Pistola agua', systemMoveName: 'Pistola Agua', pokeApiId: 'water-gun' },
  { code: 'tm13', moveName: 'Rayo hielo', systemMoveName: 'Rayo Hielo', pokeApiId: 'ice-beam' },
  { code: 'tm14', moveName: 'Ventisca', systemMoveName: 'Ventisca', pokeApiId: 'blizzard' },
  { code: 'tm15', moveName: 'Hiperrayo', systemMoveName: 'Hiperrayo', pokeApiId: 'hyper-beam' },
  { code: 'tm16', moveName: 'Día de pago', systemMoveName: 'Día de Pago', pokeApiId: 'pay-day' },
  { code: 'tm17', moveName: 'Sumisión', systemMoveName: 'Sumisión', pokeApiId: 'submission' },
  { code: 'tm18', moveName: 'Contraataque', systemMoveName: 'Contador', pokeApiId: 'counter' },
  { code: 'tm19', moveName: 'Movimiento sísmico', systemMoveName: 'Mov. Sísmico', pokeApiId: 'seismic-toss' },
  { code: 'tm20', moveName: 'Furia', systemMoveName: 'Furia', pokeApiId: 'rage' },
  { code: 'tm21', moveName: 'Megaagotar', systemMoveName: 'Megaagotar', pokeApiId: 'mega-drain' },
  { code: 'tm22', moveName: 'Rayo solar', systemMoveName: 'Rayo Solar', pokeApiId: 'solar-beam' },
  { code: 'tm23', moveName: 'Furia dragón', systemMoveName: 'Furia Dragón', pokeApiId: 'dragon-rage' },
  { code: 'tm24', moveName: 'Rayo', systemMoveName: 'Rayo', pokeApiId: 'thunderbolt' },
  { code: 'tm25', moveName: 'Trueno', systemMoveName: 'Trueno', pokeApiId: 'thunder' },
  { code: 'tm26', moveName: 'Terremoto', systemMoveName: 'Terremoto', pokeApiId: 'earthquake' },
  { code: 'tm27', moveName: 'Fisura', systemMoveName: 'Fisura', pokeApiId: 'fissure' },
  { code: 'tm28', moveName: 'Excavar', systemMoveName: 'Excavación', pokeApiId: 'dig' },
  { code: 'tm29', moveName: 'Psíquico', systemMoveName: 'Psíquico', pokeApiId: 'psychic' },
  { code: 'tm30', moveName: 'Teletransporte', systemMoveName: 'Teletransporte', pokeApiId: 'teleport' },
  { code: 'tm31', moveName: 'Mimético', systemMoveName: 'Mimético', pokeApiId: 'mimic' },
  { code: 'tm32', moveName: 'Doble equipo', systemMoveName: 'Doble Equipo', pokeApiId: 'double-team' },
  { code: 'tm33', moveName: 'Reflejo', systemMoveName: 'Reflejo', pokeApiId: 'reflect' },
  { code: 'tm34', moveName: 'Venganza', systemMoveName: 'Venganza', pokeApiId: 'bide' },
  { code: 'tm35', moveName: 'Metrónomo', systemMoveName: 'Metrónomo', pokeApiId: 'metronome' },
  { code: 'tm36', moveName: 'Autodestrucción', systemMoveName: 'Autodestrucción', pokeApiId: 'self-destruct' },
  { code: 'tm37', moveName: 'Bomba huevo', systemMoveName: 'Bomba huevo', pokeApiId: 'egg-bomb' },
  { code: 'tm38', moveName: 'Llamarada', systemMoveName: 'Llamarada', pokeApiId: 'fire-blast' },
  { code: 'tm39', moveName: 'Rapidez', systemMoveName: 'Rapidez', pokeApiId: 'swift' },
  { code: 'tm40', moveName: 'Cabezazo', systemMoveName: 'Cabezazo', pokeApiId: 'skull-bash' },
  { code: 'tm41', moveName: 'Amortiguador', systemMoveName: 'Amortiguador', pokeApiId: 'soft-boiled' },
  { code: 'tm42', moveName: 'Comesueños', systemMoveName: 'Come Sueños', pokeApiId: 'dream-eater' },
  { code: 'tm43', moveName: 'Ataque aéreo', systemMoveName: 'Ataque Aéreo', pokeApiId: 'sky-attack' },
  { code: 'tm44', moveName: 'Descanso', systemMoveName: 'Descanso', pokeApiId: 'rest' },
  { code: 'tm45', moveName: 'Onda trueno', systemMoveName: 'Onda Trueno', pokeApiId: 'thunder-wave' },
  { code: 'tm46', moveName: 'Psicoonda', systemMoveName: 'Psicoonda', pokeApiId: 'psywave' },
  { code: 'tm47', moveName: 'Explosión', systemMoveName: 'Explosión', pokeApiId: 'explosion' },
  { code: 'tm48', moveName: 'Avalancha', systemMoveName: 'Avalancha', pokeApiId: 'rock-slide' },
  { code: 'tm49', moveName: 'Triataque', systemMoveName: 'Triataque', pokeApiId: 'tri-attack' },
  { code: 'tm50', moveName: 'Sustituto', systemMoveName: 'Sustituto', pokeApiId: 'substitute' }
];
