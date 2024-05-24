import { ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const useSafeAreaPadding = (): ViewStyle => {
  const { bottom, left, right, top } = useSafeAreaInsets()

  return {
    paddingBottom: bottom,
    paddingTop: top,
    paddingLeft: left,
    paddingRight: right,
  }
}
