import { forwardRef, useCallback } from 'react'
import {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPressable } from '../Animated'

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>
  scaleValue?: number
}

const TouchableScale = forwardRef<View, Props>(
  ({ onPressIn, onPressOut, style, scaleValue = 0.9, ...props }, ref) => {
    const isPressed = useSharedValue(false)

    const handlePressIn = useCallback((e: GestureResponderEvent) => {
      onPressIn?.(e)
      isPressed.value = true
    }, [])

    const handlePressOut = useCallback((e: GestureResponderEvent) => {
      onPressOut?.(e)
      isPressed.value = false
    }, [])

    const scaleStyle = useAnimatedStyle(() => {
      const scale = withTiming(isPressed.value ? scaleValue : 1, {
        duration: 200,
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

const AnimatedTouchableScale = Animated.createAnimatedComponent(TouchableScale)

export { AnimatedTouchableScale, TouchableScale }
export type { Props as TouchableScaleProps }
