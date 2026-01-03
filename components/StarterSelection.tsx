
import React, { useState, useEffect } from 'react';
import { POKEDEX, STARTER_IDS } from '../data';
import { PokemonBase } from '../types';

interface StarterSelectionProps {
  onSelect: (pokemon: PokemonBase, name: string) => void;
}

type IntroStep = 'START_SCREEN' | 'NICKNAME_INPUT' | 'OAK_DIALOGUE' | 'PICK_POKEMON' | 'SUCCESS_SCREEN';

const StarterSelection: React.FC<StarterSelectionProps> = ({ onSelect }) => {
  const [step, setStep] = useState<IntroStep>('START_SCREEN');
  const [nickname, setNickname] = useState('');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [selectedStarter, setSelectedStarter] = useState<PokemonBase | null>(null);
  const starters = POKEDEX.filter(p => STARTER_IDS.includes(p.id));

  useEffect(() => {
    const tempNick = sessionStorage.getItem('temp_nickname');
    if (tempNick) {
      setNickname(tempNick);
    }
  }, []);

  const oakDialogues = [
    `¡Hola ${nickname}! ¡Es un placer conocerte! Bienvenido al mundo de los Pokémon.`,
    "Esta aplicación, Pokémon Companion, será tu guía para explorar rutas, capturar amigos y enfrentarte a grandes retos.",
    "Tu objetivo es claro: conseguir las 8 medallas de gimnasio, completar la Pokédex y convertirte en el nuevo Campeón.",
    "Pero no puedes ir solo... necesitas un compañero fiel que esté a tu lado en cada combate.",
    "He preparado estos 5 Pokémon para ti. Elige con cuidado, pues será tu mejor amigo en esta gran travesía.",
    "¡Adelante! ¿A quién eliges?"
  ];

  const handleNextDialogue = () => {
    if (dialogueIndex < oakDialogues.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      setStep('PICK_POKEMON');
    }
  };

  const handleStartAdventure = () => {
    if (nickname) {
      setStep('OAK_DIALOGUE');
    } else {
      setStep('NICKNAME_INPUT');
    }
  };

  const handleConfirmSelection = () => {
    setStep('SUCCESS_SCREEN');
  };

  const handleFinalStart = () => {
    if (selectedStarter) {
      sessionStorage.removeItem('temp_nickname');
      onSelect(selectedStarter, nickname);
    }
  };

  if (step === 'START_SCREEN') {
    return (
      <div className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center p-6 z-50">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <div className="w-[150%] h-[150%] border-[100px] border-white rounded-full -translate-x-1/4 -translate-y-1/4"></div>
           <div className="w-full h-10 bg-white absolute top-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="text-center z-10 animate-in fade-in zoom-in duration-700">
          <div className="w-32 h-32 bg-white rounded-full border-8 border-gray-800 mx-auto mb-8 flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-4 border-gray-800"></div>
            <div className="w-10 h-10 bg-white rounded-full border-4 border-gray-800 z-10 flex items-center justify-center shadow-inner">
               <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-white font-pixel text-2xl md:text-4xl mb-12 drop-shadow-lg tracking-tighter leading-tight uppercase">
            TU AVENTURA<br/>COMIENZA AQUÍ
          </h1>
          <button 
            onClick={handleStartAdventure}
            className="bg-white text-red-600 font-pixel py-4 px-8 rounded-xl shadow-[0_8px_0_rgb(180,180,180)] active:shadow-none active:translate-y-2 transition-all text-sm md:text-lg border-4 border-gray-800 uppercase"
          >
            COMENZAR AVENTURA
          </button>
        </div>
      </div>
    );
  }

  if (step === 'NICKNAME_INPUT') {
    return (
      <div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center p-6 z-50">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border-b-8 border-red-600 w-full max-w-md animate-in slide-in-from-bottom-12">
           <h2 className="font-pixel text-xs text-gray-800 mb-6 text-center leading-relaxed uppercase tracking-tighter">¿COMO TE LLAMAS,<br/>ENTRENADOR?</h2>
           <input 
             type="text" 
             maxLength={12}
             value={nickname}
             onChange={(e) => setNickname(e.target.value.toUpperCase())}
             placeholder="TU APODO"
             className="w-full bg-gray-50 border-4 border-gray-200 rounded-2xl py-4 px-6 text-xl font-bold text-center focus:border-red-500 outline-none transition-all uppercase text-gray-900"
           />
           <button 
             disabled={nickname.trim().length < 3}
             onClick={() => setStep('OAK_DIALOGUE')}
             className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-pixel py-4 rounded-xl shadow-[0_6px_0_rgb(153,27,27)] active:shadow-none active:translate-y-1 transition-all text-xs border-b-4 border-red-800"
           >
             CONTINUAR
           </button>
           <p className="mt-4 text-[9px] text-gray-400 font-bold uppercase text-center italic">Mínimo 3 caracteres</p>
        </div>
      </div>
    );
  }

  if (step === 'OAK_DIALOGUE') {
    return (
      <div className="fixed inset-0 bg-gray-100 flex flex-col animate-in fade-in duration-1000">
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <img 
            src="https://i.postimg.cc/JnJTxyss/3D2FB6D8-85FB-4D62-81F4-414A0E101A26.png" 
            alt="Profesor Oak"
            className="h-full max-h-[60vh] object-contain drop-shadow-2xl animate-in slide-in-from-bottom-12 duration-700"
          />
        </div>

        <div className="p-4 bg-gray-900 border-t-8 border-blue-600 min-h-[180px] flex flex-col">
          <div className="flex-1 bg-white rounded-xl p-4 border-4 border-gray-400 shadow-inner">
            <p className="font-pixel text-[11px] md:text-sm leading-relaxed text-gray-800 animate-in fade-in duration-300" key={dialogueIndex}>
              {oakDialogues[dialogueIndex]}
            </p>
          </div>
          <button 
            onClick={handleNextDialogue}
            className="mt-3 bg-blue-600 text-white font-pixel py-2 px-4 rounded-lg text-xs self-end active:scale-95 transition-transform border-b-4 border-blue-800"
          >
            {dialogueIndex === oakDialogues.length - 1 ? "ELEGIR POKÉMON" : "CONTINUAR"}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'SUCCESS_SCREEN' && selectedStarter) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 z-[200] animate-in fade-in duration-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="grid grid-cols-6 gap-8 p-12">
             {Array.from({ length: 24 }).map((_, i) => (
                <i key={i} className="fas fa-star text-4xl text-yellow-500 animate-pulse"></i>
             ))}
           </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-2xl border-b-[12px] border-green-500 w-full max-w-sm text-center relative z-10 animate-in zoom-in duration-300">
          <div className="w-48 h-48 bg-green-50 rounded-full mx-auto mb-8 flex items-center justify-center border-4 border-green-100 shadow-inner relative">
             <img src={selectedStarter.sprites.front} className="w-40 h-40 pixelated animate-bounce drop-shadow-xl" alt={selectedStarter.name} />
             <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-3 rounded-full shadow-lg border-2 border-white animate-pulse">
                <i className="fas fa-certificate text-xl"></i>
             </div>
          </div>

          <h2 className="font-pixel text-lg text-green-600 mb-4 uppercase tracking-tighter">¡FELICITACIONES!</h2>
          <p className="text-gray-700 font-pixel text-[10px] leading-relaxed uppercase mb-8">
            ¡<span className="text-indigo-600 text-xs">{selectedStarter.name}</span> será tu fiel compañero de aventuras!<br/><br/>
            ¡Cuídalo muy bien, {nickname}!
          </p>

          <button 
            onClick={handleFinalStart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-pixel py-5 rounded-2xl shadow-xl active:translate-y-1 active:shadow-none transition-all border-b-4 border-indigo-800 text-[11px] tracking-widest uppercase"
          >
            IR AL JUEGO
          </button>
        </div>
      </div>
    );
  }

  const StarterButton = ({ pokemon }: { pokemon: PokemonBase }) => {
    const typeColor = pokemon.types[0] === 'Fire' ? 'bg-red-500' : 
                      pokemon.types[0] === 'Water' ? 'bg-blue-500' : 
                      pokemon.types[0] === 'Grass' ? 'bg-green-500' : 
                      pokemon.types[0] === 'Electric' ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-400';

    return (
      <button 
        onClick={() => setSelectedStarter(pokemon)}
        className="flex flex-col items-center gap-3 group transition-all active:scale-90"
      >
        <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-gray-800 flex items-center justify-center bg-white shadow-xl group-hover:shadow-2xl group-hover:border-indigo-500 overflow-hidden relative transition-all`}>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50"></div>
          <img 
            src={pokemon.sprites.front} 
            alt={pokemon.name} 
            className="w-24 h-24 md:w-32 md:h-32 pixelated object-contain group-hover:scale-110 transition-transform relative z-10"
          />
        </div>
        <div className="text-center animate-in slide-in-from-top-2">
          <div className="font-pixel text-[11px] md:text-sm text-gray-800 uppercase mb-1.5 font-black">{pokemon.name}</div>
          <div className={`${typeColor} ${pokemon.types[0] === 'Electric' ? '' : 'text-white'} font-pixel text-[8px] px-3 py-1 rounded-full inline-block shadow-sm border border-black/10 uppercase tracking-tighter`}>
            {pokemon.types[0]}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-1000 items-center justify-center p-6 relative overflow-hidden">
      {/* MODAL DE CONFIRMACIÓN */}
      {selectedStarter && step === 'PICK_POKEMON' && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-sm overflow-hidden border-b-[12px] border-red-600 animate-in zoom-in duration-300">
            <div className="h-56 bg-gray-50 flex items-center justify-center relative overflow-hidden border-b-4 border-gray-100">
              <div className="absolute inset-0 opacity-5">
                <i className="fas fa-paw text-[12rem] absolute -bottom-10 -right-10 rotate-12 text-gray-400"></i>
              </div>
              <img 
                src={selectedStarter.sprites.front} 
                className="w-48 h-48 pixelated relative z-10 animate-bounce drop-shadow-lg" 
                alt={selectedStarter.name} 
              />
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-800 font-pixel text-[11px] leading-relaxed uppercase mb-8">
                ¿Estás seguro que quieres a <span className="text-red-600 text-sm block mt-2 font-black tracking-tight">{selectedStarter.name}</span> como tu primer Pokémon?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmSelection}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-pixel py-5 rounded-2xl shadow-lg active:scale-95 transition-all border-b-4 border-red-800 text-[10px] tracking-widest uppercase"
                >
                  ¡SÍ, LO QUIERO!
                </button>
                <button 
                  onClick={() => setSelectedStarter(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-pixel py-4 rounded-2xl transition-all text-[9px] uppercase font-bold"
                >
                  LO HE PENSADO MEJOR...
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full flex flex-wrap gap-16 items-center justify-center">
          {Array.from({ length: 30 }).map((_, i) => (
             <i key={i} className="fas fa-paw text-7xl text-gray-900"></i>
          ))}
        </div>
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col items-center">
        <div className="mb-12 text-center">
           <h2 className="font-pixel text-xl md:text-3xl text-red-600 mb-2 tracking-tighter drop-shadow-sm uppercase">EL PASO FINAL</h2>
           <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">Elige a tu compañero</p>
        </div>
        
        <div className="w-full space-y-12">
          {/* Fila 1 */}
          <div className="flex justify-around w-full px-2">
            {starters[0] && <StarterButton pokemon={starters[0]} />}
            {starters[1] && <StarterButton pokemon={starters[1]} />}
          </div>

          {/* Fila 2 (Destacado) */}
          <div className="flex justify-center w-full">
            {starters[2] && <StarterButton pokemon={starters[2]} />}
          </div>

          {/* Fila 3 */}
          <div className="flex justify-around w-full px-2">
            {starters[3] && <StarterButton pokemon={starters[3]} />}
            {starters[4] && <StarterButton pokemon={starters[4]} />}
          </div>
        </div>
        
        <p className="mt-16 font-pixel text-[9px] text-gray-300 uppercase tracking-widest animate-pulse flex items-center gap-3 uppercase">
          <i className="fas fa-mouse-pointer"></i> Toca a un Pokémon para elegirlo
        </p>
      </div>
    </div>
  );
};

export default StarterSelection;
