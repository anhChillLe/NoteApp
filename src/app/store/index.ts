import { StateCreator, create } from 'zustand'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from '~/services/storage'

interface AppData {
  isFirstOpen: boolean
}

interface AppAction {
  setFirstOpen: (bool: boolean) => void
}

type AppState = AppData & AppAction

const creator: StateCreator<AppState> = set => {
  return {
    isFirstOpen: true,
    isShowConfirmDelete: true,
    isShowConfirmPrivateDelete: true,
    isShowConfirmTrashDelete: true,
    setFirstOpen(isFirstOpen) {
      set({ isFirstOpen })
    },
  }
}

const persistOptions: PersistOptions<AppState, AppData> = {
  name: 'app-storage',
  storage: createJSONStorage(() => zustandStorage),
  partialize: state => ({
    isFirstOpen: state.isFirstOpen,
  }),
}

const useAppState = create(persist(creator, persistOptions))

export default useAppState
