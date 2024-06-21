import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  ComponentType,
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as Keychain from 'react-native-keychain'
import RNBiometrics from 'react-native-simple-biometrics'
import { PasswordLayout } from '~/components/templates'
import usePrivate from '../store'

interface VerifyData {
  hasVerified: boolean
  verify: (password: string) => void
  bioVerify: () => void
}

const VerifyConext = createContext<VerifyData>(null as any)

const VerifyProvider: FC<PropsWithChildren> = ({ children }) => {
  const isUsePassword = usePrivate(state => state.isUsePassword)
  const hasBiometric = usePrivate(state => state.hasBiometric)
  const [hasVerified, setHasVerified] = useState(!isUsePassword)

  const verify = useCallback((password: string) => {
    Keychain.getGenericPassword()
      .then(result => setHasVerified(result && result.password === password))
      .catch(console.log)
  }, [])

  const bioVerify = useCallback(async () => {
    if (!hasBiometric) return null
    try {
      const can = await RNBiometrics.canAuthenticate()
      if (!can) return
      const result = await RNBiometrics.requestBioAuth(
        'Biometric',
        'Use biometric to active',
      )
      setHasVerified(result)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    const unsub = usePrivate.subscribe((state, prevState) => {
      if (state.version !== prevState.version) {
        setHasVerified(false)
      }
    })
    return unsub
  }, [])

  return (
    <VerifyConext.Provider
      value={{ hasVerified, verify, bioVerify }}
      children={children}
    />
  )
}

const useVerify = () => useContext(VerifyConext)

const PasswordVerifyScreen: FC = () => {
  const navigation = useNavigation()
  const { verify, bioVerify } = useVerify()
  const hasBiometric = usePrivate(state => state.hasBiometric)

  useEffect(() => {
    bioVerify()
  }, [bioVerify])

  return (
    <PasswordLayout
      onBackPress={navigation.goBack}
      onSubmit={verify}
      onBioPress={bioVerify}
      withBiometric={hasBiometric}
    />
  )
}

const createScreenWithVerify = (
  name: string,
  Screen: ComponentType<any>,
): FC => {
  const Stack = createNativeStackNavigator()
  const VerifyStack: FC = () => {
    const { hasVerified } = useVerify()
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasVerified ? (
          <Stack.Screen name={name} component={Screen} />
        ) : (
          <Stack.Screen name="verify" component={PasswordVerifyScreen} />
        )}
      </Stack.Navigator>
    )
  }
  return () => (
    <VerifyProvider>
      <VerifyStack />
    </VerifyProvider>
  )
}

export default createScreenWithVerify
