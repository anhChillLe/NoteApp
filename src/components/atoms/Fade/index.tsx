import { FC, useEffect } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface FadeProps extends ViewProps {
  isActive: boolean
  color: string
  disable?: boolean
  duration?: number
}

const Fade: FC<FadeProps> = ({
  isActive,
  color,
  style,
  disable,
  duration = 150,
  ...props
}) => {
  const opacity = useSharedValue(0)

  const rippleStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      backgroundColor: color,
    }
  }, [color])

  useEffect(() => {
    if (disable) return
    opacity.value = withTiming(Number(isActive), { duration })
  }, [disable, isActive])

  return (
    <View style={[styles.container, StyleSheet.absoluteFill, style]} {...props}>
      <Animated.View style={[styles.ripple, rippleStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  ripple: {
    flex: 1,
  },
})

export default Fade
