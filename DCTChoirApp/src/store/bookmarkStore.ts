import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookmarkStore {
  bookmarkedIds: string[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearAll: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],
      addBookmark: (id: string) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(id)
            ? state.bookmarkedIds
            : [...state.bookmarkedIds, id],
        })),
      removeBookmark: (id: string) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.filter((bid) => bid !== id),
        })),
      isBookmarked: (id: string) => get().bookmarkedIds.includes(id),
      clearAll: () => set({ bookmarkedIds: [] }),
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);