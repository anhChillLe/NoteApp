import { View } from 'react-native'
import {
  useAnimatedRef,
  useSharedValue,
  useAnimatedReaction,
  measure,
  runOnJS,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useHome } from '../../Provider'

export const useHomeTagDetector = (onDragIn: () => void) => {
  const { offset, lastOffset } = useHome()
  const ref = useAnimatedRef<View>()
  const isDragIn = useSharedValue(false)

  useAnimatedReaction(
    () => lastOffset.value,
    (cur, prev) => {
      if (!cur) return
      const m = measure(ref)
      if (m === null) return

      const { x, y } = cur
      const inX = x > m.pageX && x < m.pageX + m.width
      const inY = y > m.pageY && y < m.pageY + m.height

      if (inX && inY) {
        runOnJS(onDragIn)()
        lastOffset.value = undefined
      }
    },
  )

  useAnimatedReaction(
    () => offset.value,
    cur => {
      if (!cur) {
        isDragIn.value = false
        return
      }
      const m = measure(ref)
      if (m === null) return
      const { x, y } = cur
      const inX = x > m.pageX && x < m.pageX + m.width
      const inY = y > m.pageY && y < m.pageY + m.height
      isDragIn.value = inX && inY
    },
  )

  const itemStyle = useAnimatedStyle(() => {
    const scaleValue = withDelay(
      100,
      withTiming(isDragIn.value ? 0.9 : 1, { duration: 200 }),
    )
    return {
      transform: [{ scale: scaleValue }],
      opacity: scaleValue,
    }
  })

  return { ref, itemStyle }
}
