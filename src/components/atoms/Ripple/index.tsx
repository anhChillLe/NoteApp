import { FC, forwardRef, useEffect } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useLayout } from '~/hooks'

interface Point {
  x: number
  y: number
}

interface Rectangle {
  width: number
  height: number
}

interface RippleProps extends ViewProps {
  target: SharedValue<Point>
  isActive: SharedValue<boolean>
  color: string
  disable?: boolean
  duration?: number
}

const Ripple: FC<RippleProps> = forwardRef<View, RippleProps>(
  (
    { target, isActive, color, style, disable, duration = 150, ...props },
    ref,
  ) => {
    const scale = useSharedValue(0)
    const opacity = useSharedValue(1)
    const [layout, onLayout] = useLayout()

    const rippleStyle = useAnimatedStyle(() => {
      const size = calculateRadius(layout, target.value)

      return {
        borderRadius: size,
        top: target.value.y - size,
        left: target.value.x - size,
        width: 2 * size,
        height: 2 * size,
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
        backgroundColor: color,
      }
    }, [color, layout])

    useAnimatedReaction(
      () => isActive.value,
      isActive => {
        if (disable) return
        if (isActive) {
          opacity.value = 1
          scale.value = withTiming(1, { duration })
        } else {
          opacity.value = withTiming(0, { duration }, () => {
            scale.value = 0
          })
        }
      },
      [disable],
    )

    return (
      <View
        ref={ref}
        style={[styles.container, style]}
        onLayout={onLayout}
        {...props}
      >
        <Animated.View style={[styles.ripple, rippleStyle]} />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
  },
  ripple: {
    position: 'absolute',
  },
})
const calculateRadius = (
  rec: Rectangle = { width: 0, height: 0 },
  point: Point = { x: 0, y: 0 },
): number => {
  'worklet'
  const { width, height } = rec
  const { x, y } = point

  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height },
  ]

  const distances = corners.map(corner => {
    const dx = corner.x - x
    const dy = corner.y - y
    return Math.sqrt(dx * dx + dy * dy)
  })

  return Math.max(...distances)
}

export default Ripple
