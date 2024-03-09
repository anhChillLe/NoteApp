import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { FC } from 'react'
import { RootParamList } from '~/navigation/root/params'
import { WelcomeScreen } from '~/screens'

const Stack = createNativeStackNavigator<RootParamList>()

const RootStack: FC = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  )
}

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
}

export { RootStack }
