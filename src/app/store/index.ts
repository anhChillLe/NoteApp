import { StateCreator, create } from 'zustand'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from '~/services/storage'

interface AppData {
  isLocked: boolean
  isFirstOpen: boolean
  isFirstPrivate: boolean
  isFirstDelete: boolean
}

interface AppAction {
  setFirstOpen: (bool: boolean) => void
  setFirstPrivate: (bool: boolean) => void
  setFirstDelete: (bool: boolean) => void
  setIsLocked: (bool: boolean) => void
}

type AppState = AppData & AppAction

const creator: StateCreator<AppState> = set => {
  return {
    isLocked: false,
    isFirstOpen: true,
    isFirstPrivate: true,
    isFirstDelete: true,
    setIsLocked(isLocked) {
      set({ isLocked })
    },
    setFirstOpen(isFirstOpen) {
      set({ isFirstOpen })
    },
    setFirstPrivate(isFirstPrivate) {
      set({ isFirstPrivate })
    },
    setFirstDelete(isFirstDelete) {
      set({ isFirstDelete })
    },
  }
}

const persistOptions: PersistOptions<AppState, AppData> = {
  name: 'app-storage',
  storage: createJSONStorage(() => zustandStorage),
  partialize: state => ({
    isLocked: state.isLocked,
    isFirstOpen: state.isFirstOpen,
    isFirstDelete: state.isFirstDelete,
    isFirstPrivate: state.isFirstPrivate,
  }),
}

const useAppState = create(persist(creator, persistOptions))

export default useAppState
