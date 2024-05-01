import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import { SharedValue, useSharedValue } from 'react-native-reanimated'
import { Tag } from '~/services/database/model'

type Offset = { x: number; y: number }
interface HomeSharedData {
  currentTag: Tag | undefined
  setCurrentTag: Dispatch<SetStateAction<Tag | undefined>>
  offset: SharedValue<Offset | undefined>
  lastOffset: SharedValue<Offset | undefined>
}

const defaultData: HomeSharedData = {} as HomeSharedData

const HomeContext = createContext<HomeSharedData>(defaultData)

const useHome = () => useContext(HomeContext)

const HomeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentTag, setCurrentTag] = useState<Tag>()
  const offset = useSharedValue<Offset | undefined>(undefined)
  const lastOffset = useSharedValue<Offset | undefined>(undefined)

  return (
    <HomeContext.Provider
      value={{ currentTag, setCurrentTag, offset, lastOffset }}
      children={children}
    />
  )
}

export { HomeProvider, useHome }
export type { Offset }
