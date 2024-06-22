import { forwardRef, useCallback } from 'react'
import {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'
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
      animationDuration: duration = 100,
      disabled,
      ...props
    },
    ref,
  ) => {
    const scale = useSharedValue(1)

    const handlePressIn = useCallback(
      (e: GestureResponderEvent) => {
        if (disabled) return
        scale.value = withTiming(scaleValue, { duration })
        onPressIn?.(e)
      },
      [scaleValue, onPressIn, duration],
    )

    const handlePressOut = useCallback(
      (e: GestureResponderEvent) => {
        if (disabled) return
        scale.value = withTiming(1, { duration })
        onPressOut?.(e)
      },
      [onPressOut, duration],
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
  },
)

export default TouchableScale
export type { Props as TouchableScaleProps }
