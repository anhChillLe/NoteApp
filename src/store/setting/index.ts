import { StateCreator, create } from 'zustand'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from '~/services/storage'

export type ColorScheme = 'light' | 'dark' | 'system'

interface SettingData {
  colorScheme: ColorScheme
  themeIndex: number
}

type SetValueFunction<T> = <K extends keyof T = keyof T>(
  key: K,
) => (value: T[K]) => void

interface SettingController {
  set: SetValueFunction<SettingData>
}

type SettingState = SettingData & SettingController

const settingCreator: StateCreator<SettingState> = (set, get) => ({
  colorScheme: 'system',
  themeIndex: 0,
  set: key => value => set({ [key]: value }),
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
