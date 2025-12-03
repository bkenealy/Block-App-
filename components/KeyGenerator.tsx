import React from 'react';
import QRCode from 'react-qr-code';
import { ArrowLeft, Printer } from 'lucide-react';

interface KeyGeneratorProps {
  brickKey: string;
  onClose: () => void;
}

export const KeyGenerator: React.FC<KeyGeneratorProps> = ({ brickKey, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold tracking-wider">CREATE BRICK</h2>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="bg-white p-4 rounded-xl shadow-2xl shadow-red-900/20">
          <QRCode 
            value={brickKey} 
            size={200} 
            fgColor="#000000" 
            bgColor="#ffffff" 
            level="H"
          />
        </div>

        <div className="max-w-xs text-center space-y-4">
          <h3 className="text-xl font-bold text-white">This is your Key.</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Print this code and tape it somewhere annoying (e.g., inside a book, in the kitchen, by the door).
          </p>
          <p className="text-red-400 text-xs font-mono">
            ID: {brickKey.substring(0, 8)}...
          </p>
        </div>
      </div>

      <button 
        onClick={() => window.print()}
        className="w-full py-4 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
      >
        <Printer size={20} />
        PRINT KEY
      </button>
    </div>
  );
};
