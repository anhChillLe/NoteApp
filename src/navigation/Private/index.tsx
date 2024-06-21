import { NavigationProp, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FC } from 'react'
import {
  ChangePasswordScreenWithVerify,
  CreatePasswordScreen,
  PrivateNoteScreen,
  PrivateSettingScreen,
} from '~/screens'
import createScreenWithVerify from '~/screens/PrivateStack/WithVerify'

const Stack = createNativeStackNavigator<PrivateStackParams>()

const PrivateStack: FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="private_note" component={PrivateNoteScreen} />
      <Stack.Screen name="setting" component={PrivateSettingScreen} />
      <Stack.Screen name="create_password" component={CreatePasswordScreen} />
      <Stack.Screen
        name="change_password"
        component={ChangePasswordScreenWithVerify}
      />
    </Stack.Navigator>
  )
}

const usePrivateNavigation = useNavigation<NavigationProp<PrivateStackParams>>

type PrivateStackParams = {
  password: undefined
  private_note: undefined
  create_password: undefined
  change_password: undefined
  setting: undefined
}

export default createScreenWithVerify('private_space', PrivateStack)
export { usePrivateNavigation }
