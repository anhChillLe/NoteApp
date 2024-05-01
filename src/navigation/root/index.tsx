import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { FC } from 'react'
import { useMMKVBoolean } from 'react-native-mmkv'
import { RootStackParamList } from '~/navigation/root/params'
import {
  HomeScreen,
  NoteEditScreen,
  OnboardingScreen,
  TagManagerScreen,
  TagSelectScreen,
  TaskEditScreen,
} from '~/screens'
import { Key } from '~/services/storage/keys'

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootStack: FC = () => {
  const [hasOpened] = useMMKVBoolean(Key.hasOpened)

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!hasOpened ? (
        <Stack.Group>
          <Stack.Screen name="onboarding" component={OnboardingScreen} />
          <Stack.Screen name="tag_init" component={TagSelectScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="note_edit" component={NoteEditScreen} />
          <Stack.Screen name="task_edit" component={TaskEditScreen} />
          <Stack.Screen name="tag_manager" component={TagManagerScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animationDuration: 350,
  animation: 'slide_from_right',
}

export { RootStack }
