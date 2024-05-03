import { View } from 'react-native'
import {
  MeasuredDimensions,
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { GesturePayload, useHome } from '../../Provider'

export const useHomeTagDetector = (onDragIn: () => void) => {
  const { gesturePayload } = useHome()
  const ref = useAnimatedRef<View>()
  const isDragIn = useSharedValue(false)

  useAnimatedReaction(
    () => gesturePayload.value,
    value => {
      const measurement = measure(ref)
      isDragIn.value = isInRec(value, measurement)
    },
  )

  useAnimatedReaction(
    () => gesturePayload.value,
    (value, preValue) => {
      if (!value && preValue && isInRec(preValue, measure(ref))) {
        runOnJS(onDragIn)()
      }
    },
  )

  const itemStyle = useAnimatedStyle(() => {
    const scaleValue = withTiming(isDragIn.value ? 0.9 : 1, { duration: 200 })
    return {
      transform: [{ scale: scaleValue }],
      opacity: scaleValue,
    }
  })

  return { ref, itemStyle }
}

const isInRec = (
  point?: GesturePayload | null,
  measurement?: MeasuredDimensions | null,
) => {
  'worklet'
  if (!point || !measurement) return false
  const { absoluteX, absoluteY } = point
  const { pageX, pageY, width, height } = measurement
  const inX = absoluteX > pageX && absoluteX < pageX + width
  const inY = absoluteY > pageY && absoluteY < pageY + height
  return inX && inY
}
