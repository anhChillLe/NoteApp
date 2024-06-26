import { StateCreator, create } from 'zustand'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from '~/services/storage'

export type ColorScheme = 'light' | 'dark' | 'system'

interface SettingData {
  colorScheme: ColorScheme
  themeIndex: number
  numOfColumns: number | 'auto'
  autoSave: boolean
}

interface SettingActions {
  setColorScheme: (scheme: ColorScheme) => void
  setThemeIndex: (index: number) => void
  setNumOfColumn: (numOfColumns: number | 'auto') => void
  setAutoSave: (autoSave: boolean) => void
}

type SettingState = SettingData & SettingActions

const settingCreator: StateCreator<SettingState> = (set, get) => ({
  colorScheme: 'system',
  themeIndex: 5,
  numOfColumns: 'auto',
  autoSave: true,
  setNumOfColumn(numOfColumns) {
    set({ numOfColumns })
  },
  setColorScheme(colorScheme) {
    set({ colorScheme })
  },
  setThemeIndex(themeIndex) {
    set({ themeIndex })
  },
  setAutoSave(autoSave) {
    set({ autoSave })
  },
})

const persistOptions: PersistOptions<SettingState, SettingData> = {
  name: 'setting-storage',
  storage: createJSONStorage(() => zustandStorage),
  partialize: state => ({
    colorScheme: state.colorScheme,
    themeIndex: state.themeIndex,
    numOfColumns: state.numOfColumns,
    autoSave: state.autoSave,
  }),
}

const useSetting = create(persist(settingCreator, persistOptions))

export default useSetting
