import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PrivateNoteScreen } from '~/screens'

const PrivateStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    private_note: {
      screen: PrivateNoteScreen,
    },
  },
})

export default PrivateStack
