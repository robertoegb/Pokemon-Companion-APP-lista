
import React, { useState } from 'react';

interface QrGeneratorOverlayProps {
  onClose: () => void;
}

const QrGeneratorOverlay: React.FC<QrGeneratorOverlayProps> = ({ onClose }) => {
  const [text, setText] = useState('TABLERO_01');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden border-b-[12px] border-indigo-600 animate-in zoom-in duration-300">
        <div className="h-24 bg-indigo-600 flex items-center justify-center relative">
          <h2 className="text-white font-pixel text-[10px] uppercase">Generador de Mesas</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-500 font-bold text-[9px] uppercase mb-4 tracking-widest">
            Escribe el ID de la mesa para el tablero:
          </p>
          
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl py-3 px-4 text-center font-black text-indigo-600 mb-6 uppercase outline-none focus:border-indigo-400 transition-all"
            placeholder="EJ: MESA_ALFA"
          />

          <div className="bg-white p-4 rounded-3xl border-4 border-slate-100 inline-block mb-6 shadow-inner">
             <img src={qrUrl} alt="QR Code" className="w-48 h-48 pixelated" />
          </div>

          <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
            <p className="text-indigo-600 text-[8px] font-black uppercase leading-tight">
              Escanea este código con otro móvil <br/> para unirte a la partida "{text}"
            </p>
          </div>

          <button 
            onClick={() => window.print()}
            className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-print"></i> Imprimir Código
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrGeneratorOverlay;
