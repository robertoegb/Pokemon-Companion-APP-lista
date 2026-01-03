
import React, { useEffect, useState } from 'react';
import { PokemonInstance } from '../types';

interface TradeAnimationOverlayProps {
  pokemonSent: PokemonInstance;
  pokemonReceived: PokemonInstance;
  onFinish: () => void;
}

const TradeAnimationOverlay: React.FC<TradeAnimationOverlayProps> = ({ pokemonSent, pokemonReceived, onFinish }) => {
  const [phase, setPhase] = useState<'IDLE' | 'CROSSING' | 'TRANSFORMING' | 'DONE'>('IDLE');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('CROSSING'), 500);
    const timer2 = setTimeout(() => setPhase('TRANSFORMING'), 5500);
    const timer3 = setTimeout(() => setPhase('DONE'), 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden touch-none">
      {/* Contenedor de la trayectoria */}
      <div className="relative w-full h-80 flex items-center">
        
        {/* POKEMON QUE ENVIAS (Izquierda -> Derecha) */}
        <div 
          className={`absolute left-0 transition-all duration-[5000ms] ease-in-out flex flex-col items-center
            ${phase === 'IDLE' ? '-translate-x-full opacity-100' : ''}
            ${phase === 'CROSSING' ? 'translate-x-[calc(100vw-140px)] opacity-100' : ''}
            ${phase === 'TRANSFORMING' || phase === 'DONE' ? 'translate-x-[calc(100vw-140px)] opacity-0 scale-0 rotate-180' : ''}
          `}
        >
          <img src={pokemonSent.sprites.front} className="w-48 h-48 pixelated drop-shadow-2xl" alt="sent" />
        </div>

        {/* POKEMON QUE RECIBES (Derecha -> Izquierda) */}
        <div 
          className={`absolute right-0 transition-all duration-[5000ms] ease-in-out flex flex-col items-center
            ${phase === 'IDLE' ? 'translate-x-full opacity-100' : ''}
            ${phase === 'CROSSING' ? '-translate-x-[calc(100vw-140px)] opacity-100' : ''}
            ${phase === 'TRANSFORMING' || phase === 'DONE' ? '-translate-x-[calc(100vw-140px)] opacity-0 scale-0 -rotate-180' : ''}
          `}
        >
          <img src={pokemonReceived.sprites.front} className="w-48 h-48 pixelated drop-shadow-2xl" alt="received" />
        </div>

        {/* POKEBALL ROJA (Enviada) */}
        <div 
          className={`absolute right-12 transition-all duration-1000 delay-300 flex flex-col items-center
            ${phase === 'TRANSFORMING' || phase === 'DONE' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
        >
           <div className="w-28 h-28 rounded-full border-[7px] border-black bg-white relative overflow-hidden animate-bounce shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600 border-b-[7px] border-black"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-[7px] border-black rounded-full z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-200 rounded-full shadow-inner"></div>
              </div>
           </div>
           <p className="text-[10px] font-black uppercase mt-4 text-red-600 tracking-widest">Enviado</p>
        </div>

        {/* POKEBALL AZUL (Recibida) */}
        <div 
          className={`absolute left-12 transition-all duration-1000 delay-500 flex flex-col items-center
            ${phase === 'TRANSFORMING' || phase === 'DONE' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
        >
           <div className="w-28 h-28 rounded-full border-[7px] border-black bg-white relative overflow-hidden animate-bounce shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-600 border-b-[7px] border-black"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-[7px] border-black rounded-full z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-200 rounded-full shadow-inner"></div>
              </div>
           </div>
           <p className="text-[10px] font-black uppercase mt-4 text-blue-600 tracking-widest">Recibido</p>
        </div>
      </div>

      <div className="mt-24 px-12 text-center h-24 flex items-center justify-center">
        <p className="font-pixel text-[10px] md:text-xs text-gray-400 uppercase leading-loose tracking-widest animate-pulse">
          {phase === 'CROSSING' && `INTERCAMBIANDO...`}
          {phase === 'TRANSFORMING' && `¡CONEXIÓN ESTABLECIDA!`}
          {phase === 'DONE' && `¡TRATO FINALIZADO!`}
        </p>
      </div>

      {phase === 'DONE' && (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-700 z-[1100]">
           <div className="bg-white p-10 rounded-[60px] shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-b-[16px] border-indigo-600 w-full max-w-sm text-center transform transition-transform">
              <div className="w-48 h-48 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 border-[8px] border-white relative shadow-xl">
                <img src={pokemonReceived.sprites.front} className="w-36 h-36 pixelated animate-bounce" alt="final" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <i className="fas fa-check text-xl"></i>
                </div>
              </div>
              <h2 className="font-pixel text-lg text-indigo-700 mb-6 uppercase tracking-tighter">NUEVO COMPAÑERO</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-10 leading-relaxed px-6">
                El intercambio se ha realizado con éxito.<br/>¡Revisa tu equipo!
              </p>
              <button 
                onClick={onFinish}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl active:translate-y-2 transition-all"
              >
                ENTENDIDO
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default TradeAnimationOverlay;
