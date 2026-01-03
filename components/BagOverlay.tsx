
import React, { useState } from 'react';
import { Item, PokemonInstance, Trainer, EvolutionData } from '../types';
import { ALL_ITEMS } from '../itemData';
import { applyItemToPokemon, canUseItemOnPokemon } from '../itemService';

interface BagOverlayProps {
  trainer: Trainer;
  activePokemon?: PokemonInstance; 
  onUseItem: (
    updatedTeam: PokemonInstance[], 
    message: string,
    updatedInventory?: any
  ) => void;
  onTriggerEvolution?: (evoData: EvolutionData) => void;
  onClose: () => void;
}

type BagCategory = 'TODO' | 'CURACIÓN' | 'PP' | 'ESTADO';
type BagView = 'ITEMS' | 'TARGET_PKMN' | 'TARGET_MOVE';

const BagOverlay: React.FC<BagOverlayProps> = ({ trainer, activePokemon, onUseItem, onTriggerEvolution, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [view, setView] = useState<BagView>('ITEMS');
  const [activeTab, setActiveTab] = useState<BagCategory>('TODO');
  const [selectedPkmnIdx, setSelectedPkmnIdx] = useState<number | null>(null);

  const usableItems = ALL_ITEMS.filter(item => {
    const cat = item.category;
    const name = item.name.toLowerCase();
    
    const isSpecialEventItem = 
      cat === 'evolution' || 
      name.includes('caramelo raro') || 
      name.includes('cuerda huida') || 
      name.includes('repelente');

    if (isSpecialEventItem) return false;

    const isCombatConsumable = 
      cat === 'potion' || 
      cat === 'drink' || 
      cat === 'status' || 
      cat === 'revive' || 
      cat === 'pp_restore';

    if (!isCombatConsumable) return false;

    if (activeTab === 'TODO') return true;
    if (activeTab === 'CURACIÓN' && (cat === 'potion' || cat === 'drink' || cat === 'revive')) return true;
    if (activeTab === 'PP' && cat === 'pp_restore') return true;
    if (activeTab === 'ESTADO' && cat === 'status') return true;
    return false;
  });

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setView('TARGET_PKMN');
  };

  const handleSelectPokemon = (idx: number) => {
    if (!selectedItem) return;
    if (!canUseItemOnPokemon(trainer.team[idx], selectedItem)) return;

    // Si el objeto es un Éter (afecta a un solo movimiento)
    if (selectedItem.effect.startsWith('pp:')) {
      setSelectedPkmnIdx(idx);
      setView('TARGET_MOVE');
    } else {
      executeUse(idx);
    }
  };

  const handleSelectMove = (moveIdx: number) => {
    if (selectedPkmnIdx === null) return;
    executeUse(selectedPkmnIdx, moveIdx);
  };

  const executeUse = (pkmnIdx: number, moveIdx?: number) => {
    if (!selectedItem) return;
    
    const { updated, message, success } = applyItemToPokemon(trainer.team[pkmnIdx], selectedItem, moveIdx);
    
    if (!success) {
        alert(message);
        return;
    }

    const newTeam = [...trainer.team];
    newTeam[pkmnIdx] = updated;

    onUseItem(newTeam, message);
    setView('ITEMS');
    setSelectedItem(null);
    setSelectedPkmnIdx(null);
  };

  const getIcon = (item: Item) => {
      const cat = item.category;
      if (cat.includes('potion') || cat.includes('drink')) return 'fa-prescription-bottle';
      if (cat.includes('status')) return 'fa-medkit';
      if (cat.includes('revive')) return 'fa-heartbeat';
      if (cat.includes('pp_restore')) return 'fa-bolt'; 
      return 'fa-box';
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-300 overflow-hidden">
      <div className="flex justify-between items-center p-6 bg-orange-600 shadow-xl border-b-4 border-orange-800 flex-shrink-0 m-4 rounded-3xl">
        <h2 className="text-white font-pixel text-xs uppercase tracking-tighter">Mochila</h2>
        <button onClick={onClose} className="bg-black/20 text-white w-10 h-10 rounded-xl hover:bg-black/40 transition-all flex items-center justify-center">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {view === 'ITEMS' && (
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar flex-shrink-0">
          {(['TODO', 'CURACIÓN', 'PP', 'ESTADO'] as BagCategory[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                ${activeTab === tab ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        {view === 'ITEMS' ? (
          <div className="grid grid-cols-1 gap-3">
            {usableItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4 text-left active:scale-[0.98] transition-all hover:bg-white/10 shadow-lg group"
              >
                <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 ${item.category === 'pp_restore' ? 'text-indigo-400' : 'text-orange-500'}`}>
                  <i className={`fas ${getIcon(item)} text-2xl`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-black text-xs uppercase truncate tracking-tight">{item.name}</h4>
                  <p className="text-white/40 text-[9px] font-bold uppercase leading-snug mt-1">{item.description}</p>
                </div>
              </button>
            ))}
            {usableItems.length === 0 && (
              <div className="py-20 text-center opacity-20">
                <i className="fas fa-box-open text-6xl mb-4"></i>
                <p className="font-black uppercase text-[10px] tracking-widest">No hay objetos en esta categoría</p>
              </div>
            )}
          </div>
        ) : view === 'TARGET_PKMN' ? (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <button onClick={() => setView('ITEMS')} className="text-orange-400 text-[9px] font-black uppercase mb-4 flex items-center gap-2 bg-orange-400/10 px-4 py-2 rounded-xl w-fit">
               <i className="fas fa-arrow-left"></i> Volver
            </button>
            <h3 className="text-white/60 text-[10px] font-black uppercase tracking-widest px-2 mb-4">¿En quién usar {selectedItem?.name}?</h3>
            <div className="grid grid-cols-1 gap-3">
              {trainer.team.map((p, i) => {
                const isUsable = selectedItem ? canUseItemOnPokemon(p, selectedItem) : false;
                return (
                  <button 
                    key={p.instanceId}
                    disabled={!isUsable}
                    onClick={() => handleSelectPokemon(i)}
                    className={`bg-white/5 border p-4 rounded-3xl flex items-center gap-4 text-left transition-all shadow-lg
                      ${isUsable ? 'border-white/10 hover:bg-white/10 active:scale-95' : 'border-white/5 opacity-40 grayscale cursor-not-allowed'}
                    `}
                  >
                    <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                      <img src={p.sprites.front} className={`w-14 h-14 pixelated ${p.currentHp <= 0 && !selectedItem?.effect.includes('revive') ? 'grayscale opacity-50' : ''}`} alt={p.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-black text-xs uppercase">{p.name}</h4>
                          <span className="text-[10px] font-black text-orange-500">NV.{p.level}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500" style={{ width: `${(p.currentHp/p.maxHp)*100}%` }}></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <button onClick={() => setView('TARGET_PKMN')} className="text-orange-400 text-[9px] font-black uppercase mb-4 flex items-center gap-2 bg-orange-400/10 px-4 py-2 rounded-xl w-fit">
               <i className="fas fa-arrow-left"></i> Cambiar Pokémon
            </button>
            <div className="bg-indigo-600 p-4 rounded-3xl mb-4 border-b-4 border-indigo-800 flex items-center gap-4">
               <img src={trainer.team[selectedPkmnIdx!].sprites.front} className="w-12 h-12 pixelated" />
               <div>
                  <h3 className="text-white font-black text-xs uppercase">{trainer.team[selectedPkmnIdx!].name}</h3>
                  <p className="text-indigo-200 text-[9px] font-bold uppercase">Selecciona un ataque para restaurar</p>
               </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {trainer.team[selectedPkmnIdx!].moves.map((move, midx) => {
                const isFull = move.currentPp >= move.maxPp;
                return (
                  <button
                    key={midx}
                    disabled={isFull}
                    onClick={() => handleSelectMove(midx)}
                    className={`p-4 rounded-2xl border-2 flex justify-between items-center transition-all ${isFull ? 'bg-black/20 border-white/5 opacity-40' : 'bg-white/5 border-white/10 hover:border-indigo-400 active:scale-95'}`}
                  >
                    <div>
                      <p className="text-white font-black text-[10px] uppercase">{move.name}</p>
                      <p className="text-white/40 text-[8px] font-bold uppercase">{move.type}</p>
                    </div>
                    <div className="text-right">
                       <p className={`text-xs font-mono font-black ${isFull ? 'text-gray-500' : 'text-indigo-400'}`}>{move.currentPp}/{move.maxPp}</p>
                       <p className="text-[7px] text-white/20 font-bold uppercase">PP ACTUALES</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BagOverlay;
