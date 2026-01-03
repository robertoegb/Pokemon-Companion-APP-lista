
import React, { useState, useMemo, memo } from 'react';
import { Trainer, PokemonBase } from '../types';
import { POKEDEX } from '../data';
import { WILD_POKEMON_REGISTRY } from '../wildEncountersData';

interface PokedexScreenProps {
  trainer: Trainer;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Electric: '#F8D030',
  Grass: '#78C850', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
  Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
  Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848', Fairy: '#EE99AC'
};

const PokedexEntry = memo(({ id, seen, caught, onClick }: { id: number, seen: boolean, caught: boolean, onClick: (id: number) => void }) => {
  const formatId = (n: number) => n.toString().padStart(3, '0');
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  
  return (
    <button 
      disabled={!seen}
      onClick={() => onClick(id)}
      className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative shadow-sm border-2 transition-all active:scale-90 overflow-hidden
        ${caught ? 'bg-green-50 border-green-200' : seen ? 'bg-gray-100 border-gray-300' : 'bg-gray-200 border-transparent opacity-40'}
      `}
    >
      <span className="absolute top-1 left-2 text-[8px] font-black text-gray-400 font-mono z-10">{formatId(id)}</span>
      {seen ? (
        <>
          <img 
            src={spriteUrl} 
            loading="lazy" 
            className={`w-20 h-20 pixelated transition-all ${caught ? 'drop-shadow-md' : 'grayscale brightness-50 contrast-125'}`} 
            alt={`pkmn-${id}`}
          />
          {caught && (
            <div className="absolute bottom-1 right-1">
              <div className="w-4 h-4 rounded-full border border-gray-600 relative bg-gradient-to-b from-red-500 from-50% via-gray-700 via-50% to-white to-50%">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white border border-gray-600 rounded-full"></div>
              </div>
            </div>
          )}
        </>
      ) : (
        <i className="fas fa-question text-gray-300 text-xl"></i>
      )}
    </button>
  );
});

const PokedexScreen: React.FC<PokedexScreenProps> = ({ trainer, onClose }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDiploma, setShowDiploma] = useState(false);
  const allIds = useMemo(() => Array.from({ length: 151 }, (_, i) => i + 1), []);

  const hasCompletedRegional = useMemo(() => {
    /**
     * Lógica de Completado Regional:
     * Excluimos las Aves Legendarias (144 Articuno, 145 Zapdos, 146 Moltres)
     * y los legendarios finales (150 Mewtwo, 151 Mew).
     * Total requeridos: 146 Pokémon.
     */
    const excludedLegendaries = [144, 145, 146, 150, 151];
    const requiredIds = allIds.filter(id => !excludedLegendaries.includes(id));
    return requiredIds.every(id => trainer.pokedexCaught.includes(id));
  }, [trainer.pokedexCaught, allIds]);

  const getLocations = (id: number) => {
    const locations: { zone: string; method: 'walk' | 'surf' | 'fish' }[] = [];
    Object.entries(WILD_POKEMON_REGISTRY).forEach(([zoneName, entries]) => {
      if (entries.some(e => e.pokemonId === id)) {
        let method: 'walk' | 'surf' | 'fish' = 'walk';
        if (zoneName.includes('(surf)')) method = 'surf';
        if (zoneName.toLowerCase().includes('caña') || zoneName.includes('(Pesca)')) method = 'fish';
        const cleanName = zoneName.replace(/\(surf\)/g, '').replace(/\(caña.*?\)/g, '').trim();
        if (!locations.find(l => l.zone === cleanName && l.method === method)) {
          locations.push({ zone: cleanName, method });
        }
      }
    });
    return locations;
  };

  const selectedPokemon = useMemo(() => selectedId ? POKEDEX.find(p => p.id === selectedId) : null, [selectedId]);
  const selectedLocs = useMemo(() => selectedId ? getLocations(selectedId) : [], [selectedId]);

  return (
    <div className="flex-1 flex flex-col bg-red-600 w-full h-full overflow-hidden relative">
      <div className="flex items-center justify-between p-4 bg-red-600 text-white shadow-md z-10 flex-shrink-0">
        <div>
           <h2 className="text-xl font-bold font-pixel tracking-tighter">Pokédex</h2>
           <div className="flex items-center gap-3 mt-1">
              <div className="text-[9px] opacity-90 font-black uppercase tracking-widest">
                Vistos: {trainer.pokedexSeen.length} | Atrapados: {trainer.pokedexCaught.length}
              </div>
              {hasCompletedRegional && (
                <button 
                  onClick={() => setShowDiploma(true)}
                  className="bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-1 rounded shadow-lg animate-bounce border border-yellow-200 uppercase tracking-tighter"
                >
                  <i className="fas fa-certificate mr-1"></i> Ver Diploma
                </button>
              )}
           </div>
        </div>
        <button onClick={onClose} className="bg-red-800 text-white px-4 py-2 rounded-xl font-black shadow-lg text-[10px] border-b-4 border-red-950 active:translate-y-1 transition-all uppercase flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Volver
        </button>
      </div>

      <div className="flex-1 bg-white overflow-y-auto p-4 rounded-t-[40px] mt-[-10px] pt-8 shadow-inner no-scrollbar">
        {hasCompletedRegional && !showDiploma && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-3xl text-center animate-in slide-in-from-top duration-500">
            <i className="fas fa-crown text-yellow-500 text-2xl mb-2"></i>
            <p className="text-yellow-800 font-black text-xs uppercase tracking-tight">¡Felicidades! Has completado la Pokédex de Kanto</p>
            <p className="text-yellow-600 text-[9px] font-bold mt-1 uppercase">El Profesor Oak reconoce tu gran esfuerzo</p>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 pb-24 max-w-2xl mx-auto">
          {allIds.map((id) => (
            <PokedexEntry 
              key={id} 
              id={id} 
              seen={trainer.pokedexSeen.includes(id)} 
              caught={trainer.pokedexCaught.includes(id)} 
              onClick={setSelectedId} 
            />
          ))}
        </div>
      </div>

      {/* MODAL DIPLOMA OAK */}
      {showDiploma && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500">
           <div className="bg-[#fdf6e3] rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden border-[12px] border-[#d4af37] relative animate-in zoom-in duration-300">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]"></div>
              
              <div className="p-8 text-center relative z-10">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full border-4 border-[#d4af37] p-2 shadow-inner">
                    <img src="https://i.postimg.cc/JnJTxyss/3D2FB6D8-85FB-4D62-81F4-414A0E101A26.png" className="w-full h-full object-contain pixelated" alt="Oak" />
                  </div>
                  <h2 className="font-pixel text-[#8b6b23] text-sm uppercase tracking-tighter">Diploma de Honor</h2>
                  <div className="h-0.5 bg-[#d4af37] w-24 mx-auto mt-2 opacity-50"></div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-gray-800 font-bold text-[10px] leading-relaxed uppercase">
                    Se otorga este reconocimiento a:
                  </p>
                  <p className="font-pixel text-xl text-[#3b82f6] uppercase tracking-tighter drop-shadow-sm">{trainer.name}</p>
                  <p className="text-gray-700 font-medium text-[9px] leading-relaxed uppercase px-4 italic">
                    "Por tu incansable labor al capturar todas las especies locales de la región. ¡Has demostrado un conocimiento superior y una dedicación legendaria!"
                  </p>
                </div>

                <div className="flex justify-between items-end mt-12">
                  <div className="text-left">
                    <p className="text-[7px] font-black text-gray-400 uppercase">Firma del Investigador</p>
                    <p className="font-pixel text-[8px] text-gray-800 mt-1">PROF. OAK</p>
                  </div>
                  <div className="w-16 h-16 bg-[#d4af37]/20 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center">
                    <i className="fas fa-certificate text-[#d4af37] text-2xl"></i>
                  </div>
                </div>

                <button 
                  onClick={() => setShowDiploma(false)}
                  className="mt-8 w-full bg-[#d4af37] hover:bg-[#b8952d] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
                >
                  Cerrar Diploma
                </button>
              </div>
           </div>
        </div>
      )}

      {selectedId && selectedPokemon && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden border-b-[12px] border-red-700 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className={`h-40 relative flex items-center justify-center overflow-hidden flex-shrink-0 ${trainer.pokedexCaught.includes(selectedId) ? 'bg-indigo-600' : 'bg-slate-800'}`}>
               <div className="absolute top-4 left-6 text-white/20 font-black text-4xl">#{selectedId.toString().padStart(3, '0')}</div>
               <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedId}.png`} loading="lazy" className="w-40 h-40 pixelated relative z-10 animate-bounce" alt="sprite" />
               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">{selectedPokemon.name}</h3>
                   <div className="flex gap-1 mt-1">{selectedPokemon.types.map(t => (<span key={t} className="px-2 py-0.5 rounded-full text-white font-black text-[7px] uppercase tracking-widest" style={{ backgroundColor: TYPE_COLORS[t] }}>{t}</span>))}</div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2"><i className="fas fa-map-marker-alt text-red-500"></i> Localizaciones</p>
                {selectedLocs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {selectedLocs.map((loc, idx) => (
                      <div key={idx} className="bg-slate-50 border-2 border-slate-100 p-3 rounded-xl flex items-center justify-between group hover:border-indigo-200 transition-colors">
                        <span className="text-[10px] font-black text-slate-700 uppercase">{loc.zone}</span>
                        <span className="text-[7px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">{loc.method}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 px-6 bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl text-center"><p className="text-[10px] text-orange-600 font-bold italic">"Desconocido"</p></div>
                )}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <button onClick={() => setSelectedId(null)} className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl uppercase text-[10px] border-b-4 border-black">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokedexScreen;
