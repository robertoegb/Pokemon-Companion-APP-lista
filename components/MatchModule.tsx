
import React, { useState, useEffect, useRef } from 'react';
import * as firebaseFirestore from 'firebase/firestore';
const { 
  onSnapshot, 
  collection, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  getDocs, 
  writeBatch 
} = firebaseFirestore;
import { 
  db, 
  sendInteractionRequest, 
  respondToInteraction, 
  updateTradeOffer, 
  setTradeReady, 
  executeTradeExchange,
  updatePvpConfig
} from '../services/firebaseService';
import { Trainer, Interaction, PokemonInstance } from '../types';
import { GYM_DATA } from '../data';
import TradeAnimationOverlay from './TradeAnimationOverlay';
import PvpDuelScreen from './PvpDuelScreen';

interface MatchModuleProps {
  trainer: Trainer;
  onUpdateTrainer: (data: Partial<Trainer>) => void;
  onClose: () => void;
}

const MatchModule: React.FC<MatchModuleProps> = ({ trainer, onUpdateTrainer, onClose }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [othersInZone, setOthersInZone] = useState<Trainer[]>([]);
  const [incoming, setIncoming] = useState<Interaction[]>([]);
  const [outgoingPending, setOutgoingPending] = useState<Interaction[]>([]);
  const [activeTrade, setActiveTrade] = useState<Interaction | null>(null);
  const [activeDuel, setActiveDuel] = useState<Interaction | null>(null);
  const [completedTrade, setCompletedTrade] = useState<{sent: PokemonInstance, received: PokemonInstance} | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<PokemonInstance | null>(null);
  const [showBadgeSelector, setShowBadgeSelector] = useState<{targetUid: string, badges: string[]} | null>(null);

  const existingCompletedIds = useRef<Set<string>>(new Set());
  const blacklistedIds = useRef<Set<string>>(new Set());
  const sessionStartTime = useRef<number>(Date.now());
  
  const myHealthyCount = trainer.team.filter(p => !isNaN(p.currentHp) && p.currentHp > 0).length;
  const isMyTeamFainted = myHealthyCount === 0;

  // EFECTO 1: PURGA INICIAL DE SESIÓN
  useEffect(() => {
    let isMounted = true;
    const initialScrub = async () => {
      try {
        const q = query(collection(db, 'interactions'), where('matchId', '==', trainer.matchId || 'global'));
        const snap = await getDocs(q);
        const batch = writeBatch(db);
        let count = 0;
        snap.forEach((snapshot) => {
          const data = snapshot.data() as Interaction;
          if ((data.fromUid === trainer.uid || data.toUid === trainer.uid) && data.status !== 'PENDING') {
              blacklistedIds.current.add(snapshot.id);
              batch.delete(doc(db, 'interactions', snapshot.id));
              count++;
          }
        });
        if (count > 0) await batch.commit();
        if (isMounted) setIsInitializing(false);
      } catch (e) {
        console.error("SOCIAL ERROR:", e);
        if (isMounted) setIsInitializing(false);
      }
    };
    initialScrub();
    return () => { isMounted = false; };
  }, [trainer.uid]);

  // EFECTO 2: LISTENER DE ENTRENADORES
  useEffect(() => {
    if (isInitializing || !trainer.matchId) return;
    const q = query(collection(db, 'trainers'), where('matchId', '==', trainer.matchId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inZone: Trainer[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Trainer;
        if (data.uid !== trainer.uid) inZone.push(data);
      });
      setOthersInZone(inZone);
    });
    return () => unsubscribe();
  }, [isInitializing, trainer.matchId, trainer.uid]);

  // EFECTO 3: LISTENER DE INTERACCIONES
  useEffect(() => {
    if (isInitializing) return;
    const q = query(collection(db, 'interactions'), where('matchId', '==', trainer.matchId || 'global'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inc: Interaction[] = [];
      const out: Interaction[] = [];
      const trades: Interaction[] = [];
      const duels: Interaction[] = [];

      snapshot.docs.forEach((snap) => {
        if (blacklistedIds.current.has(snap.id)) return;
        const data = { id: snap.id, ...snap.data() } as Interaction;
        
        let docTime = data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp?.seconds * 1000 || 0);
        if (docTime !== 0 && docTime < sessionStartTime.current - 5000) return;

        const isMe = data.fromUid === trainer.uid || data.toUid === trainer.uid;
        if (!isMe) return;

        if (data.status === 'COMPLETED') {
           if (!existingCompletedIds.current.has(snap.id) && !completedTrade) {
              const myO = data.fromUid === trainer.uid ? data.fromOffer : data.toOffer;
              const thO = data.fromUid === trainer.uid ? data.toOffer : data.fromOffer;
              if (myO && thO) { setCompletedTrade({ sent: myO, received: thO }); existingCompletedIds.current.add(snap.id); }
           }
           return;
        }

        if (data.status === 'PENDING') {
          if (data.toUid === trainer.uid) inc.push(data);
          else if (data.fromUid === trainer.uid) out.push(data);
        } else {
           if (data.type === 'TRADE' && data.status === 'ACCEPTED') trades.push(data);
           if (data.type === 'DUEL' && ['ACCEPTED', 'SETUP', 'BATTLE'].includes(data.status)) duels.push(data);
           if (data.type === 'DUEL' && data.pvpConfig?.winnerUid && !data.pvpConfig?.rewardProcessed) duels.push(data);
        }
      });

      setIncoming(inc);
      setOutgoingPending(out);
      setActiveTrade(trades[0] || null);
      setActiveDuel(duels[0] || null);
    });
    return () => unsubscribe();
  }, [isInitializing, trainer.uid, trainer.matchId, completedTrade]);

  useEffect(() => {
    if (activeTrade?.fromReady && activeTrade?.toReady && activeTrade.status === 'ACCEPTED') {
      executeTradeExchange(activeTrade);
    }
  }, [activeTrade]);

  if (isInitializing) return <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-white"><i className="fas fa-sync animate-spin text-4xl text-indigo-500 mb-4"></i><p className="font-pixel text-[8px]">Sincronizando...</p></div>;
  
  if (activeDuel) {
    const isHost = activeDuel.fromUid === trainer.uid;
    const rivalUid = isHost ? activeDuel.toUid : activeDuel.fromUid;
    const rival = othersInZone.find(o => o.uid === rivalUid);
    
    // Calcular límite dinámico basado en pokemon vivos de ambos
    const rivalHealthyCount = rival?.team.filter(p => !isNaN(p.currentHp) && p.currentHp > 0).length || 0;
    const pvpLimit = activeDuel.stakeBadgeId ? 3 : 6;
    const maxPossible = Math.min(pvpLimit, myHealthyCount, rivalHealthyCount);

    return (
      <PvpDuelScreen 
        interaction={activeDuel} 
        trainer={trainer} 
        maxPossiblePicks={maxPossible}
        onClose={() => { setActiveDuel(null); if (activeDuel.pvpConfig?.winnerUid) onClose(); }} 
      />
    );
  }

  const isTradeHost = activeTrade?.fromUid === trainer.uid;
  const myOfferDB = isTradeHost ? activeTrade?.fromOffer : activeTrade?.toOffer;
  const rivalOfferDB = isTradeHost ? activeTrade?.toOffer : activeTrade?.fromOffer;
  const myReady = isTradeHost ? activeTrade?.fromReady : activeTrade?.toReady;
  const rivalReady = isTradeHost ? activeTrade?.toReady : activeTrade?.fromReady;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 w-full h-full overflow-hidden">
      {completedTrade && <TradeAnimationOverlay pokemonSent={completedTrade.sent} pokemonReceived={completedTrade.received} onFinish={() => { setCompletedTrade(null); onClose(); }} />}
      
      {showBadgeSelector && (
          <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white rounded-[40px] w-full max-sm overflow-hidden border-b-[12px] border-indigo-600 shadow-2xl">
                  <div className="bg-indigo-600 p-6 text-center"><i className="fas fa-medal text-white text-3xl mb-2"></i><h3 className="text-white font-pixel text-[10px]">¿QUÉ MEDALLA APOSTAR?</h3></div>
                  <div className="p-6 grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                      {showBadgeSelector.badges.map(bId => (
                        <button key={bId} onClick={() => { sendInteractionRequest(trainer, showBadgeSelector.targetUid, 'DUEL', bId); setShowBadgeSelector(null); }} className="flex flex-col items-center bg-gray-50 border-2 p-3 rounded-2xl"><img src={GYM_DATA.find(g => g.id === bId)?.badgeSprite} className="w-12 h-12 object-contain mb-2" alt="badge" /><span className="text-[7px] font-black uppercase text-center">{GYM_DATA.find(g => g.id === bId)?.badgeName}</span></button>
                      ))}
                  </div>
                  <button onClick={() => setShowBadgeSelector(null)} className="w-full py-4 bg-slate-100 text-slate-400 font-bold uppercase text-xs">Cerrar</button>
              </div>
          </div>
      )}

      <div className="bg-indigo-600 p-4 shadow-xl flex justify-between items-center z-50 border-b-4 border-indigo-800 h-20">
        <div><h2 className="text-white font-pixel text-[10px] uppercase">Mesa de Juego</h2><p className="text-indigo-200 text-[8px] font-black">ID: {trainer.matchId || 'GLOBAL'}</p></div>
        <button onClick={onClose} className="bg-indigo-800 text-white px-4 py-2.5 rounded-xl font-black text-[10px] shadow-lg border-b-4 border-black/20 flex items-center gap-2 active:scale-95 transition-all uppercase">
          <i className="fas fa-arrow-left"></i>
          Volver
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 no-scrollbar">
        {isMyTeamFainted && <div className="bg-red-600/20 border-2 border-red-500/50 p-4 rounded-3xl text-red-400 animate-pulse text-center"><p className="text-[10px] font-black uppercase tracking-widest">Tu equipo está debilitado.<br/>Cura a tus Pokémon primero.</p></div>}
        
        {incoming.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-3xl shadow-xl flex flex-col gap-3 animate-in slide-in-from-top duration-300">
            <p className="text-slate-800 text-[10px] font-bold uppercase"><span className="text-indigo-600 font-black">{req.fromName}</span>: {req.type === 'DUEL' ? (req.stakeBadgeId ? 'Duelo por Medalla' : 'Duelo de Práctica') : 'Intercambio'}</p>
            <div className="grid grid-cols-2 gap-2">
              <button disabled={req.type === 'DUEL' && isMyTeamFainted} onClick={() => respondToInteraction(req.id, 'ACCEPTED', trainer.team.length)} className="bg-green-500 text-white py-2 rounded-xl font-black text-[9px] uppercase shadow-md active:scale-95 disabled:opacity-30">Aceptar</button>
              <button onClick={() => respondToInteraction(req.id, 'REJECTED')} className="bg-slate-200 text-slate-500 py-2 rounded-xl font-black text-[9px] uppercase active:scale-95">Ignorar</button>
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <h3 className="text-green-500 text-[9px] font-black uppercase tracking-[0.2em] px-2 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>Entrenadores ({othersInZone.length})</h3>
          {othersInZone.map((other) => (
            <div key={other.uid} className="bg-slate-900 border-2 border-indigo-500/30 rounded-3xl p-4 flex flex-col gap-4 shadow-lg group hover:border-indigo-500 transition-all">
              <div className="flex justify-between items-center"><h4 className="text-white font-black text-sm uppercase">{other.name}</h4><div className="flex gap-1">{other.badges?.map(bId => (<img key={bId} src={GYM_DATA.find(g => g.id === bId)?.badgeSprite} className="w-5 h-5 object-contain" alt="b" />))}</div></div>
              <div className="grid grid-cols-3 gap-2">
                <button disabled={isMyTeamFainted} onClick={() => sendInteractionRequest(trainer, other.uid, 'DUEL')} className="bg-red-600 text-white py-2 rounded-xl flex flex-col items-center justify-center border-b-4 border-red-800 active:scale-95 disabled:opacity-30"><i className="fas fa-bolt text-xs mb-1"></i><span className="text-[7px] font-black uppercase">Duelo</span></button>
                <button disabled={!other.badges?.length || isMyTeamFainted} onClick={() => setShowBadgeSelector({targetUid: other.uid, badges: other.badges})} className="bg-yellow-600 text-white py-2 rounded-xl flex flex-col items-center justify-center border-b-4 border-yellow-800 active:scale-95 disabled:opacity-30"><i className="fas fa-medal text-xs mb-1"></i><span className="text-[7px] font-black uppercase">Medalla</span></button>
                <button onClick={() => sendInteractionRequest(trainer, other.uid, 'TRADE')} className="bg-blue-600 text-white py-2 rounded-xl flex flex-col items-center justify-center border-b-4 border-blue-800 active:scale-95"><i className="fas fa-exchange-alt text-xs mb-1"></i><span className="text-[7px] font-black uppercase">Cambio</span></button>
              </div>
            </div>
          ))}
          {othersInZone.length === 0 && (
            <div className="py-12 text-center opacity-30">
               <i className="fas fa-ghost text-4xl text-indigo-400 mb-4"></i>
               <p className="text-white font-bold text-[10px] uppercase">No hay otros entrenadores en esta mesa</p>
            </div>
          )}
        </div>
      </div>

      {activeTrade && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in duration-300">
          <div className="bg-blue-600 p-4 flex justify-between items-center border-b-4 border-blue-800 h-20"><h2 className="text-white font-pixel text-[10px] uppercase">Intercambio</h2><button onClick={async () => { const id = activeTrade.id; setActiveTrade(null); await deleteDoc(doc(db, 'interactions', id)); }} className="text-white/60 text-xs font-black uppercase px-4 py-2 bg-black/20 rounded-xl">Cerrar</button></div>
          <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-2 gap-4 h-44">
              <div className={`rounded-3xl border-4 p-4 flex flex-col items-center justify-center transition-all ${myReady ? 'bg-green-900 border-green-500' : 'bg-slate-900 border-slate-800'}`}>{myOfferDB ? <img src={myOfferDB.sprites.front} className="w-16 h-16 pixelated animate-bounce" alt="o" /> : <i className="fas fa-question text-white/10 text-2xl"></i>}<p className="text-[7px] font-black text-white/40 uppercase mt-2">{myReady ? 'LISTO' : 'TU OFERTA'}</p></div>
              <div className={`rounded-3xl border-4 p-4 flex flex-col items-center justify-center transition-all ${rivalReady ? 'bg-green-900 border-green-500' : 'bg-slate-900 border-slate-800'}`}>{rivalOfferDB ? <img src={rivalOfferDB.sprites.front} className="w-16 h-16 pixelated" alt="r" /> : <i className="fas fa-spinner animate-spin text-white/10 text-2xl"></i>}<p className="text-[7px] font-black text-white/40 uppercase mt-2">{rivalReady ? 'LISTO' : 'RIVAL'}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {trainer.team.map((p) => (
                <button key={p.instanceId} onClick={() => { updateTradeOffer(activeTrade.id, trainer.uid, isTradeHost, p); setSelectedOffer(p); }} className={`bg-slate-900 p-2 rounded-2xl border-2 flex items-center gap-2 transition-all ${selectedOffer?.instanceId === p.instanceId ? 'border-blue-500 bg-blue-900/20 shadow-lg' : 'border-slate-800 opacity-60'}`}><img src={p.sprites.front} className="w-8 h-8 pixelated" alt="p" /><div className="min-w-0 text-left"><p className="text-[8px] font-black text-white truncate uppercase">{p.name}</p></div></button>
              ))}
            </div>
            <button disabled={!myOfferDB || !rivalOfferDB} onClick={() => setTradeReady(activeTrade.id, isTradeHost, !myReady)} className={`w-full py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest border-b-8 shadow-xl transition-all active:scale-95 ${myReady ? 'bg-orange-600 border-orange-800' : 'bg-green-500 border-green-800'} text-white disabled:opacity-30`}>{myReady ? 'CANCELAR LISTO' : 'CONFIRMAR INTERCAMBIO'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchModule;
