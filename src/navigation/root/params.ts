import { StaticParamList } from '@react-navigation/native'
import RootStack from './RootStack'

type RootStackParamList = StaticParamList<typeof RootStack>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
