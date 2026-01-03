
import React from 'react';
import { PokemonInstance, Item, Move, Trainer } from '../types';
import { canUseItemOnPokemon } from '../itemService';
import { canLearnTMHM } from '../tmhmCompatibility.gen1.yellow';

interface EventActionOverlayProps {
  trainer: Trainer;
  scannedItem?: Item;
  scannedMove?: { move: Move, code: string };
  onApplyItem: (pokemonIdx: number) => void;
  onTeachMove: (pokemonIdx: number) => void;
  onCancel: () => void;
}

const EventActionOverlay: React.FC<EventActionOverlayProps> = ({ 
  trainer, scannedItem, scannedMove, onApplyItem, onTeachMove, onCancel 
}) => {
  const title = scannedItem ? `Usar ${scannedItem.name}` : `Enseñar ${scannedMove?.move.name}`;
  const subtitle = scannedItem ? "Selecciona un Pokémon para aplicar el objeto" : "Selecciona un Pokémon compatible";

  return (
    <div className="fixed inset-0 z-[700] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
      <div className="p-6 bg-violet-600 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-white font-pixel text-[10px] uppercase tracking-tighter">{title}</h2>
          <p className="text-violet-200 text-[8px] font-bold mt-1 uppercase tracking-widest">{subtitle}</p>
        </div>
        <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {trainer.team.map((p, idx) => {
          let isCompatible = false;
          if (scannedItem) isCompatible = canUseItemOnPokemon(p, scannedItem);
          if (scannedMove) isCompatible = canLearnTMHM(p.id, scannedMove.code);

          return (
            <button
              key={p.instanceId}
              disabled={!isCompatible}
              onClick={() => scannedItem ? onApplyItem(idx) : onTeachMove(idx)}
              className={`w-full p-4 rounded-3xl border-2 flex items-center gap-4 transition-all text-left relative overflow-hidden
                ${isCompatible ? 'bg-white/5 border-violet-500/50 hover:bg-white/10 active:scale-[0.98]' : 'bg-black/20 border-white/5 opacity-30 grayscale cursor-not-allowed'}
              `}
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                <img src={p.sprites.front} className="w-14 h-14 pixelated" alt={p.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-white font-black text-sm uppercase">{p.name}</h4>
                  <span className="text-violet-400 font-black text-[10px]">NV. {p.level}</span>
                </div>
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                  {isCompatible ? '¡Compatible!' : 'Incompatible'}
                </p>
              </div>
              {isCompatible && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-500 animate-pulse">
                  <i className="fas fa-chevron-right text-lg"></i>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6 bg-black/40 text-center">
         <p className="text-white/20 text-[7px] font-black uppercase tracking-[0.4em]">Validador de Eventos Físicos</p>
      </div>
    </div>
  );
};

export default EventActionOverlay;
