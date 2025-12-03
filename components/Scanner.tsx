import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { X, Camera } from 'lucide-react';

interface ScannerProps {
  onScanSuccess: () => void;
  onCancel: () => void;
  expectedKey: string;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onCancel, expectedKey }) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  const handleScanSuccessTrigger = () => {
    setScanning(false);
    setTimeout(() => {
        onScanSuccess();
    }, 500);
  };

  useEffect(() => {
    // Simulate finding the code after 3 seconds for demonstration purposes
    // In a production environment with 'jsQR', this would be replaced by the frame processing loop.
    const timer = setTimeout(() => {
        handleScanSuccessTrigger();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={onCancel}
          className="p-4 bg-zinc-900/80 rounded-full text-white hover:bg-zinc-800 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="relative w-full max-w-md aspect-[3/4] bg-black overflow-hidden rounded-2xl border-2 border-red-500/30">
        {scanning ? (
            <>
                <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover opacity-60"
                onUserMediaError={() => setError("Camera access denied")}
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[20px] border-black/50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-red-500/80 rounded-lg">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
                    
                    {/* Scanline Animation */}
                    <div className="scan-line"></div>
                </div>
                
                <div className="absolute bottom-12 w-full text-center">
                    <p className="text-red-500 font-mono text-sm tracking-widest animate-pulse">
                        SEARCHING FOR BRICK KEY...
                    </p>
                </div>
            </>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-green-900/20">
                 <div className="text-green-500 font-mono text-xl tracking-widest">
                    KEY VERIFIED
                </div>
            </div>
        )}
      </div>

      {/* Prototype Helper */}
      <div className="mt-8 px-6 text-center">
        <p className="text-zinc-500 text-xs mb-4 max-w-xs mx-auto">
          Point camera at your printed Brick Key.
        </p>
        
        {/* Manual Trigger Button */}
        <button 
            onClick={handleScanSuccessTrigger}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm hover:border-red-500 hover:text-red-500 transition-all"
        >
            <Camera size={16} />
            [DEMO] FORCE SUCCESS
        </button>
      </div>

      {error && (
        <div className="absolute bottom-10 left-0 w-full text-center text-red-500 bg-black/80 py-2">
            {error}
        </div>
      )}
    </div>
  );
};