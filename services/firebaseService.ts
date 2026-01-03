
import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';

const { initializeApp, getApp, getApps } = firebaseApp;
const { getAuth } = firebaseAuth;
const { 
  getFirestore, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  writeBatch,
  query,
  where,
  getDocs
} = firebaseFirestore;

import { FIREBASE_CONFIG } from '../constants';
import { Trainer, PokemonInstance, PokemonBase, InstanceMove, Interaction } from '../types';
import { ALL_MOVES } from '../pokedexData';
import { getMovesForLevel, getAllLearnedMovesUpToLevel } from '../moveLearningData';

// Fix: Namespace imports and destructuring to resolve module export errors in specific environments
// Modular initialization for Firebase app
const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const generateId = () => Math.random().toString(36).substring(2, 15);

const normalizeStr = (s: string) => 
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const cleanData = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => (v && typeof v === 'object') ? cleanData(v) : v);
  }
  const newObj: any = {};
  if (!obj || typeof obj !== 'object' || obj instanceof Date) return obj;
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
        newObj[key] = cleanData(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
  });
  return newObj;
};

export const calculateHp = (base: number, level: number) => {
  const lvl = isNaN(level) || level < 1 ? 5 : level;
  const b = isNaN(base) || base < 1 ? 10 : base;
  return Math.floor(((2 * b + 31) * lvl) / 100) + lvl + 10;
};

export const createPokemonInstance = (base: PokemonBase, level: number): PokemonInstance => {
  const maxHp = calculateHp(base.baseStats.hp, level);
  const currentExp = Math.pow(level, 3);
  const nextLevelExp = Math.pow(level + 1, 3);
  
  const autoMoves = getMovesForLevel(base.id, level);
  const movesWithPp: InstanceMove[] = autoMoves.map(m => ({ 
    ...m, 
    currentPp: m.maxPp 
  }));

  if (movesWithPp.length === 0) {
     const defaultMove = ALL_MOVES.find(m => m.name === 'Placaje') || ALL_MOVES[0];
     movesWithPp.push({ ...defaultMove, currentPp: defaultMove.maxPp });
  }

  // Al crear, marcamos todos los movimientos de niveles anteriores como "procesados"
  const historicalMoves = getAllLearnedMovesUpToLevel(base.id, level);
  const historicalNames = historicalMoves.map(m => m.name);

  return cleanData({
    ...base,
    instanceId: generateId(),
    level,
    maxHp,
    currentHp: maxHp,
    exp: currentExp,
    expToNextLevel: nextLevelExp,
    moves: movesWithPp,
    learnedMoveNames: Array.from(new Set([...historicalNames, ...movesWithPp.map(m => m.name)]))
  });
};

export const sanitizeTrainerData = (data: Trainer): Trainer => {
  const sanitizePokemon = (p: PokemonInstance) => {
    let pokemon = { ...p };
    if (isNaN(pokemon.level) || pokemon.level === null) pokemon.level = 5;
    if (isNaN(pokemon.exp) || pokemon.exp === null) pokemon.exp = Math.pow(pokemon.level, 3);
    
    const correctMaxHp = calculateHp(pokemon.baseStats.hp, pokemon.level);
    pokemon.maxHp = correctMaxHp;
    
    if (isNaN(pokemon.currentHp) || pokemon.currentHp === null) {
        pokemon.currentHp = pokemon.maxHp;
    }
    if (pokemon.currentHp > pokemon.maxHp) {
        pokemon.currentHp = pokemon.maxHp;
    }

    // CRÍTICO: Siempre sincronizamos el historial de movimientos aprendidos
    // para que incluya todo lo legal hasta el nivel actual.
    const historicalMoves = getAllLearnedMovesUpToLevel(pokemon.id, pokemon.level);
    const existingHistory = pokemon.learnedMoveNames || [];
    pokemon.learnedMoveNames = Array.from(new Set([
      ...historicalMoves.map(m => m.name),
      ...existingHistory,
      ...pokemon.moves.map(m => m.name)
    ]));

    if (pokemon.moves.length === 0) {
        const defaultMove = ALL_MOVES.find(m => m.name === 'Placaje') || ALL_MOVES[0];
        pokemon.moves = [{ ...defaultMove, currentPp: defaultMove.maxPp }];
        if (!pokemon.learnedMoveNames.includes(defaultMove.name)) {
            pokemon.learnedMoveNames.push(defaultMove.name);
        }
    }

    pokemon.moves = pokemon.moves.map(move => {
      const moveDef = ALL_MOVES.find(m => normalizeStr(m.name) === normalizeStr(move.name));
      if (moveDef) {
        return {
          ...move,
          name: moveDef.name,
          power: moveDef.power,
          accuracy: moveDef.accuracy,
          category: moveDef.category,
          type: moveDef.type,
          maxPp: moveDef.maxPp,
          currentPp: (move.currentPp === undefined || isNaN(move.currentPp) || move.currentPp === null) ? moveDef.maxPp : move.currentPp
        };
      }
      return move;
    });
    return pokemon;
  };

  return { 
    ...data, 
    money: data.money || 0,
    team: (data.team || []).map(sanitizePokemon),
    pcStorage: (data.pcStorage || []).map(sanitizePokemon),
    inventory: {
        potions: data.inventory?.potions || 0,
        pokeballs: data.inventory?.pokeballs || 0,
        superballs: data.inventory?.superballs || 0,
        ultraballs: data.inventory?.ultraballs || 0,
        items: data.inventory?.items || {}
    },
    badges: data.badges || [], 
    pokedexCaught: data.pokedexCaught || [],
    pokedexSeen: data.pokedexSeen || [],
    gymProgress: data.gymProgress || {},
    eventsConsumed: data.eventsConsumed || []
  };
};

export const createNewTrainer = async (uid: string, email: string, starter: PokemonBase, matchId: string, name?: string) => {
  const starterInstance = createPokemonInstance(starter, 5);
  const newTrainer: Trainer = {
    uid,
    email,
    name: name || email.split('@')[0],
    money: 1000,
    team: [starterInstance],
    pcStorage: [], 
    inventory: { potions: 5, pokeballs: 5, superballs: 2, ultraballs: 1, items: {} },
    currentLocation: 'Ruta 1',
    pokedexCaught: [starter.id],
    pokedexSeen: [starter.id],
    badges: [],
    gymProgress: {},
    matchId: matchId.toUpperCase(),
    eventsConsumed: []
  };
  await setDoc(doc(db, 'trainers', uid), cleanData(newTrainer));
  return newTrainer;
};

export const resetTrainerData = async (uid: string) => {
  await deleteDoc(doc(db, 'trainers', uid));
};

export const getTrainerData = async (uid: string): Promise<Trainer | null> => {
  const docSnap = await getDoc(doc(db, 'trainers', uid));
  if (docSnap.exists()) {
    return sanitizeTrainerData(docSnap.data() as Trainer);
  }
  return null;
};

export const updateTrainerData = async (uid: string, data: Partial<Trainer>) => {
  const cleaned = cleanData(data);
  await updateDoc(doc(db, 'trainers', uid), cleaned);
};

export const updateMatchId = async (uid: string, matchId: string) => {
  await updateDoc(doc(db, 'trainers', uid), { matchId: matchId || "" });
};

export const sendInteractionRequest = async (fromTrainer: Trainer, toUid: string, type: 'DUEL' | 'TRADE', stakeBadgeId?: string) => {
  const toSnap = await getDoc(doc(db, 'trainers', toUid));
  const toData = toSnap.data() as Trainer;

  await addDoc(collection(db, 'interactions'), cleanData({
    fromUid: fromTrainer.uid,
    fromName: fromTrainer.name,
    toUid: toUid,
    toName: toData?.name || 'Entrenador',
    fromTeamSize: fromTrainer.team.length,
    type: type,
    status: 'PENDING',
    fromReady: false,
    toReady: false,
    fromOffer: null,
    toOffer: null,
    stakeBadgeId: stakeBadgeId || null,
    timestamp: serverTimestamp(),
    matchId: fromTrainer.matchId || 'global'
  }));
};

export const respondToInteraction = async (interactionId: string, response: 'ACCEPTED' | 'REJECTED', toTeamSize?: number) => {
  const cleanId = interactionId.split('/').pop() || interactionId;
  const docRef = doc(db, 'interactions', cleanId);
  if (response === 'REJECTED') {
    await deleteDoc(docRef);
  } else {
    await updateDoc(docRef, { 
      status: 'ACCEPTED', 
      toTeamSize: toTeamSize || 1,
      'pvpConfig.pokemonCount': 1 
    });
  }
};

export const updateTradeOffer = async (interactionId: string, uid: string, isFrom: boolean, pokemon: PokemonInstance | null) => {
  const cleanId = interactionId.split('/').pop() || interactionId;
  const docRef = doc(db, 'interactions', cleanId);
  const update: any = isFrom 
    ? { fromOffer: pokemon, fromReady: false, toReady: false } 
    : { toOffer: pokemon, fromReady: false, toReady: false };
  await updateDoc(docRef, cleanData(update));
};

export const setTradeReady = async (interactionId: string, isFrom: boolean, ready: boolean) => {
  const cleanId = interactionId.split('/').pop() || interactionId;
  const docRef = doc(db, 'interactions', cleanId);
  const update = isFrom ? { fromReady: ready } : { toReady: ready };
  await updateDoc(docRef, update);
};

export const executeTradeExchange = async (interaction: Interaction) => {
  if (!interaction.fromOffer || !interaction.toOffer || interaction.status !== 'ACCEPTED') return;
  
  const fromRef = doc(db, 'trainers', interaction.fromUid);
  const toRef = doc(db, 'trainers', interaction.toUid);
  
  const fromSnap = await getDoc(fromRef);
  const toSnap = await getDoc(toRef);
  
  if (!fromSnap.exists() || !toSnap.exists()) return;
  
  const fromData = fromSnap.data() as Trainer;
  const toData = toSnap.data() as Trainer;
  
  const fromNewTeam = fromData.team.map(p => p.instanceId === interaction.fromOffer!.instanceId ? interaction.toOffer! : p);
  const toNewTeam = toData.team.map(p => p.instanceId === interaction.toOffer!.instanceId ? interaction.fromOffer! : p);
  
  const fromNewCaught = Array.from(new Set([...(fromData.pokedexCaught || []), interaction.toOffer!.id]));
  const fromNewSeen = Array.from(new Set([...(fromData.pokedexSeen || []), interaction.toOffer!.id]));
  
  const toNewCaught = Array.from(new Set([...(toData.pokedexCaught || []), interaction.fromOffer!.id]));
  const toNewSeen = Array.from(new Set([...(toData.pokedexSeen || []), interaction.fromOffer!.id]));
  
  const batch = writeBatch(db);
  const cleanIntId = interaction.id.split('/').pop() || interaction.id;
  
  batch.update(fromRef, cleanData({ team: fromNewTeam, pokedexCaught: fromNewCaught, pokedexSeen: fromNewSeen }));
  batch.update(toRef, cleanData({ team: toNewTeam, pokedexCaught: toNewCaught, pokedexSeen: toNewSeen }));
  batch.update(doc(db, 'interactions', cleanIntId), { status: 'COMPLETED' });
  
  await batch.commit();
};

export const consumeEvent = async (uid: string, code: string) => {
  const trainerRef = doc(db, 'trainers', uid);
  const trainerSnap = await getDoc(trainerRef);
  if (trainerSnap.exists()) {
    const data = trainerSnap.data() as Trainer;
    const eventsConsumed = Array.from(new Set([...(data.eventsConsumed || []), code]));
    await updateDoc(trainerRef, { eventsConsumed });
  }
};

export const checkMatchCapacity = async (matchId: string): Promise<boolean> => {
  const q = query(collection(db, 'trainers'), where('matchId', '==', matchId.toUpperCase()));
  const snapshot = await getDocs(q);
  return snapshot.size < 5;
};

export const updatePvpConfig = async (interactionId: string, pokemonCount: number) => {
  const docRef = doc(db, 'interactions', interactionId);
  await updateDoc(docRef, { 
    status: 'SETUP', 
    'pvpConfig.pokemonCount': pokemonCount 
  });
};

export const confirmPvpSelection = async (interactionId: string, uid: string, isFrom: boolean, selection: PokemonInstance[]) => {
  const docRef = doc(db, 'interactions', interactionId);
  const update: any = isFrom 
    ? { fromReady: true, 'pvpConfig.fromSelection': selection } 
    : { toReady: true, 'pvpConfig.toSelection': selection };
  await updateDoc(docRef, cleanData(update));
};

export const startPvpBattle = async (interactionId: string) => {
  const docRef = doc(db, 'interactions', interactionId);
  await updateDoc(docRef, { status: 'BATTLE', fromReady: false, toReady: false });
};

export const updatePvpActiveIdx = async (interactionId: string, isFrom: boolean, idx: number, useSwitch: boolean) => {
  const docRef = doc(db, 'interactions', interactionId);
  const update: any = isFrom 
    ? { 'pvpConfig.fromActiveIdx': idx } 
    : { 'pvpConfig.toActiveIdx': idx };
  if (useSwitch) {
    if (isFrom) update['pvpConfig.fromSwitchUsed'] = true;
    else update['pvpConfig.toSwitchUsed'] = true;
  }
  await updateDoc(docRef, update);
};

export const markPvpFainted = async (interactionId: string, isFrom: boolean, idx: number, totalCount: number) => {
  const docRef = doc(db, 'interactions', interactionId);
  const interactionSnap = await getDoc(docRef);
  if (!interactionSnap.exists()) return;
  const interaction = interactionSnap.data() as Interaction;
  
  const currentFainted = (isFrom ? interaction.pvpConfig?.fromFaintedIndices : interaction.pvpConfig?.toFaintedIndices) || [];
  const nextFainted = Array.from(new Set([...currentFainted, idx]));
  
  const update: any = isFrom 
    ? { 'pvpConfig.fromFaintedIndices': nextFainted } 
    : { 'pvpConfig.toFaintedIndices': nextFainted };
    
  if (nextFainted.length >= totalCount) {
    update['pvpConfig.winnerUid'] = isFrom ? interaction.toUid : interaction.fromUid;
  }
  
  await updateDoc(docRef, update);
};

export const finalizePvpRewards = async (interactionId: string, winnerUid: string, loserUid: string, reward: number) => {
  const batch = writeBatch(db);
  const interactionRef = doc(db, 'interactions', interactionId);
  const interactionSnap = await getDoc(interactionRef);
  
  if (!interactionSnap.exists()) return;
  const interaction = interactionSnap.data() as Interaction;

  const fromRef = doc(db, 'trainers', interaction.fromUid);
  const toRef = doc(db, 'trainers', interaction.toUid);
  
  const fromSnap = await getDoc(fromRef);
  const toSnap = await getDoc(toRef);
  
  if (fromSnap.exists() && toSnap.exists()) {
    const fromData = fromSnap.data() as Trainer;
    const toData = toSnap.data() as Trainer;
    
    const fromFaintedIds = interaction.pvpConfig?.fromFaintedIndices?.map(idx => interaction.pvpConfig?.fromSelection?.[idx].instanceId) || [];
    const toFaintedIds = interaction.pvpConfig?.toFaintedIndices?.map(idx => interaction.pvpConfig?.toSelection?.[idx].instanceId) || [];

    const fromUpdatedTeam = fromData.team.map(p => 
      fromFaintedIds.includes(p.instanceId) ? { ...p, currentHp: 0 } : p
    );
    const toUpdatedTeam = toData.team.map(p => 
      toFaintedIds.includes(p.instanceId) ? { ...p, currentHp: 0 } : p
    );

    const isFromWinner = winnerUid === interaction.fromUid;
    const nextFromMoney = isFromWinner ? fromData.money + reward : Math.max(0, fromData.money - reward);
    const nextToMoney = isFromWinner ? Math.max(0, toData.money - reward) : toData.money + reward;

    const fromUpdate: Partial<Trainer> = { team: fromUpdatedTeam, money: nextFromMoney };
    const toUpdate: Partial<Trainer> = { team: toUpdatedTeam, money: nextToMoney };

    if (interaction.stakeBadgeId) {
      const badgeId = interaction.stakeBadgeId;
      if (isFromWinner) {
        fromUpdate.badges = Array.from(new Set([...(fromData.badges || []), badgeId]));
        toUpdate.badges = (toData.badges || []).filter(b => b !== badgeId);
      } else {
        toUpdate.badges = Array.from(new Set([...(toData.badges || []), badgeId]));
        fromUpdate.badges = (fromData.badges || []).filter(b => b !== badgeId);
      }
    }

    batch.update(fromRef, fromUpdate);
    batch.update(toRef, toUpdate);
  }
  
  batch.update(interactionRef, { 'pvpConfig.rewardProcessed': true, status: 'COMPLETED' });
  await batch.commit();
};
