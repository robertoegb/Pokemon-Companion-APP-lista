
import React, { useState, useEffect, useRef } from 'react';
import { PokemonBase, PokemonInstance } from '../types';

interface EvolutionOverlayProps {
  original: PokemonInstance;
  evolvedBase: PokemonBase;
  onComplete: () => void;
  onCancel: (level: number) => void;
}

const EvolutionOverlay: React.FC<EvolutionOverlayProps> = ({ original, evolvedBase, onComplete, onCancel }) => {
  const [phase, setPhase] = useState<'START' | 'ANIMATING' | 'FINISH' | 'CANCELLED'>('START');
  const [showEvolved, setShowEvolved] = useState(false);
  const [dialogue, setDialogue] = useState(`¡Anda! ¡Tu ${original.name} está evolucionando!`);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (phase === 'START') {
      const startTimer = setTimeout(() => {
        setPhase('ANIMATING');
      }, 1500);
      return () => clearTimeout(startTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'ANIMATING') return;

    let count = 0;
    const maxCount = 40; 
    const baseSpeed = 250;
    
    const tick = () => {
      if (isCancelledRef.current) return;

      setShowEvolved(prev => !prev);
      count++;
      
      if (count >= maxCount) {
        setPhase('FINISH');
        setShowEvolved(true);
        setDialogue(`¡Enhorabuena! ¡Tu ${original.name} ha evolucionado a ${evolvedBase.name}!`);
      } else {
        const nextSpeed = Math.max(20, baseSpeed - (count * 7));
        setTimeout(tick, nextSpeed);
      }
    };

    const initialTick = setTimeout(tick, baseSpeed);
    return () => clearTimeout(initialTick);
  }, [phase, original.name, evolvedBase.name]);

  const handleStopEvolution = (e: React.MouseEvent) => {
    e.stopPropagation();
    isCancelledRef.current = true;
    setPhase('CANCELLED');
    setShowEvolved(false);
    setDialogue(`¡Has detenido la evolución de ${original.name}!`);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden touch-none">
      <div className={`absolute w-[150vw] h-[150vw] rounded-full bg-white/20 blur-[100px] transition-all duration-1000 pointer-events-none ${phase === 'FINISH' ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`}></div>

      <div className="flex-1 flex flex-col items-center justify-center w-full p-6 z-10 pointer-events-none">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {phase === 'ANIMATING' && (
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
          )}

          <img 
            src={original.sprites.front} 
            alt={original.name}
            className={`w-48 h-48 pixelated absolute transition-all duration-75 ${(!showEvolved || phase === 'START' || phase === 'CANCELLED') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          />
          
          <img 
            src={evolvedBase.sprites.front} 
            alt={evolvedBase.name}
            className={`w-48 h-48 pixelated absolute transition-all duration-75 ${(showEvolved && phase !== 'START' && phase !== 'CANCELLED') ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}
          />
        </div>
      </div>

      <div className="w-full p-4 bg-gray-900 border-t-8 border-blue-600 min-h-[180px] flex flex-col z-[510] shadow-2xl">
          <div className="flex-1 bg-white rounded-xl p-4 border-4 border-gray-400 shadow-inner flex items-center justify-center text-center">
            <p className="font-pixel text-[10px] md:text-sm leading-relaxed text-gray-800 animate-in fade-in" key={dialogue}>
              {dialogue}
            </p>
          </div>
          
          <div className="flex gap-3 mt-3">
            {(phase === 'START' || phase === 'ANIMATING') ? (
              <button 
                onClick={handleStopEvolution}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-pixel py-3 rounded-lg text-[9px] active:scale-95 transition-transform border-b-4 border-red-800 shadow-lg"
              >
                ¡DETENER EVOLUCIÓN!
              </button>
            ) : (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (phase === 'CANCELLED') onCancel(original.level);
                  else onComplete(); 
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-pixel py-3 px-8 rounded-lg text-xs active:scale-95 transition-transform border-b-4 border-blue-800 shadow-lg cursor-pointer"
              >
                CONTINUAR
              </button>
            )}
          </div>
      </div>
    </div>
  );
};

export default EvolutionOverlay;
