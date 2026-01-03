
import React from 'react';
import { GymDef } from '../types';

interface GymPreviewOverlayProps {
  gym: GymDef;
  onStart: () => void;
  onCancel: () => void;
}

const GymPreviewOverlay: React.FC<GymPreviewOverlayProps> = ({ gym, onStart, onCancel }) => {
  const leader = gym.trainers.find(t => t.isLeader);
  const minions = gym.trainers.filter(t => !t.isLeader);

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-b-8 border-blue-800 flex flex-col">
        {/* Header con información de la ciudad */}
        <div className="bg-blue-600 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
          <h2 className="text-2xl font-black font-pixel uppercase tracking-tight mb-1">{gym.city}</h2>
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Gimnasio de tipo {gym.typeTheme}</p>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Líder destacado */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-full border-4 border-yellow-400 shadow-xl overflow-hidden flex items-center justify-center">
                <img src={leader?.sprite} className="w-full h-full object-contain object-top scale-110" alt={leader?.name} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 font-black px-3 py-1 rounded-full text-[10px] shadow-md border-2 border-white">LÍDER</div>
            </div>
            <h3 className="mt-4 text-xl font-black text-gray-800 uppercase tracking-tighter">{leader?.name}</h3>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mt-1">{gym.badgeName}</span>
          </div>

          {/* Separador con texto solicitado */}
          <div className="text-center py-4 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-600 font-bold text-sm leading-relaxed italic">
              "Para obtener esta medalla debes derrotar a mi equipo y a mí."
            </p>
          </div>

          {/* Lista de esbirros */}
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">Entrenadores del Gimnasio</h4>
            <div className="flex justify-center gap-6">
              {minions.map((minion, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-gray-300 shadow-sm overflow-hidden flex items-center justify-center">
                    <img src={minion.sprite} className="w-full h-full object-contain" alt={minion.name} />
                  </div>
                  <span className="mt-2 text-[9px] font-black text-gray-500 uppercase text-center">{minion.name}</span>
                </div>
              ))}
              {minions.length === 0 && (
                <p className="text-xs text-gray-400 italic">No hay otros entrenadores</p>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-sm transition-all active:scale-95"
          >
            Ahora no
          </button>
          <button 
            onClick={onStart}
            className="flex-2 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-2xl uppercase text-xs tracking-widest shadow-md transition-all active:scale-95 border-b-4 border-red-800 flex items-center justify-center gap-2"
          >
            <i className="fas fa-play"></i> COMENZAR DESAFÍO
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymPreviewOverlay;
