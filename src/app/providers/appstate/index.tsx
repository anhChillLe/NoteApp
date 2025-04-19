import { createContext, FC, PropsWithChildren, use, useEffect } from 'react'
import { useMMKVBoolean } from 'react-native-mmkv'
import { storage } from '~/services/storage'

interface AppState {
  isFirstOpen: boolean
  setFirstOpen: (bool: boolean) => void
}

const AppStateContext = createContext<AppState>({} as AppState)

const AppStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isFirstOpen, setFirstOpen] = useMMKVBoolean('isFirstOpen')
  useMigration()
  return (
    <AppStateContext.Provider
      value={{
        isFirstOpen: isFirstOpen === undefined ? true : false,
        setFirstOpen,
      }}
      children={children}
    />
  )
}

type AppZustandStore = {
  state: { isFirstOpen: boolean }
  version: number
}

const useMigration = () => {
  useEffect(() => {
    const isMigrated = storage.getBoolean('isMigrated-app')
    const zustandStoreStr = storage.getString('app-storage')
    if (!isMigrated && zustandStoreStr) {
      const zustandStoreValue: AppZustandStore = JSON.parse(zustandStoreStr)
      const isFirstOpen = zustandStoreValue.state.isFirstOpen
      storage.set('isFirstOpen', isFirstOpen)
      storage.delete('app-storage')
      storage.set('isMigrated-reminder', true)
    }
  }, [])
}

export const useAppState = () => use(AppStateContext)
export default AppStateProvider
