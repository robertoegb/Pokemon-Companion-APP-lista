
import React, { useState } from 'react';
import { Trainer } from '../types';
import { auth, resetTrainerData, updateTrainerData } from '../services/firebaseService';

interface SettingsModuleProps {
  trainer: Trainer;
  onUpdateTrainer: (data: Partial<Trainer>) => void;
  onReset: () => void;
  onLogout: () => void;
  onClose: () => void;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ trainer, onUpdateTrainer, onReset, onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'RULES' | 'LEGAL' | 'DANGER'>('PROFILE');
  const [newName, setNewName] = useState(trainer.name);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

  const handleUpdateName = async () => {
    if (newName.trim().length < 3) return;
    setIsSaving(true);
    try {
      await updateTrainerData(trainer.uid, { name: newName.trim() });
      onUpdateTrainer({ name: newName.trim() });
      alert("¡Nombre de entrenador actualizado!");
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el nombre.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProgress = async () => {
    if (confirmDelete !== 'BORRAR') return;
    
    setIsSaving(true);
    try {
      localStorage.setItem('pokeCompa_deleted_event', 'true');
      await resetTrainerData(trainer.uid);
      const user = auth.currentUser;
      if (user) {
        try { await user.delete(); } catch (e) { console.warn("Re-auth needed, skipping auth delete."); }
      }
      onLogout();
    } catch (e) {
      console.error(e);
      localStorage.removeItem('pokeCompa_deleted_event');
      alert("Error al procesar la eliminación.");
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 w-full h-full overflow-hidden animate-in slide-in-from-right duration-300">
      {/* HEADER */}
      <div className="bg-slate-800 p-4 shadow-lg flex justify-between items-center z-10 border-b-4 border-slate-900">
        <div>
          <h2 className="text-white font-pixel text-xs uppercase tracking-tighter">Ajustes</h2>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">Configuración de cuenta</p>
        </div>
        <button 
          onClick={onClose} 
          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm text-xs active:scale-95 transition-all flex items-center gap-2 border border-slate-500"
        >
          <i className="fas fa-arrow-left"></i> VOLVER
        </button>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex bg-slate-200 p-1 flex-shrink-0 overflow-x-auto no-scrollbar">
        {(['PROFILE', 'RULES', 'LEGAL', 'DANGER'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[80px] py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm rounded-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab === 'PROFILE' ? 'Perfil' : tab === 'RULES' ? 'Reglas' : tab === 'LEGAL' ? 'Legal' : 'PELIGRO'}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'PROFILE' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200">
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Tu Apodo de Entrenador</label>
              <div className="flex flex-col gap-3">
                <input 
                  type="text" 
                  maxLength={12}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-lg font-bold focus:border-indigo-500 outline-none uppercase text-black"
                />
                <button
                  disabled={isSaving || newName.trim() === trainer.name || newName.trim().length < 3}
                  onClick={handleUpdateName}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl uppercase text-xs tracking-widest shadow-md transition-all active:translate-y-0.5 disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200">
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Email Vinculado</label>
              <p className="text-slate-800 font-bold text-sm truncate bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6">{trainer.email}</p>
              
              <button
                onClick={onLogout}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3 rounded-xl uppercase text-xs tracking-widest shadow-sm transition-all active:scale-95 border border-slate-200 flex items-center justify-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {activeTab === 'DANGER' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-red-50 p-6 rounded-3xl shadow-md border-2 border-red-200">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-xl"></i>
              </div>
              <h3 className="text-red-700 font-black text-sm uppercase tracking-tighter mb-2">REINICIAR AVENTURA</h3>
              <p className="text-red-600/80 text-xs font-medium leading-relaxed mb-6 italic uppercase">
                Esta acción eliminará permanentemente tu progreso, Pokémon y dinero.<br/><br/>
                Para volver a jugar deberás registrar tu correo de nuevo.
              </p>
              
              <div className="space-y-3">
                <label className="block text-red-900 text-[10px] font-black uppercase tracking-widest">Escribe "BORRAR" para confirmar</label>
                <input 
                  type="text" 
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value.toUpperCase())}
                  placeholder="BORRAR"
                  className="w-full bg-white border-2 border-red-200 rounded-xl py-3 px-4 text-lg font-bold text-red-600 focus:border-red-500 outline-none uppercase placeholder:text-red-200"
                />
                <button
                  disabled={confirmDelete !== 'BORRAR' || isSaving}
                  onClick={handleDeleteProgress}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 border-b-4 border-red-800"
                >
                  {isSaving ? 'BORRANDO...' : 'BORRAR TODO Y SALIR'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 text-center flex-shrink-0">
         <p className="text-slate-500 text-[8px] font-bold uppercase tracking-[0.3em]">
           Integridad de Juego • Pokémon Companion
         </p>
      </div>
    </div>
  );
};

export default SettingsModule;
