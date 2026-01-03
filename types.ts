
export enum PokemonType {
  Normal = 'Normal',
  Fire = 'Fire',
  Water = 'Water',
  Electric = 'Electric',
  Grass = 'Grass',
  Flying = 'Flying',
  Bug = 'Bug',
  Rock = 'Rock',
  Ghost = 'Ghost',
  Ground = 'Ground',
  Psychic = 'Psychic',
  Fighting = 'Fighting',
  Poison = 'Poison',
  Dragon = 'Dragon',
  Ice = 'Ice',
  Dark = 'Dark',
  Fairy = 'Fairy',
}

export enum MoveCategory {
  Special = 'Special',
  Physical = 'Physical',
  Status = 'Status'
}

export enum StatusEffect {
  None = 'None',
  Paralysis = 'PAR',
  Poison = 'PSN',
  Sleep = 'SLP',
  Burn = 'BRN',
  Freeze = 'FRZ',
  Confusion = 'CONF'
}

export interface Move {
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  maxPp: number;
  category: MoveCategory;
  statusEffect?: StatusEffect;
  statusChance?: number; 
  statChanges?: { target?: 'self' | 'opponent', stat: string, stages: number, chance?: number }[];
}

export interface InstanceMove extends Move {
  currentPp: number;
}

export interface PokemonBase {
  id: number;
  name: string;
  types: PokemonType[];
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  baseExperience: number;
  catchRate: number;
  evolution?: {
    level: number;
    toId: number;
  };
  sprites: {
    front: string;
    back: string;
  };
  moves: Move[];
}

export interface PokemonInstance extends Omit<PokemonBase, 'moves'> {
  instanceId: string;
  level: number;
  currentHp: number;
  maxHp: number;
  exp: number;
  expToNextLevel: number;
  moves: InstanceMove[];
  evolutionCancelledLevel?: number;
  learnedMoveNames?: string[]; 
  status?: string; 
}

export interface Interaction {
  id: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  type: 'DUEL' | 'TRADE';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'SETUP' | 'BATTLE';
  fromReady: boolean;
  toReady: boolean;
  fromOffer: PokemonInstance | null;
  toOffer: PokemonInstance | null;
  timestamp: any;
  matchId: string;
  fromTeamSize?: number;
  toTeamSize?: number;
  stakeBadgeId?: string; // ID de la medalla en juego si es un duelo competitivo
  pvpConfig?: {
    pokemonCount: number;
    fromSelection?: PokemonInstance[];
    toSelection?: PokemonInstance[];
    fromActiveIdx?: number;
    toActiveIdx?: number;
    fromFaintedIndices?: number[];
    toFaintedIndices?: number[];
    fromSwitchUsed?: boolean;
    toSwitchUsed?: boolean;
    winnerUid?: string;
    surrenderedUid?: string;
    rewardProcessed?: boolean;
  };
}

export interface Trainer {
  uid: string;
  email: string;
  name: string;
  money: number;
  team: PokemonInstance[];
  pcStorage: PokemonInstance[];
  inventory: {
    potions: number;
    pokeballs: number;
    superballs: number;
    ultraballs: number;
    items?: Record<string, number>; 
  };
  currentLocation: string;
  pokedexCaught: number[];
  pokedexSeen: number[];
  badges: string[];
  gymProgress: Record<string, number>; 
  matchId?: string;
  eventsConsumed?: string[];
}

export interface BattleConfig {
  type: 'WILD' | 'TRAINER' | 'GYM' | 'PVP';
  opponentName: string;
  trainerSprite?: string;
  trainerDialog?: string;
  enemyTeam: PokemonInstance[];
  rewardMoney: number;
  isCatchable: boolean;
  isRunable: boolean;
  hideEnemyLevel?: boolean;
  gymId?: string;
  trainerIndex?: number;
}

export interface GameState {
  view: 'LOGIN' | 'MATCH_JOIN' | 'STARTER_SELECT' | 'DASHBOARD' | 'BATTLE' | 'PVP_DUEL';
  user: Trainer | null;
  loading: boolean;
  error: string | null;
}

export interface EncounterEntry {
  pokemonId: number;
  minLevel: number;
  maxLevel: number;
  weight: number; 
}

export interface SubArea {
  id: string;
  name: string;
  type: 'cave' | 'building' | 'forest' | 'water' | 'floor';
  wildPool: EncounterEntry[];
  events?: ZoneEvents; 
}

export interface ZoneEvents {
  wild: number;
  npc: number;
  item: number;
  nothing: number;
}

export interface NPC {
  id: string; 
  name: string;
  sprite: string;
  challengePhrase: string;
  defeatPhrase: string;
  rewardMoney: number;
  teamSize: number; 
  weight: number; 
}

export interface NPCPokemonPoolEntry {
  pokemonId: number;
  nivelMin: number;
  nivelMax: number;
  orden: number;
  esObligatorio: boolean;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  effect: string;
}

export interface ZoneItemPoolEntry {
  name: string;
  quantity: number;
  weight: number;
  locationDescription?: string;
  isRare?: boolean;
  canRepeat?: boolean;
}

export interface LocationProfile {
  id: string;
  name: string;
  events: ZoneEvents;
  wildPool: EncounterEntry[];
  npcPool: NPC[];
  subAreas?: Record<string, SubArea>;
  itemPool: ZoneItemPoolEntry[];
}

export type ExplorationMethod = 'walk' | 'surf' | 'old-rod' | 'good-rod' | 'super-rod' | 'safari-central' | 'safari-pesca';
export type ExplorationEvent = 'WILD' | 'NPC' | 'ITEM' | 'NOTHING';

export interface GymTrainer {
  name: string;
  pokemonNames: string[];
  levels: number[]; 
  isLeader: boolean;
  sprite: string;
}

export interface GymDef {
  id: string;
  city: string;
  leaderName: string;
  badgeName: string;
  badgeSprite: string;
  typeTheme: PokemonType;
  trainers: GymTrainer[];
}

export interface EvolutionData {
  originalInstance: PokemonInstance;
  evolvedBase: PokemonBase;
  teamIndex: number;
  postBattleTeam: PokemonInstance[];
}

export interface MoveLearningData {
  pokemon: PokemonInstance;
  newMove: Move;
  onLearned: (updated: PokemonInstance) => void;
}
