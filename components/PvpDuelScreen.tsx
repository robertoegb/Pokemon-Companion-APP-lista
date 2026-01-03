
import React, { useState, useEffect, useMemo } from 'react';
import { Interaction, Trainer, PokemonInstance, PokemonType, StatusEffect } from '../types';
import { 
  updatePvpConfig, 
  confirmPvpSelection, 
  startPvpBattle,
  updatePvpActiveIdx,
  markPvpFainted,
  finalizePvpRewards
} from '../services/firebaseService';
import { getTypeEffectiveness } from '../data';

interface PvpDuelScreenProps {
  interaction: Interaction;
  trainer: Trainer;
  maxPossiblePicks: number;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Electric: '#F8D030', Grass: '#78C850', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0', Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820', Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848', Fairy: '#EE99AC'
};

const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  PAR: { label: 'PAR', color: 'text-yellow-500' },
  PSN: { label: 'PSN', color: 'text-purple-500' },
  SLP: { label: 'SLP', color: 'text-slate-400' },
  BRN: { label: 'BRN', color: 'text-red-500' },
  FRZ: { label: 'FRZ', color: 'text-cyan-400' },
  CONF: { label: 'CONF', color: 'text-pink-400' }
};

const MOVE_RANGES: Record<string, number> = {
  'Conversión': 0, 'Fortaleza': 0, 'Minimizar': 0, 'Metrónomo': 0, 'Rizo Defensa': 0, 'Afilar': 0, 'Sustituto': 0, 'Doble Equipo': 0, 'Salpicadura': 0, 'Danza espada': 0, 'Amortiguador': 0, 'Foco Energía': 0, 'Desarrollo': 0, 'Agilidad': 0, 'Amnesia': 0, 'Teletransporte': 0, 'Reflejo': 0, 'Barrera': 0, 'Recuperación': 0, 'Meditación': 0, 'Armadura Ácida': 0, 'Neblina': 0, 'Descanso': 0, 'Transformación': 0, 'Refugio': 0,
  'Placaje': 1, 'Arañazo': 1, 'Mordisco': 1, 'Derribo': 1, 'Doble Filo': 1, 'Ataque Rápido': 1, 'Cuchillada': 1, 'Hipercolmillo': 1, 'Supercolmillo': 1, 'Venganza': 1, 'Doble Bofetón': 1, 'Destructor': 1, 'Golpe Cuerpo': 1, 'Cornada': 1, 'Perforador': 1, 'Furia': 1, 'Golpe Cometa': 1, 'Megapuño': 1, 'Megapatada': 1, 'Cabezazo': 1, 'Pisotón': 1, 'Corte': 1, 'Fuerza': 1, 'Ataque Furia': 1, 'Guillotina': 1, 'Agarre': 1, 'Constricción': 1, 'Bomba huevo': 1, 'Puño Fuego': 1, 'Tenaza': 1, 'Martillazo': 1, 'Puño Trueno': 1, 'Picotazo Veneno': 1, 'Chupavidas': 1, 'Doble Ataque': 1, 'Picotazo': 1, 'Pico Taladro': 1, 'Ataque Ala': 1, 'Hueso Palo': 1, 'Huesomerang': 1, 'Doble Patada': 1, 'Sumisión': 1, 'Patada Baja': 1, 'Mov. Sísmico': 1, 'Puño Kárate': 1, 'Patada Giro': 1, 'Patada Salto': 1, 'Patada Salto Alta': 1, 'Contador': 1, 'Puño Hielo': 1, 'Lengüetazo': 1,
  'Látigo': 2, 'Gruñido': 2, 'Supersónico': 2, 'Rugido': 2, 'Deslumbrar': 2, 'Chirrido': 2, 'Destello': 2, 'Mimético': 2, 'Malicioso': 2, 'Remolino': 2, 'Canto': 2, 'Anulación': 2, 'Pantalla Humo': 2, 'Látigo Cepa': 2, 'Paralizador': 2, 'Espora': 2, 'Somnífero': 2, 'Onda Trueno': 2, 'Hipnosis': 2, 'Kinético': 2, 'Gas Venenoso': 2, 'Polvo Veneno': 2, 'Tóxico': 2, 'Rayo Confuso': 2, 'Tinieblas': 2, 'Niebla': 2, 'Beso Amoroso': 2,
  'Bombardeo': 4, 'Clavo Cañón': 4, 'Triataque': 4, 'Día de Pago': 4, 'Tornado': 4, 'Ataque Arena': 4, 'Ascuas': 4, 'Burbuja': 4, 'Pistola Agua': 4, 'Rayo burbuja': 4, 'Hoja Afilada': 4, 'Drenadoras': 4, 'Absorber': 4, 'Megaagotar': 4, 'Impactrueno': 4, 'Confusión': 4, 'Psicoonda': 4, 'Ácido': 4, 'Residuos': 4, 'Disparo Demora': 4, 'Pin Misil': 4, 'Mov. Espejo': 4, 'Lanzarrocas': 4, 'Rayo Aurora': 4, 'Cascada': 4,
  'Gamberrada': 6, 'Autodestrucción': 6, 'Explosión': 6, 'Rapidez': 6, 'Hiperrayo': 6, 'Viento cortante': 6, 'Lanzallamas': 6, 'Llamarada': 6, 'Giro Fuego': 6, 'Rayo Solar': 6, 'Surf': 6, 'Hidrobomba': 6, 'Danza Pétalo': 6, 'Rayo': 6, 'Trueno': 6, 'Psíquico': 6, 'Psicorrayo': 6, 'Come Sueños': 6, 'Polución': 6, 'Ataque Aéreo': 6, 'Vuelo': 6, 'Excavación': 6, 'Terremoto': 6, 'Fisura': 6, 'Avalancha': 6, 'Furia Dragón': 6
};

const SPECIAL_MOVE_INFO: Record<string, string> = {
  'Látigo': '-1 a un dado de DEF del oponente', 'Gruñido': '-1 a un dado de ATK del oponente', 'Supercolmillo': 'Daño = 50% de PS actuales del rival', 'Foco Energía': 'Críticos = 18, 19 y 20', 'Malicioso': '-1 a un dado de DEF del oponente', 'Fortaleza': '+1 a un dado de DEF del usuario', 'Canto': 'Duerme al oponente', 'Minimizar': '+2 a tirada de evasión', 'Metrónomo': 'Lanza d20, revisa el resultado en la tabla', 'Rizo Defensa': '+1 a un dado de DEF del usuario', 'Perforador': 'KO en un golpe si impacta', 'Remolino': 'El oponente no puede moverse su siguiente turno', 'Deslumbrar': 'Paraliza al oponente', 'Chirrido': '-1 a dos dados o -2 a un dado de DEF', 'Conversión': 'Cambia el tipo del usuario al tipo de su primer movimiento', 'Afilar': '+1 a un dado de ATK del usuario', 'Sustituto': 'Crea un sustituto usando 1/4 de PS del usuario', 'Doble Equipo': '+1 a evasión del usuario', 'Salpicadura': 'El usuario no hace nada', 'Rugido': 'Rival no puede acercarse en su siguiente turno', 'Supersónico': 'Confunde al oponente', 'Destello': '-2 a tiradas de impacto del oponente', 'Danza espada': '+2 a un dado o +1 a dos dados de ATK', 'Mimético': 'Copia un movimiento del oponente hasta que el usuario sea debilitado o cambiado (mov. copiado: 100% de precisión)', 'Amortiguador': 'Restaura 50% de PS del usuario', 'Refugio': '+1 a un dado de DEF del usuario', 'Drenadoras': 'Cada 2 turnos el oponente pierde 1 PS. El usuario recupera la mitad.', 'Somnífero': 'Duerme al oponente', 'Espora': 'Duerme al oponente', 'Desarrollo': '+1 a un dado de ATK.ESP del usuario', 'Paralizador': 'Paraliza al oponente', 'Onda Trueno': 'Paraliza al oponente', 'Agilidad': '+1 evasión y +1 movimiento', 'Hipnosis': 'Duerme al oponente', 'Amnesia': '+2 a un dado o +1 a dos dados de ATK.ESP', 'Teletransporte': 'Teletransporte al usuario máximo 8 casillas', 'Reflejo': 'Reduce a la mitad el daño físico durante 5 turnos', 'Barrera': '+2 a un dado o +1 a dos dados de DEF', 'Recuperación': 'Restaura 50% de PS del usuario', 'Kinético': '-2 a tiradas de impacto del oponente', 'Meditación': '+1 a un dado de ATK del usuario', 'Psicoonda': 'lanza d20: 1-7->-1d6 daño, 8-13: sin cambios, 14-20->+1d6 daño (80% precisión)', 'Descanso': 'Restaura todos los PS y duerme durante 2 turnos', 'Polvo Veneno': 'Envenena al oponente', 'Gas Venenoso': 'Envenena al oponente', 'Armadura Ácida': '+1 a un dado de DEF del usuario', 'Tóxico': 'Envenena gravemente al oponente.', 'Disparo Demora': '-1 evasión y -1 movimiento del oponente', 'Mov. Espejo': 'Copia último mov. del oponente (falla si usuario no ha sido objetivo de movimientos oponentes)', 'Ataque Arena': '-2 a tiradas de impacto del oponente', 'Mov. Sísmico': 'Daño = Nivel usuario/10 PS', 'Rayo Confuso': 'Confunde al oponente', 'Tinieblas': '-2 a tiradas de impacto del oponente', 'Neblina': 'Previene cambios de estadísticas del usuario por 5 turnos', 'Niebla': 'Elimina cambios de estadística de ambos Pokémon', 'Anulación': 'Anula el último movimiento rival por 1d4 turnos', 'Pantalla Humo': '-2 a tiradas de impacto del oponente', 'Guillotina': 'KO en un golpe si impacta', 'Fisura': 'KO en un golpe si impacta', 'Transformación': 'Convierte al usuario en el pokémon objetivo. Copia estadísticas, tipo y movimientos.'
};

const PvpDuelScreen: React.FC<PvpDuelScreenProps> = ({ interaction, trainer, maxPossiblePicks, onClose }) => {
  const isFrom = interaction.fromUid === trainer.uid;
  const rivalName = isFrom ? interaction.toName : interaction.fromName;
  const myReady = isFrom ? interaction.fromReady : interaction.toReady;
  const rivalReady = isFrom ? interaction.toReady : interaction.fromReady;
  const iAmHost = isFrom;
  
  const [selectedUids, setSelectedUids] = useState<string[]>([]);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState<number | null>(null);
  const [inspectingRival, setInspectingRival] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMoveInfo, setActiveMoveInfo] = useState<{name: string, info: string} | null>(null);
  const [pendingPokemonCount, setPendingPokemonCount] = useState<number | null>(null);

  const mySelection = useMemo(() => (isFrom ? interaction.pvpConfig?.fromSelection : interaction.pvpConfig?.toSelection) || [], [interaction, isFrom]);
  const rivalSelection = useMemo(() => (isFrom ? interaction.pvpConfig?.toSelection : interaction.pvpConfig?.fromSelection) || [], [interaction, isFrom]);

  const myActiveIdx = (isFrom ? interaction.pvpConfig?.fromActiveIdx : interaction.pvpConfig?.toActiveIdx) ?? 0;
  const rivalActiveIdx = (isFrom ? interaction.pvpConfig?.toActiveIdx : interaction.pvpConfig?.fromActiveIdx) ?? 0;
  const myFainted = (isFrom ? interaction.pvpConfig?.fromFaintedIndices : interaction.pvpConfig?.toFaintedIndices) || [];
  const rivalFainted = (isFrom ? interaction.pvpConfig?.toFaintedIndices : interaction.pvpConfig?.fromFaintedIndices) || [];
  const mySwitchUsed = (isFrom ? interaction.pvpConfig?.fromSwitchUsed : interaction.pvpConfig?.toSwitchUsed) || false;
  
  const winnerUid = interaction.pvpConfig?.winnerUid;
  const rewardProcessed = interaction.pvpConfig?.rewardProcessed;

  useEffect(() => {
    if (interaction.status === 'SETUP' && interaction.fromReady && interaction.toReady && iAmHost) {
      startPvpBattle(interaction.id);
    }
  }, [interaction.status, interaction.fromReady, interaction.toReady, iAmHost, interaction.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSetCount = (count: number) => {
    if (!iAmHost) return;
    setPendingPokemonCount(count);
  };

  const confirmPokemonCount = () => {
    if (pendingPokemonCount !== null) {
      updatePvpConfig(interaction.id, pendingPokemonCount);
      setPendingPokemonCount(null);
    }
  };

  const toggleSelect = (uid: string) => {
    if (myReady) return;
    const pokemon = trainer.team.find(p => p.instanceId === uid);
    if (pokemon && (isNaN(pokemon.currentHp) || pokemon.currentHp <= 0)) {
        showToast("¡ESTE POKÉMON NO PUEDE LUCHAR!");
        return;
    }
    const count = interaction.pvpConfig?.pokemonCount || 1;
    setSelectedUids(prev => {
        if (prev.includes(uid)) return prev.filter(id => id !== uid);
        if (prev.length >= count) return prev;
        return [...prev, uid];
    });
  };

  const handleConfirmSelection = () => {
    const selection = trainer.team.filter(p => selectedUids.includes(p.instanceId));
    confirmPvpSelection(interaction.id, trainer.uid, isFrom, selection);
  };

  const handleManualSwitch = (idx: number) => {
    if (myFainted.includes(idx) || idx === myActiveIdx) return;
    if (myFainted.includes(myActiveIdx)) {
      updatePvpActiveIdx(interaction.id, isFrom, idx, false);
      return;
    }
    if (mySwitchUsed) {
      showToast("CAMBIOS AGOTADOS");
      return;
    }
    setShowSwitchConfirm(idx);
  };

  const confirmSwitch = () => {
    if (showSwitchConfirm !== null) {
      updatePvpActiveIdx(interaction.id, isFrom, showSwitchConfirm, true);
      setShowSwitchConfirm(null);
    }
  };

  const handleDebilitado = () => {
    const count = interaction.pvpConfig?.pokemonCount || 1;
    markPvpFainted(interaction.id, isFrom, myActiveIdx, count);
  };

  const handleFinalizeCombat = async () => {
    if (winnerUid && !rewardProcessed) {
      try {
        const loserUid = winnerUid === interaction.fromUid ? interaction.toUid : interaction.fromUid;
        const count = interaction.pvpConfig?.pokemonCount || 1;
        const reward = count * 100;
        await finalizePvpRewards(interaction.id, winnerUid, loserUid, reward);
        onClose();
      } catch (err) {
        console.error("ERROR FINALIZANDO:", err);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const getPvpStats = (p: PokemonInstance) => {
    const velocidadReal = Math.floor(((2 * p.baseStats.speed + 31) * p.level) / 100) + 5;
    const calcRealStat = (base: number) => Math.floor(((2 * base + 31) * p.level) / 100) + 5;
    return {
      dadosAtk: Math.max(1, Math.round(calcRealStat(p.baseStats.attack) / 25)),
      dadosDef: Math.max(1, Math.round(calcRealStat(p.baseStats.defense) / 25)),
      dadosSpAtk: Math.max(1, Math.round(calcRealStat(p.baseStats.specialAttack) / 25)),
      dadosSpDef: Math.max(1, Math.round(calcRealStat(p.baseStats.specialDefense) / 25)),
      bonusEvasion: Math.round(velocidadReal / 22),
      mov: Math.max(1, Math.round(velocidadReal / 20)),
      psFisicos: Math.round(p.maxHp / 10),
      psFisicosActuales: Math.round(p.currentHp / 10)
    };
  };

  const getMovePvpInfo = (attacker: PokemonInstance, m: any, rivalEvasionBonus: number) => {
    const isSpecial = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon'].includes(m.type);
    const actualStat = Math.floor(((2 * (isSpecial ? attacker.baseStats.specialAttack : attacker.baseStats.attack) + 31) * attacker.level) / 100) + 5;
    const baseDice = Math.max(1, Math.round(actualStat / 25));
    const dificultadBase = Math.round(21 - (m.accuracy / 5));
    const numeroObjetivo = Math.max(2, Math.min(20, dificultadBase + rivalEvasionBonus));
    const range = MOVE_RANGES[m.name] ?? 1; 
    const x2: PokemonType[] = [];
    const xHalf: PokemonType[] = [];
    const xZero: PokemonType[] = [];
    Object.values(PokemonType).forEach(t => {
      const eff = getTypeEffectiveness(m.type, [t]);
      if (eff > 1) x2.push(t);
      else if (eff > 0 && eff < 1) xHalf.push(t);
      else if (eff === 0) xZero.push(t);
    });
    return { baseDice, numeroObjetivo, range, x2, xHalf, xZero, isSpecial };
  };

  const renderPokemonCard = (p: PokemonInstance, isRival: boolean = false) => {
    const stats = getPvpStats(p);
    const opponentActive = isRival ? (mySelection[myActiveIdx]) : (rivalSelection[rivalActiveIdx]);
    const opponentStats = opponentActive ? getPvpStats(opponentActive) : { bonusEvasion: 0 };
    const rivalEvasionBonus = opponentStats.bonusEvasion;

    return (
      <div className="bg-white rounded-[40px] shadow-2xl border-b-[12px] border-slate-300 overflow-hidden animate-in slide-in-from-bottom duration-500 w-full">
         <div className={`${isRival ? 'bg-red-600 border-red-800' : 'bg-indigo-600 border-indigo-800'} p-6 text-white flex justify-between items-center relative overflow-hidden border-b-4 h-32`}>
            <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4"><i className={`fas ${isRival ? 'fa-skull' : 'fa-bolt'} text-9xl`}></i></div>
            <div className="z-10 flex flex-col">
               <div className="flex items-center gap-2">
                  <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">{p.name}</h3>
                  <div className="flex gap-1">{p.types.map(t => (<div key={t} className="w-4 h-4 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: TYPE_COLORS[t] }}></div>))}</div>
               </div>
               <div className="mt-2 flex items-center gap-2"><span className="text-xl font-black">PS: {stats.psFisicosActuales} / {stats.psFisicos}</span><i className="fas fa-heart text-red-400 text-lg animate-pulse"></i></div>
            </div>
            <div className="z-10 h-full flex items-center"><img src={p.sprites.front} className={`w-24 h-24 pixelated drop-shadow-xl ${!isRival ? 'animate-bounce' : ''}`} style={{ animationDuration: '3s' }} alt={p.name} /></div>
         </div>
         <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 border-b border-slate-100">
            <div className="bg-slate-800 text-white rounded-2xl p-2 text-center border-b-4 border-black/20"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Bonus Evasión</p><p className="font-bold text-lg">+{stats.bonusEvasion}</p></div>
            <div className="bg-slate-800 text-white rounded-2xl p-2 text-center border-b-4 border-black/20"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Movimiento</p><p className="font-bold text-lg">{stats.mov}</p></div>
         </div>
         <div className="p-4 space-y-2">
            {p.moves.map((m, midx) => {
               const pvp = getMovePvpInfo(p, m, rivalEvasionBonus);
               const statusInfo = m.statusEffect && m.statusEffect !== StatusEffect.None ? STATUS_CONFIG[m.statusEffect as unknown as string] : null;
               const isSpecialAction = m.power === 0;
               return (
                 <div key={midx} className="bg-white border-2 border-slate-100 rounded-3xl p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: TYPE_COLORS[m.type] }}></div>
                      <h5 className="font-black text-base uppercase text-slate-800 tracking-tight leading-tight">{m.name}</h5>
                      <span className="ml-auto text-[8px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">{pvp.isSpecial ? 'A.ESP' : 'FISICO'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black text-slate-600 mb-1.5 border-y border-dashed border-slate-100 py-1.5">
                      <div className="flex items-center gap-1.5">🎯 <span className="text-xs">d20 &ge; {pvp.numeroObjetivo}</span></div>
                      <div className="w-px h-3 bg-slate-200"></div>
                      {isSpecialAction ? (
                        <button onClick={() => setActiveMoveInfo({ name: m.name, info: SPECIAL_MOVE_INFO[m.name] || 'Efecto especial.' })} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg text-[9px] uppercase border border-indigo-200 active:scale-95 transition-all">Info. del mov.</button>
                      ) : (
                        <div className="flex items-center gap-1.5">🎲 <span className="text-xs">{pvp.baseDice}d6</span></div>
                      )}
                      {statusInfo && (
                        <><div className="w-px h-3 bg-slate-200"></div><div className="flex items-center gap-1"><span className={`${statusInfo.color} text-[10px]`}>{statusInfo.label}</span><span className="text-slate-400 text-[10px] font-bold">{m.statusChance}%</span></div></>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 pt-0.5">
                      <div className="flex items-center gap-1 flex-shrink-0">📏 <span className="text-[10px] font-black text-slate-500 uppercase">Alcance: {pvp.range === 0 ? '-' : `X${pvp.range}`}</span></div>
                      <div className="flex flex-wrap gap-3">
                        {pvp.x2.length > 0 && (<div className="flex items-center gap-1.5"><span className="text-[9px] font-black text-green-600 uppercase">x2</span><div className="flex gap-0.5">{pvp.x2.map(t => <div key={t} className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: TYPE_COLORS[t] }}></div>)}</div></div>)}
                        {pvp.xHalf.length > 0 && (<div className="flex items-center gap-1.5"><span className="text-[9px] font-black text-orange-600 uppercase">x½</span><div className="flex gap-0.5">{pvp.xHalf.map(t => <div key={t} className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: TYPE_COLORS[t] }}></div>)}</div></div>)}
                        {pvp.xZero.length > 0 && (<div className="flex items-center gap-1.5"><span className="text-[9px] font-black text-slate-400 uppercase">x0</span><div className="flex gap-0.5">{pvp.xZero.map(t => <div key={t} className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: TYPE_COLORS[t] }}></div>)}</div></div>)}
                      </div>
                    </div>
                 </div>
               );
            })}
         </div>
         {!isRival && !myFainted.includes(myActiveIdx) && (<div className="p-4 bg-slate-50 border-t border-slate-100"><button onClick={handleDebilitado} className="w-full bg-red-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-xl border-b-8 border-red-800 active:translate-y-1 transition-all"><i className="fas fa-skull mr-2"></i> DEBILITADO</button></div>)}
      </div>
    );
  };

  if (winnerUid) {
    const iWon = winnerUid === trainer.uid;
    const count = interaction.pvpConfig?.pokemonCount || 1;
    const reward = count * 100;
    return (
      <div className="fixed inset-0 z-[1200] bg-slate-950 flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
        <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-sm overflow-hidden border-b-[16px] border-indigo-600 text-center animate-in zoom-in duration-300">
          <div className={`h-48 ${iWon ? 'bg-yellow-400' : 'bg-slate-800'} flex items-center justify-center relative overflow-hidden`}><div className="absolute inset-0 opacity-10"><i className={`fas ${iWon ? 'fa-trophy' : 'fa-skull'} text-[12rem] -rotate-12`}></i></div><i className={`fas ${iWon ? 'fa-crown text-yellow-600 scale-[2.5]' : 'fa-heart-broken text-red-500 scale-[2.5]'} drop-shadow-xl animate-bounce`}></i></div>
          <div className="p-10">
            <h2 className={`font-pixel text-[12px] uppercase mb-4 tracking-tighter ${iWon ? 'text-yellow-600' : 'text-slate-400'}`}>{iWon ? '¡VICTORIA TOTAL!' : 'DERROTA...'}</h2>
            <p className="text-slate-800 font-black text-xl uppercase mb-8 leading-tight">{iWon ? `Has vencido a ${rivalName}` : `${rivalName} ha ganado el duelo`}</p>
            <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 mb-8"><p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{iWon ? 'GANANCIAS' : 'PÉRDIDAS'}</p><p className={`text-3xl font-black ${iWon ? 'text-green-600' : 'text-red-600'}`}>{iWon ? '+' : '-'} ₽{reward}</p></div>
            <button onClick={handleFinalizeCombat} className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl uppercase text-xs tracking-widest shadow-xl border-b-8 border-indigo-800 active:translate-y-2 transition-all">CONTINUAR AVENTURA</button>
          </div>
        </div>
      </div>
    );
  }

  if (interaction.status === 'ACCEPTED') {
    const options = Array.from({ length: maxPossiblePicks }, (_, i) => i + 1);
    return (
      <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-6 text-white animate-in zoom-in duration-300">
         {pendingPokemonCount !== null && (
           <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white rounded-[40px] p-8 w-full max-w-sm text-center shadow-2xl border-b-[12px] border-indigo-600 animate-in zoom-in">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-indigo-100 text-indigo-600">
                  <i className="fas fa-bolt text-3xl"></i>
                </div>
                <h3 className="font-black text-lg uppercase tracking-tighter text-slate-800 mb-2">Confirmar Duelo</h3>
                <p className="text-sm font-bold text-slate-400 uppercase leading-relaxed mb-8">
                  ¿Quieres un duelo a <span className="text-indigo-600 text-xl">{pendingPokemonCount}</span> Pokémon?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={confirmPokemonCount} className="bg-green-500 text-white font-black py-4 rounded-2xl uppercase text-xs border-b-4 border-green-800 active:translate-y-1">SÍ</button>
                  <button onClick={() => setPendingPokemonCount(null)} className="bg-slate-100 text-slate-400 font-black py-4 rounded-2xl uppercase text-xs">CANCELAR</button>
                </div>
             </div>
           </div>
         )}

         <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm p-8 text-center text-slate-800 border-b-[12px] border-indigo-600 relative">
            {iAmHost ? (
              <>
                <h2 className="font-pixel text-[10px] uppercase mb-6 tracking-tighter">Configurar Duelo</h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase mb-4">{interaction.stakeBadgeId ? 'Duelo por Medalla' : 'Duelo de Práctica'}</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {options.map(n => {
                    return (
                      <button 
                        key={n} 
                        onClick={() => handleSetCount(n)} 
                        className="py-4 rounded-2xl font-black text-xl border-b-4 bg-indigo-600 text-white border-indigo-800 active:translate-y-1 transition-all shadow-md"
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest italic mb-6">Toca un número para confirmar la cantidad</p>
              </>
            ) : (
              <><i className="fas fa-cog animate-spin text-4xl text-indigo-600 mb-6"></i><h2 className="font-pixel text-[10px] uppercase mb-4 tracking-tighter">Esperando al Host</h2><p className="text-xs font-bold text-slate-500 leading-relaxed uppercase">{rivalName} está configurando...</p></>
            )}
         </div>
      </div>
    );
  }

  if (interaction.status === 'SETUP') {
    const count = interaction.pvpConfig?.pokemonCount || 1;
    const isSelectionComplete = selectedUids.length === count;
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in fade-in duration-300 overflow-hidden">
        <div className="bg-red-600 p-6 flex justify-between items-center border-b-4 border-red-800">
          <div><h2 className="text-white font-pixel text-[10px] uppercase">Elegir Equipo</h2><p className="text-red-200 text-[8px] font-black mt-1 uppercase">Selecciona {count} Pokémon</p></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
          {trainer.team.map((p) => {
            const isFainted = isNaN(p.currentHp) || p.currentHp <= 0;
            const isSelected = selectedUids.includes(p.instanceId);
            return (
              <button key={p.instanceId} onClick={() => toggleSelect(p.instanceId)} disabled={myReady || isFainted} className={`w-full p-4 rounded-3xl border-4 flex items-center gap-4 transition-all text-left relative ${isSelected ? 'bg-indigo-600 border-white text-white shadow-xl' : isFainted ? 'bg-slate-900 border-slate-950 opacity-40 grayscale cursor-not-allowed' : 'bg-slate-900 border-slate-800 text-slate-400'}`}><img src={p.sprites.front} className="w-16 h-16 pixelated" alt="p" /><div className="flex-1"><h4 className="font-black text-sm uppercase">{p.name}</h4><div className="flex items-center gap-2"><p className="text-[10px] font-bold uppercase opacity-60">NV.{p.level}</p>{isFainted && <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black uppercase">Debilitado</span>}</div></div>{isSelected && <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 font-black">{selectedUids.indexOf(p.instanceId) + 1}</div>}</button>
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-md border-t border-white/10 z-50 flex flex-col gap-3">
          {myReady ? (
            <div className="text-center py-4 bg-indigo-500 rounded-2xl animate-pulse"><p className="text-white font-black text-xs uppercase tracking-widest">{rivalReady ? '¡Iniciando Batalla!' : 'Esperando elección del rival...'}</p></div>
          ) : (
            <button disabled={!isSelectionComplete} onClick={handleConfirmSelection} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95 border-b-8 border-green-800 disabled:opacity-30">CONFIRMAR EQUIPO</button>
          )}
        </div>
      </div>
    );
  }

  const activePokemon = mySelection[myActiveIdx];
  const rivalActivePokemon = rivalSelection[rivalActiveIdx];
  const activeStats = activePokemon ? getPvpStats(activePokemon) : null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-100 flex flex-col animate-in fade-in duration-500 overflow-hidden select-none">
       {toastMessage && (<div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-2xl border-2 border-white/20 animate-in slide-in-from-top-4 duration-200">{toastMessage}</div>)}
       {activeMoveInfo && (
         <div className="fixed inset-0 z-[2500] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in"><div className="bg-white rounded-[40px] p-8 w-full max-w-sm text-center shadow-2xl border-b-[12px] border-indigo-600 animate-in zoom-in"><div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-100 text-indigo-600"><i className="fas fa-info-circle text-2xl"></i></div><h3 className="font-black text-xl uppercase tracking-tighter text-slate-800 mb-2">{activeMoveInfo.name}</h3><div className="h-px bg-slate-100 w-full mb-4"></div><p className="text-sm font-bold text-slate-600 uppercase leading-relaxed mb-8">{activeMoveInfo.info}</p><button onClick={() => setActiveMoveInfo(null)} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl uppercase text-xs border-b-4 border-indigo-800 active:translate-y-1 transition-all">ENTENDIDO</button></div></div>
       )}
       {showSwitchConfirm !== null && (
         <div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in"><div className="bg-white rounded-[40px] p-8 w-full max-sm text-center shadow-2xl border-b-[12px] border-indigo-600 animate-in zoom-in"><div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-indigo-100"><img src={mySelection[showSwitchConfirm].sprites.front} className="w-16 h-16 pixelated" alt="p" /></div><h3 className="font-black text-lg uppercase tracking-tighter text-slate-800 mb-4">¿Usar cambio manual?</h3><p className="text-xs font-bold text-slate-400 uppercase leading-relaxed mb-8">Solo puedes cambiar manualmente <span className="text-indigo-600">una vez</span>. ¿Quieres hacerlo ahora?</p><div className="grid grid-cols-2 gap-3"><button onClick={confirmSwitch} className="bg-indigo-600 text-white font-black py-4 rounded-2xl uppercase text-xs border-b-4 border-indigo-800 active:translate-y-1">SÍ, CAMBIAR</button><button onClick={() => setShowSwitchConfirm(null)} className="bg-slate-100 text-slate-400 font-black py-4 rounded-2xl uppercase text-xs">CANCELAR</button></div></div></div>
       )}
       {inspectingRival && rivalActivePokemon && (
         <div className="fixed inset-0 z-[800] bg-black/80 flex flex-col items-center justify-start p-4 backdrop-blur-sm animate-in fade-in overflow-y-auto pt-16 pb-20"><div className="w-full max-w-sm relative flex flex-col items-center"><button onClick={() => setInspectingRival(false)} className="fixed top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl z-[900] border-2 border-slate-200"><i className="fas fa-times text-xl"></i></button>{renderPokemonCard(rivalActivePokemon, true)}</div></div>
       )}
       <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center h-14 flex-shrink-0 z-[100]"><div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span><h2 className="font-pixel text-[8px] uppercase tracking-tighter truncate max-w-[150px]">Duelo vs {rivalName}</h2></div></div>
       <div className="bg-slate-800 p-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0 border-b-4 border-slate-950 h-20 items-center">
          {rivalSelection.map((p, idx) => {
            const isFainted = rivalFainted.includes(idx); const isActive = idx === rivalActiveIdx;
            return (<div key={idx} className="relative flex-shrink-0"><button disabled={!isActive || isFainted} onClick={() => setInspectingRival(true)} className={`w-16 h-16 rounded-2xl border-4 transition-all relative overflow-hidden flex items-center justify-center ${isActive ? 'border-red-500 bg-red-50 ring-4 ring-red-500/30' : 'border-slate-700 bg-slate-900'} ${isFainted ? 'opacity-40 grayscale contrast-50' : ''}`}>{isActive ? <img src={p.sprites.front} className="w-12 h-12 pixelated" alt="p" /> : <div className="w-8 h-8 rounded-full border-2 border-slate-600 bg-white overflow-hidden relative"><div className={`absolute top-0 w-full h-1/2 ${isFainted ? 'bg-gray-400' : 'bg-red-600'} border-b-2 border-slate-600`}></div></div>}</button>{isFainted && <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"><i className="fas fa-times text-red-600 text-4xl drop-shadow-[0_0_8px_rgba(255,0,0,1)] animate-in zoom-in duration-300"></i></div>}</div>);
          })}
       </div>
       <div className="bg-white border-b-2 border-slate-200 p-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0 h-20 items-center">
          {mySelection.map((p, idx) => {
            const isActive = idx === myActiveIdx; const isFainted = myFainted.includes(idx);
            return (<div key={idx} className="relative flex-shrink-0"><button onClick={() => handleManualSwitch(idx)} className={`w-16 h-16 rounded-2xl border-4 transition-all relative overflow-hidden flex items-center justify-center ${isActive ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-400/20 scale-105' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'} ${isFainted ? 'opacity-20' : ''}`}><img src={p.sprites.front} className="w-12 h-12 pixelated" alt="p" /><div className="absolute bottom-0 right-0 bg-slate-800 text-white text-[6px] px-1 font-black">NV.{p.level}</div>{isActive && <div className="absolute top-0 left-0 bg-yellow-400 text-[6px] px-1 font-black text-white uppercase z-10">ACT</div>}</button>{isFainted && <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"><i className="fas fa-times text-red-600 text-4xl drop-shadow-[0_0_8px_rgba(255,0,0,1)] animate-in zoom-in duration-300"></i></div>}</div>);
          })}
       </div>
       <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-200">
          <div className="p-4 max-w-2xl mx-auto">
            {activePokemon ? (
              myFainted.includes(myActiveIdx) ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center"><div className="w-32 h-32 bg-slate-300 rounded-full flex items-center justify-center mb-6 grayscale opacity-50 border-4 border-red-500 relative"><img src={activePokemon.sprites.front} className="w-24 h-24 pixelated" alt="p" /><div className="absolute inset-0 flex items-center justify-center"><i className="fas fa-times text-red-600 text-6xl drop-shadow-xl"></i></div></div><h3 className="font-pixel text-xs text-red-600 uppercase mb-4">¡{activePokemon.name} debilitado!</h3><p className="font-bold text-slate-500 text-xs uppercase tracking-widest animate-pulse">Selecciona un relevo arriba</p></div>
              ) : (renderPokemonCard(activePokemon))
            ) : (<div className="py-20 text-center opacity-20"><i className="fas fa-bullseye text-6xl mb-4"></i><p className="font-black uppercase text-xs tracking-widest">Iniciando Combate...</p></div>)}
          </div>
       </div>
       <div className="bg-slate-900 text-white p-4 grid grid-cols-4 gap-2 flex-shrink-0 border-t-4 border-indigo-500">
          <div className="text-center bg-white/5 py-2 rounded-xl"><p className="text-[7px] text-slate-500 uppercase font-black tracking-widest">⚔️ Atk</p><p className="font-bold text-sm">{activeStats?.dadosAtk}d6</p></div>
          <div className="text-center bg-white/5 py-2 rounded-xl"><p className="text-[7px] text-slate-500 uppercase font-black tracking-widest">🛡️ Def</p><p className="font-bold text-sm">{activeStats?.dadosDef}d6</p></div>
          <div className="text-center bg-white/5 py-2 rounded-xl"><p className="text-[7px] text-slate-500 uppercase font-black tracking-widest">🪄 Esp.A</p><p className="font-bold text-sm">{activeStats?.dadosSpAtk}d6</p></div>
          <div className="text-center bg-white/5 py-2 rounded-xl"><p className="text-[7px] text-slate-500 uppercase font-black tracking-widest">🌟 Esp.D</p><p className="font-bold text-sm">{activeStats?.dadosSpDef}d6</p></div>
       </div>
    </div>
  );
};

export default PvpDuelScreen;
