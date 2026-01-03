
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
  writeBatch 
} = firebaseFirestore;

import { FIREBASE_CONFIG } from './constants';
import { Trainer, PokemonInstance, PokemonBase, InstanceMove, Interaction } from './types';
import { ALL_MOVES } from './pokedexData';
import { getMovesForLevel } from './moveLearningData';

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

  return cleanData({
    ...base,
    instanceId: generateId(),
    level,
    maxHp,
    currentHp: maxHp,
    exp: currentExp,
    expToNextLevel: nextLevelExp,
    moves: movesWithPp,
    learnedMoveNames: movesWithPp.map(m => m.name)
  });
};

export const sanitizeTrainerData = (data: Trainer): Trainer => {
  const sanitizePokemon = (p: PokemonInstance) => {
    let pokemon = { ...p };
    if (isNaN(pokemon.level) || pokemon.level === null) pokemon.level = 5;
    /* Fixing potential missing experience calculation based on level */
    if (isNaN(pokemon.exp) || pokemon.exp === null) pokemon.exp = Math.pow(pokemon.level, 3);
    const correctMaxHp = calculateHp(pokemon.baseStats.hp, pokemon.level);
    pokemon.maxHp = correctMaxHp;
    if (isNaN(pokemon.currentHp) || pokemon.currentHp === null) {
        pokemon.currentHp = pokemon.maxHp;
    }
    if (pokemon.currentHp > pokemon.maxHp) {
        pokemon.currentHp = pokemon.maxHp;
    }

    if (!pokemon.learnedMoveNames) {
      pokemon.learnedMoveNames = pokemon.moves.map(m => m.name);
    }

    if (pokemon.moves.length === 0) {
        const defaultMove = ALL_MOVES.find(m => m.name === 'Placaje') || ALL_MOVES[0];
        pokemon.moves = [{ ...defaultMove, currentPp: defaultMove.maxPp }];
        pokemon.learnedMoveNames = Array.from(new Set([...(pokemon.learnedMoveNames || []), defaultMove.name]));
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
        ultraballs: data.inventory?.ultraballs || 0
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
    inventory: { potions: 5, pokeballs: 5, superballs: 2, ultraballs: 1 },
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

export const sendInteractionRequest = async (fromTrainer: Trainer, toUid: string, type: 'DUEL' | 'TRADE') => {
  const toSnap = await getDoc(doc(db, 'trainers', toUid));
  const toData = toSnap.data() as Trainer;

  await addDoc(collection(db, 'interactions'), cleanData({
    fromUid: fromTrainer.uid,
    fromName: fromTrainer.name,
    toUid: toUid,
    toName: toData?.name || 'Entrenador',
    type: type,
    status: 'PENDING',
    fromReady: false,
    toReady: false,
    fromOffer: null,
    toOffer: null,
    timestamp: serverTimestamp(),
    matchId: fromTrainer.matchId || 'global'
  }));
};

export const respondToInteraction = async (interactionId: string, response: 'ACCEPTED' | 'REJECTED') => {
  const cleanId = interactionId.split('/').pop() || interactionId;
  const docRef = doc(db, 'interactions', cleanId);
  if (response === 'REJECTED') {
    await deleteDoc(docRef);
  } else {
    await updateDoc(docRef, { status: 'ACCEPTED' });
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
  const fromNewCaught = Array.from(new Set([...(fromData.pokedexCaught || []), interaction.toOffer!.id]));
  
  const toNewTeam = toData.team.map(p => p.instanceId === interaction.toOffer!.instanceId ? interaction.fromOffer! : p);
  const toNewCaught = Array.from(new Set([...(toData.pokedexCaught || []), interaction.fromOffer!.id]));
  
  const batch = writeBatch(db);
  const cleanIntId = interaction.id.split('/').pop() || interaction.id;
  
  batch.update(fromRef, cleanData({ team: fromNewTeam, pokedexCaught: fromNewCaught }));
  batch.update(toRef, cleanData({ team: toNewTeam, pokedexCaught: toNewCaught }));
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
