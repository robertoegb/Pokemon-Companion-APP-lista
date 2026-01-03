
import { PokemonInstance, InstanceMove, StatusEffect, MoveCategory } from './types';

export type Status = 'BRN' | 'PSN' | 'SLP' | 'PAR' | 'FRZ';
export type Stat = 'attack' | 'defense' | 'speed' | 'special' | 'accuracy' | 'evasion';

export type BattleVolatile = {
  status?: Status;
  statusTurns?: number;
  volatile?: {
    confusion?: { turnsLeft: number };
  };
  statStages: Record<Stat, number>;
  leechSeed?: { source: 'player' | 'enemy'; turnsLeft?: number };
  disabledMove?: { moveName: string; turnsLeft: number };
  bide?: { turnsLeft: number; damageStored: number };
  critBoost?: boolean;
  flinched?: boolean;
  recharging?: boolean;
  rage?: boolean;
  substituteHp?: number;
  lockedMove?: { moveName: string; turnsLeft: number; isTrapping?: boolean };
  transformed?: PokemonInstance;
  trapped?: { turnsLeft: number };
  transformedType?: string;
  chargingMove?: string;
  lastDamageTaken?: number;
  lastDamageType?: string;
  lastMoveUsedByOpponent?: InstanceMove;
  mimickedMove?: InstanceMove;
};

export const INITIAL_VOLATILE: BattleVolatile = {
  statStages: { 
    attack: 0, defense: 0, speed: 0, special: 0, 
    accuracy: 0, evasion: 0 
  }
};

const STAGE_MULTIPLIERS: Record<number, number> = {
  '-6': 0.25, '-5': 0.28, '-4': 0.33, '-3': 0.40, '-2': 0.50, '-1': 0.66,
  '0': 1.0, '1': 1.5, '2': 2.0, '3': 2.5, '4': 3.0, '5': 3.5, '6': 4.0
};

const ACC_EVA_MULTIPLIERS: Record<number, number> = {
  '-6': 0.33, '-5': 0.37, '-4': 0.43, '-3': 0.50, '-2': 0.60, '-1': 0.75,
  '0': 1.0, '1': 1.33, '2': 1.66, '3': 2.0, '4': 2.33, '5': 2.66, '6': 3.0
};

export type RegistryEffect = {
  inflictStatus?: { status: Status; chance: number; turns?: [number, number] };
  inflictConfusion?: { chance: number; turns: [number, number] };
  leechSeed?: true;
  statChanges?: Array<{ target: 'self' | 'opponent'; stat: Stat; stages: number; chance: number }>;
  drain?: { ratio: number };
  healSelf?: number; 
  resetStats?: boolean;
  flee?: boolean;
  inflictStatusSelf?: Status;
  selfDestruct?: boolean;
  turns?: number | [number, number];
  recoil?: number; 
  fixedDamage?: 'halfCurrent' | 'level' | 'psywave' | number;
  focusEnergy?: true;
  bide?: true;
  multiHit?: true | number;
  ohko?: true;
  metronome?: true;
  flinchChance?: number;
  highCrit?: boolean;
  triAttack?: boolean;
  recharge?: boolean;
  rage?: boolean;
  thrash?: boolean;
  substitute?: boolean;
  transform?: boolean;
  conversion?: boolean;
  payDay?: boolean;
  trap?: boolean;
  charge?: boolean;
  recoilOnMiss?: boolean;
  disable?: boolean;
  mimic?: boolean;
  mirrorMove?: boolean;
  counter?: boolean;
  splash?: boolean;
};

const MOVE_EFFECT_REGISTRY: Record<string, RegistryEffect> = {
  'drenadoras': { leechSeed: true },
  'absorber': { drain: { ratio: 0.5 } },
  'chupavidas': { drain: { ratio: 0.5 } },
  'autodestrucción': { selfDestruct: true },
  'explosión': { selfDestruct: true },
  'doble filo': { recoil: 0.25 },
  'derribo': { recoil: 0.25 },
  'supercolmillo': { fixedDamage: 'halfCurrent' },
  'foco energía': { focusEnergy: true },
  'venganza': { bide: true },
  'metrónomo': { metronome: true },
  'perforador': { ohko: true },
  'guillotina': { ohko: true },
  'cuchillada': { highCrit: true },
  'triataque': { triAttack: true },
  'hiperrayo': { recharge: true },
  'furia': { rage: true },
  'gamberrada': { thrash: true },
  'sustituto': { substitute: true },
  'transformación': { transform: true },
  'conversión': { conversion: true },
  'día de pago': { payDay: true },
  'giro fuego': { trap: true },
  'tenaza': { trap: true },
  'constricción': { trap: true },
  'martillazo': { highCrit: true },
  'destello': { statChanges: [{ target: 'opponent', stat: 'accuracy', stages: -1, chance: 100 }] },
  'danza espada': { statChanges: [{ target: 'self', stat: 'attack', stages: 2, chance: 100 }] },
  'remolino': { flee: true },
  'tóxico': { inflictStatus: { status: 'PSN', chance: 100 } },
  'rayo hielo': { inflictStatus: { status: 'FRZ', chance: 10 } },
  'ventisca': { inflictStatus: { status: 'FRZ', chance: 10 } },
  'burbuja': { statChanges: [{ target: 'opponent', stat: 'speed', stages: -1, chance: 10 }] },
  'rayo confuso': { inflictConfusion: { chance: 100, turns: [2, 5] } },
  'lengüetazo': { inflictStatus: { status: 'PAR', chance: 30 } },
  'tinieblas': { fixedDamage: 'level' },
  'rayo aurora': { statChanges: [{ target: 'opponent', stat: 'attack', stages: -1, chance: 10 }] },
  'puño hielo': { inflictStatus: { status: 'FRZ', chance: 10 } },
  'niebla': { resetStats: true },
  'neblina': { resetStats: true },
  'furia dragón': { fixedDamage: 40 },
  'anulación': { disable: true },
  'beso amoroso': { inflictStatus: { status: 'SLP', chance: 75, turns: [2, 5] } },
  'pantalla humo': { statChanges: [{ target: 'opponent', stat: 'accuracy', stages: -1, chance: 100 }] },
  'ataque arena': { statChanges: [{ target: 'opponent', stat: 'accuracy', stages: -1, chance: 100 }] },
  'excavación': { charge: true },
  'huesomerang': { multiHit: 2 },
  'doble patada': { multiHit: 2 },
  'sumisión': { recoil: 0.25 },
  'patada baja': { flinchChance: 30 },
  'mov. sísmico': { fixedDamage: 'level' },
  'puño kárate': { highCrit: true },
  'patada giro': { flinchChance: 30 },
  'patada salto': { recoilOnMiss: true },
  'patada salto alta': { recoilOnMiss: true },
  'polvo veneno': { inflictStatus: { status: 'PSN', chance: 100 } },
  'residuos': { inflictStatus: { status: 'PSN', chance: 30 } },
  'ácido': { statChanges: [{ target: 'opponent', stat: 'defense', stages: -1, chance: 10 }] },
  'picotazo veneno': { inflictStatus: { status: 'PSN', chance: 30 } },
  'polución': { inflictStatus: { status: 'PSN', chance: 40 } },
  'gas venenoso': { inflictStatus: { status: 'PSN', chance: 100 } },
  'armadura ácida': { statChanges: [{ target: 'self', stat: 'defense', stages: 2, chance: 100 }] },
  'disparo demora': { statChanges: [{ target: 'opponent', stat: 'speed', stages: -1, chance: 100 }] },
  'doble ataque': { multiHit: true, inflictStatus: { status: 'PSN', chance: 20 } },
  'pin misil': { multiHit: true },
  'ataque aéreo': { charge: true },
  'confusión': { inflictConfusion: { chance: 10, turns: [2, 5] } },
  'psíquico': { statChanges: [{ target: 'opponent', stat: 'special', stages: -1, chance: 33 }] },
  'psicorrayo': { inflictConfusion: { chance: 10, turns: [2, 5] } },
  'agilidad': { statChanges: [{ target: 'self', stat: 'speed', stages: 2, chance: 100 }] },
  'amnesia': { statChanges: [{ target: 'self', stat: 'special', stages: 2, chance: 100 }] },
  'hipnosis': { inflictStatus: { status: 'SLP', chance: 100, turns: [2, 5] } },
  'recuperación': { healSelf: 0.5 },
  'come sueños': { drain: { ratio: 0.5 } },
  'kinético': { statChanges: [{ target: 'opponent', stat: 'accuracy', stages: -1, chance: 100 }] },
  'meditación': { statChanges: [{ target: 'self', stat: 'attack', stages: 1, chance: 100 }] },
  'barrera': { statChanges: [{ target: 'self', stat: 'defense', stages: 2, chance: 100 }] },
  'reflejo': { statChanges: [{ target: 'self', stat: 'defense', stages: 2, chance: 100 }] },
  'descanso': { healSelf: 1.0, inflictStatusSelf: 'SLP', turns: [2, 2] },
  'impactrueno': { inflictStatus: { status: 'PAR', chance: 10 } },
  'rayo': { inflictStatus: { status: 'PAR', chance: 10 } },
  'trueno': { inflictStatus: { status: 'PAR', chance: 30 } },
  'puño trueno': { inflictStatus: { status: 'PAR', chance: 10 } },
  'onda trueno': { inflictStatus: { status: 'PAR', chance: 100 } },
  'hoja afilada': { highCrit: true },
  'rayo solar': { charge: true },
  'danza pétalo': { thrash: true },
  'desarrollo': { statChanges: [{ target: 'self', stat: 'special', stages: 1, chance: 100 }] },
  'somnífero': { inflictStatus: { status: 'SLP', chance: 100, turns: [2, 5] } },
  'espora': { inflictStatus: { status: 'SLP', chance: 100, turns: [2, 5] } },
  'paralizador': { inflictStatus: { status: 'PAR', chance: 100 } },
  'doble bofetón': { multiHit: true },
  'ataque furia': { multiHit: true },
  'golpe cometa': { multiHit: true },
  'clavo cañón': { multiHit: true },
  'bombardeo': { multiHit: true },
  'mordisco': { flinchChance: 10 },
  'hipercolmillo': { flinchChance: 10 },
  'pisotón': { flinchChance: 30 },
  'cabezazo': { flinchChance: 30 },
  'canto': { inflictStatus: { status: 'SLP', chance: 100, turns: [2, 5] } },
  'minimizar': { statChanges: [{ target: 'self', stat: 'evasion', stages: 1, chance: 100 }] },
  'doble equipo': { statChanges: [{ target: 'self', stat: 'evasion', stages: 1, chance: 100 }] },
  'rizo defensa': { statChanges: [{ target: 'self', stat: 'defense', stages: 1, chance: 100 }] },
  'gruñido': { statChanges: [{ target: 'opponent', stat: 'attack', stages: -1, chance: 100 }] },
  'látigo': { statChanges: [{ target: 'opponent', stat: 'defense', stages: -1, chance: 100 }] },
  'malicioso': { statChanges: [{ target: 'opponent', stat: 'defense', stages: -1, chance: 100 }] },
  'fortaleza': { statChanges: [{ target: 'self', stat: 'defense', stages: 1, chance: 100 }] },
  'refugio': { statChanges: [{ target: 'self', stat: 'defense', stages: 1, chance: 100 }] },
  'chirrido': { statChanges: [{ target: 'opponent', stat: 'defense', stages: -2, chance: 100 }] },
  'supersónico': { inflictConfusion: { chance: 100, turns: [2, 5] } },
  'teletransporte': { flee: true },
  'rugido': { flee: true },
  'afilar': { statChanges: [{ target: 'self', stat: 'attack', stages: 1, chance: 100 }] },
  'salpicadura': { splash: true },
  'mimético': { mimic: true },
  'amortiguador': { healSelf: 0.5 },
  'psicoonda': { fixedDamage: 'psywave' },
  'mov. espejo': { mirrorMove: true },
  'contador': { counter: true }
};

export const getEffectForMove = (moveName: string): RegistryEffect | undefined => {
  return MOVE_EFFECT_REGISTRY[moveName.toLowerCase()];
};

export const applyStatModifiers = (base: number, stat: Stat, v: BattleVolatile): number => {
  let multiplier = STAGE_MULTIPLIERS[v.statStages[stat]] || 1.0;
  if (stat === 'attack' && v.status === 'BRN') multiplier *= 0.5;
  if (stat === 'speed' && v.status === 'PAR') multiplier *= 0.25;
  return Math.floor(base * multiplier);
};

export const getAccuracyMultiplier = (v: BattleVolatile): number => {
  return ACC_EVA_MULTIPLIERS[v.statStages.accuracy] || 1.0;
};

export const getEvasionMultiplier = (v: BattleVolatile): number => {
  return ACC_EVA_MULTIPLIERS[v.statStages.evasion] || 1.0;
};

export const applyBeforeMoveEffects = (
  attacker: PokemonInstance,
  v: BattleVolatile
): { canMove: boolean; selfDamage: number; logs: string[]; updatedVolatile: BattleVolatile } => {
  const logs: string[] = [];
  let canMove = true;
  let selfDamage = 0;
  const updated = JSON.parse(JSON.stringify(v));

  if (v.trapped) {
    updated.trapped.turnsLeft--;
    if (updated.trapped.turnsLeft <= 0) {
      delete updated.trapped;
      logs.push(`¡${attacker.name} se liberó del atrapamiento!`);
    } else {
      logs.push(`¡${attacker.name} está atrapado y no puede moverse!`);
      return { canMove: false, selfDamage: 0, logs, updatedVolatile: updated };
    }
  }

  if (v.flinched) {
    updated.flinched = false;
    logs.push(`¡${attacker.name} ha retrocedido!`);
    return { canMove: false, selfDamage: 0, logs, updatedVolatile: updated };
  }

  if (v.recharging) {
    updated.recharging = false;
    logs.push(`¡${attacker.name} está recargando energía!`);
    return { canMove: false, selfDamage: 0, logs, updatedVolatile: updated };
  }

  if (v.status === 'SLP') {
    if (v.statusTurns && v.statusTurns > 0) {
      updated.statusTurns--;
      logs.push(`¡${attacker.name} está dormido!`);
      return { canMove: false, selfDamage: 0, logs, updatedVolatile: updated };
    } else {
      delete updated.status;
      delete updated.statusTurns;
      logs.push(`¡${attacker.name} se despertó!`);
    }
  }

  if (v.status === 'FRZ') {
    logs.push(`¡${attacker.name} está congelado!`);
    return { canMove: false, selfDamage: 0, logs, updatedVolatile: updated };
  }

  if (v.status === 'PAR' && Math.random() < 0.25) {
    logs.push(`¡${attacker.name} está paralizado! No puede moverse.`);
    return { canMove: false, selfDamage: 0, logs, updatedVolatile: updated };
  }

  if (v.volatile?.confusion) {
    if (v.volatile.confusion.turnsLeft <= 0) {
      delete updated.volatile.confusion;
      logs.push(`¡${attacker.name} ya no está confuso!`);
    } else {
      updated.volatile.confusion.turnsLeft--;
      logs.push(`¡${attacker.name} está confuso!`);
      if (Math.random() < 0.5) {
        const atk = applyStatModifiers(attacker.baseStats.attack, 'attack', v);
        const def = applyStatModifiers(attacker.baseStats.defense, 'defense', v);
        selfDamage = Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * 40 * atk) / def / 50) + 2;
        logs.push(`¡Tan confuso que se hirió a sí mismo!`);
        return { canMove: false, selfDamage, logs, updatedVolatile: updated };
      }
    }
  }

  return { canMove: true, selfDamage: 0, logs, updatedVolatile: updated };
};

export const applyOnHitEffects = (
  move: InstanceMove,
  attacker: PokemonInstance,
  defender: PokemonInstance,
  vAttacker: BattleVolatile,
  vDefender: BattleVolatile,
  damageDealt: number
): { 
  updatedAttacker: BattleVolatile; 
  updatedDefender: BattleVolatile; 
  healAttacker: number;
  fleeTriggered?: boolean;
  attackerFainted?: boolean;
  logs: string[];
} => {
  const logs: string[] = [];
  const upAttacker = JSON.parse(JSON.stringify(vAttacker));
  const upDefender = JSON.parse(JSON.stringify(vDefender));
  let healAttacker = 0;
  let fleeTriggered = false;
  let attackerFainted = false;

  const moveName = move.name.toLowerCase();
  const effect = MOVE_EFFECT_REGISTRY[moveName];

  upDefender.lastDamageTaken = damageDealt;
  upDefender.lastDamageType = move.type;
  upDefender.lastMoveUsedByOpponent = JSON.parse(JSON.stringify(move));

  if (effect?.splash) {
    logs.push("¡Pero no ha tenido ningún efecto!");
  }

  if (effect?.healSelf) {
      healAttacker = Math.floor(attacker.maxHp * effect.healSelf);
      logs.push(`¡${attacker.name} recuperó salud!`);
  }

  if (effect?.mimic) {
    const targetMoves = defender.moves.filter(m => m.name.toLowerCase() !== 'mimético');
    if (targetMoves.length > 0) {
        const copied = targetMoves[Math.floor(Math.random() * targetMoves.length)];
        upAttacker.mimickedMove = { ...copied, currentPp: copied.maxPp };
        logs.push(`¡${attacker.name} copió ${copied.name}!`);
    }
  }

  if (effect?.counter) {
    const validTypes = ['Normal', 'Fighting'];
    if (vAttacker.lastDamageTaken && vAttacker.lastDamageTaken > 0 && validTypes.includes(vAttacker.lastDamageType || '')) {
       // El daño real se aplica en el flujo de BattleScreen reconociendo el flag counter
       logs.push(`¡Contador devolvió el doble del golpe!`);
    } else {
       logs.push("¡Pero falló!");
    }
  }

  if (effect?.selfDestruct) attackerFainted = true;
  if (effect?.focusEnergy) { upAttacker.critBoost = true; logs.push(`¡${attacker.name} se está concentrando!`); }
  
  if (effect?.flinchChance && Math.random() * 100 < effect.flinchChance) {
    upDefender.flinched = true;
  }

  if (effect?.recharge && damageDealt > 0) {
    upAttacker.recharging = true;
  }

  if (effect?.rage) {
    upAttacker.rage = true;
    logs.push(`¡La furia de ${attacker.name} está creciendo!`);
  }

  if (effect?.thrash && !upAttacker.lockedMove) {
    upAttacker.lockedMove = { moveName: move.name, turnsLeft: Math.floor(Math.random() * 2) + 2 };
  }

  if (effect?.trap && !upDefender.trapped) {
    const turns = Math.floor(Math.random() * 4) + 2;
    upDefender.trapped = { turnsLeft: turns };
    upAttacker.lockedMove = { moveName: move.name, turnsLeft: turns, isTrapping: true };
    logs.push(`¡${defender.name} ha sido atrapado!`);
  }

  if (effect?.triAttack && Math.random() < 0.20 && !upDefender.status) {
    const statuses: Status[] = ['PAR', 'BRN', 'FRZ'];
    upDefender.status = statuses[Math.floor(Math.random() * 3)];
    logs.push(`¡Triataque causó un problema de estado!`);
  }

  if (effect?.substitute && !upAttacker.substituteHp) {
    const cost = Math.floor(attacker.maxHp / 4);
    if (attacker.currentHp > cost) {
       upAttacker.substituteHp = cost;
       logs.push(`¡${attacker.name} creó un sustituto!`);
    } else {
       logs.push(`¡Pero no tiene suficiente energía!`);
    }
  }

  if (effect?.transform) {
    upAttacker.transformed = JSON.parse(JSON.stringify(defender));
    logs.push(`¡${attacker.name} se transformó en ${defender.name}!`);
  }

  if (effect?.conversion) {
    const randomMove = attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
    upAttacker.transformedType = randomMove.type;
    logs.push(`¡${attacker.name} cambió su tipo a ${randomMove.type}!`);
  }

  if (effect?.inflictStatusSelf) {
      upAttacker.status = effect.inflictStatusSelf;
      if (effect.turns) upAttacker.statusTurns = Array.isArray(effect.turns) ? effect.turns[0] : effect.turns;
  }

  if (effect?.resetStats) {
      upAttacker.statStages = { attack: 0, defense: 0, speed: 0, special: 0, accuracy: 0, evasion: 0 };
      upDefender.statStages = { attack: 0, defense: 0, speed: 0, special: 0, accuracy: 0, evasion: 0 };
      delete upAttacker.status;
      delete upAttacker.statusTurns;
      delete upDefender.status;
      delete upDefender.statusTurns;
      delete upAttacker.volatile;
      delete upDefender.volatile;
      logs.push("¡Se han reiniciado los cambios y estados de todos!");
  }

  if (effect?.disable && !upDefender.disabledMove) {
    const moves = defender.moves.filter(m => m.currentPp > 0);
    if (moves.length > 0) {
      const targetMove = moves[Math.floor(Math.random() * moves.length)];
      upDefender.disabledMove = { moveName: targetMove.name, turnsLeft: Math.floor(Math.random() * 4) + 2 };
      logs.push(`¡${targetMove.name} de ${defender.name} fue anulado!`);
    }
  }

  if (effect?.flee) fleeTriggered = true;

  const drainRatio = effect?.drain?.ratio || 0;
  if (drainRatio > 0 && damageDealt > 0) {
    healAttacker = Math.floor(damageDealt * drainRatio);
    logs.push(`¡Le ha robado energía a ${defender.name}!`);
  }

  const statusToInflict = move.statusEffect && move.statusEffect !== StatusEffect.None && move.statusEffect !== StatusEffect.Confusion
    ? { status: move.statusEffect as unknown as Status, chance: move.statusChance || 10 }
    : effect?.inflictStatus;

  if (statusToInflict && !upDefender.status && Math.random() * 100 < statusToInflict.chance) {
    upDefender.status = statusToInflict.status;
    if (upDefender.status === 'SLP') {
      const turns = statusToInflict.turns ? Math.floor(Math.random() * (statusToInflict.turns[1] - statusToInflict.turns[0] + 1)) + statusToInflict.turns[0] : Math.floor(Math.random() * 3) + 2;
      upDefender.statusTurns = turns;
    }
    const msgs: any = { BRN: '¡se ha quemado!', PSN: '¡ha sido envenenado!', SLP: '¡se ha dormido!', PAR: '¡está paralizado!', FRZ: '¡se ha congelado!' };
    logs.push(`¡${defender.name} ${msgs[upDefender.status] || 'tiene un problema de estado!'}`);
  }

  const statChanges = move.statChanges || effect?.statChanges;
  if (statChanges) {
    statChanges.forEach(sc => {
      const isSelf = sc.target === 'self';
      const targetVolatile = isSelf ? upAttacker : upDefender;
      const targetName = isSelf ? attacker.name : defender.name;
      const statName = sc.stat.toLowerCase() as Stat;
      if (targetVolatile.statStages[statName] !== undefined && Math.random() * 100 < (sc.chance || 100)) {
        const current = targetVolatile.statStages[statName];
        const next = Math.max(-6, Math.min(6, current + sc.stages));
        if (next !== current) {
          targetVolatile.statStages[statName] = next;
          const info = { attack: 'ataque', defense: 'defensa', speed: 'velocidad', special: 'especial', accuracy: 'precisión', evasion: 'evasión' }[statName] || statName;
          logs.push(`¡El ${info} de ${targetName} ${sc.stages > 0 ? 'subió' : 'bajó'}!`);
        }
      }
    });
  }

  const conf = (move.statusEffect === StatusEffect.Confusion ? { chance: move.statusChance || 10, turns: [2, 5] as [number, number] } : null) || effect?.inflictConfusion;
  if (conf && !upDefender.volatile?.confusion && Math.random() * 100 < conf.chance) {
    const turns = Math.floor(Math.random() * (conf.turns[1] - conf.turns[0] + 1)) + conf.turns[0];
    upDefender.volatile = { ...upDefender.volatile, confusion: { turnsLeft: turns } };
    logs.push(`¡${defender.name} ahora está confuso!`);
  }

  if (effect?.leechSeed && !upDefender.leechSeed) {
    upDefender.leechSeed = { source: 'pending', turnsLeft: 5 };
    logs.push(`¡${defender.name} fue infectado por drenadoras!`);
  }

  return { updatedAttacker: upAttacker, updatedDefender: upDefender, healAttacker, fleeTriggered, attackerFainted, logs };
};

export const applyEndOfTurnEffects = (
  p: PokemonInstance,
  v: BattleVolatile
): { damage: number; healSource?: 'player' | 'enemy'; log?: string } => {
  if (p.currentHp <= 0) return { damage: 0 };
  
  if (v.disabledMove) {
      v.disabledMove.turnsLeft--;
      if (v.disabledMove.turnsLeft <= 0) {
          const name = v.disabledMove.moveName;
          delete v.disabledMove;
          return { damage: 0, log: `¡El efecto de anulación sobre ${name} terminó!` };
      }
  }

  if (v.status === 'BRN' || v.status === 'PSN') {
    const damage = Math.max(1, Math.floor(p.maxHp / 16));
    const msg = v.status === 'BRN' ? `¡${p.name} sufre por la quemadura!` : `¡${p.name} sufre por el veneno!`;
    return { damage, log: msg };
  }

  if (v.leechSeed) {
    if (v.leechSeed.turnsLeft !== undefined) {
      v.leechSeed.turnsLeft--;
      if (v.leechSeed.turnsLeft <= 0) {
        delete v.leechSeed;
        return { damage: 0, log: `¡El efecto de las drenadoras sobre ${p.name} se agotó!` };
      }
    }
    const damage = Math.max(1, Math.floor(p.maxHp / 16));
    return { damage, healSource: v.leechSeed.source === 'player' ? 'player' : 'enemy', log: `¡Drenadoras restan energía a ${p.name}!` };
  }

  return { damage: 0 };
};
