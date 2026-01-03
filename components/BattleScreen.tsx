
import React, { useState, useEffect, useRef } from 'react';
import { PokemonInstance, BattleConfig, InstanceMove, PokemonType, MoveCategory, Trainer, Move, PokemonBase } from '../types';
import { getTypeEffectiveness, ALL_MOVES, POKEDEX } from '../data';
import { 
  applyBeforeMoveEffects, 
  applyOnHitEffects, 
  applyEndOfTurnEffects, 
  applyStatModifiers,
  getAccuracyMultiplier,
  getEvasionMultiplier,
  getEffectForMove,
  BattleVolatile, 
  INITIAL_VOLATILE 
} from '../battleEffects';
import { getMultiHitCount, getRandomMetronomeMove, canOhko } from '../moveLogic';
import { getMoveLearnedAtLevel, normalizeMoveName } from '../moveLearningData';
import BagOverlay from './BagOverlay';

interface BattleScreenProps {
  playerTeam: PokemonInstance[]; 
  battleConfig: BattleConfig;
  currentLocation: string;
  trainer: Trainer;
  onWin: (money: number, updatedTeam: PokemonInstance[], learnedMoveData?: {pokemonIndex: number, move: Move}[], pendingEvolutions?: {pokemonIndex: number, evolvedBase: PokemonBase}[]) => void;
  onCatch: (pokemon: PokemonInstance, updatedTeam: PokemonInstance[]) => void;
  onLose: (updatedTeam: PokemonInstance[], moneyLost?: number) => void;
  onRun: (updatedTeam: PokemonInstance[]) => void;
  onUpdateInventory?: (inventory: any) => void;
}

type LogType = 'PLAYER' | 'ENEMY' | 'SYSTEM' | 'EFFECT' | 'CRITICAL' | 'FAINT' | 'STAT';
interface BattleLog { text: string; type: LogType; }
type BattlePhase = 'INTRO' | 'ENEMY_SEND' | 'PLAYER_SEND' | 'PLAYER_INPUT' | 'PROCESSING' | 'CATCHING' | 'ENDED' | 'VICTORY_SUMMARY' | 'CAUGHT_SUMMARY' | 'DEFEAT_SUMMARY';

const STATUS_COLORS: Record<string, string> = { PAR: 'bg-yellow-500', PSN: 'bg-purple-600', BRN: 'bg-red-500', SLP: 'bg-slate-400', FRZ: 'bg-cyan-400', };
const TYPE_COLORS: Record<string, string> = { Normal: 'bg-stone-400 border-stone-600', Fire: 'bg-orange-500 border-orange-700', Water: 'bg-blue-500 border-blue-700', Electric: 'bg-yellow-400 border-yellow-600', Grass: 'bg-green-500 border-green-700', Ice: 'bg-cyan-300 border-cyan-500', Fighting: 'bg-red-700 border-red-900', Poison: 'bg-purple-500 border-purple-700', Ground: 'bg-amber-600 border-amber-800', Flying: 'bg-indigo-300 border-indigo-500', Psychic: 'bg-pink-500 border-pink-700', Bug: 'bg-lime-500 border-lime-700', Rock: 'bg-yellow-700 border-yellow-900', Ghost: 'bg-violet-700 border-violet-900', Dragon: 'bg-indigo-700 border-indigo-900', Dark: 'bg-stone-700 border-stone-900', Fairy: 'bg-pink-300 border-pink-500', };

const HealthBar = ({ current, max }: { current: number; max: number }) => {
  const cur = isNaN(current) ? 0 : current;
  const m = isNaN(max) || max <= 0 ? 1 : max;
  const percentage = Math.max(0, Math.min(100, (cur / m) * 100));
  const color = percentage < 20 ? 'bg-red-500' : percentage < 50 ? 'bg-yellow-500' : 'bg-green-500';
  return ( <div className="w-full bg-gray-300 rounded-full border border-gray-400 overflow-hidden h-2 shadow-inner"><div className={`h-full ${color} transition-all duration-500 ease-out`} style={{ width: `${percentage}%` }}></div></div> );
};

const TeamBalls = ({ total, fainted }: { total: number, fainted: number }) => (
  <div className="flex gap-1 mt-1">{Array.from({ length: total }).map((_, i) => ( <div key={i} className={`w-2 h-2 rounded-full border border-gray-800 relative overflow-hidden ${i < fainted ? 'grayscale brightness-50 opacity-40' : ''}`}><div className="absolute top-0 left-0 w-full h-1/2 bg-red-500"></div><div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div></div> ))}</div>
);

const ExpBar = ({ current, level, isAnimating }: { current: number, level: number, isAnimating?: boolean }) => {
  const base = Math.pow(level, 3);
  const next = Math.pow(level + 1, 3);
  const diff = next - base;
  const progress = Math.max(0, current - base);
  const percentage = Math.max(0, Math.min(100, (progress / (diff || 1)) * 100));
  return ( <div className={`w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300 transition-all duration-300 shadow-inner ${isAnimating ? 'h-4 ring-2 ring-blue-400 ring-opacity-50' : 'h-2'}`}><div className={`h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out ${isAnimating ? 'animate-pulse' : ''}`} style={{ width: `${percentage}%` }}>{isAnimating && <div className="w-full h-full bg-white/20 animate-shine"></div>}</div></div> );
};

const BattleScreen: React.FC<BattleScreenProps> = ({ playerTeam, battleConfig, trainer, onWin, onLose, onRun, onCatch }) => {
  const [playerTeamState, setPlayerTeamState] = useState<PokemonInstance[]>(() => JSON.parse(JSON.stringify(playerTeam)));
  const [enemyTeamState, setEnemyTeamState] = useState<PokemonInstance[]>(() => JSON.parse(JSON.stringify(battleConfig.enemyTeam)));
  const [activePlayerIdx, setActivePlayerIdx] = useState(() => { const idx = playerTeamState.findIndex(p => !isNaN(p.currentHp) && p.currentHp > 0); return idx === -1 ? 0 : idx; });
  const [activeEnemyIdx, setActiveEnemyIdx] = useState(0);
  const [playerHp, setPlayerHp] = useState(() => playerTeamState[activePlayerIdx]?.currentHp || 0);
  const [enemyHp, setEnemyHp] = useState(() => enemyTeamState[activeEnemyIdx]?.currentHp || 0);
  const [volatile, setVolatile] = useState<{ player: BattleVolatile; enemy: BattleVolatile }>(() => ({ player: { ...JSON.parse(JSON.stringify(INITIAL_VOLATILE)), status: playerTeamState[activePlayerIdx]?.status as any }, enemy: { ...JSON.parse(JSON.stringify(INITIAL_VOLATILE)), status: enemyTeamState[activeEnemyIdx]?.status as any } }));
  const [displayExp, setDisplayExp] = useState(playerTeamState[activePlayerIdx]?.exp || 0);
  const [displayLevel, setDisplayLevel] = useState(playerTeamState[activePlayerIdx]?.level || 0);
  const [isExpAnimating, setIsExpAnimating] = useState(false);
  const [phase, setPhase] = useState<BattlePhase>('INTRO');
  const [hitEffect, setHitEffect] = useState<'player' | 'enemy' | null>(null);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [menuView, setMenuView] = useState<'MAIN' | 'MOVES' | 'TEAM' | 'BAG' | 'CATCH_MODAL'>('MAIN');
  const [showItemBag, setShowItemBag] = useState(false);
  const [learnedMovesQueue, setLearnedMovesQueue] = useState<{pokemonIndex: number, move: Move}[]>([]);
  const [pendingEvolutionsQueue, setPendingEvolutionsQueue] = useState<{pokemonIndex: number, evolvedBase: PokemonBase}[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  useEffect(() => {
    const startSequence = async () => {
      if (enemyTeamState.length === 0) { onRun(playerTeamState); return; }
      if (battleConfig.type === 'WILD') { addLog(`¡Un ${battleConfig.opponentName} salvaje apareció!`, 'ENEMY'); setPhase('ENEMY_SEND'); } 
      else { addLog(`¡${battleConfig.opponentName} quiere luchar!`, 'ENEMY'); setPhase('INTRO'); }
      await new Promise(r => setTimeout(r, 1500));
      if (battleConfig.trainerDialog && battleConfig.type !== 'WILD') { addLog(`"${battleConfig.trainerDialog}"`, 'ENEMY'); await new Promise(r => setTimeout(r, 2000)); }
      if (battleConfig.type !== 'WILD') { setPhase('ENEMY_SEND'); addLog(`¡${battleConfig.opponentName} envió a ${enemyTeamState[activeEnemyIdx].name}!`, 'ENEMY'); await new Promise(r => setTimeout(r, 1200)); }
      setPhase('PLAYER_SEND'); addLog(`¡Adelante, ${playerTeamState[activePlayerIdx].name}!`, 'PLAYER');
      await new Promise(r => setTimeout(r, 1200)); setPhase('PLAYER_INPUT');
    };
    startSequence();
  }, []);

  const addLog = (text: string, type: LogType = 'SYSTEM') => setLogs(prev => [...prev, { text, type }]);
  const getSyncedPlayerTeam = (currentTeam: PokemonInstance[], pIdx: number, php: number, pStatus?: string) => { return currentTeam.map((p, i) => i === pIdx ? { ...p, currentHp: php, status: pStatus } : p); };
  const getStat = (pokemon: PokemonInstance, v: BattleVolatile, statType: 'attack' | 'defense' | 'speed' | 'special'): number => { const sourcePkmn = v.transformed || pokemon; const technicalStat = statType === 'special' ? sourcePkmn.baseStats.specialAttack : sourcePkmn.baseStats[statType]; const baseWithLevel = Math.floor(((2 * technicalStat + 31) * pokemon.level) / 100) + 5; return applyStatModifiers(baseWithLevel, statType as any, v); };

  const handlePlayerMove = async (moveIdx: number) => {
    if (phase !== 'PLAYER_INPUT') return;
    const pIdx = activePlayerIdx; const playerActive = playerTeamState[pIdx]; const enemyActive = enemyTeamState[activeEnemyIdx]; if (!playerActive || !enemyActive) return;
    
    let forcedPlayerMove: InstanceMove | null = null;
    if (volatile.player.bide) forcedPlayerMove = playerActive.moves.find(m => m.name.toLowerCase() === 'venganza') || null;
    if (volatile.player.lockedMove) forcedPlayerMove = playerActive.moves.find(m => m.name === volatile.player.lockedMove?.moveName) || null;
    if (volatile.player.chargingMove) forcedPlayerMove = playerActive.moves.find(m => m.name === volatile.player.chargingMove) || null;
    
    const isPlayerLocked = !!volatile.player.bide || !!volatile.player.recharging || !!volatile.player.trapped || !!volatile.player.lockedMove || !!volatile.player.chargingMove;
    const playerMove = forcedPlayerMove || (isPlayerLocked ? playerActive.moves[0] : playerActive.moves[moveIdx]); 
    if (!playerMove) return;
    
    // Si el jugador está bloqueado, permitimos "continuar" aunque el primer movimiento no tenga PP
    if (!isPlayerLocked && !forcedPlayerMove && playerMove.currentPp <= 0) return;
    if (!forcedPlayerMove && !isPlayerLocked && volatile.player.disabledMove?.moveName === playerMove.name) { addLog(`¡Ese movimiento está anulado!`, 'SYSTEM'); return; }
    
    setPhase('PROCESSING'); setMenuView('MAIN');
    if (!forcedPlayerMove && !volatile.player.recharging && !volatile.player.trapped && !volatile.player.bide && !volatile.player.chargingMove && !isPlayerLocked) { 
        setPlayerTeamState(prev => prev.map((p, i) => i === pIdx ? { ...p, moves: p.moves.map(m => m.name === playerMove.name ? { ...m, currentPp: Math.max(0, m.currentPp - 1) } : m) } : p)); 
    }
    
    const enemyMove = enemyActive.moves[Math.floor(Math.random() * enemyActive.moves.length)];
    const pPriority = playerMove.name === 'Ataque Rápido' ? 1 : 0; const ePriority = enemyMove.name === 'Ataque Rápido' ? 1 : 0;
    let playerGoesFirst = pPriority > ePriority ? true : (ePriority > pPriority ? false : getStat(playerActive, volatile.player, 'speed') >= getStat(enemyActive, volatile.enemy, 'speed'));
    
    const sequence = playerGoesFirst ? [{isPlayer: true, move: playerMove}, {isPlayer: false, move: enemyMove}] : [{isPlayer: false, move: enemyMove}, {isPlayer: true, move: playerMove}];
    let currentPHp = playerHp; let currentEHp = enemyHp; let currentVolatile = JSON.parse(JSON.stringify(volatile)); let turnEndedPrematurely = false;
    
    for (const step of sequence) {
      if (currentPHp <= 0 || currentEHp <= 0) break;
      const pHealthBefore = currentPHp; const eHealthBefore = currentEHp;
      const attacker = step.isPlayer ? playerTeamState[pIdx] : enemyTeamState[activeEnemyIdx]; const defender = step.isPlayer ? enemyTeamState[activeEnemyIdx] : playerTeamState[pIdx];
      const result = await executeAttackInternal(step.isPlayer, attacker, defender, step.move, currentPHp, currentEHp, currentVolatile);
      currentPHp = result.newPHp; currentEHp = result.newEHp; currentVolatile = result.newVolatile;
      
      if (step.isPlayer) { 
        if (currentVolatile.enemy.bide) currentVolatile.enemy.bide.damageStored += Math.max(0, eHealthBefore - currentEHp); 
        if (currentVolatile.enemy.rage && eHealthBefore > currentEHp) { currentVolatile.enemy.statStages.attack = Math.min(6, currentVolatile.enemy.statStages.attack + 1); addLog(`¡El ataque de ${enemyActive.name} subió por su furia!`, 'STAT'); } 
      } else { 
        if (currentVolatile.player.bide) currentVolatile.player.bide.damageStored += Math.max(0, pHealthBefore - currentPHp); 
        if (currentVolatile.player.rage && pHealthBefore > currentPHp) { currentVolatile.player.statStages.attack = Math.min(6, currentVolatile.player.statStages.attack + 1); addLog(`¡El ataque de ${playerActive.name} subió por su furia!`, 'STAT'); } 
      }
      
      setPlayerHp(currentPHp); setEnemyHp(currentEHp); setVolatile(currentVolatile);
      
      if (result.fleeTriggered) {
          if (battleConfig.type === 'WILD') {
              addLog(`¡${attacker.name} huyó!`, 'SYSTEM');
              await new Promise(r => setTimeout(r, 1200));
              onRun(getSyncedPlayerTeam(playerTeamState, pIdx, currentPHp, currentVolatile.player.status));
              turnEndedPrematurely = true;
              break;
          } else {
              // Rugido en entrenadores
              const targetIsPlayer = !step.isPlayer;
              if (targetIsPlayer) {
                  const hasHealthyReserve = playerTeamState.some((p, i) => i !== pIdx && p.currentHp > 0);
                  if (hasHealthyReserve) {
                      addLog(`¡${playerActive.name} fue expulsado del combate!`, 'EFFECT');
                      await new Promise(r => setTimeout(r, 1000));
                      setMenuView('TEAM');
                      setPhase('PROCESSING');
                      turnEndedPrematurely = true;
                      break;
                  } else {
                      addLog("¡Pero no tuvo efecto!", 'SYSTEM');
                  }
              } else {
                  const healthyReserves = enemyTeamState.map((p, i) => i !== activeEnemyIdx && p.currentHp > 0 ? i : -1).filter(i => i !== -1);
                  if (healthyReserves.length > 0) {
                      const randomIdx = healthyReserves[Math.floor(Math.random() * healthyReserves.length)];
                      addLog(`¡${enemyActive.name} fue expulsado del combate!`, 'EFFECT');
                      await new Promise(r => setTimeout(r, 1000));
                      addLog(`¡${battleConfig.opponentName} envió a ${enemyTeamState[randomIdx].name}!`, 'ENEMY');
                      setActiveEnemyIdx(randomIdx);
                      setEnemyHp(enemyTeamState[randomIdx].currentHp);
                      currentVolatile.enemy = JSON.parse(JSON.stringify(INITIAL_VOLATILE));
                      setVolatile(currentVolatile);
                      turnEndedPrematurely = true;
                      break;
                  } else {
                      addLog("¡Pero no tuvo efecto!", 'SYSTEM');
                  }
              }
          }
      }

      if (currentPHp <= 0) { await processPlayerFaintInternal(pIdx, currentVolatile.player.status); turnEndedPrematurely = true; break; }
      if (currentEHp <= 0) { await processEnemyFaintInternal(pIdx, currentPHp, currentVolatile.player.status); turnEndedPrematurely = true; break; }
    }
    
    if (!turnEndedPrematurely) { 
      const endResult = await processEndOfTurnEffectsInternal(pIdx, currentPHp, currentEHp, currentVolatile); 
      if (!endResult.battleEnded) setPhase('PLAYER_INPUT'); 
    }
  };

  const executeAttackInternal = async (isPlayer: boolean, attacker: PokemonInstance, defender: PokemonInstance, move: InstanceMove, pPHp: number, pEHp: number, pVolatile: any) => {
    let newPHp = pPHp; let newEHp = pEHp; let newVolatile = JSON.parse(JSON.stringify(pVolatile)); let fleeTriggered = false;
    const vAtk = isPlayer ? newVolatile.player : newVolatile.enemy; const vDef = isPlayer ? newVolatile.enemy : newVolatile.player;
    
    if (vAtk.bide) { 
      vAtk.bide.turnsLeft--; 
      if (vAtk.bide.turnsLeft > 0) { addLog(`¡${attacker.name} está acumulando energía!`, 'EFFECT'); await new Promise(r => setTimeout(r, 800)); return { newPHp, newEHp, newVolatile, fleeTriggered }; } 
      const finalDmg = vAtk.bide.damageStored * 2; delete vAtk.bide; 
      if (finalDmg <= 0) addLog(`¡Venganza de ${attacker.name} falló!`, 'SYSTEM'); 
      else { addLog(`¡${attacker.name} libera su Venganza!`, 'PLAYER'); setHitEffect(isPlayer ? 'enemy' : 'player'); if (isPlayer) newEHp = Math.max(0, newEHp - finalDmg); else newPHp = Math.max(0, newPHp - finalDmg); await new Promise(r => setTimeout(r, 400)); setHitEffect(null); } 
      return { newPHp, newEHp, newVolatile, fleeTriggered }; 
    }
    
    const { canMove, selfDamage, logs: preLogs, updatedVolatile } = applyBeforeMoveEffects(attacker, vAtk); if (isPlayer) newVolatile.player = updatedVolatile; else newVolatile.enemy = updatedVolatile; preLogs.forEach(msg => addLog(msg, 'EFFECT')); if (preLogs.length > 0) { await new Promise(r => setTimeout(r, 800)); } if (!canMove) { if (selfDamage > 0) { setHitEffect(isPlayer ? 'player' : 'enemy'); if (isPlayer) newPHp = Math.max(0, newPHp - selfDamage); else newEHp = Math.max(0, newEHp - selfDamage); await new Promise(r => setTimeout(r, 400)); setHitEffect(null); } return { newPHp, newEHp, newVolatile, fleeTriggered }; }
    
    let finalMove = move; const moveNameLower = move.name.toLowerCase(); const effect = getEffectForMove(moveNameLower);
    if (moveNameLower === 'come sueños' && vDef.status !== 'SLP') { addLog(`¡Pero ${defender.name} no está dormido!`, 'SYSTEM'); return { newPHp, newEHp, newVolatile, fleeTriggered }; }
    if (effect?.charge && !vAtk.chargingMove) { vAtk.chargingMove = finalMove.name; let msg = 'está preparándose'; if (moveNameLower === 'rayo solar') msg = 'está absorbiendo luz'; if (moveNameLower === 'excavación') msg = 'se ha enterrado'; addLog(`¡${attacker.name} ${msg}!`, isPlayer ? 'PLAYER' : 'ENEMY'); await new Promise(r => setTimeout(r, 800)); return { newPHp, newEHp, newVolatile, fleeTriggered }; }
    if (vAtk.chargingMove) delete vAtk.chargingMove;
    if (effect?.metronome) { addLog(`¡${attacker.name} usó Metrónomo!`, isPlayer ? 'PLAYER' : 'ENEMY'); await new Promise(r => setTimeout(r, 600)); finalMove = getRandomMetronomeMove(); }
    
    addLog(`¡${attacker.name} usó ${finalMove.name}!`, isPlayer ? 'PLAYER' : 'ENEMY'); await new Promise(r => setTimeout(r, 600));
    
    const effectiveness = getTypeEffectiveness(finalMove.type, defender.types); if (effectiveness === 0) { addLog(`¡No afecta a ${defender.name}!`, 'SYSTEM'); return { newPHp, newEHp, newVolatile, fleeTriggered }; }
    const finalAccuracy = finalMove.accuracy * (getAccuracyMultiplier(vAtk) / getEvasionMultiplier(vDef)); if (Math.random() * 100 > finalAccuracy) { addLog("¡Pero falló!", 'SYSTEM'); if (effect?.recoilOnMiss) { const crashDmg = Math.max(1, Math.floor(attacker.maxHp / 8)); addLog(`¡${attacker.name} se estrelló contra el suelo!`, 'EFFECT'); if (isPlayer) newPHp = Math.max(0, newPHp - crashDmg); else newEHp = Math.max(0, newEHp - crashDmg); await new Promise(r => setTimeout(r, 600)); } return { newPHp, newEHp, newVolatile, fleeTriggered }; }
    if (effect?.ohko) { if (canOhko(attacker, defender)) { addLog("¡Es un golpe fulminante!", 'CRITICAL'); setHitEffect(isPlayer ? 'enemy' : 'player'); if (isPlayer) newEHp = 0; else newPHp = 0; await new Promise(r => setTimeout(r, 400)); setHitEffect(null); return { newPHp, newEHp, newVolatile, fleeTriggered }; } else { addLog("¡Pero falló!", 'SYSTEM'); return { newPHp, newEHp, newVolatile, fleeTriggered }; } }
    
    if (effect?.fixedDamage !== undefined) { 
      let dmg = 0; 
      if (effect.fixedDamage === 'halfCurrent') dmg = Math.max(1, Math.floor((isPlayer ? newEHp : newPHp) / 2)); 
      else if (effect.fixedDamage === 'level') dmg = attacker.level; 
      else if (effect.fixedDamage === 'psywave') dmg = Math.floor(attacker.level * (Math.random() * (1.5 - 0.5) + 0.5));
      else if (typeof effect.fixedDamage === 'number') dmg = effect.fixedDamage; 
      setHitEffect(isPlayer ? 'enemy' : 'player'); if (isPlayer) newEHp = Math.max(0, newEHp - dmg); else newPHp = Math.max(0, newPHp - dmg); await new Promise(r => setTimeout(r, 400)); setHitEffect(null); return { newPHp, newEHp, newVolatile, fleeTriggered }; 
    }

    if (effect?.counter) {
       const dmgToReturn = (vAtk.lastDamageTaken || 0) * 2;
       if (dmgToReturn > 0) {
          setHitEffect(isPlayer ? 'enemy' : 'player'); if (isPlayer) newEHp = Math.max(0, newEHp - dmgToReturn); else newPHp = Math.max(0, newPHp - dmgToReturn); await new Promise(r => setTimeout(r, 400)); setHitEffect(null); return { newPHp, newEHp, newVolatile, fleeTriggered };
       }
    }

    let hitCount = 1; if (typeof effect?.multiHit === 'number') hitCount = effect.multiHit; else if (effect?.multiHit === true) hitCount = getMultiHitCount();
    let totalDamage = 0; for (let h = 0; h < hitCount; h++) { if ((isPlayer ? newEHp : newPHp) <= 0) break; if (finalMove.category !== MoveCategory.Status && Number(finalMove.power) > 0) { const sourceAtk = vAtk.transformed || attacker; const sourceDef = vDef.transformed || defender; const atkVal = getStat(sourceAtk, vAtk, finalMove.category === MoveCategory.Special ? 'special' : 'attack'); const defVal = getStat(sourceDef, vDef, finalMove.category === MoveCategory.Special ? 'special' : 'defense'); const critThreshold = effect?.highCrit ? 0.25 : 0.08; const isCritical = Math.random() < (vAtk.critBoost ? (critThreshold * 3) : critThreshold); const random = (Math.floor(Math.random() * 16) + 85) / 100; let damage = Math.floor((Math.floor((2 * sourceAtk.level) / 5 + 2) * finalMove.power * atkVal) / defVal / 50) + 2; damage = Math.floor(damage * (isCritical ? 1.5 : 1) * effectiveness * random); damage = Math.max(1, damage); if (vDef.substituteHp && vDef.substituteHp > 0) { vDef.substituteHp = Math.max(0, vDef.substituteHp - damage); addLog(`¡El sustituto de ${defender.name} recibió el golpe!`, 'EFFECT'); if (vDef.substituteHp <= 0) { delete vDef.substituteHp; addLog(`¡El sustituto de ${defender.name} se debilitó!`, 'FAINT'); } } else { if (isPlayer) newEHp = Math.max(0, newEHp - damage); else newPHp = Math.max(0, newPHp - damage); } if (isCritical && h === 0) addLog("¡Un golpe crítico!", 'CRITICAL'); setHitEffect(isPlayer ? 'enemy' : 'player'); totalDamage += damage; await new Promise(r => setTimeout(r, 300)); setHitEffect(null); } else break; }
    if (hitCount > 1) addLog(`¡Golpeó ${hitCount} veces!`, 'EFFECT'); if (effect?.recoil && totalDamage > 0) { const recoilDmg = Math.max(1, Math.floor(totalDamage * effect.recoil)); addLog(`¡${attacker.name} herido por el retroceso!`, 'EFFECT'); if (isPlayer) newPHp = Math.max(0, newPHp - recoilDmg); else newEHp = Math.max(0, newEHp - recoilDmg); await new Promise(r => setTimeout(r, 600)); }
    const onHit = applyOnHitEffects(finalMove, attacker, defender, isPlayer ? newVolatile.player : newVolatile.enemy, isPlayer ? newVolatile.enemy : newVolatile.player, totalDamage); fleeTriggered = !!onHit.fleeTriggered; if (isPlayer) { newVolatile.player = onHit.updatedAttacker; newVolatile.enemy = onHit.updatedDefender; if (newVolatile.enemy.leechSeed?.source === 'pending') newVolatile.enemy.leechSeed.source = 'player'; } else { newVolatile.enemy = onHit.updatedAttacker; newVolatile.player = onHit.updatedDefender; if (newVolatile.player.leechSeed?.source === 'pending') newVolatile.player.leechSeed.source = 'enemy'; } if (onHit.attackerFainted) { if (isPlayer) newPHp = 0; else newEHp = 0; addLog(`¡${attacker.name} se debilitó!`, 'FAINT'); }
    if (effect?.substitute && onHit.updatedAttacker.substituteHp) { const cost = Math.floor(attacker.maxHp / 4); if (isPlayer) newPHp = Math.max(1, newPHp - cost); else newEHp = Math.max(1, newEHp - cost); }
    if (finalMove.category === MoveCategory.Status && onHit.logs.length === 0 && !fleeTriggered) { addLog("¡Pero no ha tenido ningún efecto!", 'SYSTEM'); } else { onHit.logs.forEach(m => addLog(m, 'EFFECT')); }
    if (onHit.healAttacker > 0) { if (isPlayer) newPHp = Math.min(attacker.maxHp, newPHp + onHit.healAttacker); else newEHp = Math.min(attacker.maxHp, newEHp + onHit.healAttacker); } if (onHit.logs.length > 0) await new Promise(r => setTimeout(r, 800)); return { newPHp, newEHp, newVolatile, fleeTriggered };
  };

  const processEndOfTurnEffectsInternal = async (pIdx: number, pphp: number, pehp: number, pVolatile: any) => {
    const pActive = playerTeamState[pIdx]; const eActive = enemyTeamState[activeEnemyIdx]; if (!pActive || !eActive) return { battleEnded: true };
    let curPHp = pphp; let curEHp = pehp;
    if (pVolatile.player.lockedMove) { pVolatile.player.lockedMove.turnsLeft--; if (pVolatile.player.lockedMove.turnsLeft <= 0) { const isTrapping = pVolatile.player.lockedMove.isTrapping; delete pVolatile.player.lockedMove; if (!isTrapping) { pVolatile.player.volatile = { ...pVolatile.player.volatile, confusion: { turnsLeft: Math.floor(Math.random() * 3) + 2 } }; addLog(`¡${pActive.name} se calmó pero está confuso!`, 'EFFECT'); } else { addLog(`¡${pActive.name} ha dejado de atacar continuamente!`, 'EFFECT'); } } }
    if (pVolatile.enemy.lockedMove) { pVolatile.enemy.lockedMove.turnsLeft--; if (pVolatile.enemy.lockedMove.turnsLeft <= 0) { const isTrapping = pVolatile.enemy.lockedMove.isTrapping; delete pVolatile.enemy.lockedMove; if (!isTrapping) { pVolatile.enemy.volatile = { ...pVolatile.enemy.volatile, confusion: { turnsLeft: Math.floor(Math.random() * 3) + 2 } }; addLog(`¡${eActive.name} se calmó pero está confuso!`, 'EFFECT'); } else { addLog(`¡${eActive.name} ha dejado de atacar continuamente!`, 'EFFECT'); } } }
    const pEffect = applyEndOfTurnEffects(pActive, pVolatile.player); if (pEffect.log) { addLog(pEffect.log, 'EFFECT'); curPHp = Math.max(0, curPHp - pEffect.damage); setPlayerHp(curPHp); if (pEffect.healSource === 'enemy') { curEHp = Math.min(eActive.maxHp, curEHp + pEffect.damage); setEnemyHp(curEHp); } await new Promise(r => setTimeout(r, 600)); if (curPHp <= 0) { await processPlayerFaintInternal(pIdx, pVolatile.player.status); return { battleEnded: true }; } }
    const eEffect = applyEndOfTurnEffects(eActive, pVolatile.enemy); if (eEffect.log) { addLog(eEffect.log, 'EFFECT'); curEHp = Math.max(0, curEHp - eEffect.damage); setEnemyHp(curEHp); if (eEffect.healSource === 'player') { curPHp = Math.min(pActive.maxHp, curPHp + eEffect.damage); setPlayerHp(curPHp); } await new Promise(r => setTimeout(r, 600)); if (curEHp <= 0) { await processEnemyFaintInternal(pIdx, curPHp, pVolatile.player.status); return { battleEnded: true }; } }
    return { battleEnded: false };
  };

  const processEnemyFaintInternal = async (pIdx: number, finalPHp: number, pStatus?: string) => {
    const enemyFainted = enemyTeamState[activeEnemyIdx]; addLog(battleConfig.type === 'WILD' ? `¡${enemyFainted.name} salvaje se debilitó!` : `¡El ${enemyFainted.name} de ${battleConfig.opponentName} se debilitó!`, 'FAINT'); setEnemyTeamState(prev => prev.map((p, i) => i === activeEnemyIdx ? { ...p, currentHp: 0 } : p)); await new Promise(r => setTimeout(r, 1000));
    const playerActive = playerTeamState[pIdx]; 
    const xpGained = Math.floor((enemyFainted.baseExperience * enemyFainted.level) / 7); 
    addLog(`¡${playerActive.name} ganó ${xpGained} puntos de EXP!`, 'SYSTEM'); setIsExpAnimating(true);
    let currentLvl = playerActive.level; 
    let currentTotalExp = playerActive.exp; 
    const targetTotalExp = playerActive.exp + xpGained;
    const newLearned: {pokemonIndex: number, move: Move}[] = []; 
    const newEvolutions: {pokemonIndex: number, evolvedBase: PokemonBase}[] = [];
    let tempHistory = [...(playerActive.learnedMoveNames || [])]; 
    const movesQueuedInBattle = new Set<string>(); 
    let lastCancelled = playerActive.evolutionCancelledLevel || 0;
    for (let i = 0; i <= 20; i++) {
      currentTotalExp = Math.min(targetTotalExp, playerActive.exp + ((xpGained / 20) * i)); 
      setDisplayExp(Math.floor(currentTotalExp));
      if (currentTotalExp >= Math.pow(currentLvl + 1, 3)) { 
        currentLvl++; setDisplayLevel(currentLvl); addLog(`¡Nivel ${currentLvl}!`, 'STAT'); 
        let learnedAtLvl = getMoveLearnedAtLevel(playerActive.id, currentLvl); 
        const baseData = POKEDEX.find(p => p.id === playerActive.id); 
        const evoData = baseData?.evolution;
        if (evoData && currentLvl >= evoData.level) { 
            if (lastCancelled === 0 || currentLvl >= lastCancelled + 5) { 
                const nextBase = POKEDEX.find(p => p.id === evoData.toId); 
                if (nextBase && !newEvolutions.some(e => e.pokemonIndex === pIdx)) newEvolutions.push({ pokemonIndex: pIdx, evolvedBase: nextBase }); 
            } 
        }
        if (learnedAtLvl) { 
            const normalizedName = normalizeMoveName(learnedAtLvl.name); 
            const isInHistory = tempHistory.some(h => normalizeMoveName(h) === normalizedName); 
            const isAlreadyQueued = movesQueuedInBattle.has(normalizedName); 
            if (!isInHistory && !isAlreadyQueued) { 
                newLearned.push({ pokemonIndex: pIdx, move: learnedAtLvl }); 
                movesQueuedInBattle.add(normalizedName); 
                if (playerActive.moves.length < 4) tempHistory.push(learnedAtLvl.name); 
            } 
        }
        await new Promise(r => setTimeout(r, 200)); 
      }
      await new Promise(r => setTimeout(r, 30));
    }
    setLearnedMovesQueue(prev => [...prev, ...newLearned]); 
    setPendingEvolutionsQueue(prev => [...prev, ...newEvolutions]); 
    setIsExpAnimating(false); 
    await new Promise(r => setTimeout(r, 600));
    setPlayerTeamState(prev => {
        const latestPlayerInState = prev[pIdx];
        const updated = { ...latestPlayerInState, currentHp: finalPHp, exp: targetTotalExp, level: currentLvl, status: pStatus, learnedMoveNames: tempHistory };
        if (currentLvl > playerActive.level) { 
            updated.maxHp = Math.floor(((2 * updated.baseStats.hp + 31) * updated.level) / 100) + updated.level + 10; 
            updated.currentHp = updated.maxHp; 
        }
        return prev.map((p, i) => i === pIdx ? updated : p);
    });
    const nextEnemyIdx = enemyTeamState.findIndex((p, i) => i !== activeEnemyIdx && p.currentHp > 0);
    if (nextEnemyIdx !== -1) { 
        addLog(`¡${battleConfig.opponentName} enviará a ${enemyTeamState[nextEnemyIdx].name}!`, 'ENEMY'); 
        await new Promise(r => setTimeout(r, 1500)); 
        setActiveEnemyIdx(nextEnemyIdx); 
        setEnemyHp(enemyTeamState[nextEnemyIdx].maxHp); 
        setVolatile(prev => ({ player: prev.player, enemy: JSON.parse(JSON.stringify(INITIAL_VOLATILE)) })); 
        setPhase('PLAYER_INPUT'); 
    } else { setPhase('VICTORY_SUMMARY'); }
  };

  const processPlayerFaintInternal = async (pIdx: number, pStatus?: string) => { 
      addLog(`¡${playerTeamState[pIdx].name} se debilitó!`, 'FAINT'); 
      setPlayerTeamState(prev => prev.map((p, i) => i === pIdx ? { ...p, currentHp: 0, status: pStatus } : p)); 
      setVolatile(prev => ({ player: JSON.parse(JSON.stringify(INITIAL_VOLATILE)), enemy: prev.enemy })); 
      const nextIdx = playerTeamState.findIndex((p, i) => i !== pIdx && !isNaN(p.currentHp) && p.currentHp > 0); 
      if (nextIdx === -1) { await new Promise(r => setTimeout(r, 1000)); setPhase('DEFEAT_SUMMARY'); } 
      else { await new Promise(r => setTimeout(r, 1000)); setMenuView('TEAM'); setPhase('PROCESSING'); } 
  };

  const handleSwitch = async (idx: number) => {
    const oldIdx = activePlayerIdx; if (!playerTeamState[idx] || isNaN(playerTeamState[idx].currentHp) || playerTeamState[idx].currentHp <= 0 || idx === oldIdx) return;
    const isForced = phase === 'PROCESSING' || playerHp <= 0; setMenuView('MAIN'); setPhase('PROCESSING'); setPlayerTeamState(prev => prev.map((p, i) => i === oldIdx ? {...p, currentHp: playerHp, status: volatile.player.status} : p)); if (!isForced) { addLog(`¡${playerTeamState[oldIdx].name}, vuelve!`, 'PLAYER'); await new Promise(r => setTimeout(r, 800)); }
    setActivePlayerIdx(idx); setPlayerHp(playerTeamState[idx].currentHp); setDisplayExp(playerTeamState[idx].exp); setDisplayLevel(playerTeamState[idx].level); const nextVolatile = { player: { ...JSON.parse(JSON.stringify(INITIAL_VOLATILE)), status: playerTeamState[idx].status as any }, enemy: volatile.enemy }; setVolatile(nextVolatile); addLog(`¡Adelante, ${playerTeamState[idx].name}!`, 'PLAYER'); await new Promise(r => setTimeout(r, 1000));
    if (isForced) { if (enemyHp <= 0) await processEnemyFaintInternal(idx, playerTeamState[idx].currentHp, playerTeamState[idx].status); else setPhase('PLAYER_INPUT'); } 
    else { const eActive = enemyTeamState[activeEnemyIdx]; const eMove = eActive.moves[Math.floor(Math.random() * eActive.moves.length)]; const result = await executeAttackInternal(false, eActive, playerTeamState[idx], eMove, playerTeamState[idx].currentHp, enemyHp, nextVolatile); setPlayerHp(result.newPHp); setEnemyHp(result.newEHp); setVolatile(result.newVolatile); if (result.newPHp <= 0) await processPlayerFaintInternal(idx, result.newVolatile.player.status); else { const turnEnd = await processEndOfTurnEffectsInternal(idx, result.newPHp, result.newEHp, result.newVolatile); if (!turnEnd.battleEnded) setPhase('PLAYER_INPUT'); } }
  };

  const handleUseItemInBattle = async (newTeam: PokemonInstance[], message: string) => {
    const pIdx = activePlayerIdx; setPlayerTeamState(newTeam); const updatedActive = newTeam[pIdx]; if (updatedActive) { setPlayerHp(updatedActive.currentHp); setVolatile(prev => ({ ...prev, player: { ...prev.player, status: updatedActive.status as any } })); }
    addLog(message, 'EFFECT'); setShowItemBag(false); setMenuView('MAIN'); setPhase('PROCESSING'); await new Promise(r => setTimeout(r, 1000));
    const eActive = enemyTeamState[activeEnemyIdx]; const eMove = eActive.moves[Math.floor(Math.random() * eActive.moves.length)]; const result = await executeAttackInternal(false, eActive, updatedActive, eMove, updatedActive.currentHp, enemyHp, { player: { ...volatile.player, status: updatedActive.status as any }, enemy: volatile.enemy }); setPlayerHp(result.newPHp); setEnemyHp(result.newEHp); setVolatile(result.newVolatile); if (result.newPHp <= 0) await processPlayerFaintInternal(pIdx, result.newVolatile.player.status); else { const turnEnd = await processEndOfTurnEffectsInternal(pIdx, result.newPHp, result.newEHp, result.newVolatile); if (!turnEnd.battleEnded) setPhase('PLAYER_INPUT'); }
  };

  const handleManualCatchResult = async (success: boolean) => {
    setMenuView('MAIN'); if (success) setPhase('CAUGHT_SUMMARY');
    else { addLog(`¡Nooo! ¡Se ha escapado de la Poké Ball!`, 'SYSTEM'); setPhase('PROCESSING'); const eActive = enemyTeamState[activeEnemyIdx]; const eMove = eActive.moves[Math.floor(Math.random() * eActive.moves.length)]; await new Promise(r => setTimeout(r, 1000)); const result = await executeAttackInternal(false, eActive, playerTeamState[activePlayerIdx], eMove, playerHp, enemyHp, volatile); setPlayerHp(result.newPHp); setEnemyHp(result.newEHp); setVolatile(result.newVolatile); if (result.newPHp <= 0) await processPlayerFaintInternal(activePlayerIdx, result.newVolatile.player.status); else { const turnEnd = await processEndOfTurnEffectsInternal(activePlayerIdx, result.newPHp, result.newEHp, result.newVolatile); if (!turnEnd.battleEnded) setPhase('PLAYER_INPUT'); } }
  };

  const currentPlayer = playerTeamState[activePlayerIdx]; const currentEnemy = enemyTeamState[activeEnemyIdx];
  if (!currentPlayer || !currentEnemy) return <div className="h-full w-full bg-black flex items-center justify-center text-white font-pixel text-[8px]">Iniciando...</div>;
  const isPlayerLocked = !!volatile.player.bide || !!volatile.player.recharging || !!volatile.player.trapped || !!volatile.player.lockedMove || !!volatile.player.chargingMove;

  return (
    <div className="flex flex-col h-full bg-gray-900 font-sans overflow-hidden select-none">
      {showItemBag && <BagOverlay trainer={{...trainer, team: getSyncedPlayerTeam(playerTeamState, activePlayerIdx, playerHp, volatile.player.status)}} activePokemon={currentPlayer} onUseItem={handleUseItemInBattle} onClose={() => setShowItemBag(false)} />}
      
      {menuView === 'TEAM' && ( <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"><div className="bg-white rounded-[40px] shadow-2xl w-full max-sm overflow-hidden border-b-[12px] border-blue-600 animate-in zoom-in duration-300"><div className="h-24 bg-blue-600 flex items-center justify-center relative overflow-hidden"><i className="fas fa-users text-4xl text-white opacity-20 absolute right-4 top-4"></i><h2 className="text-white font-pixel text-xs uppercase">Equipo Pokémon</h2></div><div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">{playerTeamState.map((p, i) => ( <button key={i} disabled={(isNaN(p.currentHp) || p.currentHp <= 0) || i === activePlayerIdx} onClick={() => handleSwitch(i)} className={`w-full flex items-center gap-4 p-3 rounded-2xl border-2 transition-all text-left relative ${i === activePlayerIdx ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : (isNaN(p.currentHp) || p.currentHp <= 0) ? 'bg-gray-100 border-gray-200 opacity-50 grayscale' : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm'}`}>{i === activePlayerIdx && <span className="absolute -top-2 -left-1 bg-blue-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-sm z-10 uppercase">En combate</span>}<img src={p.sprites.front} className="w-12 h-12 pixelated" alt={p.name} /><div className="flex-1 min-w-0"><div className="flex justify-between items-center mb-1"><div className="flex items-center gap-1"><h4 className="text-gray-800 font-black text-[10px] uppercase truncate">{p.name}</h4>{p.status && <span className={`${STATUS_COLORS[p.status]} text-white text-[6px] px-1 rounded-sm font-black`}>{p.status}</span>}</div><span className="text-[8px] font-bold text-gray-400">NV.{p.level}</span></div><HealthBar current={i === activePlayerIdx ? playerHp : p.currentHp} max={p.maxHp} /></div></button> ))}</div><div className="p-6 bg-gray-50 border-t border-gray-100"><button onClick={() => setMenuView('MAIN')} disabled={playerHp <= 0} className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${playerHp <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white shadow-lg active:scale-95 border-b-4 border-gray-900'}`}>{playerHp <= 0 ? 'Elija un Pokémon' : 'Volver'}</button></div></div></div> )}

      {menuView === 'CATCH_MODAL' && ( <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300"><div className="bg-white rounded-[40px] shadow-2xl w-full max-sm overflow-hidden border-b-[12px] border-red-600 animate-in zoom-in duration-300"><div className="h-32 bg-red-600 flex items-center justify-center relative overflow-hidden"><div className="absolute inset-0 opacity-10"><div className="grid grid-cols-4 gap-4 p-4 text-white"><i className="fas fa-dice-d20 text-4xl"></i><i className="fas fa-bullseye text-4xl"></i></div></div><div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/20"><i className="fas fa-bullseye text-4xl text-red-600 animate-pulse"></i></div></div><div className="p-8 text-center"><h2 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Captura</h2><div className="flex flex-col items-center mb-6"><span className="text-6xl font-black text-gray-800 drop-shadow-sm">45</span><p className="text-[10px] text-red-500 font-black uppercase mt-1 tracking-tighter">DC Dificultad</p></div><div className="grid grid-cols-2 gap-3"><button onClick={() => handleManualCatchResult(true)} className="bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all border-b-4 border-green-800">¡Atrapado!</button><button onClick={() => handleManualCatchResult(false)} className="bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all border-b-4 border-orange-800">Se escapó</button></div></div></div></div> )}

      <div className="h-[55%] relative bg-gradient-to-b from-blue-300 to-green-400 overflow-hidden">
        <div className={`absolute top-8 left-6 w-48 z-20 transition-all duration-500 ${phase !== 'INTRO' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}><div className="bg-white/95 p-2 rounded-lg shadow-lg border-2 border-gray-800"><div className="flex justify-between items-center mb-1"><div className="flex items-center gap-1 min-w-0"><span className="font-bold text-[10px] text-slate-900 uppercase truncate">{currentEnemy.name}</span>{volatile.enemy.status && <span className={`${STATUS_COLORS[volatile.enemy.status]} text-white text-[6px] px-1 rounded-sm font-black`}>{volatile.enemy.status}</span>}</div><span className="font-mono text-[9px] text-slate-900 font-black">NV.{currentEnemy.level}</span></div><HealthBar current={enemyHp} max={currentEnemy.maxHp} />{battleConfig.type !== 'WILD' && <TeamBalls total={enemyTeamState.length} fainted={enemyTeamState.filter(p => p.currentHp <= 0).length} />}</div></div>
        <div className="absolute top-12 right-12 w-32 h-32 flex items-end justify-center">{battleConfig.trainerSprite && phase === 'INTRO' ? <img src={battleConfig.trainerSprite} className="w-full h-full object-contain pixelated scale-125 animate-in slide-in-from-right duration-700" alt="T" /> : <img src={currentEnemy.sprites.front} className={`w-full h-full object-contain pixelated transition-all duration-700 ${phase === 'INTRO' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} ${hitEffect === 'enemy' ? 'shake flash-damage' : 'animate-bounce'}`} alt="E" />}</div>
        <div className={`absolute bottom-6 left-10 w-40 h-40 flex items-end justify-center transition-all duration-700 ${phase !== 'INTRO' && phase !== 'ENEMY_SEND' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}><img src={currentPlayer.sprites.back} className={`w-full h-full object-contain pixelated ${hitEffect === 'player' ? 'shake flash-damage' : ''}`} alt="P" /></div>
        <div className={`absolute bottom-8 right-6 w-52 z-20 transition-all duration-500 ${phase !== 'INTRO' && phase !== 'ENEMY_SEND' && phase !== 'PLAYER_SEND' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}><div className="bg-white/95 p-3 rounded-lg shadow-lg border-2 border-gray-800"><div className="flex justify-between items-center mb-1"><div className="flex items-center gap-1 min-w-0"><span className="font-bold text-[10px] text-slate-900 uppercase truncate">{currentPlayer.name}</span>{volatile.player.status && <span className={`${STATUS_COLORS[volatile.player.status]} text-white text-[6px] px-1 rounded-sm font-black`}>{volatile.player.status}</span>}</div><span className="font-mono text-[9px] text-slate-900 font-black">NV.{displayLevel}</span></div><HealthBar current={playerHp} max={currentPlayer.maxHp} /><div className="flex flex-col mt-1"><div className="flex justify-between items-center mb-0.5"><span className="text-[7px] font-bold text-gray-500 uppercase">PS {Math.max(0, Math.floor(playerHp))}/{currentPlayer.maxHp}</span><span className={`text-[7px] font-black ${isExpAnimating ? 'text-blue-600' : 'text-gray-400'}`}>EXP</span></div><ExpBar current={displayExp} level={displayLevel} isAnimating={isExpAnimating} /></div><div className="mt-1.5"><TeamBalls total={playerTeamState.length} fainted={playerTeamState.filter(p => p.currentHp <= 0).length} /></div></div></div>
      </div>
      
      <div className="h-[45%] flex flex-col bg-gray-950">
        <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-white">{logs.slice(-5).map((log, i) => (<div key={i} className={`mb-1 border-l-2 pl-3 py-0.5 animate-in fade-in ${log.type === 'PLAYER' ? 'border-blue-500' : log.type === 'ENEMY' ? 'border-red-500' : 'border-gray-500'}`}>{log.text}</div>))}<div ref={logsEndRef} /></div>
        <div className="h-44 p-2 grid grid-cols-2 gap-2 bg-gray-900 border-t-4 border-black/30">
          {(phase === 'PLAYER_INPUT' || (phase === 'PROCESSING' && menuView === 'TEAM')) && menuView === 'MAIN' && (
            <>
              {isPlayerLocked ? (
                <button 
                  onClick={() => handlePlayerMove(0)} 
                  className="col-span-2 bg-indigo-600 text-white font-black rounded-xl border-b-4 border-indigo-900 active:translate-y-1 transition-all uppercase text-[10px] flex flex-col items-center justify-center animate-pulse py-4"
                >
                  <i className="fas fa-hourglass-half text-xl mb-1"></i> CONTINUAR⏳
                </button>
              ) : (
                <>
                  <button onClick={() => setMenuView('MOVES')} className="bg-red-600 text-white font-black rounded-xl border-b-4 border-red-900 active:translate-y-1 transition-all uppercase text-[10px] flex flex-col items-center justify-center"><i className="fas fa-bolt text-xl mb-1"></i> Luchar</button>
                  <button onClick={() => setMenuView('TEAM')} className="bg-blue-600 text-white font-black rounded-xl border-b-4 border-blue-900 active:translate-y-1 transition-all uppercase text-[10px] flex flex-col items-center justify-center"><i className="fas fa-sync-alt text-xl mb-1"></i> Equipo</button>
                  <button onClick={() => setMenuView('BAG')} className="bg-orange-500 text-white font-black rounded-xl border-b-4 border-orange-900 active:translate-y-1 transition-all uppercase text-[10px] flex flex-col items-center justify-center"><i className="fas fa-briefcase text-xl mb-1"></i> Mochila</button>
                  <button onClick={() => battleConfig.isRunable && onRun(getSyncedPlayerTeam(playerTeamState, activePlayerIdx, playerHp, volatile.player.status))} disabled={!battleConfig.isRunable} className={`font-black rounded-xl border-b-4 uppercase text-[10px] flex flex-col items-center justify-center ${battleConfig.isRunable ? 'bg-gray-600 border-gray-800 text-white active:translate-y-1' : 'bg-gray-800 opacity-30 text-gray-500 cursor-not-allowed'}`}><i className="fas fa-running text-xl mb-1"></i> Huir</button>
                </>
              )}
            </>
          )}
          {phase === 'PLAYER_INPUT' && menuView === 'MOVES' && ( <div className="col-span-2 grid grid-cols-2 gap-2">{currentPlayer.moves.map((m, idx) => (<button key={idx} disabled={m.currentPp <= 0 || volatile.player.disabledMove?.moveName === m.name} onClick={() => handlePlayerMove(idx)} className={`flex flex-col items-center justify-center rounded-xl border-b-4 font-black p-2 transition-all active:scale-95 text-white ${volatile.player.disabledMove?.moveName === m.name ? 'bg-gray-700' : m.currentPp > 0 ? TYPE_COLORS[m.type] : 'bg-gray-800 opacity-50'}`}><span className="text-[10px] uppercase drop-shadow-md">{volatile.player.disabledMove?.moveName === m.name ? 'ANULADO' : m.name}</span><span className="text-[7px] opacity-80">PP {m.currentPp}/{m.maxPp}</span></button>))}<button onClick={() => setMenuView('MAIN')} className="col-span-2 bg-gray-700 text-white text-[8px] font-black py-1 rounded-lg uppercase">Volver</button></div> )}
          {menuView === 'BAG' && ( <div className="col-span-2 grid grid-cols-2 gap-2"><button disabled={!battleConfig.isCatchable} onClick={() => setMenuView('CATCH_MODAL')} className={`font-black rounded-xl border-b-4 active:translate-y-1 uppercase text-[10px] flex flex-col items-center justify-center py-4 ${battleConfig.isCatchable ? 'bg-red-600 text-white border-red-900' : 'bg-gray-700 text-gray-500 border-gray-800 opacity-50 cursor-not-allowed'}`}><i className="fas fa-bullseye text-xl mb-1"></i> Capturar</button><button onClick={() => setShowItemBag(true)} className="bg-orange-500 text-white font-black rounded-xl border-b-4 border-orange-900 active:translate-y-1 uppercase text-[10px] flex flex-col items-center justify-center py-4"><i className="fas fa-flask text-xl mb-1"></i> Objetos</button><button onClick={() => setMenuView('MAIN')} className="col-span-2 bg-gray-700 text-white text-[8px] font-black py-1 rounded-lg uppercase">Volver</button></div> )}
        </div>
      </div>

      {phase === 'VICTORY_SUMMARY' && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-[40px] w-full max-sm overflow-hidden border-b-[12px] border-yellow-600 shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className={`h-32 ${battleConfig.type === 'WILD' ? 'bg-indigo-500' : 'bg-yellow-500'} flex items-center justify-center relative`}>{battleConfig.type === 'WILD' ? <img src={currentEnemy.sprites.front} className="w-24 h-24 object-contain pixelated" /> : <img src={battleConfig.trainerSprite} className="w-32 h-32 object-contain pixelated mt-4" />}</div>
            <div className="p-8">
              <h2 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">{battleConfig.type === 'WILD' ? 'Combate Terminado' : '¡Victoria Total!'}</h2>
              <p className="text-gray-800 font-pixel text-xs leading-relaxed uppercase mb-4">¡Felicidades! Derrotaste al<br/><span className="text-lg font-black text-indigo-600 block mt-2">{battleConfig.type === 'WILD' ? currentEnemy.name : battleConfig.opponentName}</span></p>
              {battleConfig.rewardMoney > 0 && ( <p className="text-yellow-600 font-black text-sm mb-6 animate-bounce">¡Cobra ₽{battleConfig.rewardMoney} de la reserva!</p> )}
              <button onClick={() => onWin(battleConfig.rewardMoney, getSyncedPlayerTeam(playerTeamState, activePlayerIdx, playerHp, volatile.player.status), learnedMovesQueue, pendingEvolutionsQueue)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 border-b-4 border-indigo-800">Continuar Aventura</button>
            </div>
          </div>
        </div>
      )}
      {phase === 'DEFEAT_SUMMARY' && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-gray-800 rounded-[40px] w-full max-sm overflow-hidden border-b-[12px] border-black shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className="h-32 bg-gray-900 flex items-center justify-center relative border-b-4 border-black/20">{battleConfig.type === 'WILD' ? <img src={currentEnemy.sprites.front} className="w-24 h-24 object-contain grayscale opacity-80" /> : <img src={battleConfig.trainerSprite} className="w-32 h-32 object-contain pixelated mt-4 grayscale opacity-80" />}<div className="absolute top-4 right-4 bg-red-600/80 p-2 rounded-full shadow-sm animate-pulse"><i className="fas fa-skull text-white"></i></div></div>
            <div className="p-8">
              <h2 className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">¡DERROTA!</h2>
              <p className="text-gray-300 font-pixel text-xs leading-relaxed uppercase mb-4">¡<span className="text-lg font-black text-white block mt-2 mb-2">{battleConfig.type === 'WILD' ? currentEnemy.name : battleConfig.opponentName}</span> te venció!</p>
              <p className="text-red-400 font-bold text-[10px] uppercase mb-6 italic">Agotado por el esfuerzo,<br/>entregas el 50% de tus ahorros físicos y huyes...</p>
              <button onClick={() => onLose(getSyncedPlayerTeam(playerTeamState, activePlayerIdx, playerHp, volatile.player.status), 0)} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 border-b-4 border-gray-900">Ir al Centro Pokémon</button>
            </div>
          </div>
        </div>
      )}
      {phase === 'CAUGHT_SUMMARY' && ( <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"><div className="bg-white rounded-[40px] shadow-2xl w-full max-sm overflow-hidden border-b-[12px] border-red-600 shadow-2xl animate-in zoom-in duration-300 text-center"><div className="h-40 bg-red-600 flex items-center justify-center relative overflow-hidden"><div className="w-24 h-24 rounded-full border-[6px] border-gray-800 overflow-hidden bg-white shadow-2xl relative rotate-[-12deg] mt-4"><div className="absolute top-0 left-0 w-full h-1/2 bg-red-600 border-b-[6px] border-gray-800"></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-[6px] border-gray-800 rounded-full z-10 flex items-center justify-center"><div className="w-2 h-2 bg-gray-300 rounded-full"></div></div></div></div><div className="p-8"><h2 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">¡Captura Exitosa!</h2><p className="text-gray-800 font-pixel text-[10px] leading-relaxed uppercase mb-6">¡Enhorabuena!<br/>¡Has atrapado un <span className="text-lg font-black text-red-600 block mt-2">{currentEnemy.name}</span>!</p><button onClick={() => onCatch({ ...currentEnemy, currentHp: enemyHp, status: volatile.enemy.status }, getSyncedPlayerTeam(playerTeamState, activePlayerIdx, playerHp, volatile.player.status))} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 border-b-4 border-red-800">Continuar</button></div></div></div> )}
    </div>
  );
};

export default BattleScreen;
