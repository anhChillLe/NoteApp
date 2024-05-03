import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import {
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated'
import { Tag } from '~/services/database/model'

export type GesturePayload = GestureUpdateEvent<PanGestureHandlerEventPayload>
interface HomeSharedData {
  currentTag: Tag | undefined
  setCurrentTag: Dispatch<SetStateAction<Tag | undefined>>
  gesturePayload: SharedValue<GesturePayload | undefined>
}

const defaultData: HomeSharedData = {} as HomeSharedData

const HomeContext = createContext<HomeSharedData>(defaultData)

const useHome = () => useContext(HomeContext)

const HomeProvider: FC<PropsWithChildren> = ({ children }) => {
  const gesturePayload = useSharedValue<GesturePayload | undefined>(undefined)
  const [currentTag, setCurrentTag] = useState<Tag>()

  return (
    <HomeContext.Provider
      value={{
        currentTag,
        setCurrentTag,
        gesturePayload,
      }}
      children={children}
    />
  )
}

export { HomeProvider, useHome }
