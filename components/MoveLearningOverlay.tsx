
import React, { useState } from 'react';
import { PokemonInstance, Move, InstanceMove } from '../types';

interface MoveLearningOverlayProps {
  pokemon: PokemonInstance;
  newMove: Move;
  onComplete: (updatedPokemon: PokemonInstance) => void;
  onCancel: (updatedPokemon: PokemonInstance) => void;
}

const MoveLearningOverlay: React.FC<MoveLearningOverlayProps> = ({ pokemon, newMove, onComplete, onCancel }) => {
  const [step, setStep] = useState<'INITIAL' | 'FORGET_MENU' | 'SUCCESS'>('INITIAL');
  const [dialogue, setDialogue] = useState(`${pokemon.name} quiere aprender ${newMove.name}.`);

  const handleForgetMove = (index: number) => {
    const updatedMoves = [...pokemon.moves];
    updatedMoves[index] = { ...newMove, currentPp: newMove.maxPp };
    
    // Guardamos en el historial que este movimiento ya fue conocido/procesado
    const updatedHistory = Array.from(new Set([...(pokemon.learnedMoveNames || []), newMove.name]));
    
    setDialogue(`1, 2 y... ¡Tachán! ¡${pokemon.name} ha aprendido ${newMove.name}!`);
    setStep('SUCCESS');
    
    setTimeout(() => {
      onComplete({ ...pokemon, moves: updatedMoves, learnedMoveNames: updatedHistory });
    }, 2000);
  };

  const handleDirectLearn = () => {
    const updatedMoves = [...pokemon.moves, { ...newMove, currentPp: newMove.maxPp }];
    const updatedHistory = Array.from(new Set([...(pokemon.learnedMoveNames || []), newMove.name]));
    
    setDialogue(`¡${pokemon.name} ha aprendido ${newMove.name}!`);
    setStep('SUCCESS');
    
    setTimeout(() => {
      onComplete({ ...pokemon, moves: updatedMoves, learnedMoveNames: updatedHistory });
    }, 2000);
  };

  const handleSkipMove = () => {
    // CRÍTICO: Al saltar el movimiento, lo añadimos al historial de "vistos"
    // para que el sistema de detección por nivel no lo vuelva a ofrecer jamás.
    const updatedHistory = Array.from(new Set([...(pokemon.learnedMoveNames || []), newMove.name]));
    onCancel({ ...pokemon, learnedMoveNames: updatedHistory });
  };

  if (step === 'INITIAL' && pokemon.moves.length < 4) {
    return (
      <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-6 animate-in fade-in">
        <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden border-b-8 border-indigo-600">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={pokemon.sprites.front} className="w-20 h-20 pixelated" alt={pokemon.name} />
            </div>
            <p className="font-pixel text-xs text-gray-800 leading-relaxed uppercase mb-8">{dialogue}</p>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={handleDirectLearn}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 border-b-4 border-indigo-800"
                >
                    Aprender {newMove.name}
                </button>
                <button onClick={handleSkipMove} className="text-gray-400 font-pixel text-[8px] uppercase mt-2">No aprender por ahora</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden border-b-8 border-indigo-600">
        {step === 'INITIAL' && (
          <div className="p-8 text-center">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={pokemon.sprites.front} className="w-16 h-16 pixelated" alt={pokemon.name} />
            </div>
            <p className="font-pixel text-[10px] text-gray-800 leading-relaxed uppercase mb-8">
                {pokemon.name} ya conoce 4 movimientos. ¿Quieres olvidar un movimiento para aprender {newMove.name}?
            </p>
            <div className="flex flex-col gap-3">
                <button onClick={() => setStep('FORGET_MENU')} className="bg-indigo-600 text-white py-4 rounded-xl font-black uppercase text-[10px] shadow-lg active:scale-95 border-b-4 border-indigo-800">Sí, olvidar un ataque</button>
                <button onClick={handleSkipMove} className="bg-gray-100 text-gray-500 py-4 rounded-xl font-black uppercase text-[10px] active:scale-95">No aprenderlo</button>
            </div>
          </div>
        )}

        {step === 'FORGET_MENU' && (
          <div className="p-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">¿Qué ataque olvidar?</h3>
            <div className="grid grid-cols-1 gap-2">
              {pokemon.moves.map((m, i) => (
                <button 
                    key={i} 
                    onClick={() => handleForgetMove(i)}
                    className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-100 hover:border-indigo-500 text-left transition-all group"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-800 uppercase">{m.name}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase">{m.type}</span>
                    </div>
                    <i className="fas fa-times text-gray-300 group-hover:text-red-500"></i>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('INITIAL')} className="w-full mt-4 text-[9px] font-black text-gray-400 uppercase py-2">Cancelar</button>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-10 text-center animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                <i className="fas fa-star text-4xl text-white"></i>
            </div>
            <p className="font-pixel text-xs text-gray-800 leading-relaxed uppercase">{dialogue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveLearningOverlay;
