export enum AppState {
  LOCKED = 'LOCKED',
  SCANNING = 'SCANNING',
  UNLOCKED = 'UNLOCKED',
  GENERATING_KEY = 'GENERATING_KEY',
}

export interface DistractionApp {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export interface GeminiResponse {
  message: string;
  intensity: 'low' | 'medium' | 'high';
}
