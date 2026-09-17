import { create } from 'zustand';
import { phases, type TimePhase } from '@/lib/time';
interface EnvironmentState {
  theme: 'light' | 'dark';
  phase: TimePhase;
  weather: 'clear' | 'rain';
  automatic: boolean;
  toggleTheme: () => void;
  cyclePhase: () => void;
  toggleWeather: () => void;
}
export const useEnvironment = create<EnvironmentState>((set) => ({
  theme: 'dark',
  phase: 'night',
  weather: 'clear',
  automatic: true,
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  cyclePhase: () =>
    set((s) => ({
      phase: phases[(phases.indexOf(s.phase) + 1) % phases.length],
      automatic: false,
    })),
  toggleWeather: () =>
    set((s) => ({ weather: s.weather === 'clear' ? 'rain' : 'clear' })),
}));
