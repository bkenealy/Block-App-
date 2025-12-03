import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { KeyGenerator } from './components/KeyGenerator';
import { AppState } from './types';
import { getUnlockResistanceMessage, getLockedStatusMessage } from './services/geminiService';

const STORAGE_KEY = 'brick_device_id';
const STORAGE_STATE_KEY = 'brick_is_locked';
const STORAGE_BLOCKED_APPS_KEY = 'brick_blocked_apps';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UNLOCKED);
  const [brickKey, setBrickKey] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('SYSTEM SECURED');
  const [blockedAppIds, setBlockedAppIds] = useState<string[]>([]);

  useEffect(() => {
    // Initialize or retrieve existing Key
    let storedKey = localStorage.getItem(STORAGE_KEY);
    if (!storedKey) {
      storedKey = uuidv4();
      localStorage.setItem(STORAGE_KEY, storedKey);
    }
    setBrickKey(storedKey);

    // Persist lock state
    const locked = localStorage.getItem(STORAGE_STATE_KEY) === 'true';
    setAppState(locked ? AppState.LOCKED : AppState.UNLOCKED);

    // Load blocked apps
    const storedBlockedApps = localStorage.getItem(STORAGE_BLOCKED_APPS_KEY);
    if (storedBlockedApps) {
      try {
        setBlockedAppIds(JSON.parse(storedBlockedApps));
      } catch (e) {
        setBlockedAppIds([]);
      }
    }
    
    // Initial Gemini status
    if (locked) {
        updateStatusMessage();
    }
  }, []);

  const updateStatusMessage = async () => {
    const msg = await getLockedStatusMessage();
    setStatusMessage(msg);
  };

  const handleScanAction = async () => {
    // If we are currently LOCKED, we are trying to UNLOCK -> show resistance
    if (appState === AppState.LOCKED) {
        const msg = await getUnlockResistanceMessage();
        console.log("Resistance:", msg);
    }
    setAppState(AppState.SCANNING);
  };

  const handleScanSuccess = () => {
    // Toggle state based on previous state
    const wasLocked = localStorage.getItem(STORAGE_STATE_KEY) === 'true';
    
    if (wasLocked) {
        // Unlock
        setAppState(AppState.UNLOCKED);
        localStorage.setItem(STORAGE_STATE_KEY, 'false');
        setStatusMessage("UNLOCKED");
    } else {
        // Lock
        setAppState(AppState.LOCKED);
        localStorage.setItem(STORAGE_STATE_KEY, 'true');
        updateStatusMessage();
    }
  };
  
  const handleEmergencyUnlock = () => {
    setAppState(AppState.UNLOCKED);
    localStorage.setItem(STORAGE_STATE_KEY, 'false');
    setStatusMessage("EMERGENCY UNLOCKED");
  };

  const handleToggleAppBlock = (appId: string) => {
    // Only allow editing when unlocked
    if (appState === AppState.LOCKED) return;

    setBlockedAppIds(prev => {
      const newIds = prev.includes(appId) 
        ? prev.filter(id => id !== appId) 
        : [...prev, appId];
      
      localStorage.setItem(STORAGE_BLOCKED_APPS_KEY, JSON.stringify(newIds));
      return newIds;
    });
  };

  const handleCloseKeyGen = () => {
    const locked = localStorage.getItem(STORAGE_STATE_KEY) === 'true';
    setAppState(locked ? AppState.LOCKED : AppState.UNLOCKED);
  };

  return (
    <>
      {appState === AppState.SCANNING && (
        <Scanner 
          onScanSuccess={handleScanSuccess} 
          onCancel={handleCloseKeyGen} 
          expectedKey={brickKey}
        />
      )}

      {appState === AppState.GENERATING_KEY && (
        <KeyGenerator 
          brickKey={brickKey}
          onClose={handleCloseKeyGen}
        />
      )}

      <Dashboard 
        isLocked={appState === AppState.LOCKED || appState === AppState.SCANNING}
        onScanAction={handleScanAction}
        onOpenKeyGen={() => setAppState(AppState.GENERATING_KEY)}
        statusMessage={statusMessage}
        blockedAppIds={blockedAppIds}
        onToggleAppBlock={handleToggleAppBlock}
        onEmergencyUnlock={handleEmergencyUnlock}
      />
    </>
  );
}

export default App;