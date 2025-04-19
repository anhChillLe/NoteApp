import { FC } from 'react'
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useTheme } from '../../../../styles/ThemeProvider'

interface ItemProps {
  extra: SharedValue<number>
  size: number
  scale: number
}

export const TrainItem: FC<ItemProps> = ({ size, scale, extra }) => {
  const { colors } = useTheme()
  const { primary, primaryContainer } = colors

  const style = useAnimatedStyle(() => {
    return {
      height: size,
      width: size * extra.value * scale,
      borderRadius: size / 2,
    }
  }, [extra, scale, size])

  return (
    <Animated.View>
      <Animated.View
        style={{
          backgroundColor: primaryContainer,
          height: size,
          width: size * scale,
          borderRadius: size / 2,
        }}
      />
      <Animated.View
        style={[
          { position: 'absolute', backgroundColor: primary, left: 0 },
          style,
        ]}
      />
    </Animated.View>
  )
}
