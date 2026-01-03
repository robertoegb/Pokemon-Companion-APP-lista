
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';
const { onAuthStateChanged } = firebaseAuth;
const { doc, onSnapshot } = firebaseFirestore;
import { auth, db, createNewTrainer, updateTrainerData, createPokemonInstance, calculateHp, sanitizeTrainerData, consumeEvent } from './services/firebaseService';
import { GameState, Trainer, PokemonInstance, PokemonBase, BattleConfig, GymDef, ExplorationMethod, EvolutionData, MoveLearningData, NPC, Move, Item } from './types';
import LoginScreen from './components/LoginScreen';
import StarterSelection from './components/StarterSelection';
import MainGame from './components/MainGame';
import BattleScreen from './components/BattleScreen';
import EvolutionOverlay from './components/EvolutionOverlay';
import MoveLearningOverlay from './components/MoveLearningOverlay';
import ItemFoundOverlay from './components/ItemFoundOverlay';
import NpcEncounterOverlay from './components/NpcEncounterOverlay';
import NothingFoundOverlay from './components/NothingFoundOverlay';
import EventActionOverlay from './components/EventActionOverlay';
import Preloader from './components/Preloader';
import { POKEDEX, GYM_DATA, POKEMON_NAME_TO_ID, TRAINER_SPRITES } from './data';
import { LOCATION_DATA, DEFAULT_LOCATION } from './locationData';
import { ZONE_EVENT_PROBABILITIES } from './zoneEvents';
import { WILD_POKEMON_REGISTRY } from './wildEncountersData';
import { determineExplorationEvent, pickRandomItemFromPool, pickRandomNpcFromPool, pickWildPokemonEncounter, generateNpcTeam } from './services/eventService';
import { ALL_ITEMS } from './itemData';
import { ZONE_ITEMS_REGISTRY } from './zoneItemsData';
import { ZONE_NPC_REGISTRY } from './zoneNpcData';
import { getAllLearnedMovesUpToLevel, normalizeMoveName, getMoveByName } from './moveLearningData';
import { applyItemToPokemon } from './itemService';

// Carga perezosa de componentes con Cámara
const MatchJoinScreen = lazy(() => import('./components/MatchJoinScreen'));
const EventsModule = lazy(() => import('./components/EventsModule'));

const superNormalize = (s: string) => 
  s.toLowerCase().replace(/ñ/g, 'n').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '').trim();

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({ view: 'LOGIN', user: null, loading: true, error: null });
  const [showPreloader, setShowPreloader] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [activeBattleConfig, setActiveBattleConfig] = useState<BattleConfig | null>(null);
  const [pendingEvolution, setPendingEvolution] = useState<EvolutionData | null>(null);
  const [pendingMoveLearning, setPendingMoveLearning] = useState<MoveLearningData | null>(null);
  const [evolutionQueue, setEvolutionQueue] = useState<EvolutionData[]>([]);
  const [moveQueue, setMoveQueue] = useState<{instanceId: string, move: Move}[]>([]);
  const [foundItemData, setFoundItemData] = useState<any>(null);
  const [activeNpcEncounter, setActiveNpcEncounter] = useState<NPC | null>(null);
  const [showNothingFound, setShowNothingFound] = useState(false);
  const [scannedItemAction, setScannedItemAction] = useState<Item | null>(null);
  const [scannedMoveAction, setScannedMoveAction] = useState<{ move: Move, code: string } | null>(null);
  const [showGlobalDeletedNotice, setShowGlobalDeletedNotice] = useState(!!localStorage.getItem('pokeCompa_deleted_event'));
  const [tempMatchId, setTempMatchId] = useState<string | null>(sessionStorage.getItem('temp_match_id'));

  const findInRegistry = useCallback((registry: any, key: string) => {
    const normKey = superNormalize(key);
    const foundKey = Object.keys(registry).find(k => superNormalize(k) === normKey);
    return foundKey ? registry[foundKey] : null;
  }, []);

  useEffect(() => {
    let unsubscribeTrainer: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (localStorage.getItem('pokeCompa_deleted_event')) {
        setShowGlobalDeletedNotice(true);
        setDataReady(true);
        setGameState({ view: 'LOGIN', user: null, loading: false, error: null });
        return;
      }
      if (firebaseUser) {
        if (unsubscribeTrainer) unsubscribeTrainer();
        unsubscribeTrainer = onSnapshot(doc(db, 'trainers', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = sanitizeTrainerData(docSnap.data() as Trainer);
            sessionStorage.removeItem('temp_match_id');
            setGameState(prev => ({
              ...prev, user: data, loading: false, error: null,
              view: (prev.view === 'LOGIN' || prev.view === 'MATCH_JOIN' || prev.view === 'STARTER_SELECT' || prev.view === 'DASHBOARD') ? 'DASHBOARD' : prev.view
            }));
          } else {
            setGameState(prev => ({ ...prev, view: (prev.view === 'STARTER_SELECT') ? 'STARTER_SELECT' : 'MATCH_JOIN', loading: false, error: null }));
          }
          setDataReady(true);
        });
      } else {
        if (unsubscribeTrainer) unsubscribeTrainer();
        setGameState({ view: 'LOGIN', user: null, loading: false, error: null });
        setDataReady(true);
      }
    });
    return () => { unsubscribeAuth(); if (unsubscribeTrainer) unsubscribeTrainer(); };
  }, []);

  useEffect(() => {
    if (activeBattleConfig || pendingMoveLearning || pendingEvolution || !gameState.user) return;
    if (evolutionQueue.length > 0) {
      const nextEvo = evolutionQueue[0];
      const currentInTeam = gameState.user.team.find(p => p.instanceId === nextEvo.originalInstance.instanceId);
      setPendingEvolution({ ...nextEvo, originalInstance: currentInTeam || nextEvo.originalInstance });
      setEvolutionQueue(prev => prev.slice(1));
    } 
    else if (moveQueue.length > 0) {
      const next = moveQueue[0];
      const currentInTeam = gameState.user.team.find(p => p.instanceId === next.instanceId);
      if (!currentInTeam) { setMoveQueue(prev => prev.slice(1)); return; }
      const nextNormalized = normalizeMoveName(next.move.name);
      const alreadyHasMove = currentInTeam.moves.some(m => normalizeMoveName(m.name) === nextNormalized);
      const wasAlreadyRejected = currentInTeam.learnedMoveNames?.some(n => normalizeMoveName(n) === nextNormalized);
      if (alreadyHasMove || wasAlreadyRejected) { setMoveQueue(prev => prev.slice(1)); return; }
      setPendingMoveLearning({
        pokemon: currentInTeam, newMove: next.move,
        onLearned: (updated) => {
          const newTeam = gameState.user!.team.map(p => p.instanceId === updated.instanceId ? updated : p);
          handleUpdateTrainer({ team: newTeam });
          setMoveQueue(prev => prev.slice(1));
          setPendingMoveLearning(null);
        }
      });
    }
  }, [moveQueue, evolutionQueue, pendingMoveLearning, pendingEvolution, activeBattleConfig, gameState.user]);

  const handleUpdateTrainer = async (data: Partial<Trainer>) => {
    if (!gameState.user) return;
    await updateTrainerData(gameState.user.uid, data);
  };

  const runPostActionLevelCheck = (team: PokemonInstance[], allowEvolution: boolean = false) => {
      const newEvos: EvolutionData[] = [];
      const newMoves: {instanceId: string, move: Move}[] = [];
      team.forEach((p, idx) => {
          if (allowEvolution) {
              const baseData = POKEDEX.find(b => b.id === p.id);
              if (baseData?.evolution && p.level >= baseData.evolution.level) {
                  const lastCancelled = p.evolutionCancelledLevel || 0;
                  if (lastCancelled === 0 || p.level > lastCancelled) {
                      const targetBase = POKEDEX.find(b => b.id === baseData.evolution!.toId);
                      if (targetBase) {
                          newEvos.push({ originalInstance: p, evolvedBase: targetBase, teamIndex: idx, postBattleTeam: team });
                          return; 
                      }
                  }
              }
          }
          const possibleMoves = getAllLearnedMovesUpToLevel(p.id, p.level);
          possibleMoves.forEach(m => {
              const normName = normalizeMoveName(m.name);
              const alreadyKnows = p.moves.some(pm => normalizeMoveName(pm.name) === normName);
              const wasProcessed = p.learnedMoveNames?.some(lm => normalizeMoveName(lm) === normName);
              if (!alreadyKnows && !wasProcessed) { newMoves.push({ instanceId: p.instanceId, move: m }); }
          });
      });
      if (newEvos.length > 0) setEvolutionQueue(prev => [...prev, ...newEvos]);
      if (newMoves.length > 0) setMoveQueue(prev => [...prev, ...newMoves]);
  };

  const handleExplore = async (locationName: string, method: ExplorationMethod, subAreaId?: string) => {
    if (!gameState.user) return;
    const locationData = LOCATION_DATA[locationName] || DEFAULT_LOCATION;
    const currentSubArea = (subAreaId && locationData.subAreas?.[subAreaId]) ? locationData.subAreas[subAreaId] : null;
    let currentName = currentSubArea ? currentSubArea.name : locationData.name;
    if (method === 'safari-central') currentName = "Zona Safari (Área central)";
    if (method === 'safari-pesca') currentName = "Zona Safari (Pesca)";
    let suffix = '';
    if (method === 'surf') suffix = ' (surf)';
    else if (method === 'old-rod') suffix = ' (caña vieja)';
    else if (method === 'good-rod') suffix = ' (caña buena)';
    else if (method === 'super-rod') suffix = ' (supercaña)';
    const actionZoneKey = currentName + suffix;
    const events = findInRegistry(ZONE_EVENT_PROBABILITIES, actionZoneKey) || findInRegistry(ZONE_EVENT_PROBABILITIES, currentName) || { wild: 60, npc: 10, item: 10, nothing: 20 };
    const event = determineExplorationEvent(events);
    switch (event) {
      case 'WILD':
        const wildPool = findInRegistry(WILD_POKEMON_REGISTRY, actionZoneKey) || findInRegistry(WILD_POKEMON_REGISTRY, currentName);
        if (!wildPool || wildPool.length === 0) { setShowNothingFound(true); return; }
        const wildChoice = pickWildPokemonEncounter(wildPool);
        const base = POKEDEX.find(p => p.id === wildChoice.pokemonId);
        if (base) {
          if (!gameState.user.pokedexSeen.includes(base.id)) { handleUpdateTrainer({ pokedexSeen: Array.from(new Set([...gameState.user.pokedexSeen, base.id])) }); }
          const enemy = createPokemonInstance(base, wildChoice.level);
          setActiveBattleConfig({ type: 'WILD', opponentName: base.name, enemyTeam: [enemy], rewardMoney: 0, isCatchable: true, isRunable: true });
          setGameState(prev => ({ ...prev, view: 'BATTLE' }));
        } else { setShowNothingFound(true); }
        break;
      case 'NPC':
        const npcPool = findInRegistry(ZONE_NPC_REGISTRY, actionZoneKey) || findInRegistry(ZONE_NPC_REGISTRY, currentName) || [];
        const npc = pickRandomNpcFromPool(npcPool);
        if (npc) { setActiveNpcEncounter(npc); } else { setShowNothingFound(true); }
        break;
      case 'ITEM':
        const itemPool = findInRegistry(ZONE_ITEMS_REGISTRY, actionZoneKey) || findInRegistry(ZONE_ITEMS_REGISTRY, currentName) || [];
        if (itemPool.length === 0) { setShowNothingFound(true); return; }
        const found = pickRandomItemFromPool(itemPool);
        setFoundItemData(found);
        break;
      default:
        setShowNothingFound(true);
        break;
    }
  };

  const handleNpcChallenge = (npc: NPC, customTeam?: PokemonInstance[]) => {
    if (!gameState.user) return;
    const enemyTeam = customTeam || generateNpcTeam(npc);
    if (!enemyTeam || enemyTeam.length === 0) { setShowNothingFound(true); setActiveNpcEncounter(null); return; }
    const newSeen = [...gameState.user.pokedexSeen];
    let changed = false;
    enemyTeam.forEach(p => { if (!newSeen.includes(p.id)) { newSeen.push(p.id); changed = true; } });
    if (changed) handleUpdateTrainer({ pokedexSeen: Array.from(new Set(newSeen)) });
    setActiveBattleConfig({ type: 'TRAINER', opponentName: npc.name, trainerSprite: npc.sprite, enemyTeam, rewardMoney: npc.rewardMoney, isCatchable: false, isRunable: false, trainerDialog: npc.challengePhrase });
    setActiveNpcEncounter(null);
    setGameState(prev => ({ ...prev, view: 'BATTLE' }));
  };

  const handleTriggerEvent = async (code: string) => {
      if (!gameState.user) return;
      const user = gameState.user;
      
      const isInfiniteType = code.startsWith('&tmhm#') || code.startsWith('%item#');
      if (user.eventsConsumed?.includes(code) && !isInfiniteType) { 
        alert("Este código ya ha sido utilizado."); 
        return; 
      }
      
      if (code.startsWith('$wild#')) {
          await consumeEvent(user.uid, code);
          const parts = code.split('#');
          const pId = parseInt(parts[1]);
          const lvl = parseInt(parts[2]) || 50;
          const base = POKEDEX.find(p => p.id === pId);
          if (base) {
              const enemy = createPokemonInstance(base, lvl);
              setActiveBattleConfig({ type: 'WILD', opponentName: base.name, enemyTeam: [enemy], rewardMoney: 0, isCatchable: true, isRunable: false });
              setGameState(prev => ({ ...prev, view: 'BATTLE' }));
          }
          return;
      }

      if (code.startsWith('#npc#')) {
          const parts = code.split('#');
          const spriteId = parts[2] || 'joven';
          const pkmnSegments = parts.slice(3); 
          
          const specials: Record<string, NPC & { customTeam?: number[][] }> = {
              "lorelei": { id: 'lorelei_event', name: 'Lorelei (Alto Mando)', sprite: TRAINER_SPRITES.lorelei, challengePhrase: '¡Bienvenido a la Liga Pokémon! Soy Lorelei.', defeatPhrase: 'Mmm...', rewardMoney: 5000, teamSize: 5, weight: 1, customTeam: [[87,54], [91,54], [80,54], [124,56], [131,56]] },
              "bruno": { id: 'bruno_event', name: 'Bruno (Alto Mando)', sprite: TRAINER_SPRITES.bruno, challengePhrase: '¡Soy Bruno!', defeatPhrase: '¡Qué fuerza!', rewardMoney: 5000, teamSize: 5, weight: 1, customTeam: [[95,53], [106,55], [107,55], [95,56], [68,58]] },
              "agatha": { id: 'agatha_event', name: 'Agatha (Alto Mando)', sprite: TRAINER_SPRITES.agatha, challengePhrase: '¡Ese viejo de OAK se equivoca!', defeatPhrase: '¡Uuuh!', rewardMoney: 5000, teamSize: 5, weight: 1, customTeam: [[94,56], [42,56], [93,55], [24,58], [94,60]] },
              "lance": { id: 'lance_event', name: 'Lance (Alto Mando)', sprite: TRAINER_SPRITES.lance, challengePhrase: '¡Soy Lance!', defeatPhrase: '¡Increíble!', rewardMoney: 6000, teamSize: 5, weight: 1, customTeam: [[130,58], [148,56], [148,56], [142,60], [149,62]] },
              "champion": { id: 'blue_champion', name: 'Campeón Blue', sprite: TRAINER_SPRITES.blue, challengePhrase: '¡Hola! ¡Yo soy el Campeón!', defeatPhrase: '¡No!', rewardMoney: 8000, teamSize: 6, weight: 1, customTeam: [[28,59], [65,59], [103,61], [91,61], [38,63], [135,65]] },
              "blue": { id: 'blue_event', name: 'Rival Blue', sprite: TRAINER_SPRITES.blue, challengePhrase: '¡Eh! ¡Hagamos un combate!', defeatPhrase: '¡Perdí!', rewardMoney: 1500, teamSize: 6, weight: 1, customTeam: [[18,50], [65,50], [130,50], [103,50], [135,50], [28,50]] },
              "rocket_boss": { id: 'giovanni_event', name: 'Giovanni', sprite: TRAINER_SPRITES.giovanni, challengePhrase: 'No interferirás.', defeatPhrase: 'Hum...', rewardMoney: 3000, teamSize: 6, weight: 1, customTeam: [[31,50], [34,50], [112,50], [115,50], [51,50], [28,50]] }
          };

          if (pkmnSegments.length > 0) {
              const customTeam: PokemonInstance[] = [];
              pkmnSegments.forEach(seg => {
                  const [pId, lvl] = seg.split(',').map(n => parseInt(n));
                  const base = POKEDEX.find(p => p.id === pId);
                  if (base && !isNaN(lvl)) customTeam.push(createPokemonInstance(base, lvl));
              });
              if (customTeam.length > 0) {
                  await consumeEvent(user.uid, code);
                  const spriteUrl = (TRAINER_SPRITES as any)[spriteId] || TRAINER_SPRITES.joven;
                  handleNpcChallenge({ id: `event_${Date.now()}`, name: `Entrenador Especial`, sprite: spriteUrl, challengePhrase: '¡Te desafío!', defeatPhrase: '¡Increíble!', rewardMoney: customTeam.length * 200, teamSize: customTeam.length, weight: 1 }, customTeam);
                  return;
              }
          }
          if (specials[spriteId]) {
              await consumeEvent(user.uid, code);
              const boss = specials[spriteId];
              const team = boss.customTeam?.map(([id, lvl]) => createPokemonInstance(POKEDEX.find(p => p.id === id)!, lvl)) || [];
              handleNpcChallenge(boss, team);
              return;
          }
      }

      if (code.startsWith('%item#')) {
          const itemName = code.split('#')[1];
          const item = ALL_ITEMS.find(i => superNormalize(i.name) === superNormalize(itemName));
          if (item) setScannedItemAction(item); else alert("Objeto no reconocido.");
          return;
      }

      if (code.startsWith('&tmhm#')) {
          const parts = code.split('#');
          const moveName = parts[1];
          const machineCode = parts[2]?.toLowerCase();
          const move = getMoveByName(moveName);
          if (move && machineCode) setScannedMoveAction({ move, code: machineCode }); else alert("MT/MO no reconocida.");
          return;
      }
      alert("Código QR no reconocido.");
  };

  const handleApplyScannedItem = async (pkmnIdx: number) => {
    if (!scannedItemAction || !gameState.user) return;
    const { updated, message, success, evolvedBase } = applyItemToPokemon(gameState.user.team[pkmnIdx], scannedItemAction);
    if (success) {
      const code = `%item#${scannedItemAction.name}`;
      const newTeam = [...gameState.user.team];
      newTeam[pkmnIdx] = updated;
      if (evolvedBase) setEvolutionQueue(prev => [...prev, { originalInstance: updated, evolvedBase, teamIndex: pkmnIdx, postBattleTeam: newTeam }]);
      await handleUpdateTrainer({ team: newTeam });
      alert(message);
      setScannedItemAction(null);
      runPostActionLevelCheck(newTeam, true);
    }
  };

  const handleTeachScannedMove = async (pkmnIdx: number) => {
    if (!scannedMoveAction || !gameState.user) return;
    const pokemon = gameState.user.team[pkmnIdx];
    setMoveQueue(prev => [...prev, { instanceId: pokemon.instanceId, move: scannedMoveAction.move }]);
    setScannedMoveAction(null);
  };

  if (showPreloader) {
    return <Preloader isLoadingComplete={dataReady} onFinished={() => setShowPreloader(false)} />;
  }

  return (
    <Suspense fallback={<Preloader isLoadingComplete={false} onFinished={() => {}} />}>
      {gameState.view === 'LOGIN' && <LoginScreen onLoginSuccess={() => {}} />}
      
      {gameState.view === 'MATCH_JOIN' && !gameState.user && (
        <MatchJoinScreen onMatchJoined={(id) => { 
          sessionStorage.setItem('temp_match_id', id);
          setTempMatchId(id); 
          setGameState(prev => ({ ...prev, view: 'STARTER_SELECT' })); 
        }} />
      )}
      
      {gameState.view === 'STARTER_SELECT' && (
        <StarterSelection onSelect={async (starter, name) => {
          if (!auth.currentUser) return;
          const matchId = tempMatchId || sessionStorage.getItem('temp_match_id') || 'GLOBAL';
          const newTrainer = await createNewTrainer(auth.currentUser.uid, auth.currentUser.email!, starter, matchId, name);
          sessionStorage.removeItem('temp_match_id');
          setGameState(prev => ({ ...prev, user: newTrainer, view: 'DASHBOARD', loading: false }));
        }} />
      )}

      {gameState.view === 'BATTLE' && activeBattleConfig && gameState.user && (
        <BattleScreen 
          playerTeam={gameState.user.team} battleConfig={activeBattleConfig} currentLocation={gameState.user.currentLocation} trainer={gameState.user}
          onWin={async (money, team, moves, evos) => {
            if (moves?.length) setMoveQueue(prev => [...prev, ...moves.map(m => ({ instanceId: team[m.pokemonIndex].instanceId, move: m.move }))]);
            if (evos?.length) setEvolutionQueue(prev => [...prev, ...evos.map(e => ({ originalInstance: team[e.pokemonIndex], evolvedBase: e.evolvedBase, teamIndex: e.pokemonIndex, postBattleTeam: team }))]);
            
            const user = gameState.user!;
            const update: Partial<Trainer> = { 
              team, 
              money: (user.money || 0) + money 
            };

            if (activeBattleConfig.type === 'GYM' && activeBattleConfig.gymId) {
                const gymId = activeBattleConfig.gymId;
                const gym = GYM_DATA.find(g => g.id === gymId);
                const trainerIdx = activeBattleConfig.trainerIndex ?? 0;
                const isLeader = gym?.trainers[trainerIdx]?.isLeader;

                if (isLeader) {
                    update.badges = Array.from(new Set([...(user.badges || []), gymId]));
                } else {
                    const currentProg = user.gymProgress?.[gymId] || 0;
                    if (trainerIdx === currentProg) {
                        update.gymProgress = { 
                            ...(user.gymProgress || {}), 
                            [gymId]: currentProg + 1 
                        };
                    }
                }
            }

            setGameState(prev => ({ ...prev, view: 'DASHBOARD' }));
            await handleUpdateTrainer(update);
            setActiveBattleConfig(null);
            runPostActionLevelCheck(team, false);
          }} 
          onCatch={async (p, team) => {
            const updatedPc = [...(gameState.user!.pcStorage || [])];
            const updatedTeam = team.length < 6 ? [...team, p] : [...team];
            if (team.length >= 6) updatedPc.push(p);
            setGameState(prev => ({ ...prev, view: 'DASHBOARD' }));
            await updateTrainerData(gameState.user!.uid, { team: updatedTeam, pcStorage: updatedPc, pokedexCaught: Array.from(new Set([...(gameState.user!.pokedexCaught || []), p.id])), pokedexSeen: Array.from(new Set([...(gameState.user!.pokedexSeen || []), p.id])) });
            setActiveBattleConfig(null);
            runPostActionLevelCheck(updatedTeam, false);
          }}
          onLose={(t) => { handleUpdateTrainer({ team: t }); setGameState(prev => ({ ...prev, view: 'DASHBOARD' })); setActiveBattleConfig(null); }}
          onRun={(t) => { handleUpdateTrainer({ team: t }); setGameState(prev => ({ ...prev, view: 'DASHBOARD' })); setActiveBattleConfig(null); }}
        />
      )}

      {gameState.view === 'DASHBOARD' && gameState.user && (
        <MainGame 
          trainer={gameState.user} onLogout={() => auth.signOut()} onExplore={handleExplore} onUpdateTrainer={handleUpdateTrainer} onTravel={(l) => handleUpdateTrainer({ currentLocation: l })}
          onChallengeGym={(gym, idx) => {
              const trainerDef = gym.trainers[idx];
              const enemyTeam = trainerDef.pokemonNames.map((name, pIdx) => {
                  const base = POKEDEX.find(p => p.id === (POKEMON_NAME_TO_ID[name]?.id || 1))!;
                  // Fix: levels property is an array, access by index or default to first element
                  const level = trainerDef.levels[pIdx] || trainerDef.levels[0] || 5;
                  return createPokemonInstance(base, level);
              });
              setActiveBattleConfig({ type: 'GYM', gymId: gym.id, trainerIndex: idx, opponentName: trainerDef.name, trainerSprite: trainerDef.sprite, enemyTeam, rewardMoney: 500, isCatchable: false, isRunable: false });
              setGameState(prev => ({ ...prev, view: 'BATTLE' }));
          }} 
          onReset={() => setGameState(prev => ({ ...prev, view: 'STARTER_SELECT' }))} 
          onTriggerEvolution={(evo) => setEvolutionQueue(prev => [...prev, evo])}
          onTriggerMoveLearning={(p, m) => setMoveQueue(prev => [...prev, {instanceId: p.instanceId, move: m}])}
          onTriggerEvent={handleTriggerEvent}
          onPostActionCheck={(team) => runPostActionLevelCheck(team, true)}
        />
      )}
      
      {/* Overlays comunes */}
      {(scannedItemAction || scannedMoveAction) && gameState.user && (<EventActionOverlay trainer={gameState.user} scannedItem={scannedItemAction || undefined} scannedMove={scannedMoveAction || undefined} onApplyItem={handleApplyScannedItem} onTeachMove={handleTeachScannedMove} onCancel={() => { setScannedItemAction(null); setScannedMoveAction(null); }} />)}
      {foundItemData && <ItemFoundOverlay itemName={foundItemData.name} quantity={foundItemData.quantity} locationDescription={foundItemData.locationDescription} onClose={() => setFoundItemData(null)} />}
      {activeNpcEncounter && <NpcEncounterOverlay npc={activeNpcEncounter} onAccept={() => handleNpcChallenge(activeNpcEncounter)} onIgnore={() => setActiveNpcEncounter(null)} />}
      {showNothingFound && <NothingFoundOverlay onContinue={() => setShowNothingFound(false)} />}
      {pendingEvolution && (<EvolutionOverlay original={pendingEvolution.originalInstance} evolvedBase={pendingEvolution.evolvedBase} onComplete={() => { const original = pendingEvolution.originalInstance; const evolvedInstance: PokemonInstance = { ...original, id: pendingEvolution.evolvedBase.id, name: pendingEvolution.evolvedBase.name, types: pendingEvolution.evolvedBase.types, baseStats: pendingEvolution.evolvedBase.baseStats, baseExperience: pendingEvolution.evolvedBase.baseExperience, catchRate: pendingEvolution.evolvedBase.catchRate, sprites: pendingEvolution.evolvedBase.sprites, evolution: pendingEvolution.evolvedBase.evolution, learnedMoveNames: Array.from(new Set([...(original.learnedMoveNames || [])])) }; evolvedInstance.maxHp = calculateHp(evolvedInstance.baseStats.hp, evolvedInstance.level); evolvedInstance.currentHp = Math.floor((original.currentHp / original.maxHp) * evolvedInstance.maxHp); const newTeam = gameState.user!.team.map(p => p.instanceId === evolvedInstance.instanceId ? evolvedInstance : p); handleUpdateTrainer({ team: newTeam, pokedexCaught: Array.from(new Set([...(gameState.user!.pokedexCaught || []), evolvedInstance.id])) }); setPendingEvolution(null); setTimeout(() => runPostActionLevelCheck(newTeam, false), 300); }} onCancel={(lvl) => { const newTeam = gameState.user!.team.map(p => p.instanceId === pendingEvolution.originalInstance.instanceId ? { ...p, evolutionCancelledLevel: lvl } : p); handleUpdateTrainer({ team: newTeam }); setPendingEvolution(null); setTimeout(() => runPostActionLevelCheck(newTeam, false), 300); }} />)}
      {pendingMoveLearning && (<MoveLearningOverlay pokemon={pendingMoveLearning.pokemon} newMove={pendingMoveLearning.newMove} onComplete={pendingMoveLearning.onLearned} onCancel={(p) => { const newTeam = gameState.user!.team.map(pk => pk.instanceId === p.instanceId ? p : pk); handleUpdateTrainer({ team: newTeam }); setMoveQueue(prev => prev.slice(1)); setPendingMoveLearning(null); }} />)}
      {showGlobalDeletedNotice && (<div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center p-8 text-center"><h1 className="text-white font-pixel text-xl mb-4">PARTIDA BORRADA</h1><p className="text-gray-400 text-xs mb-8">Tu progreso ha sido eliminado correctamente.</p><button onClick={() => { localStorage.removeItem('pokeCompa_deleted_event'); window.location.reload(); }} className="bg-white text-black font-pixel p-4 rounded-xl uppercase">REINICIAR APP</button></div>)}
    </Suspense>
  );
};

export default App;
