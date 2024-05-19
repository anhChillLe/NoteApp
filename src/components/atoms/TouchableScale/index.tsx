import { forwardRef, useCallback } from 'react'
import {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPressable } from '../../Animated'

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>
  scaleValue?: number
  animationDuration?: number
}

const TouchableScale = forwardRef<View, Props>(
  (
    {
      onPressIn,
      onPressOut,
      style,
      scaleValue = 0.9,
      animationDuration = 100,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isPressed = useSharedValue(false)

    const handlePressIn = useCallback((e: GestureResponderEvent) => {
      if (disabled) return
      onPressIn?.(e)
      isPressed.value = true
    }, [])

    const handlePressOut = useCallback((e: GestureResponderEvent) => {
      if (disabled) return
      onPressOut?.(e)
      isPressed.value = false
    }, [])

    const scaleStyle = useAnimatedStyle(() => {
      const scale = withTiming(isPressed.value ? scaleValue : 1, {
        duration: animationDuration,
      })
      return {
        transform: [{ scale }],
      }
    })

    return (
      <AnimatedPressable
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[scaleStyle, style]}
        {...props}
      />
    )
  },
)

export { TouchableScale }
export type { Props as TouchableScaleProps }
