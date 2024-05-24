import { StateCreator, create } from 'zustand'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from '~/services/storage'
import { AppTheme } from '~/styles/material3'

type ColorScheme = 'light' | 'dark' | 'system'
type Theme = keyof typeof AppTheme

interface SettingData {
  colorScheme: ColorScheme
  themeIndex: number
}

interface SettingController {
  setColorScheme: (scheme: ColorScheme) => void
  setTheme: (index: number) => void
}

type SettingState = SettingData & SettingController

const settingCreator: StateCreator<SettingState> = (set, get) => ({
  colorScheme: 'system',
  setColorScheme: scheme => {
    set({ colorScheme: scheme })
  },
  themeIndex: 0,
  setTheme: themeIndex => {
    set({ themeIndex })
  },
})

const persistOptions: PersistOptions<SettingState, SettingData> = {
  name: 'setting-storage',
  storage: createJSONStorage(() => zustandStorage),
  partialize: state => ({
    colorScheme: state.colorScheme,
    themeIndex: state.themeIndex,
  }),
}

const useSetting = create<SettingState>()(
  persist(settingCreator, persistOptions),
)

export { useSetting }
