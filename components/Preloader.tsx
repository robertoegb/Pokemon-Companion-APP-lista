
import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  isLoadingComplete: boolean;
  onFinished: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoadingComplete, onFinished }) => {
  const [phase, setPhase] = useState<'SPLASH' | 'LOADING' | 'EXIT'>('SPLASH');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === 'LOADING') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          if (!isLoadingComplete && prev >= 90) return 90;
          return prev + (100 - prev) * 0.1;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [phase, isLoadingComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('LOADING');
    }, 4500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoadingComplete && progress >= 99) {
      setTimeout(() => {
        setPhase('EXIT');
        setTimeout(onFinished, 500);
      }, 800);
    }
  }, [isLoadingComplete, progress, onFinished]);

  if (phase === 'SPLASH') {
    const titleTop = "Pokémon".split("");
    const titleBottom = "Companion".split("");

    return (
      <div className="fixed inset-0 z-[9999] bg-red-600 flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Contenedor de Texto */}
        <div className="flex flex-col items-center text-center">
          <div className="flex">
            {titleTop.map((l, i) => (
              <span key={i} className="letter-anim font-pixel text-white text-3xl md:text-6xl" style={{ animationDelay: `${i * 0.1}s` }}>{l}</span>
            ))}
          </div>
          <div className="flex">
            {titleBottom.map((l, i) => (
              <span key={i} className="letter-anim font-pixel text-white text-3xl md:text-6xl mt-2" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>{l}</span>
            ))}
          </div>
        </div>
        
        {/* Pokéball Animada: Ahora debajo y más grande */}
        <div className="roll-in mt-16 md:mt-24" style={{ animationDelay: '1.8s' }}>
           <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] md:border-[10px] border-black bg-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600 border-b-[6px] md:border-b-[10px] border-black"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white border-[6px] md:border-[10px] border-black rounded-full z-10 flex items-center justify-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full"></div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${phase === 'EXIT' ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-xs space-y-16">
        
        <div className="relative h-48 w-full flex items-center justify-center overflow-visible">
           
           {/* CAPA 1: MITAD ROJA (VIENE DE DERECHA, TIENE HUECO DE 36px) */}
           <div className="ball-layer-top absolute w-32 h-32 z-20 flex flex-col items-center justify-center">
              <div className="w-32 h-16 bg-red-600 rounded-t-full border-[5px] border-b-0 border-black with-button-hole"></div>
              <div className="w-32 h-16 bg-transparent"></div>
           </div>
           
           {/* CAPA 2: MITAD BLANCA (VIENE DE IZQUIERDA, TIENE BOTÓN DE 36px) */}
           <div className="ball-layer-bottom absolute w-32 h-32 z-10 flex flex-col items-center justify-center">
              <div className="w-32 h-16 bg-transparent relative">
                  {/* BOTÓN CENTRAL: w-[36px] para calzar con el radio de 18px del hueco */}
                  <div className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-[36px] h-[36px] bg-white border-[5px] border-black rounded-full flex items-center justify-center z-30 shadow-sm">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
              </div>
              <div className="w-32 h-16 bg-white rounded-b-full border-[5px] border-t-0 border-black"></div>
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="font-pixel text-[8px] text-indigo-400 uppercase tracking-widest animate-pulse">Sincronizando...</span>
            <span className="font-mono text-white text-lg font-black">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border-2 border-slate-800 p-0.5 shadow-inner">
            <div className="h-full bg-gradient-to-r from-red-600 to-indigo-600 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
      
      <p className="mt-20 font-pixel text-[7px] text-slate-700 uppercase tracking-[0.5em]">Kanto OS v1.0 • FireRed Engine</p>
    </div>
  );
};

export default Preloader;
