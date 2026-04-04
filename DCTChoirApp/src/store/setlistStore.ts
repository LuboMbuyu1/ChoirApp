import { create } from 'zustand';
import { SongEntry } from '../types';

interface SetlistStore {
  entries: SongEntry[];
  currentIndex: number;
  addEntry: (entry: SongEntry) => void;
  removeEntry: (id: string) => void;
  reorder: (from: number, to: number) => void;
  setCurrentIndex: (i: number) => void;
  clear: () => void;
}

export const useSetlistStore = create<SetlistStore>((set, get) => ({
  entries: [],
  currentIndex: 0,
  addEntry: (entry: SongEntry) =>
    set((state) => ({
      entries: state.entries.some((e) => e.id === entry.id)
        ? state.entries
        : [...state.entries, entry],
    })),
  removeEntry: (id: string) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
  reorder: (from: number, to: number) =>
    set((state) => {
      const entries = [...state.entries];
      const [removed] = entries.splice(from, 1);
      entries.splice(to, 0, removed);
      return { entries };
    }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  clear: () => set({ entries: [], currentIndex: 0 }),
}));