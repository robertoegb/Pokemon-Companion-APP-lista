
import React, { useState, useMemo } from 'react';
import { Trainer, ExplorationMethod, SubArea } from '../types';
import { LOCATION_DATA, LOCATION_KEYS } from '../locationData';
import { WILD_POKEMON_REGISTRY } from '../wildEncountersData';

interface ExploreModuleProps {
  trainer: Trainer;
  onExplore: (location: string, method: ExplorationMethod, subAreaId?: string) => void;
  onTravel: (location: string) => void;
  onClose: () => void;
}

const superNormalize = (s: string) => 
  s.toLowerCase()
   .replace(/ñ/g, 'n')
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]/g, '')
   .trim();

const SearchingOverlay = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="relative">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse border-4 border-red-600">
        <i className="fas fa-search text-4xl text-red-600 animate-bounce"></i>
      </div>
    </div>
    <h3 className="mt-6 text-white font-pixel text-xs uppercase tracking-widest">¡Buscando!</h3>
  </div>
);

const ExploreModule: React.FC<ExploreModuleProps> = ({ trainer, onExplore, onTravel, onClose }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocKey, setSelectedLocKey] = useState<string | null>(trainer.currentLocation);
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(true);

  const filteredLocations = useMemo(() => {
    return LOCATION_KEYS.filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleAction = (method: ExplorationMethod, subId?: string) => {
    if (!selectedLocKey) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onExplore(selectedLocKey, method, subId);
    }, 1200);
  };

  const handleLocationClick = (locKey: string) => {
    if (selectedLocKey === locKey) {
      setIsActionPanelOpen(!isActionPanelOpen);
    } else {
      setSelectedLocKey(locKey);
      setIsActionPanelOpen(true);
    }
  };

  const isTeamFainted = trainer.team.every(p => p.currentHp <= 0);
  const selectedLoc = selectedLocKey ? LOCATION_DATA[selectedLocKey] : null;
  const isAtLocation = selectedLocKey === trainer.currentLocation;

  const hasPool = (locName: string, suffix: string) => {
    const normFull = superNormalize(locName + suffix);
    const baseName = locName.split('(')[0].trim();
    const normBase = superNormalize(baseName + suffix);
    
    return Object.keys(WILD_POKEMON_REGISTRY).some(k => {
      const normalizedKey = superNormalize(k);
      return normalizedKey === normFull || normalizedKey === normBase;
    });
  };

  const getLocationTheme = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('ruta') || n.includes('bosque') || n.includes('safari')) return { label: 'Explorar Hierba', icon: 'fa-leaf', bg: 'bg-green-600', border: 'border-green-800' };
    if (n.includes('cueva') || n.includes('túnel') || n.includes('mt.') || n.includes('islas') || n.includes('calle victoria') || n.includes('mansión') || n.includes('guarida')) return { label: 'Explorar Zona', icon: 'fa-mountain', bg: 'bg-stone-600', border: 'border-stone-800' };
    return { label: 'Adentrarse', icon: 'fa-door-open', bg: 'bg-slate-700', border: 'border-slate-900' };
  };

  const locTheme = selectedLocKey ? getLocationTheme(selectedLocKey) : null;

  const hasRootContent = useMemo(() => {
    if (!selectedLoc) return false;
    return (selectedLoc.wildPool && selectedLoc.wildPool.length > 0) || 
           (selectedLoc.npcPool && selectedLoc.npcPool.length > 0) || 
           (selectedLoc.itemPool && selectedLoc.itemPool.length > 0);
  }, [selectedLoc]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 w-full h-full overflow-hidden animate-in slide-in-from-right duration-300">
      {isSearching && <SearchingOverlay />}

      <div className="bg-red-600 text-white p-4 shadow-lg z-50 border-b-4 border-red-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="font-pixel text-xs uppercase tracking-tighter">Región de Kanto</h2>
          <button 
            onClick={onClose} 
            className="bg-red-800 text-white px-3 py-1.5 rounded-lg font-bold text-xs border border-red-400 uppercase flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Volver
          </button>
        </div>
        <input type="text" placeholder="Buscar ruta o cueva..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/20 border border-white/20 rounded-xl py-2 px-4 text-white text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {filteredLocations.map((locKey) => (
          <button 
            key={locKey} 
            onClick={() => handleLocationClick(locKey)} 
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 mb-1 transition-all ${selectedLocKey === locKey ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
          >
            <span className="text-slate-900 text-[10px] font-black uppercase">{locKey}</span>
            {trainer.currentLocation === locKey && <span className="text-[8px] bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase italic font-bold">Estás aquí</span>}
          </button>
        ))}
      </div>

      {selectedLocKey && selectedLoc && locTheme && isActionPanelOpen && (
        <div className="bg-white border-t-4 border-indigo-500 p-4 flex flex-col items-center gap-3 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_25px_rgba(0,0,0,0.15)] relative max-h-[70%] overflow-y-auto z-40">
          {/* Botón X para cerrar el panel */}
          <button 
            onClick={() => setIsActionPanelOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all z-50 shadow-sm border border-gray-200"
          >
            <i className="fas fa-times text-sm"></i>
          </button>

          {!isAtLocation ? (
            <div className="w-full flex flex-col items-center gap-3 pt-2">
              <div className="text-center pr-8">
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-1">Destino Seleccionado</p>
                <h3 className="text-slate-900 font-pixel text-[10px] uppercase">{selectedLocKey}</h3>
              </div>
              <button onClick={() => onTravel(selectedLocKey)} className="w-full max-w-xs bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] border-b-4 border-blue-800 shadow-lg active:translate-y-1 transition-all">Viajar a esta zona</button>
            </div>
          ) : (
            <div className="w-full max-w-md flex flex-col gap-3 pt-2">
              <div className="text-center mb-1 pr-8">
                <p className="text-indigo-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Explorando actualmente</p>
                <h3 className="text-slate-900 font-pixel text-xs uppercase tracking-tighter mb-2">{selectedLocKey}</h3>
                <div className="h-px w-12 bg-slate-200 mx-auto mb-2"></div>
                <p className="text-slate-400 text-[7px] font-bold uppercase tracking-widest">Acciones disponibles</p>
              </div>

              <div className="flex flex-col gap-2">
                {selectedLocKey === 'Zona Safari' ? (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleAction('safari-central')} 
                        disabled={isTeamFainted} 
                        className="bg-amber-600 text-white py-3.5 rounded-xl font-black uppercase text-[9px] border-b-4 border-amber-800 flex items-center justify-center gap-2 shadow-md active:translate-y-1 transition-all disabled:opacity-50"
                      >
                        <i className="fas fa-map-marked-alt text-sm"></i> Central
                      </button>

                      {selectedLoc.subAreas && Object.values(selectedLoc.subAreas).map((sub: SubArea) => {
                        if (sub.name.toLowerCase().includes('área')) {
                          return (
                            <button 
                              key={sub.id}
                              onClick={() => handleAction('walk', sub.id)} 
                              disabled={isTeamFainted} 
                              className="bg-amber-600 text-white py-3.5 rounded-xl font-black uppercase text-[9px] border-b-4 border-amber-800 flex items-center justify-center gap-2 shadow-md active:translate-y-1 transition-all disabled:opacity-50"
                            >
                              <i className="fas fa-map-marked-alt text-sm"></i>
                              <span>{sub.name.replace('Zona Safari', '').replace(/[()]/g, '').trim()}</span>
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    {hasPool(selectedLocKey, ' (Pesca)') && (
                      <button 
                        onClick={() => handleAction('safari-pesca')} 
                        disabled={isTeamFainted} 
                        className="w-full bg-cyan-700 text-white py-3.5 rounded-xl font-black uppercase text-[10px] border-b-4 border-cyan-900 flex items-center justify-center gap-2 shadow-md active:translate-y-1 transition-all disabled:opacity-50"
                      >
                        <i className="fas fa-fish text-sm"></i> Pesca Safari
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {hasRootContent && (
                      <button onClick={() => handleAction('walk')} disabled={isTeamFainted} className={`w-full ${locTheme.bg} text-white py-3 rounded-2xl font-black uppercase text-[10px] border-b-4 ${locTheme.border} flex items-center justify-center gap-2 shadow-md active:translate-y-1 transition-all disabled:opacity-50`}>
                        <i className={`fas ${locTheme.icon} text-sm`}></i> {locTheme.label}
                      </button>
                    )}
                    
                    {hasPool(selectedLocKey, ' (surf)') && (
                      <button onClick={() => handleAction('surf')} disabled={isTeamFainted} className="w-full bg-blue-500 text-white py-3 rounded-2xl font-black uppercase text-[10px] border-b-4 border-blue-700 flex items-center justify-center gap-2 shadow-md active:translate-y-1 transition-all disabled:opacity-50">
                        <i className="fas fa-water text-sm"></i> Surfear en el agua
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 w-full mt-1">
                {hasPool(selectedLocKey, ' (caña vieja)') && <button onClick={() => handleAction('old-rod')} disabled={isTeamFainted} className="bg-amber-700 text-white py-3 rounded-xl font-black uppercase text-[9px] border-b-4 border-amber-900 flex flex-col items-center shadow-sm active:translate-y-1 transition-all disabled:opacity-50"><i className="fas fa-fish mb-1"></i>Vieja</button>}
                {hasPool(selectedLocKey, ' (caña buena)') && <button onClick={() => handleAction('good-rod')} disabled={isTeamFainted} className="bg-cyan-600 text-white py-3 rounded-xl font-black uppercase text-[9px] border-b-4 border-cyan-800 flex flex-col items-center shadow-sm active:translate-y-1 transition-all disabled:opacity-50"><i className="fas fa-fish mb-1"></i>Buena</button>}
                {hasPool(selectedLocKey, ' (supercaña)') && <button onClick={() => handleAction('super-rod')} disabled={isTeamFainted} className="bg-pink-600 text-white py-3 rounded-xl font-black uppercase text-[9px] border-b-4 border-pink-800 flex flex-col items-center shadow-sm active:translate-y-1 transition-all disabled:opacity-50"><i className="fas fa-fish mb-1"></i>Súper</button>}
              </div>
              
              {selectedLocKey !== 'Zona Safari' && (
                <div className="grid grid-cols-2 gap-2 w-full">
                  {selectedLoc.subAreas && Object.values(selectedLoc.subAreas).map((sub: SubArea) => (
                      <div key={sub.id} className="col-span-1">
                        <button 
                          onClick={() => handleAction('walk', sub.id)} 
                          disabled={isTeamFainted} 
                          className="bg-slate-700 border-slate-900 w-full text-white py-3 rounded-xl font-black uppercase border-b-4 flex flex-col items-center justify-center px-1 shadow-sm active:translate-y-1 transition-all disabled:opacity-50 text-[8px] gap-1"
                        >
                          <i className="fas fa-stairs"></i>
                          <span className="truncate w-full text-center text-white">{sub.name.replace(selectedLoc.name, '').replace(/[()]/g, '').trim() || sub.name}</span>
                        </button>
                      </div>
                  ))}
                </div>
              )}

              {!hasRootContent && (!selectedLoc.subAreas || Object.keys(selectedLoc.subAreas).length === 0) && !hasPool(selectedLocKey, ' (surf)') && (
                <div className="py-4 text-center">
                  <p className="text-[9px] text-gray-400 font-bold uppercase italic leading-tight">
                    Esta zona no tiene áreas explorables por el momento.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreModule;
