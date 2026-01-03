
import React, { useState } from 'react';
import * as firebaseAuth from 'firebase/auth';
const { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} = firebaseAuth;
import { auth } from '../services/firebaseService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Configurar persistencia según la elección del usuario
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      if (isRegistering) {
        if (nickname.trim().length < 3) throw new Error("Apodo muy corto (mín. 3).");
        sessionStorage.setItem('temp_nickname', nickname.trim().toUpperCase());
        await createUserWithEmailAndPassword(auth, email, password);
        onLoginSuccess();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error("AUTH ERROR:", err);
      let msg = err.message.replace('Firebase: ', '').toUpperCase();
      if (err.code === 'auth/invalid-credential') msg = 'EMAIL O CONTRASEÑA INCORRECTOS';
      if (err.code === 'auth/email-already-in-use') msg = 'EL EMAIL YA ESTÁ REGISTRADO';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[100dvh] w-screen ${isRegistering ? 'bg-indigo-600' : 'bg-red-600'} p-4 transition-colors duration-500`}>
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[360px] border-b-[10px] border-black/10 overflow-hidden animate-in zoom-in duration-300">
        <div className={`h-2 transition-colors ${isRegistering ? 'bg-indigo-400' : 'bg-red-400'}`}></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="w-full h-full rounded-full border-4 border-gray-800 bg-white overflow-hidden relative shadow-lg">
                <div className={`absolute top-0 w-full h-1/2 ${isRegistering ? 'bg-indigo-500' : 'bg-red-500'} border-b-4 border-gray-800`}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-800 rounded-full z-10"></div>
              </div>
            </div>
            <h1 className="font-pixel text-base text-gray-800 tracking-tighter leading-tight">Pokémon<br/>Companion</h1>
            <p className="text-[8px] font-black text-gray-400 uppercase mt-2 tracking-widest">
              {isRegistering ? 'Crea tu ficha de entrenador' : 'Acceso al sistema'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-gray-400 text-[8px] font-black uppercase mb-1 ml-1">Apodo del Entrenador</label>
                <input 
                  type="text" 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                  placeholder="EJ: ASH" 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-sm uppercase text-black"
                  required 
                />
              </div>
            )}
            
            <div>
              <label className="block text-gray-400 text-[8px] font-black uppercase mb-1 ml-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@ejemplo.com" 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-red-500 outline-none font-bold text-sm text-black"
                required 
              />
            </div>

            <div>
              <label className="block text-gray-400 text-[8px] font-black uppercase mb-1 ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-red-500 outline-none font-bold text-sm text-black"
                required 
              />
            </div>

            <div className="flex items-center gap-2 px-1">
              <button 
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
              >
                {rememberMe && <i className="fas fa-check text-white text-[10px]"></i>}
              </button>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
                Recordarme en este dispositivo
              </span>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 animate-in slide-in-from-top-1">
                <p className="text-[9px] font-black text-red-600 text-center uppercase leading-tight">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-white text-[10px] tracking-widest uppercase shadow-xl active:translate-y-1 transition-all border-b-4 border-black/20 flex items-center justify-center gap-2 ${isRegistering ? 'bg-indigo-600 border-indigo-800' : 'bg-red-600 border-red-800'}`}
            >
              {loading ? (
                <i className="fas fa-circle-notch animate-spin text-lg"></i>
              ) : (
                <span>{isRegistering ? 'REGISTRARSE AHORA' : 'ENTRAR AL JUEGO'}</span>
              )}
            </button>

            <button 
              type="button" 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="w-full text-center text-gray-400 font-black text-[9px] uppercase tracking-widest mt-4 hover:text-gray-600 transition-colors"
            >
              {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿Eres nuevo? Crea una cuenta aquí'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-white/20 text-[7px] font-black uppercase text-center tracking-[0.3em]">
          Pokémon Companion • Sistema de Cuentas Locales
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
