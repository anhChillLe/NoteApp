import { FC, Ref, useCallback } from 'react'
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

interface Props extends PressableProps {
  ref?: Ref<View>
  style?: StyleProp<ViewStyle>
  scaleValue?: number
  animationDuration?: number
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const TouchableScale: FC<Props> = ({
  ref,
  onPressIn,
  onPressOut,
  style,
  scaleValue = 0.9,
  animationDuration: duration = 100,
  disabled,
  ...props
}) => {
  const scale = useSharedValue(1)

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return
      scale.value = withTiming(scaleValue, { duration })
      onPressIn?.(e)
    },
    [disabled, scale, scaleValue, duration, onPressIn],
  )

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return
      scale.value = withTiming(1, { duration })
      onPressOut?.(e)
    },
    [disabled, scale, duration, onPressOut],
  )

  return (
    <AnimatedPressable
      ref={ref}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{ transform: [{ scale }] }, style]}
      disabled={disabled}
      {...props}
    />
  )
}

export default TouchableScale
export type { Props as TouchableScaleProps }
