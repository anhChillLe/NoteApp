import { createContext, FC, PropsWithChildren, use, useEffect } from 'react'
import { ColorSchemeName } from 'react-native'
import { useMMKVObject } from 'react-native-mmkv'
import { storage } from '~/services/storage'

export type SortType = 'create' | 'update'

interface SettingData {
  colorScheme: ColorSchemeName
  themeIndex: number
  numOfColumns: number | null
  sortType: SortType
  autoSave: boolean
  language: string | null
}

interface SettingActions {
  setColorScheme: (scheme: ColorSchemeName) => void
  setThemeIndex: (index: number) => void
  setNumOfColumn: (numOfColumns: number | null) => void
  setAutoSave: (autoSave: boolean) => void
  setLanguage: (lng: string | null) => void
  setSortType: (sortType: SortType) => void
}

type SettingState = SettingData & SettingActions

const SettingContext = createContext<SettingState>({} as SettingState)

const defaultSettings: SettingData = {
  colorScheme: null,
  themeIndex: 13,
  numOfColumns: null,
  autoSave: true,
  language: null,
  sortType: 'update',
}

const SettingProvider: FC<PropsWithChildren> = ({ children }) => {
  useMigration()
  const [settings = defaultSettings, changeSettings] =
    useMMKVObject<SettingData>('settings')

  const setColorScheme = (colorScheme: ColorSchemeName) => {
    changeSettings(settings => ({
      ...(settings ?? defaultSettings),
      colorScheme,
    }))
  }

  const setThemeIndex = (themeIndex: number) => {
    changeSettings(settings => ({
      ...(settings ?? defaultSettings),
      themeIndex,
    }))
  }

  const setNumOfColumn = (numOfColumns: number | null) => {
    changeSettings(settings => ({
      ...(settings ?? defaultSettings),
      numOfColumns,
    }))
  }

  const setSortType = (sortType: SortType) => {
    changeSettings(settings => ({ ...(settings ?? defaultSettings), sortType }))
  }

  const setAutoSave = (autoSave: boolean) => {
    changeSettings(settings => ({ ...(settings ?? defaultSettings), autoSave }))
  }

  const setLanguage = (language: string | null) => {
    changeSettings(settings => ({ ...(settings ?? defaultSettings), language }))
  }

  const value: SettingState = {
    ...settings,
    setColorScheme,
    setThemeIndex,
    setNumOfColumn,
    setSortType,
    setAutoSave,
    setLanguage,
  }

  return <SettingContext.Provider value={value} children={children} />
}

type SettingZustandStore = {
  state: SettingData
  version: number
}

const useMigration = () => {
  useEffect(() => {
    const isMigrated = storage.getBoolean('isMigrated-setting')
    const zustandStoreStr = storage.getString('setting-storage')
    if (!isMigrated && zustandStoreStr) {
      const zustandStore: SettingZustandStore = JSON.parse(zustandStoreStr)
      storage.set('settings', JSON.stringify(zustandStore.state))
      storage.delete('setting-storage')
    }
  }, [])
}

export const useSetting = () => use(SettingContext)
export default SettingProvider
