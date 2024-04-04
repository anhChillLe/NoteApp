import { FC } from 'react'
import { useTheme } from 'react-native-paper'
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'

interface ItemProps {
  extra: SharedValue<number>
  size: number
  scale: number
}

export const MorseItem: FC<ItemProps> = ({ size, scale, extra }) => {
  const style = useAnimatedItemStyle(extra, size, scale)
  return <Animated.View style={style} />
}

const useAnimatedItemStyle = (
  extra: SharedValue<number>,
  size: number,
  scale: number,
) => {
  const { colors } = useTheme()
  const { primary } = colors
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(extra.value, [0, 1], [0.35, 1])

    return {
      height: size,
      width: size + size * extra.value * (scale - 1),
      borderRadius: size / 2,
      backgroundColor: primary,
      opacity,
    }
  }, [extra, scale, size])

  return style
}
