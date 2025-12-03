import React, { useState, useRef } from 'react';
import { DistractionApp } from '../types';
import { Lock, Unlock, QrCode, ScanLine, Check, ChevronRight, List, AlertTriangle } from 'lucide-react';

// Expanded Mock Data - simulating "Apps on Device"
const INSTALLED_APPS: DistractionApp[] = [
  { id: '1', name: 'Instagram', url: 'https://instagram.com', icon: 'IG', color: '#E1306C' },
  { id: '2', name: 'TikTok', url: 'https://tiktok.com', icon: 'TT', color: '#000000' },
  { id: '3', name: 'Twitter/X', url: 'https://twitter.com', icon: 'X', color: '#1DA1F2' },
  { id: '4', name: 'Reddit', url: 'https://reddit.com', icon: 'RD', color: '#FF4500' },
  { id: '5', name: 'YouTube', url: 'https://youtube.com', icon: 'YT', color: '#FF0000' },
  { id: '6', name: 'Facebook', url: 'https://facebook.com', icon: 'FB', color: '#1877F2' },
  { id: '7', name: 'Netflix', url: 'https://netflix.com', icon: 'NF', color: '#E50914' },
  { id: '8', name: 'Twitch', url: 'https://twitch.tv', icon: 'TW', color: '#9146FF' },
  { id: '9', name: 'Snapchat', url: 'https://snapchat.com', icon: 'SC', color: '#FFFC00' },
  { id: '10', name: 'Discord', url: 'https://discord.com', icon: 'DC', color: '#5865F2' },
];

interface DashboardProps {
  isLocked: boolean;
  onScanAction: () => void;
  onOpenKeyGen: () => void;
  statusMessage: string;
  blockedAppIds: string[];
  onToggleAppBlock: (id: string) => void;
  onEmergencyUnlock: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  isLocked, 
  onScanAction, 
  onOpenKeyGen,
  statusMessage,
  blockedAppIds,
  onToggleAppBlock,
  onEmergencyUnlock
}) => {
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  
  // Emergency Unlock Logic
  const [emergencyProgress, setEmergencyProgress] = useState(0);
  const emergencyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper to get names of blocked apps
  const blockedAppNames = INSTALLED_APPS
    .filter(app => blockedAppIds.includes(app.id))
    .map(app => app.name);

  const startEmergencyUnlock = () => {
    if (!isLocked) return;
    const startTime = Date.now();
    const DURATION = 120000; // 2 minutes in ms

    if (emergencyIntervalRef.current) clearInterval(emergencyIntervalRef.current);

    emergencyIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / DURATION) * 100, 100);
      setEmergencyProgress(progress);

      if (progress >= 100) {
        if (emergencyIntervalRef.current) clearInterval(emergencyIntervalRef.current);
        onEmergencyUnlock();
        setEmergencyProgress(0);
      }
    }, 50); // Update frequently for smooth animation
  };

  const stopEmergencyUnlock = () => {
    if (emergencyIntervalRef.current) {
      clearInterval(emergencyIntervalRef.current);
      emergencyIntervalRef.current = null;
    }
    setEmergencyProgress(0);
  };

  if (showSelectionModal) {
    return (
      <div className="fixed inset-0 bg-zinc-950 text-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <h2 className="text-lg font-mono font-bold tracking-wider">SELECT APPS</h2>
          <button 
            onClick={() => setShowSelectionModal(false)}
            className="p-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
          >
            <Check size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4 px-2">
                Apps installed on this device
            </p>
            {INSTALLED_APPS.map(app => {
                const isSelected = blockedAppIds.includes(app.id);
                return (
                    <div 
                        key={app.id}
                        onClick={() => onToggleAppBlock(app.id)}
                        className={`
                            p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all active:scale-[0.98]
                            ${isSelected 
                                ? 'bg-red-900/20 border-red-500/50' 
                                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                            }
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`font-medium ${isSelected ? 'text-red-400' : 'text-zinc-300'}`}>
                                {app.name}
                            </span>
                        </div>
                        
                        {/* Custom Radio/Checkbox styled indicator */}
                        <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${isSelected 
                                ? 'border-red-500 bg-red-500 text-black' 
                                : 'border-zinc-600 bg-transparent'
                            }
                        `}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none">
        {/* Background Ambient Effect */}
        <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none
            ${isLocked ? 'opacity-20' : 'opacity-0'} bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900 via-zinc-950 to-zinc-950`}>
        </div>

        {/* Header */}
        <header className="p-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <h1 className="font-mono text-sm tracking-widest text-zinc-400 font-bold">
                    FOCUSBRICK
                </h1>
            </div>
            <div className="text-xs font-mono text-zinc-600">
            {isLocked ? 'LOCKED' : 'UNLOCKED'}
            </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-md mx-auto">
            {/* Status Display */}
            <div className={`transition-all duration-500 mb-8 ${isLocked ? 'scale-110' : 'scale-100'}`}>
                {isLocked ? (
                    <div className="relative">
                        <Lock size={80} className="text-red-500" strokeWidth={1} />
                        <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20"></div>
                    </div>
                ) : (
                    <Unlock size={80} className="text-zinc-700" strokeWidth={1} />
                )}
            </div>
            
            <h2 className={`font-mono text-xl tracking-widest uppercase mb-2 text-center ${isLocked ? 'text-red-500' : 'text-zinc-400'}`}>
                {statusMessage}
            </h2>

            {/* Blocked List Summary */}
            <div className="w-full mt-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 min-h-[140px] flex flex-col backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                        Active Restrictions
                    </span>
                    {!isLocked && (
                        <button 
                            onClick={() => setShowSelectionModal(true)}
                            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-full transition-colors"
                        >
                            EDIT LIST
                        </button>
                    )}
                </div>
                
                {blockedAppIds.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm italic">
                        No apps selected
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 content-start">
                        {blockedAppNames.map(name => (
                            <span key={name} className={`text-xs px-2 py-1 rounded border ${isLocked ? 'bg-red-950/30 border-red-900 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                                {name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {!isLocked && (
                <button 
                    onClick={() => setShowSelectionModal(true)}
                    className="w-full mt-4 py-5 border border-dashed border-zinc-700 rounded-xl text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 group"
                >
                    <List size={18} />
                    <span className="font-mono text-sm font-bold">SELECT APPS TO BLOCK</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            )}

            {/* Emergency Unlock Button */}
            {isLocked && (
                <div className="w-full mt-6">
                    <button 
                        onMouseDown={startEmergencyUnlock}
                        onMouseUp={stopEmergencyUnlock}
                        onMouseLeave={stopEmergencyUnlock}
                        onTouchStart={startEmergencyUnlock}
                        onTouchEnd={stopEmergencyUnlock}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="relative w-full bg-zinc-900 rounded-xl py-4 group active:scale-[0.98] transition-all touch-none select-none overflow-hidden"
                    >
                        {/* Progress Fill (Background) */}
                        <div 
                            className="absolute inset-0 bg-red-900/40 transition-none ease-linear"
                            style={{ 
                                width: `${emergencyProgress}%`,
                            }}
                        ></div>

                        {/* Static Border (Base) */}
                        <div className="absolute inset-0 border border-red-900/30 rounded-xl pointer-events-none"></div>

                        {/* Animated Border (SVG) - Adjusted to fit inside without clipping */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <rect
                                x="4" y="4"
                                width="calc(100% - 8px)" height="calc(100% - 8px)"
                                rx="10" ry="10" 
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="4"
                                strokeOpacity={emergencyProgress > 0 ? 1 : 0}
                                pathLength="100"
                                strokeDasharray="100"
                                strokeDashoffset={100 - emergencyProgress}
                                className="transition-[stroke-dashoffset] duration-75 linear"
                            />
                        </svg>
                        
                        <div className="relative flex items-center justify-center gap-2 text-red-500 z-10">
                            <AlertTriangle size={16} className={emergencyProgress > 0 ? "animate-pulse" : ""} />
                            <span className="font-mono text-xs font-bold tracking-wider">
                                {emergencyProgress > 0 
                                    ? `KEEP HOLDING... ${Math.floor(emergencyProgress)}%` 
                                    : 'EMERGENCY UNLOCK (HOLD 2 MIN)'}
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </main>

        {/* Footer Actions */}
        <footer className="p-6 pb-8 z-20 w-full max-w-md mx-auto">
            <div className="flex gap-4 w-full">
                {/* Button 1: Generate Key */}
                <button 
                    onClick={onOpenKeyGen}
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold py-4 rounded-xl active:scale-95 transition-all flex flex-col items-center justify-center gap-1 hover:bg-zinc-800 hover:text-zinc-200"
                >
                    <QrCode size={20} />
                    <span className="text-[10px] uppercase tracking-wider">Get Key</span>
                </button>

                {/* Button 2: Scan Key */}
                <button 
                    onClick={onScanAction}
                    className={`flex-[2] font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2
                        ${isLocked 
                            ? 'bg-white text-black shadow-zinc-900/50 hover:bg-zinc-200' 
                            : 'bg-red-600 text-white shadow-red-900/20 hover:bg-red-500'
                        }
                    `}
                >
                    <ScanLine size={20} />
                    <span className="tracking-wide text-sm font-mono">
                        {isLocked ? 'SCAN TO UNLOCK' : 'SCAN TO LOCK'}
                    </span>
                </button>
            </div>
        </footer>
    </div>
  );
};