
import React, { useState, useRef } from 'react';
import { Trainer } from '../types';

interface EventsModuleProps {
  trainer: Trainer;
  onTriggerEvent: (code: string) => void;
  onClose: () => void;
}

const EventsModule: React.FC<EventsModuleProps> = ({ trainer, onTriggerEvent, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const html5QrCodeRef = useRef<any>(null);

  const requestCameraStart = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const module: any = await import('https://esm.sh/html5-qrcode@2.3.8');
      const Html5Qrcode = module.Html5Qrcode;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(true);

      setTimeout(async () => {
        const container = document.getElementById("event-reader");
        if (!container) return;

        try {
          const scanner = new Html5Qrcode("event-reader");
          html5QrCodeRef.current = scanner;

          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 20,
              qrbox: { width: 250, height: 250 },
            },
            async (decodedText) => {
              const code = decodedText.trim();
              const isInfiniteType = code.startsWith('&tmhm#') || code.startsWith('%item#');
              
              if (trainer.eventsConsumed?.includes(code) && !isInfiniteType) {
                setError("Este código ya ha sido utilizado.");
                return;
              }

              const validPrefixes = ['$wild#', '#npc#', '%item#', '&tmhm#'];
              if (!validPrefixes.some(p => code.startsWith(p))) {
                setError("Código QR no reconocido.");
                return;
              }

              await stopCamera();
              onTriggerEvent(code);
            },
            () => {}
          );
          setLoading(false);
        } catch (err: any) {
          console.error("Scanner start error:", err);
          setError("Error al iniciar el hardware de cámara.");
          setCameraActive(false);
          setLoading(false);
        }
      }, 100);
    } catch (err: any) {
      console.error("OS Permission denied:", err);
      setError("Permiso denegado. Activa la cámara en los ajustes.");
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
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 w-full h-full overflow-hidden animate-in slide-in-from-right duration-300">
      <div className="bg-violet-600 p-4 shadow-xl flex justify-between items-center z-10 border-b-4 border-violet-900 h-16 flex-shrink-0">
        <div>
          <h2 className="text-white font-pixel text-[10px] uppercase tracking-tighter">Eventos Especiales</h2>
          <p className="text-violet-200 text-[8px] font-bold mt-1 uppercase tracking-widest">Escanear Cartas</p>
        </div>
        <button onClick={onClose} className="bg-violet-900 text-white px-4 py-2 rounded-xl font-bold text-xs active:scale-95 border border-violet-500 uppercase flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> VOLVER
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 overflow-y-auto relative">
          <div className="relative rounded-[40px] overflow-hidden border-8 border-slate-800 bg-black w-full max-sm aspect-square shadow-2xl flex flex-col items-center justify-center min-h-[280px]">
              {!cameraActive ? (
                  <div className="flex flex-col items-center p-8">
                      <i className="fas fa-camera-retro text-white/5 text-6xl mb-6"></i>
                      <button 
                          onClick={requestCameraStart}
                          className="bg-violet-600 hover:bg-violet-700 text-white font-black py-4 px-8 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all border-b-4 border-violet-800 flex items-center gap-3"
                      >
                          <i className="fas fa-qrcode text-lg"></i> ACTIVAR CÁMARA
                      </button>
                  </div>
              ) : (
                  <>
                    {loading && (
                      <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center">
                          <i className="fas fa-circle-notch animate-spin text-3xl text-violet-400 mb-3"></i>
                          <span className="text-[10px] text-white font-black uppercase tracking-widest">Iniciando...</span>
                      </div>
                    )}
                    <div id="event-reader" className="w-full h-full event-reader-container"></div>
                  </>
              )}
          </div>

          {error && (
              <div className="bg-red-500/10 p-4 rounded-2xl border-2 border-red-500/50 w-full max-sm animate-pulse">
                  <p className="text-red-400 text-[9px] font-black uppercase leading-tight text-center">
                    <i className="fas fa-exclamation-circle mr-2"></i> {error}
                  </p>
              </div>
          )}
      </div>

      <style>{`
        .event-reader-container video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
};

export default EventsModule;
