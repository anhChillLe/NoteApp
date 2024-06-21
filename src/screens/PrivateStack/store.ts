import { resetGenericPassword, setGenericPassword } from 'react-native-keychain'
import RNBiometrics from 'react-native-simple-biometrics'
import { StateCreator, create } from 'zustand'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from '~/services/storage'

interface PrivateStackData {
  isUsePassword: boolean
  hasBiometric: boolean
  version: number | null
}

interface PrivateStackAction {
  createPassword: (password: string) => void
  changePassword: (password: string) => void
  clearPassword: () => void
  addBiometric: () => void
  removeBiometric: () => void
}

type PrivateStackState = PrivateStackData & PrivateStackAction

const creator: StateCreator<PrivateStackState> = (set, get) => {
  return {
    isUsePassword: false,
    hasBiometric: false,
    version: null,
    createPassword(password) {
      setGenericPassword('current', password)
        .then(results => {
          if (results) {
            set({ isUsePassword: true, version: new Date().getTime() })
          }
        })
        .catch(console.log)
    },
    changePassword(password) {
      console.log(password)
      setGenericPassword('current', password)
        .then(results => {
          if (results) {
            set({ isUsePassword: true, version: new Date().getTime() })
          }
        })
        .catch(console.log)
    },
    clearPassword() {
      resetGenericPassword()
        .then(result =>
          set({
            isUsePassword: !result,
            hasBiometric: !result,
            version: null,
          }),
        )
        .catch(console.log)
    },
    addBiometric() {
      RNBiometrics.canAuthenticate()
        .then(can => {
          if (!can) return
          RNBiometrics.requestBioAuth(
            'Finger print',
            'Active with finger print',
          ).then(result => {
            set({ hasBiometric: result })
          })
        })
        .catch(console.log)
    },
    removeBiometric() {
      RNBiometrics.canAuthenticate()
        .then(can => {
          if (!can) return
          RNBiometrics.requestBioAuth(
            'Finger print',
            'Active with finger print',
          ).then(result => {
            set({ hasBiometric: !result })
          })
        })
        .catch(console.log)
    },
  }
}

const persistOptions: PersistOptions<PrivateStackState, PrivateStackData> = {
  name: 'private-storage',
  storage: createJSONStorage(() => zustandStorage),
  partialize: ({ hasBiometric, isUsePassword, version }) => ({
    hasBiometric,
    isUsePassword,
    version,
  }),
}

const usePrivate = create(persist(creator, persistOptions))

export default usePrivate
