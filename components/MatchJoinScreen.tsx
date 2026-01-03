
import React, { useState, useRef } from 'react';
import { checkMatchCapacity } from '../services/firebaseService';

interface MatchJoinScreenProps {
  onMatchJoined: (matchId: string) => void;
}

const MatchJoinScreen: React.FC<MatchJoinScreenProps> = ({ onMatchJoined }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const html5QrCodeRef = useRef<any>(null);
  const isProcessingRef = useRef(false);

  const startCameraSequence = async () => {
    setError(null);
    setLoading(true);
    isProcessingRef.current = false;
    setHasScanned(false);

    try {
      const module: any = await import('https://esm.sh/html5-qrcode@2.3.8');
      const Html5Qrcode = module.Html5Qrcode;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(true);

      setTimeout(async () => {
        const element = document.getElementById("reader");
        if (!element) return;

        try {
          const scanner = new Html5Qrcode("reader");
          html5QrCodeRef.current = scanner;

          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 20,
              qrbox: { width: 250, height: 250 },
            },
            async (decodedText) => {
              if (isProcessingRef.current || hasScanned) return;
              
              isProcessingRef.current = true;
              setLoading(true);

              try {
                const matchId = decodedText.trim().toUpperCase();
                const canJoin = await checkMatchCapacity(matchId);
                if (!canJoin) throw new Error("La mesa está llena (máx. 5 jugadores).");

                setHasScanned(true);
                await stopCamera();
                onMatchJoined(matchId);
              } catch (err: any) {
                isProcessingRef.current = false;
                setLoading(false);
                setHasScanned(false);
                setError(err.message);
              }
            },
            () => {} 
          );
          setLoading(false);
        } catch (err: any) {
          console.error("Scanner Error:", err);
          setError("Error al iniciar el hardware de cámara.");
          setCameraActive(false);
          setLoading(false);
        }
      }, 150);
    } catch (err) {
      console.error("OS Camera access denied:", err);
      setError("Acceso denegado. Permite la cámara en los ajustes del navegador.");
      setLoading(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-sm overflow-hidden border-b-[12px] border-black/20 text-center relative z-10 animate-in zoom-in duration-500">
            <div className="h-32 bg-indigo-600 flex items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-indigo-400 z-10">
                    <i className={`fas ${hasScanned ? 'fa-check text-green-500' : 'fa-qrcode text-indigo-600'} text-3xl`}></i>
                </div>
            </div>

            <div className="p-8">
                <h2 className="text-gray-800 font-pixel text-[10px] uppercase mb-4 tracking-tighter">VINCULAR TABLERO</h2>
                
                <div className="relative rounded-3xl overflow-hidden border-4 border-slate-100 bg-black mb-6 aspect-square flex flex-col items-center justify-center min-h-[220px]">
                    {(hasScanned || loading) && (
                        <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center">
                            <i className="fas fa-sync animate-spin text-3xl text-indigo-400 mb-4"></i>
                            <span className="text-[10px] font-black uppercase text-white tracking-widest">Sincronizando...</span>
                        </div>
                    )}

                    {!cameraActive && !hasScanned ? (
                        <div className="flex flex-col items-center p-6 text-center">
                            <i className="fas fa-camera text-slate-200 text-5xl mb-6 opacity-20"></i>
                            <button 
                                onClick={startCameraSequence}
                                className="bg-indigo-600 text-white font-black py-4 px-8 rounded-2xl text-[11px] uppercase tracking-widest active:scale-95 border-b-4 border-indigo-800 shadow-xl transition-all"
                            >
                                ACTIVAR CÁMARA
                            </button>
                        </div>
                    ) : (
                        !hasScanned && <div id="reader" className="w-full h-full"></div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 p-3 rounded-xl border-2 border-red-100 mb-6">
                        <p className="text-red-500 text-[8px] font-black uppercase">{error}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MatchJoinScreen;
