
import React from 'react';
import { NPC } from '../types';

interface NpcEncounterOverlayProps {
  npc: NPC;
  onAccept: () => void;
  onIgnore: () => void;
}

const NpcEncounterOverlay: React.FC<NpcEncounterOverlayProps> = ({ npc, onAccept, onIgnore }) => {
  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden border-b-[12px] border-black/10 animate-in slide-in-from-bottom duration-500">
        
        {/* Entrenador */}
        <div className="h-48 bg-slate-100 flex items-end justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-slate-200 to-transparent"></div>
           <img 
             src={npc.sprite} 
             className="w-40 h-40 object-contain pixelated relative z-10 animate-in slide-in-from-right duration-700" 
             alt={npc.name} 
           />
           <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-[8px] px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
             DESAFÍO ENTRENADOR
           </div>
        </div>

        <div className="p-8">
           <h2 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">¡Un entrenador te detiene!</h2>
           
           {/* Bocadillo de diálogo */}
           <div className="relative bg-slate-50 border-4 border-slate-200 p-6 rounded-3xl mb-8">
              <div className="absolute -top-3 left-10 w-6 h-6 bg-slate-50 border-l-4 border-t-4 border-slate-200 rotate-45"></div>
              <p className="text-gray-800 font-pixel text-[10px] leading-relaxed uppercase">
                "{npc.challengePhrase}"
              </p>
           </div>

           <div className="flex flex-col gap-3">
              <button 
                onClick={onAccept}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all border-b-4 border-red-800 flex items-center justify-center gap-2"
              >
                <i className="fas fa-bolt"></i> ¡ACEPTAR RETO!
              </button>
              <button 
                onClick={onIgnore}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-3 rounded-2xl uppercase text-[9px] tracking-widest transition-all"
              >
                Intentar escabullirse
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NpcEncounterOverlay;
