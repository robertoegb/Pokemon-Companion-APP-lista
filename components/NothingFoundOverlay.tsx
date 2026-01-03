
import React from 'react';

interface NothingFoundOverlayProps {
  onContinue: () => void;
}

const NothingFoundOverlay: React.FC<NothingFoundOverlayProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-[400] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden border-b-[12px] border-slate-200 animate-in zoom-in duration-300">
        <div className="h-32 bg-slate-100 flex items-center justify-center relative">
           <i className="fas fa-wind text-slate-300 text-5xl animate-pulse"></i>
           <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-50"></div>
        </div>

        <div className="p-8 text-center">
           <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Exploración completada</h2>
           <p className="text-slate-600 font-pixel text-[10px] leading-relaxed uppercase mb-8">
             Exploraste la zona con cuidado... <br/><br/>
             <span className="text-slate-800 font-black">Pero todo parece tranquilo por aquí.</span>
           </p>

           <button 
             onClick={onContinue}
             className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
           >
             Continuar
           </button>
        </div>
      </div>
    </div>
  );
};

export default NothingFoundOverlay;
