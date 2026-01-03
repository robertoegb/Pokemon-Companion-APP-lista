
import React, { useState, useEffect } from 'react';
import * as firebaseFirestore from 'firebase/firestore';
const { onSnapshot, collection, query, where } = firebaseFirestore;
import { db } from '../services/firebaseService';
import { Trainer, PokemonInstance, GymDef, ExplorationMethod, PokemonType, EvolutionData, Move } from '../types';
import { GYM_DATA } from '../data'; 
import PokedexScreen from './PokedexScreen'; 
import MatchModule from './MatchModule';
import ExploreModule from './ExploreModule';
import SettingsModule from './SettingsModule';
import BagOverlay from './BagOverlay';
import EventsModule from './EventsModule';

interface MainGameProps {
  trainer: Trainer;
  onLogout: () => void;
  onExplore: (location: string, method: ExplorationMethod, subAreaId?: string) => void;
  onUpdateTrainer: (data: Partial<Trainer>) => void;
  onTravel: (location: string) => void;
  onChallengeGym: (gym: GymDef, trainerIndex: number) => void; 
  onReset: () => void;
  onTriggerEvolution: (evoData: EvolutionData) => void;
  onTriggerMoveLearning: (pokemon: PokemonInstance, move: Move) => void;
  onTriggerEvent: (code: string) => void;
  onPostActionCheck: (team: PokemonInstance[]) => void;
  initialView?: MainView;
  initialGymId?: string;
}

export type MainView = 'MENU' | 'TEAM' | 'EXPLORE' | 'POKECENTER' | 'GYMS' | 'BADGES' | 'POKEDEX' | 'GYM_DETAIL' | 'SOCIAL' | 'SETTINGS' | 'EVENTS';

const TYPE_COLORS: Record<string, string> = {
  Fire: '#ef4444', Water: '#3b82f6', Grass: '#22c55e', Electric: '#eab308', Normal: '#a8a29e', Flying: '#38bdf8', Bug: '#84cc16', Poison: '#9333ea', Rock: '#854d0e', Ground: '#d97706', Psychic: '#ec4899', Fighting: '#b91c1c', Ice: '#22d3ee', Ghost: '#6366f1', Dragon: '#8b5cf6', Fairy: '#f472b6', Dark: '#44403c',
};

const STATUS_COLORS: Record<string, string> = {
  PAR: 'bg-yellow-500', PSN: 'bg-purple-600', BRN: 'bg-red-500', SLP: 'bg-slate-400', FRZ: 'bg-cyan-400',
};

const STAT_CONFIG: Record<string, { icon: string, color: string, bgColor: string, label: string }> = {
  hp: { icon: 'fa-heart', color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'PS' },
  attack: { icon: 'fa-fist-raised', color: 'text-orange-500', bgColor: 'bg-orange-500/10', label: 'Ataque' },
  defense: { icon: 'fa-shield-alt', color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: 'Defensa' },
  specialAttack: { icon: 'fa-magic', color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'At. Esp' },
  specialDefense: { icon: 'fa-shield-virus', color: 'text-teal-500', bgColor: 'bg-teal-500/10', label: 'Def. Esp' },
  speed: { icon: 'fa-wind', color: 'text-green-500', bgColor: 'bg-green-500/10', label: 'Veloc.' },
};

const calculateStatAtLevel = (base: number, level: number, isHp: boolean = false): number => {
  if (isHp) return Math.floor(((2 * base + 31) * level) / 100) + level + 10;
  return Math.floor(((2 * base + 31) * level) / 100) + 5;
};

const HealthBar = ({ current, max, isCompact = false, animate = false }: { current: number; max: number; isCompact?: boolean, animate?: boolean }) => {
  const [displayPct, setDisplayPct] = useState((current / max) * 100);
  useEffect(() => {
    if (animate) {
      setDisplayPct(0);
      const timeout = setTimeout(() => setDisplayPct((current / max) * 100), 100);
      return () => clearTimeout(timeout);
    } else setDisplayPct((current / max) * 100);
  }, [current, max, animate]);
  const percentage = Math.max(0, Math.min(100, displayPct));
  let color = 'bg-green-500';
  if (percentage < 50) color = 'bg-yellow-500';
  if (percentage < 20) color = 'bg-red-500';
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300 ${isCompact ? 'h-2' : 'h-2 md:h-2.5'}`}>
      <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out shadow-inner`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const ExpBar = ({ exp, expToNext, level, isCompact = false }: { exp: number, expToNext: number, level: number, isCompact?: boolean }) => {
  const currentLevelBaseExp = Math.pow(level, 3);
  const neededForNext = expToNext - currentLevelBaseExp;
  const currentProgress = Math.max(0, exp - currentLevelBaseExp);
  const percentage = Math.max(0, Math.min(100, (currentProgress / (neededForNext || 1)) * 100));
  return (
    <div className={`w-full bg-gray-700/30 rounded-full overflow-hidden border border-gray-400/20 ${isCompact ? 'h-1.5' : 'h-1.5 md:h-2'}`}>
      <div className="h-full rounded-full bg-blue-400 transition-all duration-500 ease-out shadow-inner" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const PokemonDetail = ({ pokemon, onClose }: { pokemon: PokemonInstance, onClose: () => void }) => {
  const bgGradient = pokemon.types.length > 1 
    ? `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0]]} 50%, ${TYPE_COLORS[pokemon.types[1]]} 50%)`
    : `${TYPE_COLORS[pokemon.types[0]]}`;
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col p-4 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} className="text-white bg-white/10 w-10 h-10 rounded-full hover:bg-white/20 transition-all flex items-center justify-center"><i className="fas fa-times text-lg"></i></button>
        <div className="text-right">
          <h2 className="text-white font-pixel text-sm uppercase">{pokemon.name}</h2>
          <div className="flex items-center justify-end gap-2 mt-1">
             {pokemon.status && <span className={`${STATUS_COLORS[pokemon.status] || 'bg-gray-500'} text-white font-black text-[8px] px-1.5 py-0.5 rounded`}>{pokemon.status}</span>}
             <p className="text-blue-400 font-black text-[10px]">NIVEL {pokemon.level}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="rounded-3xl p-6 border-4 border-white/20 flex flex-col items-center relative overflow-hidden" style={{ background: bgGradient }}>
          <div className="absolute inset-0 bg-black/10"></div>
          <img src={pokemon.sprites.front} className="w-44 h-44 pixelated drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] relative z-10" alt={pokemon.name} />
          <div className="flex gap-2 mt-2 relative z-10">{pokemon.types.map(t => (<span key={t} className="px-4 py-1 rounded-full text-white font-black text-[8px] uppercase tracking-widest shadow-xl border-2 border-white/30" style={{ backgroundColor: TYPE_COLORS[t] }}>{t}</span>))}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><i className="fas fa-chart-bar"></i> Estadísticas Actuales</h3>
            <span className="text-[7px] text-white/40 font-bold uppercase">Calculadas para Nivel {pokemon.level}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(pokemon.baseStats).map(([stat, baseVal]) => {
              const currentVal = stat === 'hp' ? pokemon.maxHp : calculateStatAtLevel(baseVal, pokemon.level, false);
              const config = STAT_CONFIG[stat];
              return (
                <div key={stat} className={`flex justify-between items-center p-2 rounded-xl border border-white/5 ${config?.bgColor}`}>
                  <div className="flex items-center gap-2"><i className={`fas ${config?.icon} ${config?.color} text-[10px]`}></i><span className="text-white/80 text-[9px] uppercase font-bold">{config?.label || stat}</span></div>
                  <div className="flex flex-col items-end"><span className="text-white font-black text-xs">{currentVal}</span><span className="text-[6px] text-white/20 font-bold">BASE: {baseVal}</span></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-2"><i className="fas fa-heartbeat"></i> Estado de Salud</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1"><p className="text-white/60 text-[8px] uppercase font-black">Puntos de Salud</p><p className="text-white font-mono text-[9px]">{pokemon.currentHp}/{pokemon.maxHp}</p></div>
              <HealthBar current={pokemon.currentHp} max={pokemon.maxHp} isCompact />
            </div>
            <div>
              <div className="flex justify-between mb-1"><p className="text-white/60 text-[8px] uppercase font-black">Experiencia</p><p className="text-blue-400 font-mono text-[9px]">{pokemon.exp} / {pokemon.expToNextLevel}</p></div>
              <ExpBar exp={pokemon.exp} expToNext={pokemon.expToNextLevel} level={pokemon.level} isCompact />
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 pb-6">
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-2"><i className="fas fa-fist-raised"></i> Movimientos</h3>
          <div className="grid grid-cols-1 gap-2">
            {pokemon.moves.map((m, i) => (
              <div key={i} className="bg-black/40 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: TYPE_COLORS[m.type] }}></div>
                  <div><p className="text-white font-black text-[10px] uppercase">{m.name}</p><span className="text-[7px] font-bold text-gray-400 uppercase">{m.type} | POT {m.power}</span></div>
                </div>
                <p className="text-white/60 font-mono text-[9px] bg-white/5 px-2 py-1 rounded">PP {m.currentPp}/{m.maxPp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PokeballButton = ({ label, onClick, colorClass = "bg-red-600" }: { label: string, icon?: string, onClick: () => void, colorClass?: string }) => (
  <button onClick={onClick} className="flex flex-col items-center group active:scale-95 transition-transform duration-150 w-full">
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 md:border-8 border-gray-800 relative overflow-hidden shadow-xl bg-white flex items-center justify-center hover:shadow-2xl transition-all hover:scale-105">
      <div className={`absolute top-0 left-0 right-0 h-1/2 ${colorClass} border-b-4 md:border-b-8 border-gray-800`}></div>
      <div className="absolute z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-4 md:border-8 border-gray-800 flex items-center justify-center"><div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full"></div></div>
    </div>
    <span className="mt-2 font-black text-gray-800 bg-white/90 px-3 py-1 rounded-full shadow-md border border-gray-200 text-sm md:text-base uppercase tracking-wide backdrop-blur-sm">{label}</span>
  </button>
);

const MainGame: React.FC<MainGameProps> = ({ trainer, onLogout, onExplore, onUpdateTrainer, onTravel, onChallengeGym, onReset, onTriggerEvolution, onTriggerMoveLearning, onTriggerEvent, onPostActionCheck, initialView, initialGymId }) => {
  const [currentView, setCurrentView] = useState<MainView>(initialView || 'MENU');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonInstance | null>(null);
  const [pcView, setPcView] = useState<'HEAL' | 'STORAGE'>('HEAL');
  const [selectedGymId, setSelectedGymId] = useState<string | null>(initialGymId || null);
  const [pokemonToRelease, setPokemonToRelease] = useState<PokemonInstance | null>(null);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [swapSource, setSwapSource] = useState<number | null>(null);
  const [isHealingAnimation, setIsHealingAnimation] = useState(false);
  const [showBag, setShowBag] = useState(false);
  
  const isTeamFainted = trainer.team.every(p => !p.currentHp || p.currentHp <= 0);

  // Estado para rastrear quién tiene cada medalla en la partida actual
  const [badgeOwners, setBadgeOwners] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialView) setCurrentView(initialView);
    if (initialGymId) setSelectedGymId(initialGymId);
  }, [initialView, initialGymId]);

  // Listener para rastrear medallas en tiempo real por partida
  useEffect(() => {
    if (!trainer.matchId) return;
    const q = query(collection(db, 'trainers'), where('matchId', '==', trainer.matchId));
    return onSnapshot(q, (snapshot) => {
      const owners: Record<string, string> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Trainer;
        if (data.badges) {
          data.badges.forEach(badgeId => {
            owners[badgeId] = data.name;
          });
        }
      });
      setBadgeOwners(owners);
    });
  }, [trainer.matchId]);

  const handleHealTeam = () => {
    setIsHealingAnimation(true);
    const healedTeam = trainer.team.map(p => ({ ...p, currentHp: p.maxHp, status: undefined, moves: p.moves.map(m => ({...m, currentPp: m.maxPp})) }));
    const healedPC = trainer.pcStorage.map(p => ({ ...p, currentHp: p.maxHp, status: undefined, moves: p.moves.map(m => ({...m, currentPp: m.maxPp})) }));
    setTimeout(() => { onUpdateTrainer({ team: healedTeam, pcStorage: healedPC }); setIsHealingAnimation(false); }, 2000);
  };

  const handleDeposit = (index: number) => {
    if (trainer.team.length <= 1) return;
    const newTeam = [...trainer.team];
    const [pokemon] = newTeam.splice(index, 1);
    const newPC = [...trainer.pcStorage, pokemon];
    onUpdateTrainer({ team: newTeam, pcStorage: newPC });
  };

  const handleWithdraw = (index: number) => {
    if (trainer.team.length >= 6) return;
    const newPC = [...trainer.pcStorage];
    const [pokemon] = newPC.splice(index, 1);
    const newTeam = [...trainer.team, pokemon];
    onUpdateTrainer({ team: newTeam, pcStorage: newPC });
  };

  const handleRelease = (pokemon: PokemonInstance) => {
    const newPC = trainer.pcStorage.filter(p => p.instanceId !== pokemon.instanceId);
    onUpdateTrainer({ pcStorage: newPC });
    setPokemonToRelease(null);
  };

  const handleTeamInteraction = (index: number) => {
    if (isOrganizing) {
        if (swapSource === null) setSwapSource(index);
        else if (swapSource === index) setSwapSource(null);
        else {
            const newTeam = [...trainer.team];
            const temp = newTeam[swapSource];
            newTeam[swapSource] = newTeam[index];
            newTeam[index] = temp;
            onUpdateTrainer({ team: newTeam });
            setSwapSource(null);
        }
        return;
    }
    setSelectedPokemon(trainer.team[index]);
  };

  const handleUseBagItem = (newTeam: PokemonInstance[], message: string, updatedInventory?: any) => {
    const update: Partial<Trainer> = { team: newTeam };
    if (updatedInventory) update.inventory = updatedInventory;
    onUpdateTrainer(update);
    onPostActionCheck(newTeam);
  };

  const renderMenu = () => (
    <div className="flex-1 flex flex-col justify-center items-center p-2 w-full max-w-5xl mx-auto overflow-hidden h-full">
      <div className="grid grid-cols-2 gap-4 md:gap-x-12 md:gap-y-8 w-full max-w-lg">
        <PokeballButton label="Explorar" icon="fa-map-marked-alt" onClick={() => setCurrentView('EXPLORE')} colorClass="bg-orange-500" />
        <PokeballButton label="Pokédex" icon="fa-book-open" onClick={() => setCurrentView('POKEDEX')} colorClass="bg-red-600" />
        <PokeballButton label="Mi Equipo" icon="fa-users" onClick={() => setCurrentView('TEAM')} colorClass="bg-blue-600" />
        <PokeballButton label="Gimnasios" icon="fa-dungeon" onClick={() => setCurrentView('GYMS')} colorClass="bg-gray-700" />
        <PokeballButton label="Centro Pkmn" icon="fa-hospital" onClick={() => setCurrentView('POKECENTER')} colorClass="bg-green-500" />
        <PokeballButton label="Medallas" icon="fa-medal" onClick={() => setCurrentView('BADGES')} colorClass="bg-indigo-600" />
        <PokeballButton label="Social" icon="fa-handshake" onClick={() => setCurrentView('SOCIAL')} colorClass="bg-fuchsia-600" />
        <PokeballButton label="Eventos" icon="fa-ticket-alt" onClick={() => setCurrentView('EVENTS')} colorClass="bg-violet-600" />
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="flex-1 flex flex-col bg-gray-100 w-full h-full overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-white shadow-sm flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 font-pixel">Mi Equipo</h2>
          <div className="flex gap-2">
            <button onClick={() => { setIsOrganizing(!isOrganizing); setSwapSource(null); }} className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 ${isOrganizing ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}><i className="fas fa-arrows-alt-v"></i> {isOrganizing ? 'Listo' : 'Ordenar'}</button>
            <button onClick={() => setShowBag(true)} className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 border border-orange-200"><i className="fas fa-briefcase"></i> Mochila</button>
            <button onClick={() => setCurrentView('MENU')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-xl font-bold shadow-sm text-sm active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"><i className="fas fa-arrow-left"></i> Volver</button>
          </div>
        </div>
        <div className="flex-1 p-2 bg-gray-100 overflow-y-auto pb-24">
          <div className="flex flex-col gap-2">
              {trainer.team.map((pokemon, index) => (
                <div key={pokemon.instanceId} onClick={() => handleTeamInteraction(index)} className={`p-3 rounded-2xl shadow-md border-2 flex items-center transition-all cursor-pointer bg-white relative ${swapSource === index ? 'border-indigo-500 bg-indigo-50 scale-[0.98]' : (index === 0 ? 'border-yellow-400 ring-4 ring-yellow-400/20' : 'border-gray-200 hover:border-gray-300')} ${isOrganizing ? 'active:scale-95' : ''}`}>
                  {index === 0 && <div className="absolute -top-2 -left-1 bg-yellow-400 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm z-10 animate-pulse uppercase">Líder</div>}
                  <div className="mr-4 relative flex-shrink-0">
                    <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 overflow-hidden ${index === 0 ? 'border-yellow-400 shadow-inner' : 'border-gray-200'}`}><img src={pokemon.sprites.front} className={`w-14 h-14 pixelated ${pokemon.currentHp <= 0 ? 'grayscale opacity-50' : ''}`} alt={pokemon.name} /></div>
                    <span className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded-md font-black">NV.{pokemon.level}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-1">
                       <div className="flex items-center gap-1.5 min-w-0"><h3 className="font-black text-gray-800 capitalize text-sm truncate">{pokemon.name}</h3>{pokemon.status && <span className={`${STATUS_COLORS[pokemon.status] || 'bg-gray-500'} text-white text-[6px] px-1 rounded-sm font-black uppercase`}>{pokemon.status}</span>}</div>
                       {isOrganizing && <i className="fas fa-exchange-alt text-indigo-400"></i>}
                     </div>
                     <HealthBar current={pokemon.currentHp} max={pokemon.maxHp} isCompact={true} />
                     <div className="mt-1"><ExpBar exp={pokemon.exp} expToNext={pokemon.expToNextLevel} level={pokemon.level} isCompact={true} /></div>
                     <div className="flex justify-between text-[7px] font-black text-gray-400 mt-1 uppercase"><span>PS: {pokemon.currentHp}/{pokemon.maxHp}</span><span>{Math.round((pokemon.currentHp/pokemon.maxHp)*100)}% Vida</span></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {selectedPokemon && <PokemonDetail pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
        {showBag && <BagOverlay trainer={trainer} onUseItem={handleUseBagItem} onTriggerEvolution={onTriggerEvolution} onClose={() => setShowBag(false)} />}
    </div>
  );

  const renderPokeCenter = () => (
    <div className="flex-1 flex flex-col bg-white w-full h-full overflow-hidden">
      <div className="flex items-center justify-between p-2 md:p-4 flex-shrink-0 border-b border-gray-100 shadow-sm h-16">
         <h2 className="text-sm md:text-lg font-bold text-red-600 font-pixel flex-shrink-0 uppercase">Centro Pokémon</h2>
         <div className="flex gap-1.5 md:gap-2 flex-1 justify-end items-center">
            <button onClick={() => setPcView(pcView === 'HEAL' ? 'STORAGE' : 'HEAL')} className={`px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-[10px] md:text-xs transition-all flex items-center gap-1.5 whitespace-nowrap justify-center ${pcView === 'STORAGE' ? 'bg-green-500 text-white shadow-[0_3px_0_#166534]' : 'bg-blue-600 text-white shadow-[0_3px_0_#1e3a8a]'}`}><i className={`fas ${pcView === 'HEAL' ? 'fa-laptop' : 'fa-plus-square'} text-[10px] md:sm`}></i> <span className="uppercase">{pcView === 'HEAL' ? 'PC' : 'Curar'}</span></button>
            <button onClick={() => setCurrentView('MENU')} className="bg-gray-100 text-gray-700 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl font-bold shadow-sm active:scale-95 text-[10px] md:text-xs flex items-center gap-1.5 border border-gray-200 whitespace-nowrap flex-shrink-0"><i className="fas fa-arrow-left"></i> <span>Volver</span></button>
         </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-20">
        {pcView === 'HEAL' ? (
          <div className="flex flex-col items-center p-6 space-y-8 h-full justify-center">
            <div className="relative">
              <div className={`w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center border-4 border-pink-300 shadow-inner relative transition-transform ${isHealingAnimation ? 'scale-110' : ''}`}><img src="https://i.postimg.cc/vBYYFg6W/IMG-4870.png" className="w-28 h-28 object-contain" alt="Enfermera Joy" /></div>
              {isHealingAnimation && <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-2 animate-bounce shadow-lg"><i className="fas fa-heart"></i></div>}
            </div>
            <div className="w-full max-w-sm grid grid-cols-3 gap-3">
              {trainer.team.map((p, i) => (
                <div key={i} className={`flex flex-col items-center bg-gray-50 p-2 rounded-xl border-2 transition-all ${isHealingAnimation ? 'animate-pulse border-green-300 bg-green-50' : 'border-gray-100 shadow-sm'}`}>
                  <img src={p.sprites.front} className={`w-16 h-16 pixelated transition-transform ${isHealingAnimation ? 'animate-bounce' : ''}`} alt={p.name} />
                  <HealthBar current={p.currentHp} max={p.maxHp} isCompact animate={isHealingAnimation} />
                </div>
              ))}
            </div>
            <button onClick={handleHealTeam} disabled={isHealingAnimation} className={`w-full max-w-sm py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all border-b-8 ${isHealingAnimation ? 'bg-gray-400 border-gray-600 text-white scale-95' : 'bg-green-500 border-green-700 hover:bg-green-600 text-white active:translate-y-2 active:border-b-4'}`}><i className={`fas fa-plus-square text-lg ${isHealingAnimation ? 'animate-spin' : 'animate-pulse'}`}></i> {isHealingAnimation ? 'Restaurando...' : 'Curar Pokémon'}</button>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            <div className="bg-blue-50/50 p-4 rounded-3xl border-2 border-blue-200">
               <h3 className="text-blue-700 font-black text-[9px] uppercase tracking-widest mb-4 flex items-center gap-2"><i className="fas fa-users text-sm"></i> Mi Equipo ({trainer.team.length}/6)</h3>
               <div className="grid grid-cols-2 gap-3">
                  {trainer.team.map((p, i) => (
                    <div key={p.instanceId} className="bg-white p-2 rounded-2xl border border-blue-100 flex items-center gap-2 shadow-sm relative overflow-hidden">
                       <img src={p.sprites.front} className="w-14 h-14 pixelated flex-shrink-0" alt={p.name} />
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1"><p className="text-[9px] font-black truncate uppercase leading-tight">{p.name}</p>{p.status && <span className={`${STATUS_COLORS[p.status] || 'bg-gray-500'} text-white text-[6px] px-1 rounded-sm font-black`}>{p.status}</span>}</div>
                          <p className="text-[8px] font-bold text-blue-500 mb-1">NV. {p.level}</p>
                          <button disabled={trainer.team.length <= 1} onClick={() => handleDeposit(i)} className="text-[7px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-black uppercase w-fit disabled:opacity-30 mt-1">Depositar</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-gray-100/50 p-4 rounded-3xl border-2 border-gray-200">
               <h3 className="text-gray-600 font-black text-[9px] uppercase tracking-widest mb-4 flex items-center gap-2"><i className="fas fa-box-open text-sm"></i> PC de Bill ({trainer.pcStorage.length} Pokémon)</h3>
               {trainer.pcStorage.length === 0 ? (
                 <div className="py-10 text-center"><i className="fas fa-ghost text-3xl text-gray-300 mb-2"></i><p className="text-[10px] text-gray-400 font-bold uppercase">El PC está vacío</p></div>
               ) : (
                 <div className="grid grid-cols-1 gap-3">
                    {trainer.pcStorage.map((p, i) => (
                      <div key={p.instanceId} className="bg-white p-2 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-sm relative group">
                         <img src={p.sprites.front} className="w-20 h-20 pixelated flex-shrink-0" alt={p.name} />
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><p className="text-sm font-black truncate uppercase leading-tight">{p.name}</p>{p.status && <span className={`${STATUS_COLORS[p.status] || 'bg-gray-500'} text-white text-[6px] px-1 rounded-sm font-black`}>{p.status}</span>}</div>
                            <p className="text-[10px] font-black text-gray-400 mb-2">NV. {p.level}</p>
                            <div className="flex gap-2 mt-1"><button disabled={trainer.team.length >= 6} onClick={() => handleWithdraw(i)} className="text-[8px] bg-green-100 text-green-600 px-4 py-1.5 rounded-full font-black uppercase shadow-sm disabled:opacity-30">Retirar</button><button onClick={() => setPokemonToRelease(p)} className="text-[8px] bg-red-50 text-red-400 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-full font-black uppercase transition-colors border border-red-100 shadow-sm">Liberar</button></div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
      {pokemonToRelease && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border-t-8 border-red-500">
                <div className="p-6 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-200"><img src={pokemonToRelease.sprites.front} className="w-16 h-16 pixelated" alt={pokemonToRelease.name} /></div>
                    <h3 className="text-sm font-black text-gray-800 uppercase mb-2">¿Liberar a {pokemonToRelease.name}?</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed mb-6">Esta acción es permanente y no se puede deshacer.</p>
                    <div className="flex flex-col gap-2"><button onClick={() => handleRelease(pokemonToRelease)} className="bg-red-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-md">Confirmar Liberación</button><button onClick={() => setPokemonToRelease(null)} className="bg-gray-100 text-gray-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Cancelar</button></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  const renderGyms = () => (
    <div className="flex-1 flex flex-col bg-gray-100 w-full h-full overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-white shadow-sm flex-shrink-0 h-16"><h2 className="text-lg font-bold text-gray-800 font-pixel uppercase tracking-tighter">Gimnasios</h2><button onClick={() => setCurrentView('MENU')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-xl font-bold shadow-sm text-sm active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"><i className="fas fa-arrow-left"></i> Volver</button></div>
      <div className="flex-1 p-3 overflow-y-auto pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GYM_DATA.map((gym) => {
            const myHasBadge = (trainer.badges || []).includes(gym.id);
            const otherOwner = badgeOwners[gym.id];
            const isDefeatedByOther = !!otherOwner && !myHasBadge;
            const isDefeated = myHasBadge || isDefeatedByOther;
            
            const currentProgress = (trainer.gymProgress || {})[gym.id] || 0;
            const totalTrainers = gym.trainers.length;
            const leader = gym.trainers.find(t => t.isLeader);
            
            return (
              <div key={gym.id} onClick={() => { setSelectedGymId(gym.id); setCurrentView('GYM_DETAIL'); }} className={`aspect-square p-3 rounded-3xl shadow-lg border-2 transition-all cursor-pointer bg-white flex flex-col items-center justify-between hover:border-blue-400 group active:scale-[0.98] relative overflow-hidden ${isDefeated ? 'border-green-300' : 'border-gray-200'}`}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: TYPE_COLORS[gym.typeTheme] }}></div>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center p-2 mb-2 transition-all overflow-hidden ${isDefeated ? 'bg-green-50' : 'grayscale contrast-125 brightness-75 bg-gray-50'}`}><img src={leader?.sprite} alt={gym.leaderName} className="w-full h-full object-contain object-top scale-125" /></div>
                <div className="text-center w-full">
                  <h3 className="font-black text-gray-800 uppercase text-[9px] md:text-[10px] truncate leading-tight">{gym.city}</h3>
                  <p className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 truncate">{gym.leaderName}</p>
                  
                  {isDefeatedByOther ? (
                    <div className="bg-red-50 p-1 rounded-lg border border-red-100">
                        <p className="text-[6px] font-black text-red-600 uppercase leading-tight">Medalla reclamada por <br/> <span className="text-indigo-600">{otherOwner}</span></p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 w-full">
                      <div className="bg-gray-100 h-1 rounded-full overflow-hidden border border-gray-200">
                        <div className={`h-full transition-all duration-1000 ${myHasBadge ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${(myHasBadge ? totalTrainers : currentProgress) / totalTrainers * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center px-0.5">
                        <span className="text-[6px] md:text-[7px] font-black text-gray-500 uppercase">{myHasBadge ? 'COMPLETO' : `${currentProgress}/${totalTrainers}`}</span>
                        {myHasBadge && <i className="fas fa-check-circle text-green-500 text-[9px]"></i>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderGymDetail = () => {
    const gym = GYM_DATA.find(g => g.id === selectedGymId);
    if (!gym) return null;
    
    const myHasBadge = (trainer.badges || []).includes(gym.id);
    const otherOwner = badgeOwners[gym.id];
    const isBadgeClaimed = !!otherOwner && !myHasBadge;

    const currentProgress = (trainer.gymProgress || {})[gym.id] || 0;
    const subordinates = gym.trainers.filter(t => !t.isLeader);
    const leader = gym.trainers.find(t => t.isLeader);
    
    return (
      <div className="flex-1 flex flex-col bg-gray-50 w-full h-full overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-white shadow-sm flex-shrink-0 border-b border-gray-100 h-16"><div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center p-1.5 shadow-sm flex-shrink-0"><img src={gym.badgeSprite} className={`w-full h-full object-contain ${myHasBadge ? '' : 'grayscale opacity-30'}`} alt="Medalla" /></div><h2 className="text-base font-bold text-gray-800 font-pixel uppercase truncate">{gym.city}</h2></div><button onClick={() => setCurrentView('GYMS')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold shadow-sm text-xs active:scale-95 transition-all flex items-center gap-2 border border-gray-200 whitespace-nowrap"><i className="fas fa-arrow-left"></i> <span>Volver</span></button></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 flex flex-col items-center">
           
           <div className="w-full bg-white p-6 rounded-3xl shadow-xl border-t-8 flex flex-col items-center relative overflow-hidden flex-shrink-0 min-h-[260px]" style={{ borderTopColor: TYPE_COLORS[gym.typeTheme] }}>
              <div className="absolute top-2 right-4 opacity-10"><i className="fas fa-crown text-4xl"></i></div>
              <div className="relative mb-4">
                <div className={`w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden flex items-center justify-center shadow-inner transition-all duration-700 bg-gray-50 ${(isBadgeClaimed || (currentProgress < subordinates.length && !myHasBadge)) ? 'grayscale brightness-[0.2]' : ''}`}>
                  <img src={leader?.sprite} className="w-full h-full object-contain object-top scale-125 pixelated" alt="Líder" />
                </div>
                {myHasBadge && <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2.5 rounded-full border-2 border-white shadow-lg animate-bounce"><i className="fas fa-medal"></i></div>}
                {(currentProgress < subordinates.length && !myHasBadge && !isBadgeClaimed) && <div className="absolute inset-0 flex items-center justify-center"><i className="fas fa-lock text-white text-3xl opacity-50"></i></div>}
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase mb-1 tracking-tighter">{gym.leaderName}</h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Líder {gym.typeTheme}</p>
              
              {isBadgeClaimed ? (
                <div className="w-full mt-6 bg-red-50 p-4 rounded-2xl border-2 border-red-200 text-center animate-in zoom-in">
                  <p className="text-red-700 font-black text-[10px] uppercase">Gimnasio Bloqueado</p>
                  <p className="text-gray-500 text-[8px] font-bold mt-1 uppercase">La medalla ha sido ganada por <br/> <span className="text-indigo-600 text-xs">{otherOwner}</span></p>
                  <p className="text-[7px] text-gray-400 mt-4 italic">"Debes desafiar al poseedor actual en el Módulo Social para obtener esta medalla."</p>
                </div>
              ) : (currentProgress >= subordinates.length || myHasBadge) ? (
                <div className="w-full mt-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic text-center animate-in fade-in slide-in-from-top-4">
                  <p className="text-blue-700 font-bold text-[10px]">"Me has impresionado. ¡Veamos si puedes contra mi mejor equipo!"</p>
                  {!myHasBadge && (<button disabled={isTeamFainted} onClick={() => onChallengeGym(gym, gym.trainers.length - 1)} className={`mt-4 w-full bg-red-600 text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all border-b-4 border-red-800 ${isTeamFainted ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}>Retar al Líder</button>)}
                </div>
              ) : (
                <div className="mt-4 text-center">
                  <p className="text-[9px] text-gray-400 font-bold uppercase italic leading-tight">Derrota a todos los subordinados ({currentProgress}/{subordinates.length})<br/>para desbloquear al Líder.</p>
                </div>
              )}
           </div>

           {isTeamFainted && (
             <div className="w-full bg-red-600/20 border-2 border-red-500/50 p-4 rounded-3xl animate-in fade-in">
               <div className="flex items-center gap-4 text-red-400">
                 <i className="fas fa-heart-broken text-xl"></i>
                 <div>
                   <p className="text-[8px] font-black uppercase tracking-widest">Equipo debilitado</p>
                   <p className="text-[10px] font-bold uppercase">Cura a tus Pokémon para poder desafiar este gimnasio.</p>
                 </div>
               </div>
             </div>
           )}

           <div className="w-1 border-l-4 border-dashed border-gray-300 h-10 -my-2"></div>
           <div className="w-full space-y-3 flex flex-col-reverse">
            {subordinates.map((t, idx) => { 
              const isAlreadyDefeated = myHasBadge || isBadgeClaimed || idx < currentProgress; 
              const isLocked = !myHasBadge && !isBadgeClaimed && idx > currentProgress; 
              return ( 
                <div key={idx} className="flex flex-col items-center">
                  {idx < subordinates.length - 1 && <div className="w-1 border-l-4 border-dashed border-gray-300 h-6"></div>}
                  <div className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all relative ${isAlreadyDefeated ? 'bg-green-50 border-green-100 shadow-inner' : isLocked ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-blue-500 shadow-md ring-4 ring-blue-50'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${isAlreadyDefeated ? 'bg-green-100' : 'bg-gray-100 shadow-inner'}`}>
                      <img src={t.sprite} className={`w-full h-full object-contain pixelated ${isLocked ? 'grayscale brightness-50' : ''}`} alt="NPC" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h5 className={`font-black uppercase text-xs truncate ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{t.name}</h5>
                        {isAlreadyDefeated && <i className="fas fa-check-circle text-green-500 text-lg"></i>}
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">SUBORDINADO {idx + 1} ({t.pokemonNames.length} POKÉMON)</p>
                    </div>
                    {!isAlreadyDefeated && !isLocked && !isBadgeClaimed && (<button disabled={isTeamFainted} onClick={() => onChallengeGym(gym, idx)} className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all border-b-4 border-red-800 ${isTeamFainted ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}>Desafiar</button>)}
                    {isLocked && !isBadgeClaimed && <i className="fas fa-lock text-gray-300 text-lg"></i>}
                    {isBadgeClaimed && <i className="fas fa-ban text-red-200 text-lg"></i>}
                  </div>
                </div>
              );
            })}
           </div>
        </div>
      </div>
    );
  };

  const renderBadges = () => (
    <div className="flex-1 flex flex-col bg-gray-900 w-full h-full overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-800 text-white shadow-xl z-10 border-b-2 border-gray-700 h-14 flex-shrink-0"><div className="flex-1 min-w-0"><h2 className="text-[10px] md:text-xs font-bold font-pixel uppercase tracking-tighter truncate">Estuche de Medallas</h2><p className="text-[7px] text-gray-400 font-bold uppercase mt-0.5">Liga Kanto</p></div><button onClick={() => setCurrentView('MENU')} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm text-[10px] active:scale-95 transition-all flex items-center gap-2 border border-gray-600 flex-shrink-0"><i className="fas fa-arrow-left"></i> <span>Volver</span></button></div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] overflow-hidden">
        <div className="bg-[#4a1a1a] p-4 md:p-6 rounded-[30px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,1),inset_0_0_40px_rgba(0,0,0,0.8)] border-6 md:border-[12px] border-[#2e0e0e] w-full max-w-[480px] h-full max-h-full grid grid-cols-2 grid-rows-4 gap-x-2 md:gap-x-4 gap-y-2 md:gap-y-4 relative items-center overflow-hidden py-4">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[#7c2d2d] font-black text-[7px] md:text-[11px] tracking-[0.5em] uppercase opacity-40 whitespace-nowrap">COLECCIÓN DE KANTO</div>
          {GYM_DATA.map((gym) => { const hasBadge = (trainer.badges || []).includes(gym.id); return ( <div key={gym.id} className="flex flex-col items-center justify-center h-full min-h-0 px-2 overflow-hidden"><div className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center p-2 relative transition-all duration-700 scale-90 ${hasBadge ? 'bg-gradient-to-br from-white/10 to-transparent shadow-[0_0_30px_rgba(255,255,255,0.15)]' : 'opacity-10 grayscale brightness-50'}`}><div className={`absolute inset-0 rounded-full ${hasBadge ? 'bg-black/20 blur-lg' : ''}`}></div><img src={gym.badgeSprite} alt={gym.badgeName} className="w-full h-full object-contain relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] transition-all duration-1000" />{hasBadge && ( <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"><div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-[shine_4s_infinite]"></div></div>)}</div><div className="mt-2 text-center flex flex-col justify-center w-full"><p className={`text-[10px] md:text-[13px] font-black uppercase tracking-tight transition-colors leading-none truncate ${hasBadge ? 'text-yellow-400' : 'text-[#7c2d2d]'}`}>{hasBadge ? gym.badgeName.split(' ')[1] : '---'}</p><p className={`text-[7px] md:text-[9px] font-bold uppercase opacity-30 mt-1 tracking-widest truncate px-1 ${hasBadge ? 'text-yellow-100' : 'text-[#5a1a1a]'}`}>{hasBadge ? gym.city.replace('Ciudad', '').replace('Isla', '').trim() : '---'}</p></div></div>);})}
        </div>
        <div className="mt-3 md:mt-4 flex flex-col items-center flex-shrink-0"><div className="bg-gray-800/90 backdrop-blur px-6 py-2 rounded-full border border-gray-700 shadow-2xl"><span className="text-gray-200 text-[9px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">PROGRESS: <span className="text-yellow-500 ml-2 font-pixel">{(trainer.badges || []).length} / 8</span></span></div></div>
      </div>
      <style>{`@keyframes shine { 0% { left: -100%; } 15% { left: 100%; } 100% { left: 100%; } }`}</style>
    </div>
  );

  return (
    <div className="h-[100dvh] w-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
      <div className="bg-red-600 text-white px-3 py-2 shadow-lg flex justify-between items-center z-50 flex-shrink-0 h-14">
        <div className="flex items-center">
          <button onClick={() => setCurrentView('SETTINGS')} className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center border border-red-500 active:scale-95 transition-all shadow-sm mr-3"><i className="fas fa-cog text-sm text-red-100"></i></button>
          <div>
            <h1 className="font-bold text-sm md:text-base font-pixel tracking-tighter">Pokémon Companion</h1>
            <div className="flex items-center text-[10px] opacity-90 mt-0.5 bg-black/20 px-2 py-0.5 rounded-full inline-block"><i className="fas fa-map-marker-alt mr-1"></i><span className="max-w-[70px] truncate">{trainer.currentLocation}</span></div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xs uppercase tracking-tighter text-red-200 truncate max-w-[100px]">{trainer.name}</div>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-gray-100 flex flex-col">
        {currentView === 'MENU' && renderMenu()}
        {currentView === 'TEAM' && renderTeam()}
        {currentView === 'EXPLORE' && <ExploreModule trainer={trainer} onExplore={onExplore} onTravel={onTravel} onClose={() => setCurrentView('MENU')} />}
        {currentView === 'POKECENTER' && renderPokeCenter()}
        {currentView === 'GYMS' && renderGyms()}
        {currentView === 'GYM_DETAIL' && renderGymDetail()}
        {currentView === 'BADGES' && renderBadges()}
        {currentView === 'POKEDEX' && <PokedexScreen trainer={trainer} onClose={() => setCurrentView('MENU')} />}
        {currentView === 'SOCIAL' && <MatchModule trainer={trainer} onUpdateTrainer={onUpdateTrainer} onClose={() => setCurrentView('MENU')} />}
        {currentView === 'SETTINGS' && (<SettingsModule trainer={trainer} onUpdateTrainer={onUpdateTrainer} onReset={onReset} onLogout={onLogout} onClose={() => setCurrentView('MENU')} />)}
        {currentView === 'EVENTS' && (<EventsModule trainer={trainer} onTriggerEvent={onTriggerEvent} onClose={() => setCurrentView('MENU')} />)}
      </div>
    </div>
  );
};

export default MainGame;
