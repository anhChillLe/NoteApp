import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { FC } from 'react'
import useAppState from '~/app/store'
import { RootStackParamList } from '~/navigation/Root/params'
import {
  CreatePasswordScreen,
  EditorScreen,
  HomeScreen,
  OnboardingScreen,
  PrivateNoteScreen,
  SettingScreen,
  TagManagerScreen,
  TagSelectScreen,
  TrashScreen,
} from '~/screens'
import PrivateStack from '../Private'

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootStack: FC = () => {
  const isFirst = useAppState(state => state.isFirstOpen)

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {isFirst ? (
        <Stack.Group>
          <Stack.Screen name="onboarding" component={OnboardingScreen} />
          <Stack.Screen name="tag_init" component={TagSelectScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="editor" component={EditorScreen} />
          <Stack.Screen name="tag_manager" component={TagManagerScreen} />
          <Stack.Screen name="setting" component={SettingScreen} />
          <Stack.Screen name="trash" component={TrashScreen} />
          <Stack.Screen name="private" component={PrivateStack} />
          <Stack.Screen
            name="createPassword"
            component={CreatePasswordScreen}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animationDuration: 350,
  animation: 'ios',
}

export default RootStack
