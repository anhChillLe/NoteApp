import { FC } from 'react'
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useTheme } from '../../../../styles/ThemeProvider'

interface ItemProps {
  extra: SharedValue<number>
  size: number
  scale: number
}

export const BreadsItem: FC<ItemProps> = ({ size, scale, extra }) => {
  const style = useAnimatedItemStyle({
    scale,
    size,
    extra,
  })
  return <Animated.View style={style} />
}

const useAnimatedItemStyle = ({
  size,
  scale,
  extra,
}: {
  size: number
  scale: number
  extra: SharedValue<number>
}) => {
  const { colors } = useTheme()
  const { primary, primaryContainer } = colors
  const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      extra.value,
      [0, 1],
      [primaryContainer, primary],
    )

    const width = size + size * extra.value * (scale - 1)

    return {
      height: width,
      width,
      borderRadius: width / 2,
      backgroundColor,
    }
  }, [extra, scale, size])

  return style
}
