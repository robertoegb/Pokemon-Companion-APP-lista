
import React from 'react';

interface ItemFoundOverlayProps {
  itemName: string;
  quantity: number;
  locationDescription?: string;
  onClose: () => void;
}

const ItemFoundOverlay: React.FC<ItemFoundOverlayProps> = ({ itemName, quantity, locationDescription, onClose }) => {
  // Determinamos el icono basado en el nombre (heurística simple)
  const itemNameNormalized = itemName.toLowerCase();
  const isBall = itemNameNormalized.includes('ball');
  const isPotion = itemNameNormalized.includes('poción') || itemNameNormalized.includes('pocio') || itemNameNormalized.includes('restaura');
  const isRevive = itemNameNormalized.includes('revivir');
  const isRare = itemNameNormalized.includes('caramelo') || itemNameNormalized.includes('pepita');
  
  let icon = 'fa-box';
  let colorClass = 'bg-orange-500';
  
  if (isBall) {
    icon = 'fa-circle';
    colorClass = itemName.includes('Ultra') ? 'bg-yellow-500' : itemName.includes('Super') ? 'bg-blue-500' : 'bg-red-500';
  } else if (isPotion) {
    icon = 'fa-prescription-bottle';
    colorClass = 'bg-green-500';
  } else if (isRevive) {
    icon = 'fa-heartbeat';
    colorClass = 'bg-indigo-500';
  } else if (isRare) {
    icon = 'fa-gem';
    colorClass = 'bg-purple-500';
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden border-b-[12px] border-black/10 animate-in zoom-in duration-300">
        <div className={`h-32 ${colorClass} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <i key={i} className={`fas ${icon} text-2xl`}></i>
              ))}
            </div>
          </div>
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/20 animate-bounce">
            <i className={`fas ${icon} text-4xl ${colorClass.replace('bg-', 'text-')}`}></i>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <h2 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">¡Hallazgo con éxito!</h2>
          <p className="text-gray-800 font-pixel text-[10px] leading-relaxed uppercase mb-4">
            Has encontrado <br/>
            <span className="text-lg font-black block mt-2 text-indigo-600">{quantity}x {itemName}</span>
          </p>
          
          {locationDescription && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-2xl mb-8">
                <p className="text-[10px] text-slate-500 font-bold italic leading-tight">
                    "{locationDescription}"
                </p>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all border-b-4 border-indigo-800"
          >
            GUARDAR EN LA MOCHILA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemFoundOverlay;
