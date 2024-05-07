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
  MeasuredDimensions,
  SharedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { Tag } from '~/services/database/model'

export type GesturePayload = GestureUpdateEvent<PanGestureHandlerEventPayload>
interface HomeSharedData {
  target: SharedValue<MeasuredDimensions | null | undefined>
  dragingTag: Tag | undefined
  setDragingTag: Dispatch<SetStateAction<Tag | undefined>>
  gesturePayload: SharedValue<GesturePayload | undefined>
}

const defaultData: HomeSharedData = {} as HomeSharedData

const HomeContext = createContext<HomeSharedData>(defaultData)

const useDragingHome = () => useContext(HomeContext)

const HomeDragingTagProvider: FC<PropsWithChildren> = ({ children }) => {
  const gesturePayload = useSharedValue<GesturePayload | undefined>(undefined)
  const target = useSharedValue<MeasuredDimensions | null | undefined>(
    undefined,
  )
  const [dragingTag, setDragingTag] = useState<Tag>()

  return (
    <HomeContext.Provider
      value={{
        target,
        dragingTag,
        setDragingTag,
        gesturePayload,
      }}
      children={children}
    />
  )
}

export { HomeDragingTagProvider, useDragingHome }
