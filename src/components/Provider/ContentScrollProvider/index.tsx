import { FC, PropsWithChildren, createContext, useContext } from 'react'
import { NativeScrollPoint } from 'react-native'
import { SharedValue, useSharedValue } from 'react-native-reanimated'

interface ContentScrollData {
  event: SharedValue<NativeScrollPoint>
}

const ContentScrollContext = createContext({} as ContentScrollData)

const ContentScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const event = useSharedValue<NativeScrollPoint>({
    x: 0,
    y: 0,
  })

  return <ContentScrollContext.Provider value={{ event }} children={children} />
}

const useContentScroll = () => useContext(ContentScrollContext)

export { ContentScrollProvider, useContentScroll }
