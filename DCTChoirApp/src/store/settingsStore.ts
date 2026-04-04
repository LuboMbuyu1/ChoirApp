import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  theme: 'system' | 'light' | 'dark';
  setFontSize: (s: 'small' | 'medium' | 'large' | 'xlarge') => void;
  setTheme: (t: 'system' | 'light' | 'dark') => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      theme: 'system',
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);